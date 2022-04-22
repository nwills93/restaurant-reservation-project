import React from 'react'

export default function SeatForm({ tables, onSubmit, onCancel, setFormData }) {

    const tableOptions = tables.map(table => (
        <option value={table.table_id}>{table.table_name} - {table.capacity}</option>
    ))

    const handleChange = ({target}) => {
        setFormData({
            [target.name]: target.value
        })
    }

    return (
        <form onSubmit={onSubmit}>
                <label htmlFor="table_id" className="form-label">
                    Seat At:
                </label>
                <select id="table_id" name="table_id" className="form-control" onChange={handleChange} required>
                    <option value>Select a Table</option>
                    {tableOptions}
                </select>
                <div className="mt-2">
                    <button type="button" className="btn btn-secondary mr-2" onClick={onCancel}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>
    )
}