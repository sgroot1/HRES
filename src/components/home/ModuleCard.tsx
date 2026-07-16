interface ModuleCardProps {

  title: string;

  description: string;

  status?: string;

  onClick?: () => void;

  disabled?: boolean;

}

export default function ModuleCard({

  title,

  description,

  status,

  onClick,

  disabled = false,

}: ModuleCardProps) {

  return (

    <button

      className="module-card"

      disabled={disabled}

      onClick={onClick}

    >

      <h2>

        {title}

      </h2>

      <p>

        {description}

      </p>

      {status && (

        <div className="module-status">

          {status}

        </div>

      )}

    </button>

  );

}
