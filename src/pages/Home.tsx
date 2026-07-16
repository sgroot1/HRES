import { useNavigate } from "react-router-dom";

export default function Home() {

  const navigate = useNavigate();

  return (

    <div className="home">

      <header className="home-header">

        <h1>HRES</h1>

        <p>

          Helios Race Engineering Suite

        </p>

      </header>

      <section className="home-actions">

        <button
          onClick={() => navigate("/new-session")}
        >
          New Test Session
        </button>

        <button
          onClick={() => navigate("/workspace")}
        >
          Continue Session
        </button>

      </section>

      <section className="tool-grid">

        <ToolCard
          title="Workspace"
          description="Setup editor and engineering workspace."
          onClick={() => navigate("/workspace")}
        />

        <ToolCard
          title="Setup Database"
          description="Manage all saved setups."
          onClick={() => navigate("/database")}
        />

        <ToolCard
          title="Performance"
          description="Driver feedback and MoTeC-linked run analysis."
          onClick={() => navigate("/performance")}
        />

        <ToolCard
          title="Run Review"
          description="Evaluate driver feedback and setup changes."
          onClick={() => navigate("/runs")}
        />

        <ToolCard
          title="Setup Compare"
          description="Compare two setups."
          onClick={() => navigate("/compare")}
        />

        <ToolCard
          title="Recommendation Engine"
          description="Coming soon."
          disabled
        />

      </section>

    </div>

  );

}

interface ToolCardProps {

  title: string;

  description: string;

  onClick?: () => void;

  disabled?: boolean;

}

function ToolCard({

  title,

  description,

  onClick,

  disabled = false,

}: ToolCardProps) {

  return (

    <button

      className="tool-card"

      disabled={disabled}

      onClick={onClick}

    >

      <h2>{title}</h2>

      <p>{description}</p>

    </button>

  );

}
