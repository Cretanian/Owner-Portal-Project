import { useState } from "react";
import "./App.css";
import "./styles/DataGrid.css";

import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import routeDispatcher from "./routes/routeDispatcher";
import { UserContextProvider } from "./context/userContextProvider/UserContextProvider";

const Routes = () => {
  const routes = routeDispatcher();
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

function App() {
  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  );
}

export default App;
