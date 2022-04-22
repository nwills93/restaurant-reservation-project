import React from 'react'
import ReservationRow from './ReservationRow'

export default function ReservationTableDisplay({ reservations, handleCancel }) {

    const reservationRows = reservations.map((reservation) => (
        <ReservationRow reservation={reservation} handleCancel={handleCancel}/>
        ));
    
    
    return (
        <table className="table table-bordered border-dark table-hover">
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