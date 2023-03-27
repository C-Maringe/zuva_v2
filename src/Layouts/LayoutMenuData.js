import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Navdata = () => {

    // const dispatch = useDispatch
    const [isDashboard, setIsDashboard] = useState(false);
    const [isApps, setIsApps] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [isPages, setIsPages] = useState(false);
    const [isBaseUi, setIsBaseUi] = useState(false);
    const [isAdvanceUi, setIsAdvanceUi] = useState(false);
    const [isForms, setIsForms] = useState(false);
    const [isTables, setIsTables] = useState(false);
    const [isCharts, setIsCharts] = useState(false);
    const [isIcons, setIsIcons] = useState(false);
    const [isMaps, setIsMaps] = useState(false);
    const [isMultiLevel, setIsMultiLevel] = useState(false);

    // Authentication
    const [isSignIn, setIsSignIn] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    // Pages
    const [isLanding, setIsLanding] = useState(false);

    const [iscurrentState, setIscurrentState] = useState('Dashboard');

    useEffect(() => {
        document.body.classList.remove('twocolumn-panel');
        if (iscurrentState !== 'Dashboard') {
            setIsDashboard(false);
        }
        if (iscurrentState !== 'Apps') {
            setIsApps(false);
        }
        if (iscurrentState !== 'Auth') {
            setIsAuth(false);
        }
        if (iscurrentState !== 'Pages') {
            setIsPages(false);
        }
        if (iscurrentState !== 'BaseUi') {
            setIsBaseUi(false);
        }
        if (iscurrentState !== 'AdvanceUi') {
            setIsAdvanceUi(false);
        }
        if (iscurrentState !== 'Forms') {
            setIsForms(false);
        }
        if (iscurrentState !== 'Tables') {
            setIsTables(false);
        }
        if (iscurrentState !== 'Charts') {
            setIsCharts(false);
        }
        if (iscurrentState !== 'Icons') {
            setIsIcons(false);
        }
        if (iscurrentState !== 'Maps') {
            setIsMaps(false);
        }
        if (iscurrentState !== 'MuliLevel') {
            setIsMultiLevel(false);
        }
        if (iscurrentState === 'Widgets') {
            document.body.classList.add('twocolumn-panel');
        }
        if (iscurrentState !== 'Landing') {
            setIsLanding(false);
        }
    }, [
        iscurrentState,
        isDashboard,
        isApps,
        isAuth,
        isPages,
        isBaseUi,
        isAdvanceUi,
        isForms,
        isTables,
        isCharts,
        isIcons,
        isMaps,
        isMultiLevel
    ]);

    const CheckIfCompany = ([...useSelector(state => state.IsCompanyLoggedIn)].map((data) => data.status)[0])
    const IsServiceStation = ([...useSelector(state => state.IsServiceStation)].map((data) => data.status)[0])

    const menuItems0 = [
        {
            label: "Menu",
            isHeader: true,
        },
        {
            id: "dashboard",
            label: "View Transactions",
            icon: "ri-dashboard-2-line",
            link: "/",
            click: function (e) {
                e.preventDefault();
                setIscurrentState('View Transactions');
            }
        },
        {
            id: "transferfunds",
            label: "Transfer Funds",
            icon: "ri-funds-line",
            link: "/transferfunds",
            subItems: [
                {
                    id: "abc1",
                    label: "Company to Card",
                    link: "/transferfunds#company-to-card/1",
                    parentId: "transferfunds",
                },
                {
                    id: "abc2",
                    label: "Card to Card",
                    link: "/transferfunds#card-to-card/2",
                    parentId: "transferfunds",
                },
                {
                    id: "abc3",
                    label: "Card to Company",
                    link: "/transferfunds#card-to-company/3",
                    parentId: "transferfunds",
                },
                {
                    id: "abc4",
                    label: "Bulk Company to Card Transfer",
                    link: "/transferfunds#bulk-company-to-card/4",
                    parentId: "transferfunds",
                }
            ],
        },
        // {
        //     id: "reporst",
        //     label: "Reports",
        //     icon: "ri-bar-chart-grouped-line",
        //     link: "/reports",
        //     click: function (e) {
        //         e.preventDefault();
        //         setIscurrentState('Reports');
        //     }
        // },
        {
            id: "apps",
            label: "View Cards",
            icon: "ri-bank-card-line",
            link: "/cards"
        },
        {
            label: "pages",
            isHeader: true,
        },
        {
            id: "authentication",
            label: "View Employees",
            icon: "ri-group-line",
            link: "/employees"
        },
        {
            id: "fleetManagement",
            label: "Fleet Management",
            icon: "ri-building-line",
            link: "/fleet/management"
        },
        {
            id: "pages",
            label: "View Profile",
            icon: "ri-account-circle-line",
            link: "/profile",
            subItems: [
                {
                    id: "profile",
                    label: "Go to Profile",
                    link: "/profile",
                    parentId: "pages",
                },
                {
                    id: "starter",
                    label: "Logout",
                    link: "/login",
                    parentId: "pages",
                }
            ],
        }
    ]

    const menuItems1 = [
        {
            label: "Menu",
            isHeader: true,
        },
        {
            id: "dashboard",
            label: "View Transactions",
            icon: "ri-dashboard-2-line",
            link: "/",
        },
        {
            id: "apps",
            label: "View Cards",
            icon: "ri-bank-card-line",
            link: "/cards"
        },
        {
            label: "pages",
            isHeader: true,
        },
        {
            id: "authentication",
            label: "View Vehicles",
            icon: "ri-group-line",
            link: "/employees"
        },
        {
            id: "pages",
            label: "View Profile",
            icon: "ri-account-circle-line",
            link: "/profile",
            subItems: [
                {
                    id: "profile",
                    label: "Go to Profile",
                    link: "/profile",
                    parentId: "pages",
                },
                {
                    id: "starter",
                    label: "Logout",
                    link: "/login",
                    parentId: "pages",
                    // click: function (e) {
                    //     e.preventDefault();
                    //     dispatch(isloggedout())
                    // }
                }
            ],
        }
    ];

    const menuItems2 = [
        {
            label: "Menu",
            isHeader: true,
        },
        {
            id: "dashboard",
            label: "View Transactions",
            icon: "ri-dashboard-2-line",
            link: "/service-station/transactions",
        },
        {
            label: "pages",
            isHeader: true,
        },
        {
            id: "apps",
            label: "View Attendants",
            icon: "ri-group-line",
            link: "/service-station/attendants"
        },
        {
            id: "authentication",
            label: "View Profile",
            icon: "ri-account-circle-line",
            link: "/service-station/profile"
        }

    ];

    const menuItems = IsServiceStation ? menuItems2 : CheckIfCompany ? menuItems0 : menuItems1
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;