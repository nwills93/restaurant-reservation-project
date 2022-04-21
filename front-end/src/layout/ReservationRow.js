import React from "react";
import {useHistory, Link} from 'react-router-dom'
import {cancelReservation} from "../utils/api"

export default function ReservationRow({ reservation }) {
    const history = useHistory()

    const handleCancel = (id) => {
        if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
          cancelReservation(id).then(history.go(0))
        }
      }
  
    return (
        <tr key={reservation.reservation_id}>
            <td>{`${reservation.last_name}, ${reservation.first_name}`}</td>
            <td>{reservation.mobile_number}</td>
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
