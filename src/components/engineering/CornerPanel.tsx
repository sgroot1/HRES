import { ReactNode } from "react";

interface Props {

  title: string;

  children: ReactNode;

}

export default function CornerPanel({

  title,

  children,

}: Props) {

  return (

    <div className="corner-panel">

      <h2>{title}</h2>

      {children}

    </div>

  );

}
