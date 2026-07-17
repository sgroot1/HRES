import { create } from "zustand";

import { getExampleSetups } from "../data/exampleSetups";
import { useCatalogStore } from "../data/catalog";
import { Setup, SetupStatus } from "../types/setup";
import { useActivityStore } from "./activityStore";

const STORAGE_KEY = "helios.setups.v2";

const now = () => new Date().toISOString();

const createCorner = () => ({
  camber: null,
  toe: null,
  caster: null,
  rideHeight: null,
  cornerWeight: null,

  springRate: null,
  springPreload: null,

  lowSpeedBump: null,
  highSpeedBump: null,
  lowSpeedRebound: null,
  highSpeedRebound: null,
});

const createBrakeCorner = () => ({
  rotorTemperature: null,
  padThickness: null,
  brakePressure: null,
  brakeWear: null,
});

const createTireCorner = () => ({
  coldPressure: null,
  hotPressure: null,
  finalPressure: null,

  insideTemp: null,
  middleTemp: null,
  outsideTemp: null,

  wear: null,
  heatCycles: null,
});

interface PersistedSetupState {
  setupsByCarId: Record<string, Setup[]>;
  currentSetupIdByCarId: Record<string, string | null>;
}

interface SetupStore {
  setupsByCarId: Record<string, Setup[]>;
  currentSetupIdByCarId: Record<string, string | null>;
  setups: Setup[];
  currentSetup: Setup | null;

  syncToSelectedCar(): void;
  loadExampleSetups(): void;
  createSetup(name: string): Setup;
  openSetup(id: string): void;
  duplicateSetup(id: string): void;
  deleteSetup(id: string): void;

  updateGeneral(values: Partial<Setup["general"]>): void;
  updateSuspension(values: Partial<Setup["suspension"]>): void;
  updateBrakes(values: Partial<Setup["brakes"]>): void;
  updateTires(values: Partial<Setup["tires"]>): void;
  updateEngine(values: Partial<Setup["engine"]>): void;
}

function loadPersistedState(): PersistedSetupState | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as PersistedSetupState;
  } catch {
    return null;
  }
}

function persistState(state: PersistedSetupState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getCarLabel(carId: string) {
  const car = useCatalogStore.getState().cars.find((entry) => entry.id === carId);
  return car?.name ?? carId.toUpperCase();
}

function getActiveCarId() {
  return useCatalogStore.getState().selectedCarId;
}

function cloneExampleSetupsForCar(carId: string): Setup[] {
  const carLabel = getCarLabel(carId);

  return getExampleSetups().map((setup, index) => ({
    ...structuredClone(setup),
    id: crypto.randomUUID(),
    carId,
    name: index === 0 ? `${carLabel} Baseline` : setup.name.replace(/SDM26/gi, carLabel),
    general: {
      ...setup.general,
      vehicle: carLabel,
      setupName: index === 0 ? `${carLabel} Baseline` : setup.general.setupName.replace(/SDM26/gi, carLabel),
    },
  }));
}

function ensureCarDefaults(
  state: PersistedSetupState,
  carId: string,
  shouldSeedExamples = false
): PersistedSetupState {
  const setups = state.setupsByCarId[carId] ?? [];
  const currentSetupId = state.currentSetupIdByCarId[carId] ?? null;

  if (setups.length === 0 && shouldSeedExamples) {
    const seeded = cloneExampleSetupsForCar(carId);
    return {
      setupsByCarId: {
        ...state.setupsByCarId,
        [carId]: seeded,
      },
      currentSetupIdByCarId: {
        ...state.currentSetupIdByCarId,
        [carId]: seeded[0]?.id ?? null,
      },
    };
  }

  return {
    setupsByCarId: {
      ...state.setupsByCarId,
      [carId]: setups,
    },
    currentSetupIdByCarId: {
      ...state.currentSetupIdByCarId,
      [carId]: currentSetupId,
    },
  };
}

function findSetupLocation(setupsByCarId: Record<string, Setup[]>, id: string) {
  for (const [carId, setups] of Object.entries(setupsByCarId)) {
    const setup = setups.find((item) => item.id === id);
    if (setup) {
      return { carId, setup };
    }
  }
  return null;
}

function syncCarView(
  carId: string,
  state: Pick<PersistedSetupState, "setupsByCarId" | "currentSetupIdByCarId">
) {
  const setups = state.setupsByCarId[carId] ?? [];
  const currentSetupId = state.currentSetupIdByCarId[carId] ?? setups[0]?.id ?? null;
  const currentSetup = setups.find((setup) => setup.id === currentSetupId) ?? setups[0] ?? null;

  return {
    setups,
    currentSetup,
    currentSetupId,
  };
}

function saveSnapshot(state: Pick<PersistedSetupState, "setupsByCarId" | "currentSetupIdByCarId">) {
  persistState({
    setupsByCarId: state.setupsByCarId,
    currentSetupIdByCarId: state.currentSetupIdByCarId,
  });
}

export const useSetupStore = create<SetupStore>((set, get) => {
  const persisted = loadPersistedState();
  const selectedCarId = getActiveCarId();
  const initialState = ensureCarDefaults(
    persisted ?? { setupsByCarId: {}, currentSetupIdByCarId: {} },
    selectedCarId,
    true
  );
  const initialView = syncCarView(selectedCarId, initialState);

  saveSnapshot(initialState);

  return {
    setupsByCarId: initialState.setupsByCarId,
    currentSetupIdByCarId: initialState.currentSetupIdByCarId,
    setups: initialView.setups,
    currentSetup: initialView.currentSetup,

    syncToSelectedCar() {
      const carId = getActiveCarId();
      const state = get();
      const normalized = ensureCarDefaults(
        {
          setupsByCarId: state.setupsByCarId,
          currentSetupIdByCarId: state.currentSetupIdByCarId,
        },
        carId,
        false
      );
      const view = syncCarView(carId, normalized);
      set({
        setupsByCarId: normalized.setupsByCarId,
        currentSetupIdByCarId: normalized.currentSetupIdByCarId,
        setups: view.setups,
        currentSetup: view.currentSetup,
      });
    },

    loadExampleSetups() {
      const carId = getActiveCarId();
      const state = get();
      if ((state.setupsByCarId[carId] ?? []).length > 0) {
        return;
      }

      const seeded = cloneExampleSetupsForCar(carId);
      const nextState: PersistedSetupState = {
        setupsByCarId: {
          ...state.setupsByCarId,
          [carId]: seeded,
        },
        currentSetupIdByCarId: {
          ...state.currentSetupIdByCarId,
          [carId]: seeded[0]?.id ?? null,
        },
      };
      const view = syncCarView(carId, nextState);

      set({
        setupsByCarId: nextState.setupsByCarId,
        currentSetupIdByCarId: nextState.currentSetupIdByCarId,
        setups: view.setups,
        currentSetup: view.currentSetup,
      });
      saveSnapshot(nextState);

      useActivityStore.getState().addActivity({
        type: "setup",
        title: "Example Setups Loaded",
        description: `${seeded.length} setups for ${getCarLabel(carId)}`,
        severity: "info",
      });
    },

    createSetup(name) {
      const carId = getActiveCarId();
      const carName = getCarLabel(carId);
      const isBaseline = /baseline/i.test(name);
      const setup: Setup = {
        id: crypto.randomUUID(),
        name,
        version: 1,
        status: isBaseline ? SetupStatus.Baseline : SetupStatus.Development,
        createdAt: now(),
        updatedAt: now(),
        parentId: undefined,
        carId,

        general: {
          setupName: name,
          vehicle: carName,
          driver: "",
          engineer: "",
          track: "",
          event: "",
          weather: "",
          airTemperature: null,
          humidity: null,
          wind: "",
          trackTemperature: null,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
        },

        suspension: {
          lf: createCorner(),
          rf: createCorner(),
          lr: createCorner(),
          rr: createCorner(),
        },

        brakes: {
          lf: createBrakeCorner(),
          rf: createBrakeCorner(),
          lr: createBrakeCorner(),
          rr: createBrakeCorner(),
          frontBias: null,
          rearBias: null,
          masterCylinder: "",
          pedalRatio: null,
          notes: "",
        },

        tires: {
          lf: createTireCorner(),
          rf: createTireCorner(),
          lr: createTireCorner(),
          rr: createTireCorner(),
          notes: "",
        },

        engine: {
          throttleMap: "Map 1",
          fuelMap: "Normal",
          revLimit: 12000,
          engineBrake: 0,
          launchControl: false,
          tractionControl: false,
          shiftLight: 11500,
          pitLimiter: false,
          notes: "",
        },

        daq: {},
        drivetrain: {},
        aero: {},
        performance: {},
      };

      set((state) => {
        const nextSetups = [...(state.setupsByCarId[carId] ?? []), setup];
        const nextState: PersistedSetupState = {
          setupsByCarId: {
            ...state.setupsByCarId,
            [carId]: nextSetups,
          },
          currentSetupIdByCarId: {
            ...state.currentSetupIdByCarId,
            [carId]: setup.id,
          },
        };
        const view = syncCarView(carId, nextState);
        saveSnapshot(nextState);
        return {
          setupsByCarId: nextState.setupsByCarId,
          currentSetupIdByCarId: nextState.currentSetupIdByCarId,
          setups: view.setups,
          currentSetup: view.currentSetup,
        };
      });

      useActivityStore.getState().addActivity({
        type: "setup",
        title: "Setup Created",
        description: `${setup.name} (${carName})`,
        severity: "success",
      });

      return setup;
    },

    openSetup(id) {
      const state = get();
      const location = findSetupLocation(state.setupsByCarId, id);
      if (!location) return;

      if (location.carId !== getActiveCarId()) {
        useCatalogStore.getState().selectCar(location.carId);
      }

      const nextState: PersistedSetupState = {
        setupsByCarId: state.setupsByCarId,
        currentSetupIdByCarId: {
          ...state.currentSetupIdByCarId,
          [location.carId]: id,
        },
      };
      const view = syncCarView(location.carId, nextState);

      set({
        setupsByCarId: nextState.setupsByCarId,
        currentSetupIdByCarId: nextState.currentSetupIdByCarId,
        setups: view.setups,
        currentSetup: view.currentSetup,
      });
      saveSnapshot(nextState);

      useActivityStore.getState().addActivity({
        type: "setup",
        title: "Setup Opened",
        description: location.setup.name,
        severity: "info",
      });
    },

    duplicateSetup(id) {
      const state = get();
      const location = findSetupLocation(state.setupsByCarId, id);
      if (!location) return;

      const copy: Setup = {
        ...structuredClone(location.setup),
        id: crypto.randomUUID(),
        version: location.setup.version + 1,
        parentId: location.setup.id,
        name: `${location.setup.name} v${location.setup.version + 1}`,
        status: SetupStatus.Development,
        createdAt: now(),
        updatedAt: now(),
        carId: location.carId,
      };

      const nextSetups = [...(state.setupsByCarId[location.carId] ?? []), copy];
      const nextState: PersistedSetupState = {
        setupsByCarId: {
          ...state.setupsByCarId,
          [location.carId]: nextSetups,
        },
        currentSetupIdByCarId: {
          ...state.currentSetupIdByCarId,
          [location.carId]: copy.id,
        },
      };
      const view = syncCarView(location.carId, nextState);

      set({
        setupsByCarId: nextState.setupsByCarId,
        currentSetupIdByCarId: nextState.currentSetupIdByCarId,
        setups: view.setups,
        currentSetup: view.currentSetup,
      });
      saveSnapshot(nextState);

      useActivityStore.getState().addActivity({
        type: "setup",
        title: "Setup Duplicated",
        description: copy.name,
        severity: "info",
      });
    },

    deleteSetup(id) {
      const state = get();
      const location = findSetupLocation(state.setupsByCarId, id);
      if (!location) return;

      useActivityStore.getState().addActivity({
        type: "setup",
        title: "Setup Deleted",
        description: location.setup.name,
        severity: "warning",
      });

      const remaining = (state.setupsByCarId[location.carId] ?? []).filter((setup) => setup.id !== id);
      const nextState: PersistedSetupState = {
        setupsByCarId: {
          ...state.setupsByCarId,
          [location.carId]: remaining,
        },
        currentSetupIdByCarId: {
          ...state.currentSetupIdByCarId,
          [location.carId]:
            state.currentSetupIdByCarId[location.carId] === id
              ? remaining[remaining.length - 1]?.id ?? null
              : state.currentSetupIdByCarId[location.carId] ?? null,
        },
      };
      const view = syncCarView(location.carId, nextState);

      set({
        setupsByCarId: nextState.setupsByCarId,
        currentSetupIdByCarId: nextState.currentSetupIdByCarId,
        setups: view.setups,
        currentSetup: view.currentSetup,
      });
      saveSnapshot(nextState);
    },

    updateGeneral(values) {
      const current = get().currentSetup;
      if (!current) return;

      const updated: Setup = {
        ...current,
        general: {
          ...current.general,
          ...values,
        },
        updatedAt: now(),
      };

      const carId = current.carId ?? getActiveCarId();
      const state = get();
      const nextSetups = (state.setupsByCarId[carId] ?? []).map((setup) =>
        setup.id === updated.id ? updated : setup
      );
      const nextState: PersistedSetupState = {
        setupsByCarId: {
          ...state.setupsByCarId,
          [carId]: nextSetups,
        },
        currentSetupIdByCarId: {
          ...state.currentSetupIdByCarId,
          [carId]: updated.id,
        },
      };
      const view = syncCarView(carId, nextState);
      set({
        setupsByCarId: nextState.setupsByCarId,
        currentSetupIdByCarId: nextState.currentSetupIdByCarId,
        setups: view.setups,
        currentSetup: view.currentSetup,
      });
      saveSnapshot(nextState);
    },

    updateSuspension(values) {
      const current = get().currentSetup;
      if (!current) return;

      const updated: Setup = {
        ...current,
        suspension: {
          ...current.suspension,
          ...values,
        },
        updatedAt: now(),
      };

      const carId = current.carId ?? getActiveCarId();
      const state = get();
      const nextSetups = (state.setupsByCarId[carId] ?? []).map((setup) =>
        setup.id === updated.id ? updated : setup
      );
      const nextState: PersistedSetupState = {
        setupsByCarId: {
          ...state.setupsByCarId,
          [carId]: nextSetups,
        },
        currentSetupIdByCarId: {
          ...state.currentSetupIdByCarId,
          [carId]: updated.id,
        },
      };
      const view = syncCarView(carId, nextState);
      set({
        setupsByCarId: nextState.setupsByCarId,
        currentSetupIdByCarId: nextState.currentSetupIdByCarId,
        setups: view.setups,
        currentSetup: view.currentSetup,
      });
      saveSnapshot(nextState);
    },

    updateBrakes(values) {
      const current = get().currentSetup;
      if (!current) return;

      const updated: Setup = {
        ...current,
        brakes: {
          ...current.brakes,
          ...values,
        },
        updatedAt: now(),
      };

      const carId = current.carId ?? getActiveCarId();
      const state = get();
      const nextSetups = (state.setupsByCarId[carId] ?? []).map((setup) =>
        setup.id === updated.id ? updated : setup
      );
      const nextState: PersistedSetupState = {
        setupsByCarId: {
          ...state.setupsByCarId,
          [carId]: nextSetups,
        },
        currentSetupIdByCarId: {
          ...state.currentSetupIdByCarId,
          [carId]: updated.id,
        },
      };
      const view = syncCarView(carId, nextState);
      set({
        setupsByCarId: nextState.setupsByCarId,
        currentSetupIdByCarId: nextState.currentSetupIdByCarId,
        setups: view.setups,
        currentSetup: view.currentSetup,
      });
      saveSnapshot(nextState);
    },

    updateTires(values) {
      const current = get().currentSetup;
      if (!current) return;

      const updated: Setup = {
        ...current,
        tires: {
          ...current.tires,
          ...values,
        },
        updatedAt: now(),
      };

      const carId = current.carId ?? getActiveCarId();
      const state = get();
      const nextSetups = (state.setupsByCarId[carId] ?? []).map((setup) =>
        setup.id === updated.id ? updated : setup
      );
      const nextState: PersistedSetupState = {
        setupsByCarId: {
          ...state.setupsByCarId,
          [carId]: nextSetups,
        },
        currentSetupIdByCarId: {
          ...state.currentSetupIdByCarId,
          [carId]: updated.id,
        },
      };
      const view = syncCarView(carId, nextState);
      set({
        setupsByCarId: nextState.setupsByCarId,
        currentSetupIdByCarId: nextState.currentSetupIdByCarId,
        setups: view.setups,
        currentSetup: view.currentSetup,
      });
      saveSnapshot(nextState);
    },

    updateEngine(values) {
      const current = get().currentSetup;
      if (!current) return;

      const updated: Setup = {
        ...current,
        engine: {
          ...current.engine,
          ...values,
        },
        updatedAt: now(),
      };

      const carId = current.carId ?? getActiveCarId();
      const state = get();
      const nextSetups = (state.setupsByCarId[carId] ?? []).map((setup) =>
        setup.id === updated.id ? updated : setup
      );
      const nextState: PersistedSetupState = {
        setupsByCarId: {
          ...state.setupsByCarId,
          [carId]: nextSetups,
        },
        currentSetupIdByCarId: {
          ...state.currentSetupIdByCarId,
          [carId]: updated.id,
        },
      };
      const view = syncCarView(carId, nextState);
      set({
        setupsByCarId: nextState.setupsByCarId,
        currentSetupIdByCarId: nextState.currentSetupIdByCarId,
        setups: view.setups,
        currentSetup: view.currentSetup,
      });
      saveSnapshot(nextState);
    },
  };
});

useCatalogStore.subscribe((state, previous) => {
  if (state.selectedCarId !== previous.selectedCarId) {
    useSetupStore.getState().syncToSelectedCar();
  }
});
