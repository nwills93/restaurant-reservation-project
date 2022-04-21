import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today, previous, next } from "../utils/date-time";
import ReservationTableDisplay from "../layout/ReservationTableDisplay"
import TablesTableDisplay from "../layout/TablesTableDisplay";
import DateButtons from "../layout/DateButtons"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const [date, setDate] = useState(today());
  const [reservations, setReservations] = useState(null);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const location = useLocation();

  useEffect(loadDashboard, [date]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const singleValue = queryParams.get("date");
    if (singleValue) {
      setDate(singleValue);
    }
  }, [location.search]);


  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setReservationsError)
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <DateButtons 
        date={date}
        setDate={setDate}
      />
      {/* <div className="btn-group" role="group">
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
      </div> */}
      <div className="d-flex justify-content-between">
        {reservations && (
          <ReservationTableDisplay reservations={reservations} />
        )}
        {tables && (
          <TablesTableDisplay tables={tables}/>
        )}        
      </div>
    </main>
  );
}

export default Dashboard;
