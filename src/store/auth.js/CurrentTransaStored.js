const CURRENT_TRANSA_STORED = 'CURRENT_TRANSA_STORED'

export function CurrentTransaStored(company) {
    return {
        type: CURRENT_TRANSA_STORED,
        company,
    }
}

const CurrentTransaStoredIn = JSON.parse(sessionStorage.getItem('CurrentTransaStoredIn'))

const defaultcompanystatus = [{ status: CurrentTransaStoredIn }]

function CurrentTransaStoredRedux(state = defaultcompanystatus, action) {
    switch (action.type) {
        case CURRENT_TRANSA_STORED:
            return [{ status: action.payload }]
        default:
            return state;
    }
}

export default CurrentTransaStoredRedux;
