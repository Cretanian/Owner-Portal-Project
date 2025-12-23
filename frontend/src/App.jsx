import { useState } from "react";
import "./App.css";

import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import routeDispatcher from "./routes/routeDispatcher";

function App() {
  const routes = routeDispatcher();
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}

export default App;
