import React from "react";

import secureRoutes from "./secureRoutes";
import adminRoutes from "./adminRoutes";
import publicRoutes from "./publicRoutes";
import { useUser } from "../context/userContextProvider/UserContextProvider";

function routeDispatcher() {
  const { user } = useUser();

  if (!user) return publicRoutes;

  return secureRoutes;
}

export default routeDispatcher;
