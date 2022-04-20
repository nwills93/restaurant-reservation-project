const tablesService = require("./tables.service")
const reservationsService = require("../reservations/reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const hasProperties = require("../errors/hasProperties")
const hasRequiredUpdateProperties = hasProperties("reservation_id")
const hasRequiredCreateProperties = hasProperties("table_name", "capacity")

async function listTables(req, res, next) {
    const data = await tablesService.listTables()
    res.json({data})
}
async function create(req, res, next) {
    const data = await tablesService.create(req.body.data)
    res.status(201).json({data})
}

function tableNameIsMoreThanOneCharacter(req, res, next) {
    const {table_name} = req.body.data
    if(table_name.length < 2) {
        next({
            status: 400,
            message: `table_name must be atleast 2 characters or longer`
        })
    } else {
        next()
    }
}

function capacityIsANumber(req, res, next) {
    let {capacity} = req.body.data
    capacity = Number(capacity)
    if(!Number.isInteger(capacity)) {
        next({
            status: 400,
            message: 'capacity is not a valid number'
        })
    } else {
        next()
    }
}

async function tableExists(req, res, next) {
    const tableId = Number(req.params.table_id)
    const foundTable = await tablesService.read(tableId)
    if(foundTable) {
        res.locals.table = foundTable
        next()
    } else {
        next({
            status: 404,
            message: `Table '${tableId}' does not exist`
        })
    }
}

async function validatingReservation(req, res, next) {
    const {reservation_id} = req.body.data
    const reservation = await reservationsService.read(reservation_id)
    if(!reservation) {
        next({
            status: 404,
            message: `Reservation id '${reservation_id}' does not exist`
        })
    }
    if(reservation.status === 'seated') {
        next({
            status: 400,
            message: 'Table has already been seated.'
        })
    }
    if(Number(res.locals.table.capacity) < Number(reservation.people)) {
        next({
            status: 400,
            message: "Party size cannot be greater than table capacity. Please select another table."
        })
    } else {
        next()
    }
}

function isTableOccupied(req, res, next) {
    if(res.locals.table.occupied) {
        next({
            status: 400,
            message: 'Table is currently occupied, please select another table.'
        })
    } else {
        next()
    } 
}

function isTableFree(req, res, next) {
    if(!res.locals.table.reservation_id) {
        next({
            status: 400,
            message: 'Table is not occupied.'
        })
    } else {
        next()
    }
}

async function updateTable(req, res, next) {
    const updatedTable = {
        ...req.body.data,
        occupied: true,
        table_id: res.locals.table.table_id
    }
    const data = await tablesService.update(updatedTable)
    res.json({data})
}

// async function deleteTableAssignment(req, res, next) {
//     const resetTableAssignment = {
//         table_id: res.locals.table.table_id,
//         occupied: false,
//         reservation_id: null,
//     }
//     const data = await tablesService.deleteTableAssignment(resetTableAssignment)
//     res.json({data})
// }

async function deleteTableAssignment(req, res, next) {
    const table = res.locals.table
    const data = await tablesService.deleteTableAssignment(table)
    res.json({data})
}



module.exports = {
    listTables: asyncErrorBoundary(listTables),
    create: [hasRequiredCreateProperties, tableNameIsMoreThanOneCharacter, capacityIsANumber, asyncErrorBoundary(create)],
    update: [asyncErrorBoundary(tableExists), hasRequiredUpdateProperties, asyncErrorBoundary(validatingReservation), isTableOccupied, asyncErrorBoundary(updateTable)],
    delete: [asyncErrorBoundary(tableExists), isTableFree, asyncErrorBoundary(deleteTableAssignment)]
}