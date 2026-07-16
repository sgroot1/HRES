interface Props {

  title: string;

  subtitle?: string;

}

export default function SectionHeader({

  title,

  subtitle,

}: Props) {

  return (

    <header className="section-header">

      <h1>{title}</h1>

      {subtitle && (

        <p>{subtitle}</p>

      )}

    </header>

  );

}
