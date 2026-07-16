import { create } from "zustand";

import { Setup, SetupStatus } from "../types/setup";
import { useActivityStore } from "./activityStore";

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

interface SetupStore {
  setups: Setup[];
  currentSetup: Setup | null;

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

export const useSetupStore = create<SetupStore>((set, get) => {
  const syncCurrentSetup = (updated: Setup) => {
    set((state) => ({
      currentSetup: updated,
      setups: state.setups.map((setup) =>
        setup.id === updated.id ? updated : setup
      ),
    }));
  };

  return {
    setups: [],
    currentSetup: null,

    createSetup(name) {
      const isBaseline = /baseline/i.test(name);

      const setup: Setup = {
        id: crypto.randomUUID(),
        name,
        version: 1,
        status: isBaseline ? SetupStatus.Baseline : SetupStatus.Development,
        createdAt: now(),
        updatedAt: now(),
        parentId: undefined,

        general: {
          setupName: name,
          vehicle: "",
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

      set((state) => ({
        setups: [...state.setups, setup],
        currentSetup: setup,
      }));

      useActivityStore.getState().addActivity({
        type: "setup",
        title: "Setup Created",
        description: setup.name,
        severity: "success",
      });

      return setup;
    },

    openSetup(id) {
      const setup = get().setups.find((s) => s.id === id) ?? null;

      set({
        currentSetup: setup,
      });

      if (setup) {
        useActivityStore.getState().addActivity({
          type: "setup",
          title: "Setup Opened",
          description: setup.name,
          severity: "info",
        });
      }
    },

    duplicateSetup(id) {
      const original = get().setups.find((s) => s.id === id);
      if (!original) return;

      const copy: Setup = {
        ...structuredClone(original),
        id: crypto.randomUUID(),
        version: original.version + 1,
        parentId: original.id,
        name: `${original.name} v${original.version + 1}`,
        status: SetupStatus.Development,
        createdAt: now(),
        updatedAt: now(),
      };

      set((state) => ({
        setups: [...state.setups, copy],
        currentSetup: copy,
      }));

      useActivityStore.getState().addActivity({
        type: "setup",
        title: "Setup Duplicated",
        description: copy.name,
        severity: "info",
      });
    },

    deleteSetup(id) {
      const deleted = get().setups.find((s) => s.id === id);

      if (deleted) {
        useActivityStore.getState().addActivity({
          type: "setup",
          title: "Setup Deleted",
          description: deleted.name,
          severity: "warning",
        });
      }

      set((state) => {
        const remaining = state.setups.filter((s) => s.id !== id);

        return {
          setups: remaining,
          currentSetup:
            state.currentSetup?.id === id
              ? remaining[remaining.length - 1] ?? null
              : state.currentSetup,
        };
      });
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

      syncCurrentSetup(updated);
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

      syncCurrentSetup(updated);
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

      syncCurrentSetup(updated);
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

      syncCurrentSetup(updated);
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

      syncCurrentSetup(updated);
    },
  };
});
