import React from "react";

import secureRoutes from "./secureRoutes";
import adminRoutes from "./adminRoutes";
import publicRoutes from "./publicRoutes";

function routeDispatcher() {
  // TODO:
  // if user is not authenticated return publicRoutes
  // if user is admin return admin
  // else return secureRoutes

  return secureRoutes;
}

export default routeDispatcher;
