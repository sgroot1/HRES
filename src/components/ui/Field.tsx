import { useId } from "react";

interface Props {

  label?: string;

  type?: "text" | "number" | "select" | "textarea";

  value: string | number;

  options?: string[];

  onChange(
    value: string | number
  ): void;

}

export default function Field({

  label,

  type = "text",

  value,

  options = [],

  onChange,

}: Props) {

  const inputId = useId();

  return (

    <div className="field">

      {label && (

        <label htmlFor={inputId}>

          {label}

        </label>

      )}

      {type === "textarea" && (

        <textarea
          id={inputId}
          value={String(value)}
          onChange={e=>

            onChange(
              e.target.value
            )

          }

        />

      )}

      {type === "select" && (

        <select
          id={inputId}
          value={String(value)}
          onChange={e=>

            onChange(
              e.target.value
            )

          }

        >

          {options.map(option=>(

            <option

              key={option}

              value={option}

            >

              {option}

            </option>

          ))}

        </select>

      )}

      {(type==="text" ||

      type==="number") && (

        <input
          id={inputId}
          type={type}
          value={value}
          onChange={e=>

            onChange(

              type==="number"
              ? Number(e.target.value)
              : e.target.value

            )

          }

        />

      )}

    </div>

  );

}
