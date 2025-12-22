import LoginPage from "../pages/public/loginPage/LoginPage";

const routes = [
  {
    path: "",
    children: [
      {
        path: "login",
        Component: LoginPage,
      },
    ],
  },
];

export default routes;
