import React, {useState} from 'react'
import {searchReservations} from '../utils/api'
import ErrorAlert from "./ErrorAlert"

export default function SearchByPhone() {
    const initialFormState = {
        mobile_number: ""
    }

    const [formData, setFormData] = useState({...initialFormState})
    const [reservations, setReservations] = useState(null)
    const [error, setError] = useState(null)

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
        searchReservations({mobile_number}, ac.signal).then(setReservations).catch(setError)
        return () => ac.abort()
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
        </div>
    )
}