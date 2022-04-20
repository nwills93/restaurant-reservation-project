import React, {useState} from 'react'

export default function SearchByPhone() {
    return (
        <div>
            <h1>Search for Reservation by Phone Number</h1>
            <form>
                <label htmlFor="mobile_number" className="form-label">
                    Search Phone Number:
                </label>
                <input 
                    id="mobile_number"
                    type="search"
                    name="mobile_number"
                    placeholder="Enter a customer's phone number"
                    className="form-control"
                />
                <button type="submit" className="btn btn-primary">Find</button>
            </form>
        </div>
    )
}