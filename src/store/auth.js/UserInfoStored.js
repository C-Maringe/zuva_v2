const SET_USER_INFO_DATA = 'SET_USER_INFO_DATA'

export function UserInfoDispatch(company) {
    return {
        type: SET_USER_INFO_DATA,
        company,
    }
}

const UserInfoStoredLocally = JSON.parse(sessionStorage.getItem('UserInfoStoredLocally'))

const defaultcompanystatus = [{ status: UserInfoStoredLocally===null ? {
        administrator:"",cards:"",status:"",company:"",description:"",token:"",vehicles:[],customer:{cards:[]}
    }: UserInfoStoredLocally}]

function UserInfoStored(state = defaultcompanystatus, action) {
    switch (action.type) {
        case SET_USER_INFO_DATA:
            return [{ status: action.payload }]
        default:
            return state;
    }
}

export default UserInfoStored;
