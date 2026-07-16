import { create } from "zustand";

import { Setup, SetupStatus } from "../types/setup";
import { useActivityStore } from "./activityStore";
import { getExampleSetups } from "../data/exampleSetups";

/* ==========================================================
   HELPERS
========================================================== */

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

/* ==========================================================
   STORE
========================================================== */

interface SetupStore {

  setups: Setup[];

  currentSetup: Setup | null;

  createSetup(name: string, vehicle?: string): Setup;

  openSetup(id: string): void;

  duplicateSetup(id: string): void;

  deleteSetup(id: string): void;

  loadExampleSetups(): void;

  updateGeneral(
    values: Partial<Setup["general"]>
  ): void;

  updateSuspension(
    values: Partial<Setup["suspension"]>
  ): void;

  updateBrakes(
    values: Partial<Setup["brakes"]>
  ): void;

  updateTires(
    values: Partial<Setup["tires"]>
  ): void;

  updateEngine(
    values: Partial<Setup["engine"]>
  ): void;

  updateDrivetrain(
    values: Partial<Setup["drivetrain"]>
  ): void;

}

export const useSetupStore =
create<SetupStore>((set, get) => ({

  setups: [],

  currentSetup: null,

  /* ======================================================
     CREATE
  ====================================================== */

  createSetup(name, vehicle = "SDM26") {

    const baselineName = vehicle === "SDM27" ? "SDM27 Baseline" : "SDM26 Baseline";

    const setup: Setup = {

      id: crypto.randomUUID(),

      name,

      version: 1,

      status: SetupStatus.Development,

      createdAt: now(),

      updatedAt: now(),

      parentId: undefined,

      general: {

        setupName: name,

        vehicle,

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

        frontArb: null,

        rearArb: null,

      },

      brakes: {

        lf: createBrakeCorner(),

        rf: createBrakeCorner(),

        lr: createBrakeCorner(),

        rr: createBrakeCorner(),

        frontBias: vehicle === "SDM27" ? 58 : 56,

        rearBias: null,

        masterCylinder: "",

        pedalRatio: null,

        notes: "",

      },

      tires: {

        inventoryTireId: null,

        lf: createTireCorner(),

        rf: createTireCorner(),

        lr: createTireCorner(),

        rr: createTireCorner(),

        notes: "",

      },

      engine: {

        throttleMap: vehicle === "SDM27" ? "Map 2" : "Map 1",

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

  setups: [

    ...state.setups,

    setup,

  ],

}));

return setup;
    useActivityStore
      .getState()
      .addActivity({

        type: "setup",

        title: "Setup Created",

        description: setup.name,

      });

  },
    /* ======================================================
     OPEN
  ====================================================== */

  openSetup(id) {

    const setup =
      get().setups.find(
        (s) => s.id === id
      ) ?? null;

    set({

      currentSetup: setup,

    });

    if (setup) {

      useActivityStore
        .getState()
        .addActivity({

          type: "setup",

          title: "Setup Opened",

          description: setup.name,

        });

    }

  },

  /* ======================================================
     DUPLICATE
  ====================================================== */

  duplicateSetup(id) {

    const original =
      get().setups.find(
        (s) => s.id === id
      );

    if (!original) return;

    const copy: Setup = {

      ...structuredClone(original),

      id: crypto.randomUUID(),

      version: original.version + 1,

      parentId: original.id,

      name: `${original.name} v${original.version + 1}`,

      status: SetupStatus.Development,

      updatedAt: now(),

    };

    set((state) => ({

      setups: [

        ...state.setups,

        copy,

      ],

    }));

    useActivityStore
      .getState()
      .addActivity({

        type: "setup",

        title: "Setup Duplicated",

        description: copy.name,

      });

  },

  /* ======================================================
     DELETE
  ====================================================== */

  deleteSetup(id) {

    const deleted =
      get().setups.find(
        (s) => s.id === id
      );

    if (deleted) {

      useActivityStore
        .getState()
        .addActivity({

          type: "setup",

          title: "Setup Deleted",

          description: deleted.name,

        });

    }

    set((state) => ({

      setups: state.setups.filter(
        (s) => s.id !== id
      ),

      currentSetup:
        state.currentSetup?.id === id
          ? null
          : state.currentSetup,

    }));

  },

  loadExampleSetups() {

    const examples = getExampleSetups();

    const currentSetups = get().setups;

    const existingNames = new Set(
      currentSetups.map((setup) => setup.name)
    );

    const missingExamples = examples.filter(
      (setup) => !existingNames.has(setup.name)
    );

    if (!missingExamples.length) {
      return;
    }

    set((state) => ({

      setups: [

        ...state.setups,

        ...missingExamples,

      ],

      currentSetup:

        state.currentSetup ?? missingExamples[0],

    }));

    useActivityStore
      .getState()
      .addActivity({

        type: "setup",

        title: "Example Setups Loaded",

        description: `${missingExamples.length} presets added`,

      });

  },

  /* ======================================================
     UPDATE HELPERS
  ====================================================== */

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

    set((state) => ({

      currentSetup: updated,

      setups: state.setups.map((setup) =>

        setup.id === updated.id
          ? updated
          : setup

      ),

    }));

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

    set((state) => ({

      currentSetup: updated,

      setups: state.setups.map((setup) =>

        setup.id === updated.id
          ? updated
          : setup

      ),

    }));

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

    set((state) => ({

      currentSetup: updated,

      setups: state.setups.map((setup) =>

        setup.id === updated.id
          ? updated
          : setup

      ),

    }));

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

    set((state) => ({

      currentSetup: updated,

      setups: state.setups.map((setup) =>

        setup.id === updated.id
          ? updated
          : setup

      ),

    }));

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

    set((state) => ({

      currentSetup: updated,

      setups: state.setups.map((setup) =>

        setup.id === updated.id
          ? updated
          : setup

      ),

    }));

  },

  updateDrivetrain(values) {

    const current = get().currentSetup;

    if (!current) return;

    const updated: Setup = {

      ...current,

      drivetrain: {

        ...current.drivetrain,

        ...values,

      },

      updatedAt: now(),

    };

    set((state) => ({

      currentSetup: updated,

      setups: state.setups.map((setup) =>

        setup.id === updated.id
          ? updated
          : setup

      ),

    }));

  },

}));
