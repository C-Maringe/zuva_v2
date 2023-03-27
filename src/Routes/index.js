import React from 'react';
import { Routes, Route } from "react-router-dom";
import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts/index";
import { authProtectedRoutes, publicRoutes, serviceStationProtectedRoutes } from "./allRoutes";
import { AuthProtected, ServiceStationProtected } from './AuthProtected';
import NotFound from '../pages/Authentication/NotFound';
import { FallbackProvider } from "react-current-page-fallback";
import { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {

    const navigate = useNavigate()

    return (
        <React.Fragment>
            <FallbackProvider >
                <Routes>
                    <Route element={<NonAuthLayout />}>
                        {publicRoutes.map((route, idx) => (
                            <Route
                                path={route.path}
                                element={route.component}
                                key={idx}
                                exact={true}
                            />
                        ))}
                    </Route>
                    <Route element={<AuthProtected />}>
                        <Route element={<VerticalLayout />}>
                            {authProtectedRoutes.map((route, idx) => (

                                <Route
                                    path={route.path}
                                    element={route.component}
                                    key={idx}
                                    exact={true}
                                />
                            ))}
                        </Route>
                    </Route>
                    <Route element={<ServiceStationProtected />}>
                        <Route element={<VerticalLayout />}>
                            {serviceStationProtectedRoutes.map((route, idx) => (
                                <Route
                                    path={route.path}
                                    element={route.component}
                                    key={idx}
                                    exact={true}
                                />
                            ))}
                        </Route>
                    </Route>
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </FallbackProvider>
        </React.Fragment >
    );
};

export default Index;