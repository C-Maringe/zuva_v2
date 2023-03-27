const SET_SELECTED_CARD_DETAILS = 'SET_SELECTED_CARD_DETAILS'

export function SelectedCardDetailsDispatch(company) {
    return {
        type: SET_SELECTED_CARD_DETAILS,
        company,
    }
}

const SelectedRoCardInfo = JSON.parse((sessionStorage.getItem('SelectedRoCardInfo')))

const defaultcompanystatus = [{ status: SelectedRoCardInfo !== null || undefined ? SelectedRoCardInfo : { id: null, first_name: '', last_name: '' } }]

function SelectedCardDetails(state = defaultcompanystatus, action) {
    switch (action.type) {
        case SET_SELECTED_CARD_DETAILS:
            return [{ status: action.payload }]
        default:
            return state;
    }
}

export default SelectedCardDetails;
