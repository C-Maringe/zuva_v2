const TRANSACTIONS_STORED = 'TRANSACTIONS_STORED'

export function TransactionsStored(company) {
    return {
        type: TRANSACTIONS_STORED,
        company,
    }
}

const TransactionsStoredReduxLocally = JSON.parse(sessionStorage.getItem('TransactionsStoredIn'))

const defaultcompanystatus = [{ status: TransactionsStoredReduxLocally }]

function TransactionsStoredRedux(state = defaultcompanystatus, action) {
    switch (action.type) {
        case TRANSACTIONS_STORED:
            return [{ status: action.payload }]
        default:
            return state;
    }
}

export default TransactionsStoredRedux;
