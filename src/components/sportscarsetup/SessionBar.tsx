import { useSessionStore } from "../../store/sessionStore";
import { useSetupStore } from "../../store/setupStore";
import { useRunStore } from "../../store/runStore";

export default function SessionBar() {

  const session = useSessionStore(
    state => state.session
  );

  const setup = useSetupStore(
    state => state.currentSetup
  );

  const run = useRunStore(
    state => state.currentRun
  );

  return (

    <header className="session-bar">

      <div className="session-title">

        <strong>HRES</strong>

        <span>Version 1.0 Beta</span>

      </div>

      <div className="session-info">

        <span>

          <strong>Session:</strong>

          {session?.name ?? "--"}

        </span>

        <span>

          <strong>Vehicle:</strong>

          {session?.vehicle ?? "--"}

        </span>

        <span>

          <strong>Driver:</strong>

          {run?.driver ?? session?.driver ?? "--"}

        </span>

        <span>

          <strong>Track:</strong>

          {session?.track ?? "--"}

        </span>

        <span>

          <strong>Setup:</strong>

          {setup?.name ?? "--"}

        </span>

        <span>

          <strong>Run:</strong>

          {run?.number ?? "--"}

        </span>

      </div>

    </header>

  );

}
