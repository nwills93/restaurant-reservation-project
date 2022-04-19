const knex = require("../db/connection")

function listReservationsForCurrentDate(reservation_date) {
    return knex("reservations").select("*").where({reservation_date}).orderBy("reservation_time")
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

function updateReservationStatus(updatedReservation) {
    return knex("reservations")
        .select("*")
        .where({reservation_id: updatedReservation.reservation_id})
        .update(updatedReservation, "*")
        .then(updatedRow => updatedRow[0])
}

module.exports = {
    listReservationsForCurrentDate,
    create,
    read,
    updateReservationStatus
}