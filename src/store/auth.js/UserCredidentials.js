const USER_CREDIDENTIALS = 'USER_CREDIDENTIALS'

export function UserCredidentialsStore(company) {
    return {
        type: USER_CREDIDENTIALS,
        company,
    }
}

const UserCredidentialsLocally = JSON.parse(sessionStorage.getItem('UserCredidentialsLocally'))

const defaultUser = [{ status: UserCredidentialsLocally===null ? {email: '', password: ''}: UserCredidentialsLocally}]

function UserCredidentials(state = defaultUser, action) {
    switch (action.type) {
        case USER_CREDIDENTIALS:
            return [{ status: action.payload }]
        default:
            return state;
    }
}

export default UserCredidentials;
