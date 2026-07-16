export interface TireCorner {

  coldPressure: number | null;

  hotPressure: number | null;

  finalPressure: number | null;

  insideTemp: number | null;

  middleTemp: number | null;

  outsideTemp: number | null;

  wear: number | null;

  heatCycles: number | null;

}

export interface TireSetup {

  inventoryTireId?: string | null;

  lf: TireCorner;

  rf: TireCorner;

  lr: TireCorner;

  rr: TireCorner;

  notes: string;

}
