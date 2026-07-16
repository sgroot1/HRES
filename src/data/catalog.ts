export interface CatalogEntry {
  id: string;
  name: string;
  notes?: string;
}

export interface TireInventoryEntry {
  id: string;
  tireSetId: string;
  compound: string;
  condition: string;
  notes?: string;
}

export interface SetupMotecCsvEntry {
  id: string;
  setupId: string;
  setupName: string;
  fileName: string;
  importedAt: string;
  lapCount: number;
  sampleCount: number;
  bestLap: number | null;
  averageLap: number | null;
}

export interface CatalogState {
  tracks: CatalogEntry[];
  drivers: CatalogEntry[];
  cars: CatalogEntry[];
  tires: TireInventoryEntry[];
  motecCsv: SetupMotecCsvEntry[];
}

const STORAGE_KEY = "helios.catalog.v1";

function loadPersistedCatalog(): CatalogState | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as CatalogState;
  } catch {
    return null;
  }
}

function persistCatalog(state: CatalogState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export const initialCatalog: CatalogState = {
  tracks: [
    { id: "amp", name: "Arizona Motorsports Park" },
    { id: "whp", name: "Wild Horse Pass" },
    { id: "inde", name: "Inde Motorsports Ranch" },
    { id: "podium", name: "Podium Club" },
    { id: "laguna", name: "Laguna Seca" },
    { id: "road-america", name: "Road America" },
  ],
  drivers: [
    { id: "maria", name: "Maria Chen" },
    { id: "jordan", name: "Jordan Alvarez" },
    { id: "leo", name: "Leo Patel" },
    { id: "sophia", name: "Sophia Rivera" },
  ],
  cars: [
    { id: "sdm26", name: "SDM26" },
    { id: "sdm27", name: "SDM27" },
  ],
  tires: [
    {
      id: "set-01",
      tireSetId: "SET-01",
      compound: "Hoosier R25B",
      condition: "dry",
    },
    {
      id: "set-w1",
      tireSetId: "SET-W1",
      compound: "Hoosier WET",
      condition: "wet",
    },
  ],
  motecCsv: [],
};

function hydrateCatalog(raw: CatalogState | null): CatalogState {
  if (!raw) {
    return {
      tracks: [...initialCatalog.tracks],
      drivers: [...initialCatalog.drivers],
      cars: [...initialCatalog.cars],
      tires: [...initialCatalog.tires],
    };
  }

  return {
    tracks: raw.tracks ?? [...initialCatalog.tracks],
    drivers: raw.drivers ?? [...initialCatalog.drivers],
    cars: raw.cars ?? [...initialCatalog.cars],
    tires: raw.tires ?? [...initialCatalog.tires],
    motecCsv: raw.motecCsv ?? [...initialCatalog.motecCsv],
  };
}

export function createCatalogStore() {
  const persisted = loadPersistedCatalog();
  const state: CatalogState = hydrateCatalog(persisted);

  persistCatalog(state);

  return {
    getState: () => state,
    addTrack: (name: string) => {
      const entry = { id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`, name };
      state.tracks.push(entry);
      persistCatalog(state);
      return entry;
    },
    removeTrack: (id: string) => {
      state.tracks = state.tracks.filter((entry) => entry.id !== id);
      persistCatalog(state);
    },
    addDriver: (name: string) => {
      const entry = { id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`, name };
      state.drivers.push(entry);
      persistCatalog(state);
      return entry;
    },
    removeDriver: (id: string) => {
      state.drivers = state.drivers.filter((entry) => entry.id !== id);
      persistCatalog(state);
    },
    addCar: (name: string) => {
      const entry = { id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`, name };
      state.cars.push(entry);
      persistCatalog(state);
      return entry;
    },
    removeCar: (id: string) => {
      state.cars = state.cars.filter((entry) => entry.id !== id);
      persistCatalog(state);
    },
    addTire: (values: Omit<TireInventoryEntry, "id">) => {
      const seed = values.tireSetId || `${values.compound}-${values.condition}`;
      const entry: TireInventoryEntry = {
        ...values,
        id: `${seed.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      };
      state.tires.push(entry);
      persistCatalog(state);
      return entry;
    },
    removeTire: (id: string) => {
      state.tires = state.tires.filter((entry) => entry.id !== id);
      persistCatalog(state);
    },
    addSetupMotecCsv: (values: Omit<SetupMotecCsvEntry, "id" | "importedAt">) => {
      const seed = `${values.setupId}-${values.fileName}`;
      const entry: SetupMotecCsvEntry = {
        ...values,
        id: `${seed.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
        importedAt: new Date().toISOString(),
      };
      state.motecCsv.push(entry);
      persistCatalog(state);
      return entry;
    },
    removeSetupMotecCsv: (id: string) => {
      state.motecCsv = state.motecCsv.filter((entry) => entry.id !== id);
      persistCatalog(state);
    },
  };
}
