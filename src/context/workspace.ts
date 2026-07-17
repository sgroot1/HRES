import { create } from "zustand";

import { useCatalogStore } from "../data/catalog";

type WorkspaceModule =
  | "General"
  | "Suspension"
  | "Diff"
  | "Engine"
  | "DAQ"
  | "Aero"
  | "Performance";

interface WorkspaceState {
  moduleByCarId: Record<string, WorkspaceModule>;
  module: WorkspaceModule;
  syncToSelectedCar(): void;
  setModule(module: WorkspaceModule): void;
}

const STORAGE_KEY = "helios.workspace.v2";

function loadPersistedModules(): Record<string, WorkspaceModule> {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};

  try {
    return JSON.parse(raw) as Record<string, WorkspaceModule>;
  } catch {
    return {};
  }
}

function persistModules(modules: Record<string, WorkspaceModule>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(modules));
}

function getSelectedCarId() {
  return useCatalogStore.getState().selectedCarId;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => {
  const selectedCarId = getSelectedCarId();
  const moduleByCarId = loadPersistedModules();
  const module = moduleByCarId[selectedCarId] ?? "General";

  persistModules(moduleByCarId);

  return {
    moduleByCarId,
    module,

    syncToSelectedCar() {
      const carId = getSelectedCarId();
      const state = get();
      const nextModule = state.moduleByCarId[carId] ?? "General";
      set({ module: nextModule });
    },

    setModule(module) {
      const carId = getSelectedCarId();
      set((state) => {
        const nextModuleByCarId = {
          ...state.moduleByCarId,
          [carId]: module,
        };
        persistModules(nextModuleByCarId);
        return {
          moduleByCarId: nextModuleByCarId,
          module,
        };
      });
    },
  };
});

useCatalogStore.subscribe((state, previous) => {
  if (state.selectedCarId !== previous.selectedCarId) {
    useWorkspaceStore.getState().syncToSelectedCar();
  }
});

export type { WorkspaceModule };
