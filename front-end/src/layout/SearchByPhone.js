import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {searchReservations, cancelReservation} from '../utils/api'
import ErrorAlert from "./ErrorAlert"

export default function SearchByPhone() {
    const initialFormState = {
        mobile_number: ""
    }

    const [formData, setFormData] = useState({...initialFormState})
    const [reservations, setReservations] = useState([])
    const [error, setError] = useState(null)
    const [notFound, setNotFound] = useState("")

    const handleChange = ({target}) => {
        setFormData({
            ...initialFormState,
            [target.name]: target.value
        })
    }

    const handleSearchSubmission = (event) => {
        event.preventDefault()
        const ac = new AbortController()
        const {mobile_number} = formData
        searchReservations({mobile_number}, ac.signal)
            .then((response) => {
                if (response.length >= 1) {
                    setNotFound("")
                    setReservations(response)
                } else {
                    setReservations([])
                    setNotFound('No reservations found')
                }
            })
            .catch(setError)
        return () => ac.abort()
    }

    const handleCancel = (id) => {
        const {mobile_number} = formData
        if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
            cancelReservation(id)
                .then(() => searchReservations({mobile_number}))
                .then((response) => {
                    if (response.length >= 1) {
                        setNotFound("")
                        setReservations(response)
                    } else {
                        setReservations([])
                        setNotFound('No reservations found')
                    }
                })
                .catch(setError)
        }
    }

    return (
        <div>
            <h1>Search for Reservation by Phone Number</h1>
            <ErrorAlert error={error}/>
            <form onSubmit={handleSearchSubmission}>
                <label htmlFor="mobile_number" className="form-label">
                    Search Phone Number:
                </label>
                <input 
                    id="mobile_number"
                    type="search"
                    name="mobile_number"
                    placeholder="Enter a customer's phone number"
                    onChange={handleChange}
                    value={formData.mobile_number}
                    className="form-control"
                />
                <button type="submit" className="btn btn-primary">Find</button>
            </form>
            {reservations.length >= 1 ? (
            <div className="d-flex justify-content-between">
                <table className="table table-bordered border-dark table-hover mr-2">
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Mobile Number</th>
                    <th>Reservation Time</th>
                    <th>Number of People in Party</th>
                    <th>Status</th>
                    </tr>
                </thead>
                    <tbody>
                    {reservations.map((reservation) => (
                        <tr key={reservation.reservation_id}>
                          <td>{`${reservation.last_name}, ${reservation.first_name}`}</td>
                          <td>{reservation.mobile_number}</td>
                          <td>{reservation.reservation_time}</td>
                          <td>{reservation.people}</td>
                          <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>
                          {reservation.status === 'booked' && (
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
                                onClick={() => handleCancel(reservation.reservation_id)}>
                                    Cancel
                              </button>
                          </td>
                        </tr>
                      ))}
                      </tbody>         
                </table>
            </div>
            ) : (
                <p>{notFound}</p>
            )}
        </div>
    )
}