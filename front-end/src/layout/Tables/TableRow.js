import React from 'react'
import {useHistory} from 'react-router-dom'
import {deleteTableAssignment} from '../../utils/api'

//displays table information as a table row.
export default function TableRow({table}) {
    const history = useHistory()

    /*
    Handler for finishing a table. 
    Updates the reservation associated with the table's status to 'finished'. Reservation will be removed from the dashboard.
    Removes the reservation association with the table and sets the table status to 'free'.
    */
    const handleFinishTable = (tableId) => {
        if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
            deleteTableAssignment(tableId).then(() => history.go(0))        
          }
    }

    return (
        <tr key={table.table_id}>
          <td>{table.table_id}</td>
          <td>{table.table_name}</td>
          <td>{table.capacity}</td>
          <td data-table-id-status={`${table.table_id}`}>
            {table.reservation_id === null ? "Free" : "Occupied"}
          </td>
          {table.reservation_id && (
            <td>
              <button
                type="button"
                className="btn btn-secondary"
                data-table-id-finish={table.table_id}
                onClick={() => handleFinishTable(table.table_id)}
              >
                Finish
              </button>
            </td>
          )}
        </tr>
    )
}