const SET_COMPANY_ID = 'SET_COMPANY_ID'

export function companyID(company) {
    return {
        type: SET_COMPANY_ID,
        company,
    }
}

const CompanyStoredID = JSON.parse(sessionStorage.getItem('CompanyStoredID'))

const defaultcompanystatus = [{ status: [CompanyStoredID] }]

function CompanyID(state = defaultcompanystatus, action) {
    switch (action.type) {
        case SET_COMPANY_ID:
            return [{ status: action.payload }]
        default:
            return state;
    }
}

export default CompanyID;
