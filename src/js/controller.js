import '../scss/style.scss'
import * as model from './model'
import view from './view'
import { DAYS_AGO_MONTH, DIRECTION_LEFT} from './conifg'

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
        model.state.companies.forEach(company => {
            view.renderCompany(company)
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

async function controlSelect(symbol, index) {
    try {
        model.updateSelectedIndex(index)
        view.renderSelectedCard(index)
        await Promise.all([model.fetchCompanyOverview(symbol), model.fetchStockPrices(symbol), model.fetchCompanyIncomeStatement(symbol)])
        view.renderCompanySelected(model.state.selectedCompany, model.state.companyStats)
        view.addArrowsHandler(controlSelectArrows)
        view.renderGraph(model.state.compressedStockPrices, model.state.graphTimestamps)
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

async function controlGraphOptions(daysSpan, buttonID) {
    try {
        view.desactivateGraphOptions(buttonID)
        view.removeCurrentGraph()
        model.setDates(daysSpan)
        await model.fetchStockPrices()
        view.renderGraph(model.state.compressedStockPrices, model.state.graphTimestamps)
    } catch(error) {
        view.renderGraphError('The data failed to arrive. Please try again later.')
    }
    
}

async function controlSelectArrows(direction) {
    if (direction === DIRECTION_LEFT) {
        model.updateSelectedIndex(model.state.selectedIndex - 1)
    } else {
        model.updateSelectedIndex(model.state.selectedIndex + 1)
    }

    const newSymbol = model.getSelectedSymbol()
    await controlSelect(newSymbol, model.state.selectedIndex)
}




init()



