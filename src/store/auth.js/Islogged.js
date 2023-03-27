import { useSelector } from "react-redux";

const USER_LOGGED_IN = 'USER_LOGGED_IN'
const USER_LOGGED_OUT = 'USER_LOGGED_OUT'

export function isloggedin(company) { return { type: USER_LOGGED_IN, company, } }

export function isloggedout(company) {
    return { type: USER_LOGGED_OUT, company }
}

const storedIsLoggedIn = JSON.parse(sessionStorage.getItem('checkifflogged'))

const defaultstoredIsLoggedIn = [{ status: (storedIsLoggedIn === true ? true : false) }]

function IsLoggedIn(state = defaultstoredIsLoggedIn, action) {
    switch (action.type) {
        case USER_LOGGED_IN:
            return [{ status: true }]
        case USER_LOGGED_OUT:
            sessionStorage.removeItem('CurrentTransaStoredIn')
            return [{ status: false }];
        default:
            return state;
    }
}

export default IsLoggedIn;