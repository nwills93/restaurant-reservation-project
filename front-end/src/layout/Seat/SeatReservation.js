import React, {useState, useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {listTables, readReservation, updateTableStatus} from "../../utils/api"
import ErrorAlert from "../Errors/ErrorAlert"
import SeatForm from "../Forms/SeatForm"

export default function SeatReservation() {

    const {reservationId} = useParams()

    const history = useHistory()

    const [reservation, setReservation] = useState({})
    const [error, setError] = useState(null)
    const [tables, setTables] = useState([])
    const [formData, setFormData] = useState({table_id: null})

    useEffect(() => {
        const ac = new AbortController()
        readReservation(reservationId, ac.signal).then(setReservation).catch(setError)
        return () => ac.abort()
    }, [reservationId])

    useEffect(() => {
        const ac = new AbortController()
        listTables(ac.signal).then(setTables).catch(setError)
        return () => ac.abort()
    }, [])
    
    const handleTableSelection = (event) => {
        event.preventDefault()
        const ac = new AbortController()
        updateTableStatus(formData.table_id, reservation.reservation_id, ac.signal).then(() => history.push("/dashboard")).catch(setError)
        return () => ac.abort()
    }

    return (
        <div>
            <h1>Seat Reservation</h1>
            <ErrorAlert error={error}/>
            <h2>{reservation.reservation_id} - {reservation.first_name} {reservation.last_name} on {reservation.reservation_date} at {reservation.reservation_time} | Party of {reservation.people}</h2>
            {tables && (
                <SeatForm 
                    tables={tables}
                    onSubmit={handleTableSelection}
                    onCancel={() => history.goBack()}
                    setFormData={setFormData}
                />
            )}
        </div>
    )
}