const SERVICE_STATION_ID = 'SERVICE_STATION_ID'

export function CurrentTransaStored(company) {
    return {
        type: SERVICE_STATION_ID,
        company,
    }
}
let CurrentServiceStationIdStored = ''

try {
    CurrentServiceStationIdStored = JSON.parse(sessionStorage.getItem('CurrentServiceStationIdStored'))
} catch (error) {
    console.log(error)
}

const ServiceStationIdStored = [{ status: CurrentServiceStationIdStored }]

function CurrentServiceStationId(state = ServiceStationIdStored, action) {
    switch (action.type) {
        case SERVICE_STATION_ID:
            return [{ status: action.payload }]
        default:
            return state;
    }
}

export default CurrentServiceStationId;
