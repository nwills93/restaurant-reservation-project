const reservationsService = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const hasProperties = require("../errors/hasProperties")
const hasRequiredProperties = hasProperties("first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people")

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status"
]

 function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

function isANumber(req, res, next) {
  let {people} = req.body.data
  people = Number(people)
  if(!Number.isInteger(people)) {
    next({
      status: 400,
      message: "Input for 'people' is not a valid number"
    })
  } else {
    next()
  }
}

// function isValidPhoneNumber(req, res, next) {
//   const data = req.body.data
//   const regex = /[0-9]{3}-[0-9]{3}-[0-9]{4}/
//   if (!data.mobile_number.match(regex)) {
//     next({
//       status: 400,
//       message: "Mobile number is not in a valid format."
//     })
//   } else {
//     next()
//   }
// }

function isValidDate(req, res, next) {
  const {reservation_date} = req.body.data
  const validDateRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/
  if(!reservation_date.match(validDateRegex)) {
    next({
      status: 400,
      message: `reservation_date '${reservation_date}' is invalid`
    })
  } else {
    next()
  }
}

function dateIsNotInPast(req, res, next) {
  const {reservation_date, reservation_time} = req.body.data
  let current = new Date()
  let userReservationDate = new Date(`${reservation_date} ${reservation_time}`)
  if (current > userReservationDate) {
    next({
      status: 400,
      message: `Reservation date must be a future date and time than the current date and time.`
    })
  } else {
    next()
  }
}

function isDateTuesday(req, res, next) {
  const {reservation_date} = req.body.data
  let userReservationDate = new Date(reservation_date)
  if(userReservationDate.getUTCDay() === 2) {
    next({
      status: 400,
      message: "Restaurant is closed on Tuesday. Please select another day."
    })
  } else {
    next()
  }
}

function isValidTime(req, res, next) {
  const {reservation_time} = req.body.data
  const validTimeRegex = /[0-2]{1}[0-9]{1}:[0-5]{1}[0-9]{1}/
  const timeNumber = Number(reservation_time.split(":").join(""))
  if(!reservation_time.match(validTimeRegex)) {
    next({
      status: 400,
      message: `reservation_time '${reservation_time}' is invalid`
    })
  } else if(timeNumber < 1030) {
    next({
      status: 400,
      message: `Restaurant opens at 10:30 AM.`
    })
  } else if(timeNumber > 2130) {
    next({
      status: 400,
      message: `Restaurant does not accept reservations after 9:30 PM`
    })
  } else {
    next()
  }
}

async function reservationExists(req, res, next) {
  const reservationId = Number(req.params.reservation_id)
  const foundReservation = await reservationsService.read(reservationId)
  if (foundReservation) {
    res.locals.reservation = foundReservation
    next()
  } else {
    next({
      status: 404,
      message: `Reservation '${req.params.reservation_id}' does not exist` 
    })
  }
}

function checkStatus(req, res, next) {
  const {status} = req.body.data
  if(status !== 'booked') {
    next({
      status: 400,
      message: `Status '${status}' is invalid`
    })
  } else {
    next()
  }
}

function checkIfStatusIsFinished(req, res, next) {
  if(res.locals.reservation.status === 'finished') {
    next({
      status: 400,
      message: 'Cannot update status of a reservation that is finished.'
    })
  } else {
    next()
  }
}

function checkIfStatusIsValidEntry(req, res, next) {
  const {status} = req.body.data
  console.log(status)
  const validStatus = ['booked', 'seated', 'finished']
  if (validStatus.includes(status)) {
    next()
  } else {
    next({
      status: 400,
      message: `Status '${status}' is invalid. Status must be either 'booked', 'seated', or 'finished'.`
    })
  }
}

async function list(req, res) {
  const data = await reservationsService.listReservationsForCurrentDate(req.query.date)
  res.json({data})
}

async function create(req, res) {
  const data = await reservationsService.create(req.body.data)
  res.status(201).json({data})
}

function read(req, res, next) {
  res.json({data: res.locals.reservation})
}

async function updateReservationStatus(req, res, next) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id
  }
  const data = await reservationsService.updateReservationStatus(updatedReservation)
  res.json({data})
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasOnlyValidProperties, hasRequiredProperties, isValidDate, dateIsNotInPast, isDateTuesday, isValidTime, isANumber, checkStatus ,asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [asyncErrorBoundary(reservationExists), checkIfStatusIsFinished, checkIfStatusIsValidEntry, asyncErrorBoundary(updateReservationStatus)]
};
