import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation, updateReservation } from "../../utils/api";
import { isDateTuesday, isDateInPast } from "../../utils/validateDate";
import ErrorAlert from "../Errors/ErrorAlert";
import InvalidDateErrors from "../Errors/InvalidDateErrors";
import ReservationFormPage from "../Forms/ReservationFormPage";
import "../../font.css";

/*
EditReservation contains logic for how to handle submitting an update reservation.
Displays any errors that come from API.
Upon initial render, form is populated with pre-existing information from reservation.
*/
export default function EditReservation() {
  const { reservation_id } = useParams();
  const history = useHistory();
  const [reservation, setReservation] = useState({});
  const [error, setError] = useState(null);
  const [dateErrors, setDateErrors] = useState(null);
  const [formData, setFormData] = useState({});

  //Loads data from reservation.
  useEffect(() => {
    const ac = new AbortController();
    readReservation(reservation_id, ac.signal)
      .then(setReservation)
      .catch(setError);
    return () => ac.abort();
  }, [reservation_id]);

  //sets formdata to information from reservation after it has been loaded. Then it's passed to formpage as a prop.
  useEffect(() => {
    const initialFormState = {
      first_name: reservation.first_name,
      last_name: reservation.last_name,
      mobile_number: reservation.mobile_number,
      reservation_date: reservation.reservation_date,
      reservation_time: reservation.reservation_time,
      people: reservation.people,
    };
    setFormData({ ...initialFormState });
  }, [reservation]);

  const handleUpdateReservationSubmission = (event) => {
    event.preventDefault();
    setError(null);

    //checks to see if date selected is on a Tuesday.
    const tuesday = isDateTuesday(formData.reservation_date);

    //checks to see if date and time are in the past.
    const past = isDateInPast(formData);

    //if either of the above variables have a truthy value, date errors will be set and display associated error message.
    if (tuesday || past) {
      setDateErrors([tuesday ? tuesday : null, past ? past : null]);
      return;
    }
    setDateErrors(null);
    const ac = new AbortController();
    updateReservation(formData, reservation_id, ac.signal)
      .then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
      .catch(setError);
    return () => ac.abort();
  };

  return (
    <div className="fancy-font text-white">
      <h1>Edit Reservation</h1>
      <ErrorAlert error={error} />
      <InvalidDateErrors errors={dateErrors} />
      <ReservationFormPage
        onSubmit={handleUpdateReservationSubmission}
        onCancel={() => history.goBack()}
        formData={formData}
        setFormData={setFormData}
        submitLabel="Submit"
      />
    </div>
  );
}
