import React, {useState, useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {readReservation} from "../utils/api"
import ErrorAlert from "./ErrorAlert"

export default function EditReservation() {
    const {reservation_id} = useParams()
    const history = useHistory()
    const [reservation, setReservation] = useState({})
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({})

    useEffect(() => {
        const ac = new AbortController()
        readReservation(reservation_id, ac.signal)
            .then(setReservation)
            .catch(setError)
        return () => ac.abort()
    }, [reservation_id])

    useEffect(() => {
        const initialFormState = {
            first_name: reservation.first_name,
            last_name: reservation.last_name,
            mobile_number: reservation.mobile_number,
            reservation_date: reservation.reservation_date,
            reservation_time: reservation.reservation_time,
            people: reservation.people
        }
        setFormData({...initialFormState})
    }, [reservation])

    return (
        <div>
            <h1>Edit Reservation</h1>
            <ErrorAlert error={error}/>
        </div>
    )
}