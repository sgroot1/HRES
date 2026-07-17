import { create } from "zustand";

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
  selectedCarId: string;
}

interface CatalogActions {
  addTrack: (name: string) => CatalogEntry;
  removeTrack: (id: string) => void;
  addDriver: (name: string) => CatalogEntry;
  removeDriver: (id: string) => void;
  addCar: (name: string) => CatalogEntry;
  removeCar: (id: string) => void;
  selectCar: (id: string) => void;
  selectCarByName: (name: string) => void;
  addTire: (values: Omit<TireInventoryEntry, "id">) => TireInventoryEntry;
  removeTire: (id: string) => void;
  addSetupMotecCsv: (values: Omit<SetupMotecCsvEntry, "id" | "importedAt">) => SetupMotecCsvEntry;
  removeSetupMotecCsv: (id: string) => void;
}

export type CatalogStore = CatalogState & CatalogActions;

const STORAGE_KEY = "helios.catalog.v2";

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
  selectedCarId: "sdm26",
};

function loadPersistedCatalog(): Partial<CatalogState> | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Partial<CatalogState>;
  } catch {
    return null;
  }
}

function persistCatalog(state: CatalogState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function makeId(seed: string) {
  return `${seed.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
}

function hydrateCatalog(raw: Partial<CatalogState> | null): CatalogState {
  const cars = raw?.cars?.length ? raw.cars : [...initialCatalog.cars];
  const selectedCarId =
    raw?.selectedCarId && cars.some((car) => car.id === raw.selectedCarId)
      ? raw.selectedCarId
      : cars[0]?.id ?? initialCatalog.selectedCarId;

  return {
    tracks: raw?.tracks?.length ? raw.tracks : [...initialCatalog.tracks],
    drivers: raw?.drivers?.length ? raw.drivers : [...initialCatalog.drivers],
    cars,
    tires: raw?.tires?.length ? raw.tires : [...initialCatalog.tires],
    motecCsv: raw?.motecCsv?.length ? raw.motecCsv : [...initialCatalog.motecCsv],
    selectedCarId,
  };
}

export const useCatalogStore = create<CatalogStore>((set, get) => {
  const persisted = hydrateCatalog(loadPersistedCatalog());
  persistCatalog(persisted);

  return {
    ...persisted,

    addTrack(name) {
      const entry = { id: makeId(name), name };
      set((state) => {
        const next: CatalogState = { ...state, tracks: [...state.tracks, entry] };
        persistCatalog(next);
        return next;
      });
      return entry;
    },

    removeTrack(id) {
      set((state) => {
        const next: CatalogState = { ...state, tracks: state.tracks.filter((entry) => entry.id !== id) };
        persistCatalog(next);
        return next;
      });
    },

    addDriver(name) {
      const entry = { id: makeId(name), name };
      set((state) => {
        const next: CatalogState = { ...state, drivers: [...state.drivers, entry] };
        persistCatalog(next);
        return next;
      });
      return entry;
    },

    removeDriver(id) {
      set((state) => {
        const next: CatalogState = { ...state, drivers: state.drivers.filter((entry) => entry.id !== id) };
        persistCatalog(next);
        return next;
      });
    },

    addCar(name) {
      const entry = { id: makeId(name), name };
      set((state) => {
        const nextCars = [...state.cars, entry];
        const next: CatalogState = {
          ...state,
          cars: nextCars,
          selectedCarId: nextCars.some((car) => car.id === state.selectedCarId)
            ? state.selectedCarId
            : entry.id,
        };
        persistCatalog(next);
        return next;
      });
      return entry;
    },

    removeCar(id) {
      set((state) => {
        const remaining = state.cars.filter((entry) => entry.id !== id);
        const next: CatalogState = {
          ...state,
          cars: remaining,
          selectedCarId:
            state.selectedCarId === id
              ? remaining[0]?.id ?? initialCatalog.selectedCarId
              : state.selectedCarId,
        };
        persistCatalog(next);
        return next;
      });
    },

    selectCar(id) {
      set((state) => {
        if (!state.cars.some((car) => car.id === id)) {
          return {} as CatalogState;
        }
        const next: CatalogState = { ...state, selectedCarId: id };
        persistCatalog(next);
        return next;
      });
    },

    selectCarByName(name) {
      const existing = get().cars.find(
        (car) => car.name.toLowerCase() === name.trim().toLowerCase()
      );

      if (existing) {
        get().selectCar(existing.id);
        return;
      }

      const created = get().addCar(name.trim());
      get().selectCar(created.id);
    },

    addTire(values) {
      const seed = values.tireSetId || `${values.compound}-${values.condition}`;
      const entry: TireInventoryEntry = {
        ...values,
        id: makeId(seed),
      };
      set((state) => {
        const next: CatalogState = { ...state, tires: [...state.tires, entry] };
        persistCatalog(next);
        return next;
      });
      return entry;
    },

    removeTire(id) {
      set((state) => {
        const next: CatalogState = { ...state, tires: state.tires.filter((entry) => entry.id !== id) };
        persistCatalog(next);
        return next;
      });
    },

    addSetupMotecCsv(values) {
      const seed = `${values.setupId}-${values.fileName}`;
      const entry: SetupMotecCsvEntry = {
        ...values,
        id: makeId(seed),
        importedAt: new Date().toISOString(),
      };
      set((state) => {
        const next: CatalogState = { ...state, motecCsv: [...state.motecCsv, entry] };
        persistCatalog(next);
        return next;
      });
      return entry;
    },

    removeSetupMotecCsv(id) {
      set((state) => {
        const next: CatalogState = { ...state, motecCsv: state.motecCsv.filter((entry) => entry.id !== id) };
        persistCatalog(next);
        return next;
      });
    },
  };
});

export function createCatalogStore() {
  return {
    getState: () => useCatalogStore.getState(),
    addTrack: (name: string) => useCatalogStore.getState().addTrack(name),
    removeTrack: (id: string) => useCatalogStore.getState().removeTrack(id),
    addDriver: (name: string) => useCatalogStore.getState().addDriver(name),
    removeDriver: (id: string) => useCatalogStore.getState().removeDriver(id),
    addCar: (name: string) => useCatalogStore.getState().addCar(name),
    removeCar: (id: string) => useCatalogStore.getState().removeCar(id),
    selectCar: (id: string) => useCatalogStore.getState().selectCar(id),
    selectCarByName: (name: string) => useCatalogStore.getState().selectCarByName(name),
    addTire: (values: Omit<TireInventoryEntry, "id">) => useCatalogStore.getState().addTire(values),
    removeTire: (id: string) => useCatalogStore.getState().removeTire(id),
    addSetupMotecCsv: (values: Omit<SetupMotecCsvEntry, "id" | "importedAt">) =>
      useCatalogStore.getState().addSetupMotecCsv(values),
    removeSetupMotecCsv: (id: string) => useCatalogStore.getState().removeSetupMotecCsv(id),
  };
}
