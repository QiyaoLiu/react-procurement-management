import { createBrowserRouter, Navigate } from "react-router-dom";
import Main from "../pages/main";
import Home from "../pages/home";
import Supplier from "../pages/supplier";
import Order from "../pages/order";
import Login from "../pages/login";

const routes = [
  {
    path: "/",
    Component: Main,
    children: [
      //redirect
      {
        path: "/",
        element: <Navigate to="home" replace />,
      },
      {
        path: "home",
        Component: Home,
      },
      {
        path: "supplier",
        Component: Supplier,
      },
      {
        path: "order",
        Component: Order,
      },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
];

export default createBrowserRouter(routes);
