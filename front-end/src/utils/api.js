/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

//production environment points to deployed backend url
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

//Retrieves all reservations (if any) that meet search criteria.
export async function searchReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

//Creates a new reservation.
export async function createReservation(reservation, signal) {
  const url = `${API_BASE_URL}/reservations`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  };
  return await fetchJson(url, options, reservation);
}

//Retrieves all tables.
export async function listTables(signal) {
  const url = `${API_BASE_URL}/tables`;
  const options = {
    method: "GET",
    headers,
    signal,
  };
  return await fetchJson(url, options, []);
}

//Creates a new table.
export async function createTable(table, signal) {
  const url = `${API_BASE_URL}/tables`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: table }),
    signal,
  };
  return await fetchJson(url, options, table);
}

//Retrieves information for a certain reservation.
export async function readReservation(reservationId, signal) {
  const url = `${API_BASE_URL}/reservations/${reservationId}`;
  const options = {
    headers,
    signal,
  };
  return await fetchJson(url, options, {});
}

//Updates pre-existing reservation with new information.
export async function updateReservation(reservation, id, signal) {
  const url = `${API_BASE_URL}/reservations/${id}`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  };
  return await fetchJson(url, options, reservation);
}

//Updates reservation status to 'cancelled'.
export async function cancelReservation(reservationId, signal) {
  const url = `${API_BASE_URL}/reservations/${reservationId}/status`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { status: "cancelled" } }),
    signal,
  };
  return await fetchJson(url, options, {});
}

//Updates Table to be associated with a reservation id so the table is 'occupied'.
export async function updateTableStatus(tableId, reservationId, signal) {
  const url = `${API_BASE_URL}/tables/${tableId}/seat`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { reservation_id: reservationId } }),
    signal,
  };
  return await fetchJson(url, options, {});
}

//Removes associated reservation id from the table so that the table is 'free'. This will also set the reservation status to 'finished.'
export async function deleteTableAssignment(tableId, signal) {
  const url = `${API_BASE_URL}/tables/${tableId}/seat`;
  const options = {
    method: "DELETE",
    headers,
    signal,
  };

  return await fetchJson(url, options);
}
