import React from "react";
import {Link} from 'react-router-dom'

export default function ReservationRow({ reservation, handleCancel }) {
  
    return (
        <tr key={reservation.reservation_id}>
            <td>{`${reservation.last_name}, ${reservation.first_name}`}</td>
            <td>{reservation.mobile_number}</td>
            <td>{reservation.reservation_date}</td>
            <td>{reservation.reservation_time}</td>
            <td>{reservation.people}</td>
            <td data-reservation-id-status={reservation.reservation_id}>
                {reservation.status}
            </td>
            {reservation.status === "booked" && (
                <td>
                <Link to={`/reservations/${reservation.reservation_id}/seat`}>
                    <button type="button" className="btn btn-secondary">
                    Seat
                    </button>
                </Link>
                </td>
            )}
            <td>
                <Link to={`/reservations/${reservation.reservation_id}/edit`}>
                <button type="button" className="btn btn-secondary">
                    Edit
                </button>
                </Link>
            </td>
            <td>
                <button
                type="button"
                className="btn btn-secondary"
                data-reservation-id-cancel={reservation.reservation_id}
                onClick={() => handleCancel(reservation.reservation_id)}
                >
                Cancel
                </button>
            </td>
        </tr>
  );
}
