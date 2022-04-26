import React, {useState} from 'react'
import {searchReservations, cancelReservation} from '../../utils/api'
import ErrorAlert from "../Errors/ErrorAlert"
import ReservationTableDisplay from "../Reservations/ReservationTableDisplay"
import SearchForm from "../Forms/SearchForm"
import "../../font.css"

/*
SearchByPhone contains logic for how to handle search submission.
All reservations that match the search query are displayed in a table
Otherwise 'No reservations found' is displayed.
*/
export default function SearchByPhone() {

    const [formData, setFormData] = useState({mobile_number: ""})
    const [reservations, setReservations] = useState([])
    const [error, setError] = useState(null)
    const [notFound, setNotFound] = useState("")

    //if a reservation (or reservations) are returned from the API, display them. Otherwise, display 'No reservations found'.
    const handleResponse = async (response) => {
        if (response.length >= 1) {
            setNotFound("")
            setReservations(response)
        } else {
            setReservations([])
            setNotFound('No reservations found')
        }
    }

    const handleSearchSubmission = (event) => {
        event.preventDefault()
        const ac = new AbortController()
        const {mobile_number} = formData
        searchReservations({mobile_number}, ac.signal)
            .then(handleResponse)
            .catch(setError)
        return () => ac.abort()
    }

    /*
    Modal dialogue that asks user to confirm reservation cancellation.
    If confirmed, reservation status is updated to 'cancelled' and unlike on the Dashboard,
    the reservation is displayed as it still meets the search criteria. 
    */
    const handleCancel = (id) => {
        const ac = new AbortController()
        const {mobile_number} = formData
        if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
            cancelReservation(id)
                .then(() => searchReservations({mobile_number}, ac.signal))
                .then(handleResponse)
                .catch(setError)
        }
        return () => ac.abort()
    }

    return (
        <div className="fancy-font">
            <h1 className="text-white fancy-font">Search for Reservation by Phone Number</h1>
            <ErrorAlert error={error}/>
            <SearchForm 
                onSubmit={handleSearchSubmission}
                formData={formData}
                setFormData={setFormData}
            />
            {reservations.length >= 1 ? (
                <div className="overflow-auto mt-2">
                <ReservationTableDisplay reservations={reservations} handleCancel={handleCancel}/>
                </div>           
            ) : (
                <h3 className="mt-2 text-white fancy-font">{notFound}</h3>
            )}
        </div>
    )
}