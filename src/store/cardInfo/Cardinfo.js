const SET_CARD_INFO = 'SET_CARD_INFO'
const DISPATCH_CARD_INFO = 'DISPATCH_CARD_INFO'

export function CardInfoReduxset(company) {
    return {
        type: SET_CARD_INFO,
        company,
    }
}

export function CardInfoReduxdis(company) {
    return {
        type: DISPATCH_CARD_INFO,
        company
    }
}

// const storedCardInfoRedux = sessionStorage.getItem('storedCardInfoRedux')

const defaultcompanystatus = [{ status: [{ "data": "data" }] }]

function CardInfoRedux(state = defaultcompanystatus, action) {
    switch (action.type) {
        case SET_CARD_INFO:
            // console.log(state)
            return [{ status: action.payload }]
        case DISPATCH_CARD_INFO:
            return [{ status: [] }];
        default:
            return state;
    }
}

export default CardInfoRedux;