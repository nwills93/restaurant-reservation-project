import React from "react";

//Form page for seating a reservation.
export default function SeatForm({ tables, onSubmit, onCancel, setFormData }) {
  //Maps through all tables, and adds them to the form as select options.
  const tableOptions = tables.map((table) => (
    <option key={table.table_id} value={table.table_id}>
      {table.table_name} - {table.capacity}
    </option>
  ));

  const handleChange = ({ target }) => {
    setFormData({
      [target.name]: target.value,
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="table_id" className="form-label text-white">
        Seat At:
      </label>
      <select
        id="table_id"
        name="table_id"
        className="form-control bg-dark text-white"
        onChange={handleChange}
        required
      >
        <option value>Select a Table</option>
        {tableOptions}
      </select>
      <div className="mt-2">
        <button type="button" className="btn btn-dark mr-2" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
    </form>
  );
}
