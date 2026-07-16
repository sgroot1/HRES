import { useRunStore } from "../store/runStore";

export function useRuns() {

  const runs = useRunStore(
    state => state.runs
  );

  const currentRun =
    useRunStore(
      state => state.currentRun
    );

  const createRun =
    useRunStore(
      state => state.createRun
    );

  const openRun =
    useRunStore(
      state => state.openRun
    );

  const updateRun =
    useRunStore(
      state => state.updateRun
    );

  const completeRun =
    useRunStore(
      state => state.completeRun
    );

  return {

    runs,

    currentRun,

    createRun,

    openRun,

    updateRun,

    completeRun,

  };

}
