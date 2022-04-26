import React from 'react'

export default function TableFormPage({onSubmit, onCancel, formData, setFormData}) {
    const handleChange = ({target}) => {
        setFormData({
            ...formData,
            [target.name]: target.value
        })
    }

    return (
        <form onSubmit={onSubmit}>
                <label htmlFor="table_name" className="form-label text-white">
                    Table Name
                </label>
                <input 
                    id="table_name"
                    type="text"
                    name="table_name"
                    minLength="2"
                    onChange={handleChange}
                    value={formData.table_name}
                    className="form-control bg-dark text-white"
                    required
                />
                <label htmlFor="capacity" className="form-label text-white">
                    Capacity
                </label>
                <input 
                    id="capacity"
                    type="number"
                    name="capacity"
                    min="1"
                    onChange={handleChange}
                    value={formData.capacity}
                    className="form-control bg-dark text-white"
                    required
                />
                <div className="mt-2">
                    <button type="submit" className="btn btn-primary mr-2">Save</button>
                    <button type="button" className="btn btn-dark" onClick={onCancel}>Cancel</button>
                </div>
            </form>
    )
}