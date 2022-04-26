//Returns an error message if Date is on a Tuesday. Returns undefined otherwise.
export function isDateTuesday(date) {
    const userReservationDate = new Date(date)
    if (userReservationDate.getUTCDay() === 2) {
        return "Restaurant is closed Tuesday. Please select another day."
    } else {
        return
    }
}

//Returns an error message if date/time combo is in the past. Returns undefined otherwise.
export function isDateInPast(reservation) {
    const userReservationDate = new Date(`${reservation.reservation_date} ${reservation.reservation_time}`)
    if(new Date() > userReservationDate) {
        return "Date and/or time cannot be in the past. Please select another date."
    } else {
        return
    }
}