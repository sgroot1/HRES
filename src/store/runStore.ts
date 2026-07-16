import { create } from "zustand";

import { Run, RunLog, RunStatus } from "../types/run";
import { useActivityStore } from "./activityStore";

/* ==========================================================
   HELPERS
========================================================== */

const now = () => new Date().toISOString();

function createDefaultCorner() {
  return {
    coldPsi: "",
    hotPsi: "",
    tempOutside: "",
    tempMiddle: "",
    tempInside: "",
  };
}

function createDefaultRunLog(driver: string, track: string): RunLog {
  const today = new Date();
  return {
    date: today.toLocaleDateString("en-US"),
    time: today.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    amPm: today.getHours() >= 12 ? "PM" : "AM",
    filledBy: "",
    testName: "",
    location: "",
    weather: "",
    tempAir: "",
    tempTrack: "",
    windSpeed: "",
    windDirection: "",
    humidity: "",
    trackConfig: track,
    carChanges: "",
    bestTime: "",
    averageTime: "",
    notes: "",
    fl: createDefaultCorner(),
    fr: createDefaultCorner(),
    rl: createDefaultCorner(),
    rr: createDefaultCorner(),
    feedback: {
      entry: "",
      mid: "",
      exit: "",
      stability: "",
      consistency: "",
      balance: "",
      grip: "",
    },
  };
}

/* ==========================================================
   STORE
========================================================== */

interface RunStore {

  runs: Run[];

  currentRun: Run | null;

  createRun(
    setupId: string,
    driver: string,
    track: string
  ): void;

  openRun(id: string): void;

  completeRun(id: string): void;

  updateRun(
    values: Partial<Run>
  ): void;

}

export const useRunStore =
create<RunStore>((set, get) => ({

  runs: [],

  currentRun: null,

  /* ======================================================
     CREATE
  ====================================================== */

  createRun(
    setupId,
    driver,
    track
  ) {

    const run: Run = {

      id: crypto.randomUUID(),

      number:
        get().runs.length + 1,

      setupId,

      driver,

      track,

      weather: "",

      startTime: now(),

      endTime: "",

      comments: "",

      telemetryFile: "",

      videoFile: "",

      photos: [],

      bestLap: null,

      averageLap: null,

      motecAnalysis: null,

      runLog: createDefaultRunLog(driver, track),

      status: RunStatus.Planned,

    };

    set((state) => ({

      runs: [

        ...state.runs,

        run,

      ],

      currentRun: run,

    }));

    useActivityStore
      .getState()
      .addActivity({

        type: "run",

        title: `Run #${run.number} Created`,

        description: `${driver} • ${track}`,

      });

  },
    /* ======================================================
     OPEN
  ====================================================== */

  openRun(id) {

    const run =
      get().runs.find(
        (r) => r.id === id
      ) ?? null;

    set({

      currentRun: run,

    });

    if (run) {

      useActivityStore
        .getState()
        .addActivity({

          type: "run",

          title: `Run #${run.number} Opened`,

          description: run.driver,

        });

    }

  },

  /* ======================================================
     COMPLETE
  ====================================================== */

  completeRun(id) {

    const run =
      get().runs.find(
        (r) => r.id === id
      );

    if (!run) return;

    const updated: Run = {

      ...run,

      status: RunStatus.Complete,

      endTime: now(),

    };

    set((state) => ({

      currentRun: updated,

      runs: state.runs.map((r) =>

        r.id === updated.id

          ? updated

          : r

      ),

    }));

    useActivityStore
      .getState()
      .addActivity({

        type: "run",

        title: `Run #${updated.number} Completed`,

        description:
          updated.bestLap != null
            ? `${updated.bestLap.toFixed(3)} s`
            : updated.driver,

      });

  },

  /* ======================================================
     UPDATE
  ====================================================== */

  updateRun(values) {

    const current =
      get().currentRun;

    if (!current) return;

    const updated: Run = {

      ...current,

      ...values,

    };

    set((state) => ({

      currentRun: updated,

      runs: state.runs.map((run) =>

        run.id === updated.id

          ? updated

          : run

      ),

    }));

  },

}));
