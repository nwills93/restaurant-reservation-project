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
                <label htmlFor="table_name" className="form-label">
                    Table Name
                </label>
                <input 
                    id="table_name"
                    type="text"
                    name="table_name"
                    minlength="2"
                    onChange={handleChange}
                    value={formData.table_name}
                    className="form-control"
                    required
                />
                <label htmlFor="capacity" className="form-label">
                    Capacity
                </label>
                <input 
                    id="capacity"
                    type="number"
                    name="capacity"
                    min="1"
                    onChange={handleChange}
                    value={formData.capacity}
                    className="form-control"
                    required
                />
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            </form>
    )
}