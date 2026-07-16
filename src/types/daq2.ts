export interface DaqSetup {

  telemetryFile: string;

  canLog: string;

  downloadFolder: string;

  //sensors//

  steeringAngle: boolean;

  throttlePosition: boolean;

  brakePressure: boolean;

  wheelSpeed: boolean;

  gps: boolean;

  oxygen: boolean;

  fuel: boolean;

  wheelSpeed: boolean;

  lambda: boolean;

  notes: string;

}
