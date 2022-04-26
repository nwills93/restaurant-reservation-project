import React from "react";
import { Link } from "react-router-dom";
import { today, previous, next } from "../../utils/date-time";
import "../../font.css";

/*
Buttons for displaying the current day, 
the previous day from whatever the 'date' state is set to in the DashBoard, 
or the next day from whatever the 'date' state is set to in the Dashboard.
*/
export default function DateButtons({ date, setDate }) {
  return (
    <div className="btn-group" role="group">
      <Link to={`/dashboard?date=${previous(date)}`}>
        <button
          type="button"
          className="btn btn-primary mr-2"
          onClick={() => setDate(previous(date))}
        >
          Previous
        </button>
      </Link>
      <Link to={`/dashboard?date=${today()}`}>
        <button
          type="button"
          className="btn btn-primary mr-2"
          onClick={() => setDate(today())}
        >
          Today
        </button>
      </Link>
      <Link to={`/dashboard?date=${next(date)}`}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setDate(next(date))}
        >
          Next
        </button>
      </Link>
    </div>
  );
}
