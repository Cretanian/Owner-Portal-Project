import UsersPage from "../pages/admin/usersPage/UsersPage";

const routes = [
  {
    path: "",
    children: [
      {
        path: "users",
        Component: UsersPage,
      },
    ],
  },
];

export default routes;
