import { create } from "zustand";

import { TestSession } from "../types/testSession";
import { useActivityStore } from "./activityStore";

interface SessionStore {

  session: TestSession | null;

  createSession(
    session: Omit<TestSession, "id" | "createdAt">
  ): void;

  closeSession(): void;

}

export const useSessionStore =
create<SessionStore>((set) => ({

  session: null,

  createSession(session) {

    const newSession: TestSession = {

      id: crypto.randomUUID(),

      createdAt: new Date().toISOString(),

      ...session,

    };

    set({

      session: newSession,

    });

    useActivityStore
      .getState()
      .addActivity({

        type: "session",

        title: "Session Created",

        description: newSession.name,

      });

  },

  closeSession() {

    useActivityStore
      .getState()
      .addActivity({

        type: "session",

        title: "Session Closed",

      });

    set({

      session: null,

    });

  },

}));
