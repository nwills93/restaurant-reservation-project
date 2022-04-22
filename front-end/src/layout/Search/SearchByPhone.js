import React, {useState} from 'react'
import {searchReservations, cancelReservation} from '../../utils/api'
import ErrorAlert from "../Errors/ErrorAlert"
import ReservationTableDisplay from "../Reservations/ReservationTableDisplay"
import SearchForm from "../Forms/SearchForm"

export default function SearchByPhone() {

    const [formData, setFormData] = useState({mobile_number: ""})
    const [reservations, setReservations] = useState([])
    const [error, setError] = useState(null)
    const [notFound, setNotFound] = useState("")

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

    const handleCancel = (id) => {
        const {mobile_number} = formData
        if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
            cancelReservation(id)
                .then(() => searchReservations({mobile_number}))
                .then(handleResponse)
                .catch(setError)
        }
    }

    return (
        <div>
            <h1>Search for Reservation by Phone Number</h1>
            <ErrorAlert error={error}/>
            <SearchForm 
                onSubmit={handleSearchSubmission}
                formData={formData}
                setFormData={setFormData}
            />
            {reservations.length >= 1 ? (
                <ReservationTableDisplay reservations={reservations} handleCancel={handleCancel}/>           
            ) : (
                <p>{notFound}</p>
            )}
        </div>
    )
}