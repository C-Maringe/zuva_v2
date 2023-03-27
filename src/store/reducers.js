import { combineReducers } from "redux";

import IsCompanyLoggedIn from './auth.js/IsCompany';
import IsLoggedIn from './auth.js/Islogged';
import CardInfoRedux from './cardInfo/Cardinfo';
import UserToken from './auth.js/Token';
import CardID from './cardInfo/CardID';
import CompanyID from './auth.js/CompanyID';
import UserInfoStored from './auth.js/UserInfoStored';
import TransactionsStoredRedux from './auth.js/TransactionsStored';
import MoreTransactionsStoredRedux from './auth.js/MoreDetailsUser';
import SelectedCardDetails from './auth.js/SelectedCardDetails';
import TOGGLELOADER from "./auth.js/OpenLoader";
import Layout from "./layouts/reducer";
import UserCredidentials from "./auth.js/UserCredidentials";
import StoredRerunFunction from "./auth.js/StoredRerunFunction";
import CurrentTransaStoredRedux from "./auth.js/CurrentTransaStored";
import IsTableLoadingStore from "./auth.js/tableloadingStore";
import IsBulkTransfer from "./auth.js/BulkTransfer";
import ProcessingBulkTransferInfo from "./auth.js/ProcessingBulkInfo";
import IsServiceStation from "./auth.js/CheckIfServiceStation";
import ServiceStationUserInfoRedux from "./auth.js/ServiceStationUserInfo";
import CurrentServiceStationId from "./auth.js/ServiceStationId";

const rootReducer = combineReducers({
    Layout, IsCompanyLoggedIn, IsLoggedIn, CardInfoRedux, UserToken, CardID, CompanyID, UserInfoStored, StoredRerunFunction,
    TransactionsStoredRedux, MoreTransactionsStoredRedux, SelectedCardDetails, TOGGLELOADER, UserCredidentials,
    CurrentTransaStoredRedux, IsTableLoadingStore, IsBulkTransfer, ProcessingBulkTransferInfo, IsServiceStation,
    ServiceStationUserInfoRedux, CurrentServiceStationId
});

export default rootReducer;