import { useSetupStore } from "../store/setupStore";

export function useSuspension() {
  const setup = useSetupStore(
    (state) => state.currentSetup
  );

  const update = useSetupStore(
    (state) => state.updateSuspension
  );

  return {
    suspension: setup?.suspension,
    update,
  };
}
