import { useSetupStore } from "../store/setupStore";

export function useAero() {

  const setup = useSetupStore(
    state => state.currentSetup
  );

  const update = useSetupStore(
    state => state.updateAero
  );

  return {

    aero: setup?.aero,

    update,

  };

}
