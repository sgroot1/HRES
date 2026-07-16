import { useSetupStore } from "../store/setupStore";

export function useGeneral() {

  const setup = useSetupStore(
    (state) => state.currentSetup
  );

  const updateGeneral = useSetupStore(
    (state) => state.updateGeneral
  );

  return {

    data: setup?.general,

    update: updateGeneral,

    isDirty: false,

  };

}
