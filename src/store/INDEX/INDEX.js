import { combineReducers } from 'redux';
import IsCompanyLoggedIn from '../auth.js/IsCompany';
import IsLoggedIn from '../auth.js/Islogged';
import CardInfoRedux from '../cardInfo/Cardinfo';
import UserToken from '../auth.js/Token';
import CardID from '../cardInfo/CardID';
import CompanyID from '../auth.js/CompanyID';
import UserInfoStored from '../auth.js/UserInfoStored';
import TransactionsStoredRedux from '../auth.js/TransactionsStored';
import MoreTransactionsStoredRedux from '../auth.js/MoreDetailsUser';
import SelectedCardDetails from '../auth.js/SelectedCardDetails';
import TOGGLELOADER from "../auth.js/OpenLoader";
const COMPANY_STATUS = 'COMPANY_STATUS'
const CHANGE_COMPANY = 'CHANGE_COMPANY'

export function companystatus(company) {
    return {
        type: COMPANY_STATUS,
        company,
    }
}

export function changecompany(company) {
    return {
        type: CHANGE_COMPANY,
        company
    }
}

const defaultcompanystatus = [{ status: true }]

function company(state = defaultcompanystatus, action) {
    switch (action.type) {
        case COMPANY_STATUS:
            return [{ status: true }]
        case CHANGE_COMPANY:
            return [{ status: false }];
        default:
            return state;
    }
}

const CombinedReducers = combineReducers({
    company, IsLoggedIn, CardInfoRedux, UserToken, CompanyID, CardID, IsCompanyLoggedIn,TOGGLELOADER,
    UserInfoStored, TransactionsStoredRedux, MoreTransactionsStoredRedux, SelectedCardDetails
});

export default CombinedReducers; 