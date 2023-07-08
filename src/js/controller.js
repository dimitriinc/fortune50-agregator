import '../scss/style.scss'
import * as model from './model'
import view from './view'
import { DAYS_AGO_MONTH, DAYS_AGO_QUARTER, DAYS_AGO_YEAR} from './conifg'

async function init() {

    try {
        model.actualizeStateOnInit()
        model.setDates(DAYS_AGO_MONTH)    

        view.renderOverlay()
        view.renderHeader()
        view.renderMain()
        view.renderFooter()

        if (model.state.modeSelected) {
            view.enterSelectedMode()
            await controlSelect(model.state.selectedCompany.Symbol)
        }

        view.addHashHandler(controlHashChange)
        view.addExchangeHandler(controlExchangeButtons)
        view.addSelectHandler(controlSelect, controlDeselect)
        view.addDeselectHandler(controlDeselect)
        view.addSelectedOptionsHandler(controlSelectOptions)
        view.addGraphOptionsHandler(controlGraphOptions)
        
        window.location.hash = model.state.selectedExchange

        await controlHashChange()

    } catch (error) {
        console.error(error)
        view.renderError(error.message)
    }

    
}

async function controlHashChange() {

    const stockExchange = window.location.hash.slice(1)
    if (!stockExchange) return

    try {

        view.renderSpinner()
        

        await model.fetchCompaniesRating(stockExchange)

        model.persistSelectedExchange(stockExchange)

        view.highlightExchange(stockExchange)
        model.state.companies.forEach((company, index) => {
            view.renderCompany(company, index)
        })

        view.showGrid()
        view.hideSpinner()

    } catch (error) {
        view.renderError(error.message)
        history.replaceState({}, document.title, window.location.href.split('#')[0])
        model.persistSelectedMode(false)
    }
}

function controlExchangeButtons(mic) {
    window.location.hash = mic
}

async function controlSelect(symbol) {
    try {
        view.renderSelectedCard()
        await Promise.all([model.fetchCompanyOverview(symbol), model.fetchStockPrices(symbol)])
        view.renderCompanySelected(model.state.selectedCompany)
        model.persistSelectedMode(true)
    } catch (error) {
        view.renderSelectError(error.message)
        model.persistSelectedMode(false)
    }
}

function controlDeselect() {
    view.exitSelectedMode()
    model.persistSelectedMode(false)
}

function controlSelectOptions(viewID, buttonID) {
    view.desactivateSelectOptions(buttonID)
    view.displaySelectedOptionView(viewID)
}

function controlGraphOptions(daysSpan, buttonID) {
    view.desactivateGraphOptions(buttonID)
}




init()



