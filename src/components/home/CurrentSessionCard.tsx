import { useNavigate } from "react-router-dom";

import { useRunStore } from "../../store/runStore";
import { useSessionStore } from "../../store/sessionStore";
import { useSetupStore } from "../../store/setupStore";

export default function CurrentSessionCard() {

  const navigate = useNavigate();

  const session = useSessionStore(
    state => state.session
  );

  const setup = useSetupStore(
    state => state.currentSetup
  );

  const run = useRunStore(
    state => state.currentRun
  );

  const hasSession = !!session;

  return (

    <section className="current-session-card">

      <div className="current-session-header">

        <h2>

          CURRENT SESSION

        </h2>

        <span className="session-badge">

          {hasSession ? "ACTIVE" : "READY"}

        </span>

      </div>

      {!hasSession ? (

        <>

          <h1 className="session-title">

            No Active Session

          </h1>

          <p className="session-message">

            Start a new engineering session to begin
            recording setup changes, runs and driver
            feedback.

          </p>

          <button
            className="primary-action"
            onClick={() => navigate("/new-session")}
          >

            New Test Session

          </button>

        </>

      ) : (

        <>

          <h1 className="session-title">

            {session.name}

          </h1>

          <div className="session-grid">

            <div>

              <label>Vehicle</label>

              <strong>

                {session.vehicle}

              </strong>

            </div>

            <div>

              <label>Driver</label>

              <strong>

                {run?.driver ?? "--"}

              </strong>

            </div>

            <div>

              <label>Track</label>

              <strong>

                {run?.track ?? "--"}

              </strong>

            </div>

            <div>

              <label>Current Setup</label>

              <strong>

                {setup?.name ?? "--"}

              </strong>

            </div>

            <div>

              <label>Current Run</label>

              <strong>

                {run
                  ? `#${run.number}`
                  : "--"}

              </strong>

            </div>

            <div>

              <label>Status</label>

              <strong>

                {setup?.status ?? "--"}

              </strong>

            </div>

          </div>

          <button
            className="primary-action"
            onClick={() => navigate("/workspace")}
          >

            Continue Working

          </button>

        </>

      )}

    </section>

  );

}
