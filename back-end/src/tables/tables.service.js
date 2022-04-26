const knex = require("../db/connection");

//retrieves all tables from the db ordered in ascending order by name.
function listTables() {
  return knex("tables").select("*").orderBy("table_name");
}

//creates a new row in the 'tables' table filled with table information.
function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRow) => createdRow[0]);
}

//retrieves a table by id.
function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

/*
Updates a table's occupied status to occupied and assigns it a reservation id. 
The reservation associated with the reservation id has its status updated to 'seated'.
*/
async function update(updatedTable) {
  await knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .then((updatedRow) => updatedRow[0]);

  const response = await knex("reservations")
    .select("*")
    .where({ reservation_id: updatedTable.reservation_id })
    .update({ status: "seated" }, "*");
  return response[0];
}

/*Updates a reservation's status to finished.
Then, the table's reservation id is set to null, occupied status is set to false, and then the table is 'free' again. */
async function deleteTableAssignment(resetTable) {
  await knex("reservations")
    .select("*")
    .where({ reservation_id: resetTable.reservation_id })
    .update({ status: "finished" }, "*");

  const response = await knex("tables")
    .select("*")
    .where({ table_id: resetTable.table_id })
    .update({ occupied: false, reservation_id: null }, "*")
    .then((resetTableRow) => resetTableRow[0]);

  return response;
}

module.exports = {
  listTables,
  create,
  read,
  update,
  deleteTableAssignment,
};
