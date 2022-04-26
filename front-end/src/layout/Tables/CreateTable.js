import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../../utils/api";
import ErrorAlert from "../Errors/ErrorAlert";
import TableFormPage from "../Forms/TableFormPage";
import "../../font.css";

//Create Table handles submission logic for creating a table. Displays all errors(if any) that return from the API.
export default function CreateTable() {
  const history = useHistory();

  const initialFormState = {
    table_name: "",
    capacity: 0,
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [tableError, setTableError] = useState(null);

  const handleCreateTableSubmission = (event) => {
    const ac = new AbortController();
    event.preventDefault();
    createTable(formData, ac.signal)
      .then(() => history.push("/dashboard"))
      .catch(setTableError);
    return () => ac.abort();
  };

  return (
    <div className="fancy-font">
      <h1 className="text-white">Create Table</h1>
      <ErrorAlert error={tableError} />
      <TableFormPage
        onSubmit={handleCreateTableSubmission}
        onCancel={() => history.goBack()}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
}
