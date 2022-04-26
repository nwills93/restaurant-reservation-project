import React from "react";
import TableRow from "./TableRow";
import "../../font.css";

//Displays all information about the restaurant's tables in a table.
export default function TablesTableDisplay({ tables }) {
  //Each table is sent to TableRow component to be rendered as a table row.
  const tableRows = tables.map((table) => (
    <TableRow table={table} key={table.table_id} />
  ));

  return (
    <table className="table table-dark table-borderless table-hover">
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
  );
}
