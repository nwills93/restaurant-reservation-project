import React, {useState, useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {readReservation, updateReservation} from "../utils/api"
import {isDateTuesday, isDateInPast} from "../utils/validateDate"
import ErrorAlert from "./ErrorAlert"
import InvalidDateErrors from "./InvalidDateErrors"
import ReservationFormPage from "./ReservationFormPage"

export default function EditReservation() {
    const {reservation_id} = useParams()
    const history = useHistory()
    const [reservation, setReservation] = useState({})
    const [error, setError] = useState(null)
    const [dateErrors, setDateErrors] = useState(null)
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

    const handleUpdateReservationSubmission = (event) => {
        event.preventDefault()
        setError(null)
        const tuesday = isDateTuesday(formData.reservation_date)
        const past = isDateInPast(formData)
        if (tuesday || past) {
            setDateErrors([tuesday ? tuesday : null, past ? past : null])
            return
        }
        setDateErrors(null)
        const ac = new AbortController()
        updateReservation(formData, reservation_id, ac.signal)
            .then(history.push(`/dashboard?date=${formData.reservation_date}`))
            .catch(setDateErrors)
        return () => ac.abort()
    }

    return (
        <div>
            <h1>Edit Reservation</h1>
            <ErrorAlert error={error}/>
            <InvalidDateErrors errors={dateErrors}/>
            <ReservationFormPage 
                onSubmit={handleUpdateReservationSubmission}
                onCancel={() => history.goBack()}
                formData={formData}
                setFormData={setFormData}
            />
        </div>
    )
}