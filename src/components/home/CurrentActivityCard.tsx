import { useActivityStore } from "../../store/activityStore";
import TimelineItem from "./TimelineItem";

export default function CurrentActivityCard() {

  const activities =
    useActivityStore(
      state => state.activities
    );

  return (

    <section className="activity-card">

      <div className="section-header">

        <h2>

          ENGINEERING TIMELINE

        </h2>

      </div>

      {!activities.length ? (

        <div className="activity-empty">

          No engineering activity yet.

        </div>

      ) : (

        activities.map(activity => (

          <TimelineItem

            key={activity.id}

            activity={activity}

          />

        ))

      )}

    </section>

  );

}
