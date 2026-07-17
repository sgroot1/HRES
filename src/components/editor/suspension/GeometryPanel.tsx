import CornerGrid, { CornerGridRow } from "../../engineering/CornerGrid";
import { getCarProfile } from "../../../data/carProfiles";
import { useCatalogStore } from "../../../data/catalog";
import { useSuspension } from "../../../hooks/useSuspension";

export default function GeometryPanel() {
  const { suspension, update } = useSuspension();
  const selectedCarId = useCatalogStore((state) => state.selectedCarId);
  const profile = getCarProfile(selectedCarId);

  if (!suspension) return null;

  const rows: CornerGridRow[] = [
    { label: "Camber", unit: "°", values: { lf: suspension.lf.camber, rf: suspension.rf.camber, lr: suspension.lr.camber, rr: suspension.rr.camber } },
    { label: "Toe", unit: "mm", values: { lf: suspension.lf.toe, rf: suspension.rf.toe, lr: suspension.lr.toe, rr: suspension.rr.toe } },
    { label: "Caster", unit: "°", values: { lf: suspension.lf.caster, rf: suspension.rf.caster, lr: suspension.lr.caster, rr: suspension.rr.caster } },
    { label: "Ride Height", unit: "mm", values: { lf: suspension.lf.rideHeight, rf: suspension.rf.rideHeight, lr: suspension.lr.rideHeight, rr: suspension.rr.rideHeight } },
    { label: "Corner Weight", unit: "lb", values: { lf: suspension.lf.cornerWeight, rf: suspension.rf.cornerWeight, lr: suspension.lr.cornerWeight, rr: suspension.rr.cornerWeight } },
  ];

  function updateRow(row: number, corner: "lf" | "rf" | "lr" | "rr", value: number) {
    const copy = structuredClone(suspension);
    switch (row) {
      case 0: copy[corner].camber = value; break;
      case 1: copy[corner].toe = value; break;
      case 2: copy[corner].caster = value; break;
      case 3: copy[corner].rideHeight = value; break;
      case 4: copy[corner].cornerWeight = value; break;
    }
    update(copy);
  }

  return (
    <CornerGrid
      title={profile.setupLayout === "gt4" ? "Geometry / Chassis" : "Geometry"}
      rows={rows}
      onChange={updateRow}
    />
  );
}
