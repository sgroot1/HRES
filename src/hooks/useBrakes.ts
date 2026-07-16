import { useSetupStore } from "../store/setupStore";

export function useBrakes() {

    const setup = useSetupStore(
        state => state.currentSetup
    );

    const update = useSetupStore(
        state => state.updateBrakes
    );

    return {

        brakes: setup?.brakes,

        update,

    };

}
