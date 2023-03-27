import React, { useState } from 'react';
import humanicon from '../../assets/Pictures/humanicon.jpg'
import { useSelector } from 'react-redux'
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

import { Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { isloggedout } from '../../store/auth.js/Islogged';
import { IsTableloading } from '../../store/auth.js/tableloadingStore';
import { IsNotServiceStationNow } from '../../store/auth.js/CheckIfServiceStation';

const ProfileDropdown = () => {

    const dispatch = useDispatch()
    const CardInStoredID = ([...useSelector(state => state.UserInfoStored)].map((data) => data.status)[0])
    const CheckIfCompany = ([...useSelector(state => state.IsCompanyLoggedIn)].map((data) => data.status)[0])
    const UserInfoStoredLocally = ([...useSelector(state => state.UserInfoStored)].map((data) => data.status)[0])
    const [isProfileDropdown, setIsProfileDropdown] = useState(false);
    const toggleProfileDropdown = () => { setIsProfileDropdown(!isProfileDropdown); };
    const UserDataInfo = ([...useSelector(state => state.MoreTransactionsStoredRedux)].map((data) => data.status)[0])

    const newdataAcc = CheckIfCompany ? (UserDataInfo.model.other_accounts.map((data) => ({ account: data.account, balance: data.deposit / 100 }))) : []
    const [USD_ACCOUNT] = (newdataAcc.filter(({ account }) => account.includes("USD")))
    const [ZWL_ACCOUNT] = (newdataAcc.filter(({ account }) => !account.includes("USD")))

    const IsServiceStation = ([...useSelector(state => state.IsServiceStation)].map((data) => data.status)[0])

    const ServiceStationUserInfoIn = ([...useSelector(state => state.ServiceStationUserInfoRedux)].map((data) => data.status)[0])

    return (
        <React.Fragment>
            <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className="ms-sm-3 header-item topbar-user">
                <DropdownToggle tag="button" type="button" className="btn">
                    <span className="d-flex align-items-center">
                        <img className="rounded-circle header-profile-user" src={humanicon}
                            alt="Header Avatar" />
                        <span className="text-start ms-xl-2">
                            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                                {IsServiceStation ? UserInfoStoredLocally.model === undefined ? '' : UserInfoStoredLocally.model.name : CheckIfCompany ? UserDataInfo.model.name :
                                    <><>{CardInStoredID.customer.first_name}  </><>{CardInStoredID.customer.last_name}</></>}</span>
                            <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                                {CheckIfCompany ? UserDataInfo.model.company_contacts[0].company_contact_type : IsServiceStation ? "Service Station" : "Individual Account"}</span>
                        </span>
                    </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                    <h6 className="dropdown-header">{IsServiceStation ? UserInfoStoredLocally.model === undefined ? '' : UserInfoStoredLocally.model.name + " station"
                        : CheckIfCompany ? UserDataInfo.model.name : CardInStoredID.customer.first_name}</h6>
                    <Link to={IsServiceStation ? "/service-station/profile" : "/profile"}>
                        <DropdownItem ><i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
                            <span className="align-middle">Profile</span></DropdownItem> </Link>
                    <div className="dropdown-divider"></div>
                    {IsServiceStation ? "" : CheckIfCompany ? <>
                        <DropdownItem ><i
                            className="mdi mdi-wallet text-muted fs-16 align-middle me-1"></i> <span
                                className="align-middle"> Company USD Balance : <b>${(USD_ACCOUNT.balance).toFixed(2)}</b></span></DropdownItem>
                        <DropdownItem ><i
                            className="mdi mdi-wallet text-muted fs-16 align-middle me-1"></i> <span
                                className="align-middle"> Company ZWL Balance : <b>${(ZWL_ACCOUNT.balance).toFixed(2)}</b></span>
                        </DropdownItem></> :
                        <>
                            <DropdownItem ><i
                                className="mdi mdi-wallet text-muted fs-16 align-middle me-1"></i> <span
                                    className="align-middle">  USD Balance : <b>${(UserInfoStoredLocally.customer.cards.filter(({ pan, currency }) => pan.includes('_') && currency.includes('USD'))
                                        .reduce((accumulator, object) => {
                                            return accumulator + object.deposit_amount;
                                        }, 0) / 100).toFixed(2)}</b></span></DropdownItem>
                            <DropdownItem ><i
                                className="mdi mdi-wallet text-muted fs-16 align-middle me-1"></i> <span
                                    className="align-middle">  ZWL Balance : <b>${(UserInfoStoredLocally.customer.cards.filter(({ pan, currency }) => pan.includes('_') && currency.includes('ZWL'))
                                        .reduce((accumulator, object) => {
                                            return accumulator + object.deposit_amount;
                                        }, 0) / 100).toFixed(2)}</b></span></DropdownItem></>}
                    <a onClick={() => {
                        dispatch(isloggedout())
                        dispatch(IsTableloading())
                        dispatch(IsNotServiceStationNow())
                    }}>
                        <DropdownItem ><i
                            className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i> <span
                                className="align-middle" data-key="t-logout">Logout</span></DropdownItem></a>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default ProfileDropdown;