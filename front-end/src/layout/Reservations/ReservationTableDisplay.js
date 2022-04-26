import React from 'react'
import ReservationRow from './ReservationRow'
import "../../font.css"

//Table for displaying all reservations. Each reservation is passed down as a prop to another component to be rendered as a table row.
export default function ReservationTableDisplay({ reservations, handleCancel }) {

    const reservationRows = reservations.map((reservation) => (
        <ReservationRow reservation={reservation} handleCancel={handleCancel} key={reservation.reservation_id}/>
        ));
    
    
    return (
        <table className="table table-dark table-borderless table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile Number</th>
              <th>Date</th>
              <th>Reservation Time</th>
              <th>Number of People in Party</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>{reservationRows}</tbody>
        </table>
    )
}