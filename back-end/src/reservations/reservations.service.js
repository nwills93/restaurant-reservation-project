const knex = require("../db/connection")

function listReservationsForCurrentDate(reservation_date) {
    const response =  knex("reservations").select("*").where({reservation_date}).andWhereNot({status: 'finished'}).andWhereNot({status: 'cancelled'}).orderBy("reservation_time")
    return response
}

function search(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
  }

function create(reservation) {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then(createdRow => createdRow[0])
}

function read(reservation_id) {
    return knex("reservations").select("*").where({reservation_id}).first()
}

function update(updatedReservation) {
    return knex("reservations")
        .select("*")
        .where({reservation_id: updatedReservation.reservation_id})
        .update(updatedReservation, "*")
        .then(updatedRow => updatedRow[0])
}

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