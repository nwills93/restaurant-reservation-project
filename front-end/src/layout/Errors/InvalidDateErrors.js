import React from "react";

//Will display a list of all errors that include an invalid date or invalid time that occur on 'new reservation' page.
export default function InvalidDateErrors({ errors }) {
  return (
    errors && (
      <div className="alert alert-danger">
        <p>The following issues occurred:</p>
        {errors.map((error, index) => (
          <>{error ? <li key={index}>{error}</li> : null}</>
        ))}
      </div>
    )
  );
}
