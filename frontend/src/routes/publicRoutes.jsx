import LoginPage from "../pages/public/loginPage/LoginPage";
import { Navigate } from "react-router";

const routes = [
  {
    path: "",
    children: [
      {
        path: "login",
        Component: LoginPage,
      },

      {
        path: "",
        Component: () => <Navigate to={"/login"} replace />,
      },
      {
        path: "*",
        Component: () => <Navigate to={"/login"} replace />,
      },
    ],
  },
];

export default routes;
