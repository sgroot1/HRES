import { GeneralSetup } from "./general";
import { SuspensionSetup } from "./suspension";
import { BrakeSetup } from "./brakes";
import { TireSetup } from "./tires";
import { EngineSetup } from "./engine";
import { DaqSetup } from "./daq";
import { DrivetrainSetup } from "./drivetrain";
import { AeroSetup } from "./aero";
import { PerformanceSetup } from "./performance";

export enum SetupStatus {
  Baseline = "Baseline",
  Development = "Development",
  Approved = "Approved",
  Competition = "Competition",
  Archived = "Archived",
}

export interface Setup {

  id: string;

  name: string;

  version: number;

  status: SetupStatus;

  createdAt: string;

  updatedAt: string;

  parentId?: string;

  carId?: string;

  general: GeneralSetup;

  suspension: SuspensionSetup;

  brakes: BrakeSetup;

  tires: TireSetup;

  engine: EngineSetup;

  daq: DaqSetup;

  drivetrain: DrivetrainSetup;

  aero: AeroSetup;

  performance: PerformanceSetup;

}
