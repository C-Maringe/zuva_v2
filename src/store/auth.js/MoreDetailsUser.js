const MORE_TRANSACTIONS_STORED = 'MORE_TRANSACTIONS_STORED'

export function More_TransactionsStored(company) {
    return {
        type: MORE_TRANSACTIONS_STORED,
        company,
    }
}

const MoreTransactionsStoredReduxLocally = JSON.parse(sessionStorage.getItem('MoreTransactionsStoredIn'))

const defaultcompanystatus = [{ status: MoreTransactionsStoredReduxLocally===null ? {
        administrator:"",cards:"",status:"",company:"",description:"",token:"",vehicles:[],customer:{cards:[]},
        model:{other_accounts:[]},pageable:{total_elements:0}
    }: MoreTransactionsStoredReduxLocally}]

function MoreTransactionsStoredRedux(state = defaultcompanystatus, action) {
    switch (action.type) {
        case MORE_TRANSACTIONS_STORED:
            return [{ status: action.payload }]
        default:
            return state;
    }
}

export default MoreTransactionsStoredRedux;
