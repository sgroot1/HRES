import CornerGrid, { CornerGridRow } from "../../engineering/CornerGrid";
import { getCarProfile } from "../../../data/carProfiles";
import { useCatalogStore } from "../../../data/catalog";
import { useSuspension } from "../../../hooks/useSuspension";

export default function DamperPanel() {
  const { suspension, update } = useSuspension();
  const selectedCarId = useCatalogStore((state) => state.selectedCarId);
  const profile = getCarProfile(selectedCarId);

  if (!suspension || !profile.showDamperControls) return null;

  const rows: CornerGridRow[] = [
    { label: "LS Bump", unit: "clicks", values: { lf: suspension.lf.lowSpeedBump, rf: suspension.rf.lowSpeedBump, lr: suspension.lr.lowSpeedBump, rr: suspension.rr.lowSpeedBump } },
    { label: "HS Bump", unit: "clicks", values: { lf: suspension.lf.highSpeedBump, rf: suspension.rf.highSpeedBump, lr: suspension.lr.highSpeedBump, rr: suspension.rr.highSpeedBump } },
    { label: "LS Rebound", unit: "clicks", values: { lf: suspension.lf.lowSpeedRebound, rf: suspension.rf.lowSpeedRebound, lr: suspension.lr.lowSpeedRebound, rr: suspension.rr.lowSpeedRebound } },
    { label: "HS Rebound", unit: "clicks", values: { lf: suspension.lf.highSpeedRebound, rf: suspension.rf.highSpeedRebound, lr: suspension.lr.highSpeedRebound, rr: suspension.rr.highSpeedRebound } },
  ];

  function updateRow(row: number, corner: "lf" | "rf" | "lr" | "rr", value: number) {
    const copy = structuredClone(suspension);
    switch (row) {
      case 0: copy[corner].lowSpeedBump = value; break;
      case 1: copy[corner].highSpeedBump = value; break;
      case 2: copy[corner].lowSpeedRebound = value; break;
      case 3: copy[corner].highSpeedRebound = value; break;
    }
    update(copy);
  }

  return <CornerGrid title="Dampers" rows={rows} onChange={updateRow} />;
}
