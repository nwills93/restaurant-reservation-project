import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import {createTable} from '../utils/api'
import ErrorAlert from "./ErrorAlert"
import TableFormPage from "./TableFormPage"

export default function CreateTable() {

    const history = useHistory()

    const initialFormState = {
        table_name: "",
        capacity: null
    }

    const [formData, setFormData] = useState({...initialFormState})
    const [tableError, setTableError] = useState(null)

    const handleCreateTableSubmission = (event) => {
        event.preventDefault()
        createTable(formData).then(() => history.push("/dashboard")).catch(setTableError)
    }

    return (
        <div>
            <h1>Create Table</h1>
            <ErrorAlert error={tableError} />
            <TableFormPage 
                onSubmit={handleCreateTableSubmission}
                onCancel={() => history.goBack()}
                formData={formData}
                setFormData={setFormData}
            />
        </div>
    )
}