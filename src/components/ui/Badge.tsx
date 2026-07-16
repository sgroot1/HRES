import { SetupStatus } from "../../types/setup";

interface Props {

  status: SetupStatus;

}

export default function Badge({

  status,

}: Props) {

  let className = "status ";

  switch (status) {

    case SetupStatus.Baseline:

      className += "baseline";

      break;

    case SetupStatus.Development:

      className += "development";

      break;

    case SetupStatus.Approved:

      className += "approved";

      break;

    case SetupStatus.Competition:

      className += "competition";

      break;

    case SetupStatus.Archived:

      className += "archived";

      break;

  }

  return (

    <span className={className}>

      {status}

    </span>

  );

}
