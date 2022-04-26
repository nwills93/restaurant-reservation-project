const knex = require("../db/connection")

//queries reservations that match the reservation date query who don't have a status of finished or cancelled. Ordered in ascending order by reservation time.
function listReservationsForCurrentDate(reservation_date) {
    const response =  knex("reservations").select("*").where({reservation_date}).andWhereNot({status: 'finished'}).andWhereNot({status: 'cancelled'}).orderBy("reservation_time")
    return response
}

//queries reservations that include the search string. Ordered in ascending order by reservation date.
function search(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
  }

//creates a new reservation in the reservations table in the db.
function create(reservation) {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then(createdRow => createdRow[0])
}

//queries the reservation that matches by the given id.
function read(reservation_id) {
    return knex("reservations").select("*").where({reservation_id}).first()
}

//updates a reservation with new data.
function update(updatedReservation) {
    return knex("reservations")
        .select("*")
        .where({reservation_id: updatedReservation.reservation_id})
        .update(updatedReservation, "*")
        .then(updatedRow => updatedRow[0])
}

//updates a reservation's status.
function updateReservationStatus(updatedReservationStatus) {
    return knex("reservations")
        .select("*")
        .where({reservation_id: updatedReservationStatus.reservation_id})
        .update(updatedReservationStatus, "*")
        .then(updatedRow => updatedRow[0])
}

module.exports = {
    listReservationsForCurrentDate,
    create,
    read,
    update,
    updateReservationStatus,
    search
}