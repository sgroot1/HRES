import { useSetupStore } from "../store/setupStore";

export function useDAQ() {

  const setup = useSetupStore(
    state => state.currentSetup
  );

  const update = useSetupStore(
    state => state.updateDAQ
  );

  return {

    daq: setup?.daq,

    update,

  };

}
