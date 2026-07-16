import { create } from "zustand";

export type ActivityType =
  | "session"
  | "setup"
  | "run"
  | "driver"
  | "engineer"
  | "telemetry"
  | "recommendation";

export type ActivitySeverity =
  | "info"
  | "success"
  | "warning"
  | "critical";

export interface Activity {

  id: string;

  type: ActivityType;

  title: string;

  description?: string;

  timestamp: string;

  severity: ActivitySeverity;

}

interface ActivityStore {

  activities: Activity[];

  addActivity(
    activity: Omit<Activity, "id" | "timestamp">
  ): void;

  removeActivity(
    id: string
  ): void;

  clearActivities(): void;

}

export const useActivityStore =
create<ActivityStore>((set) => ({

  activities: [],

  addActivity(activity) {

    const newActivity: Activity = {

      id: crypto.randomUUID(),

      timestamp: new Date().toISOString(),

      ...activity,

    };

    set((state) => ({

      activities: [

        newActivity,

        ...state.activities,

      ],

    }));

  },

  removeActivity(id) {

    set((state) => ({

      activities:

        state.activities.filter(

          (activity) => activity.id !== id

        ),

    }));

  },

  clearActivities() {

    set({

      activities: [],

    });

  },

}));
