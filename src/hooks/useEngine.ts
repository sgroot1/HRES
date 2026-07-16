import { useSetupStore } from "../store/setupStore";

export function useEngine() {

  const setup = useSetupStore(
    state => state.currentSetup
  );

  const update = useSetupStore(
    state => state.updateEngine
  );

  return {

    engine: setup?.engine,

    update,

  };

}
