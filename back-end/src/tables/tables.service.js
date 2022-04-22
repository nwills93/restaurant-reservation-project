const knex = require("../db/connection")

function listTables() {
    return knex("tables").select("*").orderBy("table_name")
}

function create(table) {
    return knex("tables")
        .insert(table)
        .returning("*")
        .then(createdRow => createdRow[0])
}

function read(table_id) {
    return knex("tables").select("*").where({table_id}).first()
}


async function update(updatedTable) {
    await knex("tables")
        .select("*")
        .where({table_id: updatedTable.table_id})
        .update(updatedTable, "*")
        .then(updatedRow => updatedRow[0])

    const response = await knex("reservations")
        .select("*")
        .where({reservation_id: updatedTable.reservation_id})
        .update({status: 'seated'}, "*")
    return response[0]
}

async function deleteTableAssignment(resetTable) {
    await knex("reservations")
        .select("*")
        .where({reservation_id: resetTable.reservation_id})
        .update({status: 'finished'}, "*")

    const response = await knex("tables")
        .select("*")
        .where({table_id: resetTable.table_id})
        .update({occupied: false, reservation_id: null}, "*")
        .then(resetTableRow => resetTableRow[0])
    
    return response
}

module.exports = {
    listTables,
    create,
    read,
    update,
    deleteTableAssignment
}