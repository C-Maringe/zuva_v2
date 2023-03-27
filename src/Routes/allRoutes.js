import React, { lazy } from "react";

// Non Auth
// import Login from "../pages/Authentication/Login";
const Login = lazy(() => import("../pages/Authentication/Login"))

const RegisterNewAdmin = lazy(() => import("../pages/Authentication/RegisterNewAdmin"))
const Make_admin = lazy(() => import("../pages/Authentication/Make_admin"));
const ForgetPassword = lazy(() => import("../pages/Authentication/ForgetPassword"));
const ResetPassword = lazy(() => import("../pages/Authentication/ResetPassword"));
const ResetPasswordCustomer = lazy(() => import("../pages/Authentication/ResetPasswordCustomer"));

// Corporate Accounts
const DashboardEcommerce = lazy(() => import("../pages/DashboardEcommerce"));
const Employees = lazy(() => import("../pro_pages/employees/Employees"));
const CardDetails = lazy(() => import("../pro_pages/CardDetails/CardDetails"));
const MainReports = lazy(() => import("../pro_pages/Reports/MainReports"));
const Transferfunds = lazy(() => import("../pro_pages/TransferFunds/TransferFunds"));
const MainProfile = lazy(() => import("../pro_pages/MainProfile/Profile"));
const MainCards = lazy(() => import("../pro_pages/MainCards/MainCards"));
const FleetManagement = lazy(() => import("../pro_pages/FleetManagement/FleetManagement"));

// Service Station
const ST_Attendants = lazy(() => import("../pro_pages/service-station/ST-Attendants"));
const ST_Profiles = lazy(() => import("../pro_pages/service-station/ST-Profiles"));
const ST_OperatorProfile = lazy(() => import("../pro_pages/service-station/ST-OperatorProfile"));
const ST_Transactions = lazy(() => import("../pro_pages/service-station/ST-Transactions"));

const authProtectedRoutes = [
  { path: "/", component: <DashboardEcommerce /> },
  { path: "/employees", component: <Employees /> },
  { path: "/transferfunds", component: <Transferfunds /> },
  { path: "/profile", component: <MainProfile /> },
  { path: "/cards", component: <MainCards /> },
  { path: "/cards/profile", component: <CardDetails /> },
  { path: "/reports", component: <MainReports /> },
  { path: '/fleet/management', component: <FleetManagement /> }
];

const serviceStationProtectedRoutes = [
  { path: "/service-station/transactions", component: <ST_Transactions /> },
  { path: "/service-station/attendants", component: <ST_Attendants /> },
  { path: "/service-station/profile", component: <ST_Profiles /> },
  { path: "/service-station/attendant/profile", component: <ST_OperatorProfile /> }
];

const publicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPassword /> },
  { path: "/admin/reset/password/:id/:token", component: <ResetPassword /> },
  { path: "/customer/reset/password/:id/:token", component: < ResetPasswordCustomer /> },
  { path: "/company/make-admin/:token", component: < Make_admin /> },
  { path: "/company/confirmed-make-admin/:token", component: < RegisterNewAdmin /> },
];

export { authProtectedRoutes, publicRoutes, serviceStationProtectedRoutes };