import '../scss/style.scss'
import * as model from './model'
import view from './view'
import { stockExchanges } from './conifg'
import { DAYS_AGO_MONTH, DAYS_AGO_QUARTER, DAYS_AGO_YEAR, SHOW_EMAIL, SHOW_SIGNATURE } from './conifg'

async function init() {

    view.renderHeader()
    view.renderEmptyGrid()
    view.renderFooter()
    // view.showCorporates(SHOW_SIGNATURE)

    model.setTimestamps(DAYS_AGO_MONTH)
    
    await model.fetchCompaniesRating(stockExchanges.nasdaq)
    model.state.companies.forEach((company, index) => {
        view.renderCompany(company, index)
    })
    model.fetchStockPrices("GOOG")
}




init()



