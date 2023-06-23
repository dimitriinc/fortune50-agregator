import * as helpers from './helpers'

export const state = {
    companies: [],
    selectedCompany: {},
}

export const fetchCompaniesRating = async function(exchange) {
    try {
        const url = helpers.getFinModelPrepScreenerUrl(exchange)
        const data = await helpers.AJAX(url)
        state.companies = data
    } catch (error) {
        throw error
    }
}