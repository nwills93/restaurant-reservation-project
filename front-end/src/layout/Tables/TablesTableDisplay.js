import React from 'react'
import TableRow from "./TableRow"

export default function TablesTableDisplay({tables}) {

    const tableRows = tables.map((table) => (
        <TableRow table={table} />
      ));

    return (
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
    )
}