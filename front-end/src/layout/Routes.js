import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import CreateReservation from "./CreateReservation"
import CreateTable from "./CreateTable"
import SeatReservation from "./SeatReservation"
import SearchByPhone from "./SearchByPhone"
import EditReservation from "./EditReservation"

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      <Route exact path="/reservations/new">
        <CreateReservation />
      </Route>
      <Route exact path="/reservations/:reservationId/seat">
        <SeatReservation />
      </Route>
      <Route exact path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      <Route exact path="/tables/new">
        <CreateTable />
      </Route>
      <Route exact path="/search">
        <SearchByPhone />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
