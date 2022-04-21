import React, { useEffect, useState } from "react";
import { useLocation, Link, useHistory } from "react-router-dom";
import { listReservations, listTables, deleteTableAssignment, cancelReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today, previous, next } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const [date, setDate] = useState(today());
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const location = useLocation();
  const history = useHistory();

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

  const handleCancel = (id) => {
    if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
      cancelReservation(id).then(history.go(0))
    }
  }

  const reservationRows = reservations.map((reservation) => (
    <tr key={reservation.reservation_id}>
      <td>{`${reservation.last_name}, ${reservation.first_name}`}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
      <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>
      {reservation.status === 'booked' && (
        <td>
          <Link to={`/reservations/${reservation.reservation_id}/seat`}>
            <button type="button" className="btn btn-secondary">
              Seat
            </button>
          </Link>
        </td>
      )}
      <td>
        <Link to={`/reservations/${reservation.reservation_id}/edit`}>
          <button type="button" className="btn btn-secondary">
              Edit
          </button>
        </Link>
      </td>
      <td>
        <button 
          type="button" 
          className="btn btn-secondary" 
          data-reservation-id-cancel={reservation.reservation_id}
          onClick={() => handleCancel(reservation.reservation_id)}>
              Cancel
        </button>
      </td>
    </tr>
  ));

  const tableRows = tables.map((table) => (
    <tr key={table.table_id}>
      <td>{table.table_id}</td>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      <td data-table-id-status={`${table.table_id}`}>
        {table.reservation_id === null ? "Free" : "Occupied"}
      </td>
      {table.reservation_id ? (
        <td>
          <button
            type="button"
            className="btn btn-secondary"
            data-table-id-finish={table.table_id}
            onClick={() => {
              if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
                deleteTableAssignment(table.table_id).then(history.go(0))        
              }
            }}
          >
            Finish
          </button>
        </td>
      ) : null}
    </tr>
  ));

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
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
      <div className="d-flex justify-content-between">
        <table className="table table-bordered border-dark table-hover mr-2">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile Number</th>
              <th>Reservation Time</th>
              <th>Number of People in Party</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>{reservationRows}</tbody>
        </table>
        <table className="table table-bordered border-dark table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Table Name</th>
              <th>Capacity</th>
              <th>Occupied?</th>
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </table>
      </div>
    </main>
  );
}

export default Dashboard;
