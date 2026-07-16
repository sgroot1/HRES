import { useSetupStore } from "../store/setupStore";

export function useDrivetrain() {
  const setup = useSetupStore((state) => state.currentSetup);
  const update = useSetupStore((state) => state.updateDrivetrain);

  return {
    drivetrain: setup?.drivetrain,
    update,
  };
}
