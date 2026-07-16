import { ReactNode } from "react";

interface Props {

  title: string;

  subtitle?: string;

  children?: ReactNode;

}

export default function Toolbar({

  title,

  subtitle,

  children,

}: Props) {

  return (

    <div className="toolbar">

      <div>

        <h1>{title}</h1>

        {subtitle &&

        <p>{subtitle}</p>}

      </div>

      <div>

        {children}

      </div>

    </div>

  );

}
