import { create } from "zustand";

export type WorkspaceModule =
  | "General"
  | "Suspension"
  | "Diff"
  | "Engine"
  | "DAQ"
  | "Aero"
  | "Performance";

interface WorkspaceStore {

  module: WorkspaceModule;

  setModule(
    module: WorkspaceModule
  ): void;

}

export const useWorkspaceStore =
create<WorkspaceStore>((set)=>({

  module:"General",

  setModule(module){

    set({

      module

    });

  }

}));
