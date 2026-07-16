import { useSetupStore } from "../store/setupStore";

export function useTires() {

  const setup = useSetupStore(
    state => state.currentSetup
  );

  const update = useSetupStore(
    state => state.updateTires
  );

  return {

    tires: setup?.tires,

    update,

  };

}
