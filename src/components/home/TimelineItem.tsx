import { Activity } from "../../store/activityStore";

interface TimelineItemProps {

  activity: Activity;

}

export default function TimelineItem({

  activity,

}: TimelineItemProps) {

  const time = new Date(
    activity.timestamp
  ).toLocaleTimeString([], {

    hour: "2-digit",

    minute: "2-digit",

  });

  return (

    <div className="timeline-item">

      <div className="timeline-time">

        {time}

      </div>

      <div

        className={`timeline-dot ${activity.severity}`}

      />

      <div className="timeline-content">

        <div className="timeline-title">

          {activity.title}

        </div>

        {activity.description && (

          <div className="timeline-description">

            {activity.description}

          </div>

        )}

      </div>

    </div>

  );

}
