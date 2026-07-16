import { ReactNode } from "react";

interface Props {

  title: string;

  children: ReactNode;

}

export default function CompareSection({

  title,

  children,

}: Props) {

  return (

    <div className="compare-section">

      <h2>{title}</h2>

      {children}

    </div>

  );

}
