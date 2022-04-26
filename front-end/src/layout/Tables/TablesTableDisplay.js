import React from 'react'
import TableRow from "./TableRow"
import "../../font.css"

export default function TablesTableDisplay({tables}) {

    const tableRows = tables.map((table) => (
        <TableRow table={table} key={table.table_id}/>
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
    )
}