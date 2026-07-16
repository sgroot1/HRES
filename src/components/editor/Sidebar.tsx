interface Props {

  selected: string;

  onSelect: (section: string) => void;

}

const sections = [

  "General",

  "Engine",

  "DAQ",

  "Suspension",

  "Performance Analysis",

  "Brakes",

  "Drivetrain",

  "Aerodynamics",

];

export default function Sidebar({

  selected,

  onSelect,

}: Props) {

  return (

    <aside className="editor-sidebar">

      {sections.map(section => (

        <button

          key={section}

          className={

            selected === section

              ? "sidebar-active"

              : ""

          }

          onClick={() =>

            onSelect(section)

          }

        >

          {section}

        </button>

      ))}

    </aside>

  );

}
