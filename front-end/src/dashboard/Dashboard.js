import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { listReservations, listTables, cancelReservation } from "../utils/api";
import ErrorAlert from "../layout/Errors/ErrorAlert";
import { today } from "../utils/date-time";
import ReservationTableDisplay from "../layout/Reservations/ReservationTableDisplay"
import TablesTableDisplay from "../layout/Tables/TablesTableDisplay";
import DateButtons from "../layout/Home/DateButtons"
import "../font.css"

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
  const history = useHistory();

  useEffect(loadDashboard, [date]);

  //Pulls date query from url and sets the date. Dashboard is updated anytime the date changes.
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const singleValue = queryParams.get("date");
    if (singleValue) {
      setDate(singleValue);
    }
  }, [location.search]);

  //Lists all reservations for a certain date. Lists all tables that have been created.
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

  /*
  Modal dialogue asks if user wants to continue with reservation cancellation request. 
  If confirmed, page is refreshed and reservation is moved from page
  */
  const handleCancel = (id) => {
    if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
      cancelReservation(id).then(() => history.go(0)).catch(setReservationsError)
    }
  }

  return (
    <main className="text-white fancy-font">
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <DateButtons 
        date={date}
        setDate={setDate}
      />
      <div className="container-fluid d-flex flex-column justify-content-between mt-2">
        <div className="row">
          <div className="col">
        <div className="overflow-auto">
          <h4>Reservations</h4>
        {reservations && (
          <ReservationTableDisplay reservations={reservations} handleCancel={handleCancel}/>
        )}
        </div>
        <div className="overflow-auto">
          <h4>Tables</h4>
        {tables && (
          <TablesTableDisplay tables={tables}/>
        )}        
        </div>
        </div>
        </div>      
      </div>
    </main>
  );
}

export default Dashboard;
