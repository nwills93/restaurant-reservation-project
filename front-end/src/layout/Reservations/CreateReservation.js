import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ReservationFormPage from "../Forms/ReservationFormPage";
import { createReservation } from "../../utils/api";
import ErrorAlert from "../Errors/ErrorAlert";
import { isDateTuesday, isDateInPast } from "../../utils/validateDate";
import InvalidDateErrors from "../Errors/InvalidDateErrors";
import "../../font.css";

//CreateReservation contains logic for how to handle submission, and will display any validation errors that occur.
export default function CreateReservation() {
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };

  const history = useHistory();

  const [formData, setFormData] = useState({ ...initialFormState });

  //state for any errors that occur from the API.
  const [reservationsError, setReservationsError] = useState(null);

  //state for all errors that deal with invalid date and/or time.
  const [dateErrors, setDateErrors] = useState(null);

  const handleCreateReservationSubmission = (event) => {
    event.preventDefault();
    const ac = new AbortController();
    setReservationsError(null);

    //checks to see if date selected is on a Tuesday.
    const tuesday = isDateTuesday(formData.reservation_date);

    //checks to see if date and time is in the past.
    const past = isDateInPast(formData);

    //if either of the above variables have a truthy value, date errors will be set and display associated error message.
    if (tuesday || past) {
      setDateErrors([tuesday ? tuesday : null, past ? past : null]);
      return;
    }
    setDateErrors(null);
    createReservation(formData, ac.signal)
      .then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
      .catch(setReservationsError);
    return () => ac.abort();
  };

  return (
    <div className=" text-white fancy-font">
      <h1>New Reservation</h1>
      <ErrorAlert error={reservationsError} />
      <InvalidDateErrors errors={dateErrors} />
      <ReservationFormPage
        onSubmit={handleCreateReservationSubmission}
        onCancel={() => history.goBack()}
        formData={formData}
        setFormData={setFormData}
        submitLabel="Save"
      />
    </div>
  );
}
