const SET_CARD_ID = 'SET_CARD_ID'

export function setCardsIds(company) {
    return {
        type: SET_CARD_ID,
        company,
    }
}

const CardInStoredID = JSON.parse(sessionStorage.getItem('CardInStoredID') !== undefined || null ? sessionStorage.getItem('CardInStoredID'):"")

const defaultcompanystatus = [{ status: CardInStoredID === undefined || null ? [] : [CardInStoredID] }]

function CardID(state = defaultcompanystatus, action) {
    switch (action.type) {
        case SET_CARD_ID:
            return [{ status: action.payload }]
        default:
            return state;
    }
}

export default CardID;
