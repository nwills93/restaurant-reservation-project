import React from 'react'
import "../../font.css"

export default function SearchForm({onSubmit, formData, setFormData}) {

    const handleChange = ({target}) => {
        setFormData({
            [target.name]: target.value
        })
    }

    return (
        <form onSubmit={onSubmit}>
                <label htmlFor="mobile_number" className="form-label text-white fancy-font">
                    Search Phone Number:
                </label>
                <div className="d-flex fancy-font" style={{marginRight: '5em'}}>
                <input 
                    id="mobile_number"
                    type="search"
                    name="mobile_number"
                    placeholder="Enter a customer's phone number"
                    onChange={handleChange}
                    value={formData.mobile_number}
                    className="form-control bg-dark text-white"
                />
                <button type="submit" className="btn btn-primary">Find</button>
                </div>
            </form>
    )
}