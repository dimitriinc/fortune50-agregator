import '../scss/style.scss'
import * as model from './model'
import view from './view'
import { stockExchanges } from './conifg'
import { DAYS_AGO_MONTH, DAYS_AGO_QUARTER, DAYS_AGO_YEAR} from './conifg'

async function init() {

    try {
        model.actualizeStateOnInit()
        model.setDates(DAYS_AGO_MONTH)    

        view.renderOverlay()
        view.renderHeader()
        view.renderMain()
        view.renderFooter()

        console.log(model.state.modeSelected);

        if (model.state.modeSelected) await controlSelect(model.state.selectedCompany.Symbol)

        view.addHashHandler(controlHashChange)

        // await onHashChange()

        view.addExchangeHandler(controlExchangeButtons)
        view.addSelectHandler(controlSelect, controlDeselect)
        view.addDeselectHandler(controlDeselect)
        
        window.location.hash = model.state.selectedExchange

        await controlHashChange()

        // model.fetchStockPrices("GOOG")
    } catch (error) {
        console.error(error)
        view.renderError(error.message)
    }

    
}

async function controlHashChange() {
    try {

        view.renderSpinner()
        const stockExchange = window.location.hash.slice(1)
        await model.fetchCompaniesRating(stockExchange)

        view.highlightExchange(stockExchange)
        model.state.companies.forEach((company, index) => {
            view.renderCompany(company, index)
        })

        view.showGrid()
        view.hideSpinner()

    } catch (error) {
        console.error(error)
        view.renderError(error.message)
    }
}

function controlExchangeButtons(mic) {
    window.location.hash = mic
}

async function controlSelect(symbol) {
    try {
        console.log(`SYMBOL received:: ${symbol}`)
        view.renderSelectedCard()
        await model.fetchCompanyOverview(symbol)
        view.renderCompanySelected(model.state.selectedCompany)
        model.persistSelectedMode(true)
        console.log(model.state.selectedCompany)
    } catch (error) {
        view.renderError(error.message)
    }
}

function controlDeselect() {
    console.log('We are inside the control deselect!!!');
    view.exitSelectedMode()
    model.persistSelectedMode(false)
    console.log('We are inside the control deselect!!!');
}




init()



