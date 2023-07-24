import '../scss/style.scss'
import * as model from './model'
import view from './view'
import { DAYS_AGO_MONTH, DIRECTION_LEFT} from './conifg'

const abortControllers = {
    ratingsAbortController: new AbortController(),
    graphAbortController: new AbortController(),
    infoAbortController: new AbortController(),
    statsAbortController: new AbortController(),
}

async function init() {

    try {
        model.actualizeStateOnInit()

        view.renderOverlay()
        view.renderHeader()
        view.renderMain()
        view.renderFooter()

        // if (model.state.modeSelected) {
        //     view.enterSelectedMode()
        //     await controlSelect(model.state.selectedCompany.symbol, model.state.selectedIndex, model.state.selectedCompany.name)
        // }

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
        
        await model.fetchCompaniesRating(stockExchange, abortControllers.ratingsAbortController)

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
        // model.persistSelectedMode(false)
    }
}

function controlExchangeButtons(mic) {
    window.location.hash = mic
}

async function controlSelect(symbol, index, name, direction = undefined) {

    renewAbortControllers()

    try {
        model.updateSelectedIndex(index)
        model.setCompanySymbol(symbol)
        model.setCompanyName(name)
        model.setDates(DAYS_AGO_MONTH)

        await view.renderSelectedCard(index, name, direction)
        view.addArrowsHandler(controlSelectArrows)

        const [infoPromise, graphPromise, statsPromise] = await Promise.allSettled([
            model.fetchTickerDetails(symbol, abortControllers.infoAbortController), 
            model.fetchStockPrices(symbol, abortControllers.graphAbortController), 
            model.fetchCompanyIncomeStatement(symbol, abortControllers.statsAbortController)
        ])

        if (graphPromise.status === 'fulfilled') view.renderGraphView(model.state.compressedStockPrices, model.state.graphTimestamps)
        else view.renderGraphError(graphPromise.reason.message)

        if (infoPromise.status === 'fulfilled') view.renderInfoView(model.state.selectedCompany)
        else view.renderInfoError(infoPromise.reason.message)

        if (statsPromise.status === 'fulfilled') view.renderStatsView(model.state.statistics)
        else view.renderStatsError(statsPromise.reason.message)

        view.activateSelectedOptionsButtons()

        // model.persistSelectedMode(true)
    } catch (error) {
        view.renderSelectError(error.message)
        // console.error(error)
        // model.persistSelectedMode(false)
    }
}

function controlDeselect() {
    view.exitSelectedMode()
    // model.persistSelectedMode(false)
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
        await model.fetchStockPrices(model.state.selectedCompany.symbol, abortControllers.graphAbortController)
        view.renderGraphView(model.state.compressedStockPrices, model.state.graphTimestamps)
    } catch(error) {
        view.renderGraphError(error.message)
    }
    
}

async function controlSelectArrows(direction) {
    abortSelectedApiCalls()

    if (direction === DIRECTION_LEFT) {
        model.updateSelectedIndex(model.state.selectedIndex - 1)
    } else {
        model.updateSelectedIndex(model.state.selectedIndex + 1)
    }

    const newSymbol = model.getSelectedSymbol()
    const newName = model.getSelectedName()

    await controlSelect(newSymbol, model.state.selectedIndex, newName, direction)
}

function abortSelectedApiCalls() {
    abortControllers.graphAbortController.abort()
    abortControllers.infoAbortController.abort()
    abortControllers.statsAbortController.abort()
}

function renewAbortControllers() {
    abortControllers.ratingsAbortController = new AbortController()
    abortControllers.graphAbortController = new AbortController()
    abortControllers.infoAbortController = new AbortController()
    abortControllers.statsAbortController = new AbortController()
}




init()



