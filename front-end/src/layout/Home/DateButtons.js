import React from 'react'
import {Link} from 'react-router-dom'
import {today, previous, next} from "../../utils/date-time"

export default function DateButtons({ date, setDate }) {
    return (
        <div className="btn-group" role="group">
        <Link to={`/dashboard?date=${previous(date)}`}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setDate(previous(date))}
          >
            Previous
          </button>
        </Link>
        <Link to={`/dashboard?date=${today()}`}>
          <button
            type="button"
            className="btn btn-primary"
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
    )
}