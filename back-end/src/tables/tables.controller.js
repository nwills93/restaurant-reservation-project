const tablesService = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasRequiredUpdateProperties = hasProperties("reservation_id");
const hasRequiredCreateProperties = hasProperties("table_name", "capacity");

//validates that the table name is more than one character long.
function tableNameIsMoreThanOneCharacter(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.length < 2) {
    next({
      status: 400,
      message: `table_name must be atleast 2 characters or longer`,
    });
  } else {
    next();
  }
}

//validates that table capacity is a number.
function capacityIsANumber(req, res, next) {
  let { capacity } = req.body.data;
  capacity = Number(capacity);
  if (!Number.isInteger(capacity)) {
    next({
      status: 400,
      message: "capacity is not a valid number",
    });
  } else {
    next();
  }
}

//validates that a table exists.
async function tableExists(req, res, next) {
  const tableId = Number(req.params.table_id);
  const foundTable = await tablesService.read(tableId);
  if (foundTable) {
    res.locals.table = foundTable;
    next();
  } else {
    next({
      status: 404,
      message: `Table '${tableId}' does not exist`,
    });
  }
}

//validation middleware for reservation.
async function validatingReservation(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await reservationsService.read(reservation_id);

  //if no reservation is found, reservation does not exist.
  if (!reservation) {
    next({
      status: 404,
      message: `Reservation id '${reservation_id}' does not exist`,
    });
  }

  //If the reservation status is 'seated', then the table cannot be updated with this reservation, as it's already been seated at another table.
  if (reservation.status === "seated") {
    next({
      status: 400,
      message: "Table has already been seated.",
    });
  }

  //If the table's capacity is less than the number of people in a reservation's party, reservation cannot be seated at the table.
  if (Number(res.locals.table.capacity) < Number(reservation.people)) {
    next({
      status: 400,
      message:
        "Party size cannot be greater than table capacity. Please select another table.",
    });
  } else {
    next();
  }
}

//checks to see if the table is already occupied. If so, reservation cannot be seated at the table.
function isTableOccupied(req, res, next) {
  if (res.locals.table.occupied) {
    next({
      status: 400,
      message: "Table is currently occupied, please select another table.",
    });
  } else {
    next();
  }
}

/*
checks to see if the table is free. If so, the table cannot be finished, as it is already free. 
A table is considered occupied if its secondary key in the db has a value pointing toward a valid reservation id.
*/
function isTableFree(req, res, next) {
  if (!res.locals.table.reservation_id) {
    next({
      status: 400,
      message: "Table is not occupied.",
    });
  } else {
    next();
  }
}

//gets all tables.
async function listTables(req, res, next) {
  const data = await tablesService.listTables();
  res.json({ data });
}

//creates a table.
async function create(req, res, next) {
  const data = await tablesService.create(req.body.data);
  res.status(201).json({ data });
}

//updates a table's status to occupied by assigning it a reservation id.
async function updateTable(req, res, next) {
  const updatedTable = {
    ...req.body.data,
    occupied: true,
    table_id: res.locals.table.table_id,
  };
  const data = await tablesService.update(updatedTable);
  res.json({ data });
}

//Sets a table's reservation id to 'null'. Therefore, the table has been 'finished' and is no longer occupied. The table is now 'free'.
async function deleteTableAssignment(req, res, next) {
  const table = res.locals.table;
  const data = await tablesService.deleteTableAssignment(table);
  res.json({ data });
}

module.exports = {
  listTables: asyncErrorBoundary(listTables),
  create: [
    hasRequiredCreateProperties,
    tableNameIsMoreThanOneCharacter,
    capacityIsANumber,
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(tableExists),
    hasRequiredUpdateProperties,
    asyncErrorBoundary(validatingReservation),
    isTableOccupied,
    asyncErrorBoundary(updateTable),
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    isTableFree,
    asyncErrorBoundary(deleteTableAssignment),
  ],
};
