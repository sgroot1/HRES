import { ReactNode } from "react";
import Navigation from "./Navigation";

interface Props {
  page: string;
  setPage: (page: string) => void;
  children: ReactNode;
}

export default function AppShell({
  page,
  setPage,
  children,
}: Props) {
  return (
    <div className="helios-shell">

      <aside className="helios-sidebar">

        <h1 className="helios-logo">

          HRES

        </h1>

        <Navigation
          current={page}
          onNavigate={setPage}
        />

      </aside>

      <main className="helios-main">

        {children}

      </main>

    </div>
  );
}
