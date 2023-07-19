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
            await controlSelect(model.state.selectedCompany.symbol, model.state.selectedIndex, model.state.selectedCompany.name)
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

async function controlSelect(symbol, index, name) {
    try {
        model.updateSelectedIndex(index)
        view.renderSelectedCard(index, name)
        view.addArrowsHandler(controlSelectArrows)
        const [infoPromise, graphPromise, statsPromise] = await Promise.allSettled([model.fetchCompanyOverview(symbol), model.fetchStockPrices(symbol), model.fetchCompanyIncomeStatement(symbol)])

        if (graphPromise.status === 'fulfilled') view.renderGraphView(model.state.compressedStockPrices, model.state.graphTimestamps)
        else view.renderGraphError(graphPromise.reason.message)

        if (infoPromise.status === 'fulfilled') view.renderInfoView(model.state.selectedCompany)
        else view.renderInfoError(infoPromise.reason.message)

        if (statsPromise.status === 'fulfilled') view.renderStatsView(model.state.companyStats)
        else view.renderStatsError(statsPromise.reason.message)

        view.activateSelectedOptionsButtons()

        // view.renderCompanySelected(model.state.selectedCompany, model.state.companyStats)
        // view.renderGraph(model.state.compressedStockPrices, model.state.graphTimestamps)
        // model.persistSelectedMode(true)
    } catch (error) {
        view.renderSelectError(error.message)
        console.error(error)
        model.persistSelectedMode(false)
    }
}

function controlDeselect() {
    view.exitSelectedMode()
    model.persistSelectedMode(false)
}

function controlSelectOptions(viewID, buttonID) {
    view.resetSelectOptionsStyles(buttonID)
    view.displaySelectedOptionView(viewID)
}

async function controlGraphOptions(daysSpan, buttonID) {
    try {
        view.resetGraphBtnStyles(buttonID)
        view.removeCurrentGraph()
        model.setDates(daysSpan)
        await model.fetchStockPrices()
        view.renderGraphView(model.state.compressedStockPrices, model.state.graphTimestamps)
    } catch(error) {
        view.renderGraphError('The limit of API calls per minute (5) is expired. Wait a bit to request the stock prices again.')
    }
    
}

async function controlSelectArrows(direction) {
    if (direction === DIRECTION_LEFT) {
        model.updateSelectedIndex(model.state.selectedIndex - 1)
    } else {
        model.updateSelectedIndex(model.state.selectedIndex + 1)
    }

    const newSymbol = model.getSelectedSymbol()
    const newName = model.getSelectedName()
    await controlSelect(newSymbol, model.state.selectedIndex, newName)
}




init()



