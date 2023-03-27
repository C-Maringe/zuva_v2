const USER_TOKEN = 'USER_TOKEN'

export function setTokenn(company) {
    return {
        type: USER_TOKEN,
        company,
    }
}

const userStoredToken = JSON.parse(sessionStorage.getItem('userStoredToken'))

const defaultcompanystatus = [{ status: [userStoredToken] }]

function UserToken(state = defaultcompanystatus, action) {
    switch (action.type) {
        case USER_TOKEN:
            return [{ status: action.payload }]
        default:
            return state;
    }
}

export default UserToken;
