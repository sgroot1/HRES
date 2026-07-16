import { useSetupStore } from "../store/setupStore";

export function usePerformance() {

  const setup = useSetupStore(
    state => state.currentSetup
  );

  const update = useSetupStore(
    state => state.updatePerformance
  );

  return {

    performance: setup?.performance,

    update,

  };

}
