import React from 'react'

export default function SearchForm({onSubmit, formData, setFormData}) {

    const handleChange = ({target}) => {
        setFormData({
            [target.name]: target.value
        })
    }

    return (
        <form onSubmit={onSubmit}>
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
    )
}