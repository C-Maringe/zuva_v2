const IS_COMPANY_LOGGED = 'IS_COMPANY_LOGGED'
const IS_COMPANY_LOGOUT = 'IS_COMPANY_LOGOUT'

export function IsCompanyLogedIn(company) { return { type: IS_COMPANY_LOGGED, company, } }

export function IsCompanyLogedOut(company) { return { type: IS_COMPANY_LOGOUT, company } }

const storedIsCompanyLoggedIn = JSON.parse(sessionStorage.getItem('storedIsCompanyLoggedIn'))

const defaultstoredIsCompanyLoggedIn = [{ status: (storedIsCompanyLoggedIn === true ? true : false) }]

function IsCompanyLoggedIn(state = defaultstoredIsCompanyLoggedIn, action) {
    switch (action.type) {
        case IS_COMPANY_LOGGED:
            return [{ status: true }]
        case IS_COMPANY_LOGOUT:
            return [{ status: false }];
        default:
            return state;
    }
}

export default IsCompanyLoggedIn;