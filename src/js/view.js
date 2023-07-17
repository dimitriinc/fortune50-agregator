import spinner from '../images/spinner.svg'
import { stockExchanges, VISIBLE, HIDDEN, DIRECTION_LEFT, DIRECTION_RIGHT } from './conifg'
import numeral from 'numeral'
import Chart from 'chart.js/auto'


class View {

    _gridContainer
    _spinner
    _mySingature
    _myEmail
    _nyseBtn
    _nasdaqBtn
    _overlay
    _overlayDouble
    _blankSelectedCard
    _selectedDisplay

    renderOverlay() {
        const html = `
            <div class="overlay" data-visibility="${HIDDEN}">
                <div class="overlay--double hidden"></div>
            <div>
        `
        document.body.insertAdjacentHTML('afterbegin', html)
        this._overlay = document.querySelector('.overlay')
        this._overlayDouble = document.querySelector('.overlay--double')

    }

    renderHeader() {
        const html = `
            <header>
                <div class='header--title'>
                    Fortune 50
                </div>

                <nav>
                    <div id="nyse-btn" class="btn-exchange" data-mic="nyse">NYSE</div>
                    <div id="nasdaq-btn" class="btn-exchange" data-mic="nasdaq">NASDAQ</div>
                </nav>
            </header>
        `
        document.body.insertAdjacentHTML('afterbegin', html)
        this._nyseBtn = document.getElementById('nyse-btn')
        this._nasdaqBtn = document.getElementById('nasdaq-btn')
    }

    renderMain() {
        const html = `
            <main>
                <img id="grid-spinner" src="${spinner}">
                <div class="grid-container" style="opacity:0"></div>
            </main>
        `
        document.body.insertAdjacentHTML('beforeend', html)
        this._gridContainer = document.querySelector('.grid-container')
        this._spinner = document.getElementById('grid-spinner')
    }

    renderFooter() {
        const html = `
            <footer>
                <div class="corporate-container">
                    <p id="dimi_signature" class="emerged">powered by DimitriInc.</p>
                    <p id="dimi_email" class="submerged">dimitriinc@proton.me</p>
                </div>
            </footer>
        `
        document.body.insertAdjacentHTML('beforeend', html)
        this._mySingature = document.getElementById('dimi_signature')
        this._myEmail = document.getElementById('dimi_email')

        this._mySingature.addEventListener('click', () => {this._switchCorporates()})
        this._myEmail.addEventListener('click', () => {this._switchCorporates()})
    }

    renderCompany(company) {
        const marketCap = this._formatMarketCap(company.marketCap)
        const html = `
            <div class="grid-item">
                <div class="grid-item--rating">
                    <span class="grid-item--rating--content">${company.index + 1}</span>
                </div>
                <div class="grid-item--card" data-symbol="${company.symbol}" data-name="${company.name}" data-index="${company.index}">
                    <div class="grid-item--card--name">
                        <div class="grid-item--card--name--company-name">${company.name}</div>
                        <div class="grid-item--card--name--symbol">${company.symbol}</div>
                    </div>
                    <div class="grid-item--card--marketcap">${marketCap}</div>
                </div>
            </div> 
        `
        this._gridContainer.insertAdjacentHTML('beforeend', html)
    }

    renderSelectedCard(index, companyName) {

        if (+this._overlay.dataset.visibility === VISIBLE) this._overlayDouble.innerHTML = ''

        const html = `
            <div class="selected-container">
                <div class="selected-container--overlay">

                    <div class="selected--head">
                        ${companyName}
                    </div>

                    <div class="selected--options">
                        <div class="selected--options-option active" id="options-graph" data-view-id="display-view--graph" style="pointer-events: none">Graph</div>
                        <div class="selected--options-option" id="options-info" data-view-id="display-view--info" style="pointer-events: none">Info</div>
                        <div class="selected--options-option" id="options-stats" data-view-id="display-view--stats" style="pointer-events: none">Stats</div>
                    </div>
           
                    <div class="selected--display">




                        <div class="selected--display-view visible" id="display-view--graph">
                            <div class="canvas">
                                <img class="graph--spinner" src="${spinner}">
                            </div>
                            <div class="view--graph-buttons">
                                <div class="view--graph-buttons--button active" id="graph-button--month" data-days-span="30" style="pointer-events: none">Month</div>
                                <div class="view--graph-buttons--button" id="graph-button--quarter" data-days-span="90" style="pointer-events: none">Quarter</div>
                                <div class="view--graph-buttons--button" id="graph-button--year" data-days-span="365" style="pointer-events: none">Year</div>
                            </div>
                        </div>

                        <div class="selected--display-view hidden" id="display-view--info"></div>

                        <div class="selected--display-view hidden" id="display-view--stats"></div>





                    </div>

                </div>
            </div>
            <div class="selected-arrow ${index === 49 ? 'hidden' : 'visible'}" id="arrow-right"><span class="arrow-content">></span></div>
            <div class="selected-arrow ${index === 0 ? 'hidden' : 'visible'}" id="arrow-left"><span class="arrow-content"><</span></div>
        `
        this._overlayDouble.insertAdjacentHTML('afterbegin', html)
        this._blankSelectedCard = document.querySelector('.selected-container')
        this._selectedDisplay = document.querySelector('.selected--display')
    }

    renderGraphView(prices, timestamps) {
        const canvas = document.createElement('canvas')
        canvas.id = 'graph'
        document.querySelector('.canvas').appendChild(canvas)
        document.querySelector('.graph--spinner').classList.add('hidden')

        new Chart(canvas, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [
                    {
                        label: '',
                        data: prices,
                        fill: true,
                        borderColor: "rgb(242, 139, 130)",
                        tension: 0.1,
                        backgroundColor: function(context) {
                            const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, context.chart.height)
                            gradient.addColorStop(0, 'rgba(242, 139, 130, 1)')
                            gradient.addColorStop(.75, 'rgba(242, 139, 130, 0)')
                            return gradient
                        }
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: false,
                            text: "Time"
                        },
                        ticks: {
                            autoSkip: false,
                            maxRotation: 180,
                            callback: function(value, index, values) {
                                if (index === 0 || index === values.length - 1) {
                                    return timestamps[value]
                                } else {
                                    return ''
                                }
                            }
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: "Stock Price"
                        },
                        ticks: {
                            autoSkip: false,
                            maxRotation: 0,
                            callback: function(value, index, values) {
                                if (index === 0 || index === values.length - 1) {
                                    return `$${value}`
                                } else {
                                    return ''
                                }
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                        callbacks: {
                          label: function (context) {
                            return context.dataset.data[context.dataIndex].toString()
                          },
                          title: function () {
                            return null
                          }
                        }
                    }
                }
            }
        })

        // Activate the graph options and selected options
        document.querySelectorAll('.view--graph-buttons--button').forEach(btn => btn.removeAttribute('style'))
        this._blankSelectedCard.querySelectorAll('.selected--options-option').forEach(btn => btn.removeAttribute('style'))
    }

    renderInfoView(company) {
        const html = `
            <div class="view--info-about">
                ${company.description}
            </div>
            <div class="view--info-container">
                <div class="view--info-item">
                    <p class="data-label">Sector</p>
                    <p class="data-content">${this._capitalizeString(company.sector)}</p>
                </div>
                <div class="view--info-item">
                    <p class="data-label">Address</p>
                    <p class="data-content">${this._capitalizeWords(company.address)}</p>
                </div>
                <div class="view--info-item">
                    <p class="data-label">Market capitalization</p>
                    <p class="data-content">${numeral(company.marketCap).format('$0,0')}
                </div>
            </div>
        `
        document.getElementById('display-view--info').insertAdjacentHTML('afterbegin', html)
    }

    renderStatsView(stats) {
        const html = `
            <div class="stats-grid">
                <div class="stat-item--container">
                    <div class="stat-item">
                        <p class="data-label">Total revenue</p>
                        <p class="data-content">${numeral(stats.totalRevenue).format('$0,0')}</p>
                    </div>
                </div>
                <div class="stat-item--container">
                    <div class="stat-item">
                        <p class="data-label">Gross profit</p>
                        <p class="data-content">${numeral(stats.grossProfit).format('$0,0')}</p>
                    </div>
                </div>
                <div class="stat-item--container">
                    <div class="stat-item">
                        <p class="data-label">Depreciation</p>
                        <p class="data-content">${numeral(stats.depreciation).format('$0,0')}</p>
                    </div>
                </div>
                <div class="stat-item--container">
                    <div class="stat-item">
                        <p class="data-label">Interest Income</p>
                        <p class="data-content">${numeral(stats.interestIncome).format('$0,0')}</p>
                    </div>
                </div>
            </div>
        `
        document.getElementById('display-view--stats').insertAdjacentHTML('afterbegin', html)
    }

    renderSpinner() {
        if (document.querySelector('.error-message')) document.querySelector('.error-message').remove()
        
        this.emptyGridContainer()
        this._spinner.setAttribute('style', 'opacity: 1')
    }


    renderError(message) {
        this.hideSpinner()
        this.emptyGridContainer()

        // Ensure there are no duplicate errors
        document.querySelectorAll('.error-message').forEach(el => el.remove())

        const html = `
            <div class="error-message" style="opacity:0">
                ${message}
            </div>
        `
        document.querySelector('main').insertAdjacentHTML('afterbegin', html)
        document.querySelector('.error-message').setAttribute('style', 'opacity:1')
        this.exitSelectedMode()
    }

    renderSelectError(message) {
        this._blankSelectedCard.innerHTML = ''
        const html = `
            <div class="error-message" style="opacity:0">
                ${message}
            </div>
        `
        this._blankSelectedCard.insertAdjacentHTML('afterbegin', html)
        document.querySelector('.error-message').setAttribute('style', 'opacity:1')
        
    }

    renderGraphError(message) {
        try {
            document.getElementById('graph').remove()
        } catch(err) {

        } finally {

            // Hide spinner
            document.querySelector('.graph--spinner').classList.remove('visible')
            document.querySelector('.graph--spinner').classList.add('hidden')

            // Actvate graph options
            document.querySelectorAll('.view--graph-buttons--button').forEach(btn => btn.removeAttribute('style'))

            const error = document.createElement('div')
            error.id = 'graph--error'
            error.innerHTML = message
            error.classList.add('hidden')
            document.querySelector('.canvas').appendChild(error)
            error.classList.remove('hidden')
        }
    }

    renderInfoError(message) {
        const html = `
            <div id="info-error">
                ${message}
            </div>
        `
        document.getElementById('display-view--info').insertAdjacentHTML('afterbegin', html)
    }

    renderStatsError(message) {
        const html = `
            <div id="stats-error">
                ${message}
            </div>
        `
        document.getElementById('display-view--stats').insertAdjacentHTML('afterbegin', html)
    }

    showGrid() {
        if (document.querySelector('.error-message')) document.querySelector('.error-message').remove()
        this._gridContainer.setAttribute('style', 'opacity:1')
    }

    emptyGridContainer() {
        this._gridContainer.innerHTML = ''
        this._gridContainer.setAttribute('style', 'opacity:0')
    }

    hideSpinner() {
        this._spinner.setAttribute('style', 'opacity: 0')
    }

    highlightExchange(exchange) {
        if (exchange === stockExchanges.newYorkStockExchange) {
            this._nyseBtn.classList.add('active')
            this._nasdaqBtn.classList.remove('active')
        } else {
            this._nyseBtn.classList.remove('active')
            this._nasdaqBtn.classList.add('active')
        }
    }

    addHashHandler(handler) {
        window.addEventListener('hashchange', handler)
    }

    addExchangeHandler(handler) {
        document.querySelectorAll('.btn-exchange').forEach(btn => {
            btn.addEventListener('click', () => {

                // reset the highlightning of the buttons
                [this._nyseBtn, this._nasdaqBtn].forEach(el => {
                    el.classList.remove('active')
                })

                handler(btn.dataset.mic)
            })
        })
    }

    addSelectHandler(handler, deselectHandler) {
        document.body.addEventListener('click', event => {
            const card = event.target.closest('.grid-item--card')
            if (!card) return

            this.enterSelectedMode()
            
            handler(card.dataset.symbol, +card.dataset.index, card.dataset.name)
        })

        this._overlayDouble.addEventListener('click', event => {
            if (!event.target.classList.contains('overlay--double')) return
            deselectHandler()
        })
    }

    addDeselectHandler(handler) {
        document.addEventListener('keydown', event => {
            if (event.key !== 'Escape') return
            handler(event)
        })
    }

    addSelectedOptionsHandler(handler) {
        document.addEventListener('click', event => {
            const button = event.target.closest('.selected--options-option')
            if (!button) return
            handler(button.dataset.viewId, button.id)
        }) 
    }

    addGraphOptionsHandler(handler) {
        document.addEventListener('click', event => {
            const button = event.target.closest('.view--graph-buttons--button')
            if (!button) return
            handler(button.dataset.daysSpan, button.id)
        })
    }

    addArrowsHandler(handler) {
        
        document.getElementById('arrow-right').addEventListener('click', () => {
            handler(DIRECTION_RIGHT)
        })
        document.getElementById('arrow-left').addEventListener('click', () => {
            handler(DIRECTION_LEFT)
        })
    }

    enterSelectedMode() {
        this._overlay.classList.add('visible')
        this._overlayDouble.classList.remove('hidden')
        this._overlay.dataset.visibility = VISIBLE
        document.body.setAttribute('style', 'overflow:hidden')
    }

    exitSelectedMode() {
        if (+this._overlay.dataset.visibility === HIDDEN) return

        this._overlay.dataset.visibility = HIDDEN
        this._overlay.classList.remove('visible')
        this._overlayDouble.classList.add('hidden')
        this._overlayDouble.innerHTML = ''
        // this._overlay.firstElementChild.remove()

        document.body.removeAttribute('style')
    }

    resetSelectOptionsStyles(optionID) {
        document.querySelectorAll('.selected--options-option').forEach(button => {
            button.classList.remove('active')
            if (button.id === optionID) button.classList.add('active')
        })
    }

    displaySelectedOptionView(viewID) {
        document.querySelectorAll('.selected--display-view').forEach(view => {
            view.classList.remove('visible')
            view.classList.add('hidden')
            if (view.id === viewID) {
                view.classList.remove('hidden')
                view.classList.add('visible')
            }

        })
    }

    resetGraphBtnStyles(optionID) {
        document.querySelectorAll('.view--graph-buttons--button').forEach(button => {
            button.classList.remove('active')
            if (button.id === optionID) button.classList.add('active')
        })
    }

    removeCurrentGraph() {

        try {

            // empty the canvas div, except for the spinner
            const spinner = document.querySelector('.graph--spinner').cloneNode()
            document.querySelector('.canvas').innerHTML = ''
            document.querySelector('.canvas').appendChild(spinner)

            // display spinner
            spinner.classList.remove('hidden')
            spinner.classList.add('visible')

            // disable the graph options until the API response arrives
            document.querySelectorAll('.view--graph-buttons--button').forEach(btn => btn.setAttribute('style', 'pointer-events: none;'))
        } catch(error) {
            console.error(error)
        }
        
    }

    _formatMarketCap(marketCap) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact'
        })
        return formatter.format(marketCap)
    }

    _switchCorporates() {
        this._myEmail.classList.toggle('submerged')
        this._myEmail.classList.toggle('emerged')
        this._mySingature.classList.toggle('emerged')
        this._mySingature.classList.toggle('submerged')
    }

    _capitalizeString(string) {
        const newString = string.charAt(0).toUpperCase() + string.substring(1).toLowerCase()
        return newString
    }

    _capitalizeWords(string) {
        const words = string.split(' ')
        const capitalizedWords = words.map(word => {
            if (!(word.length > 3)) return word
            return this._capitalizeString(word)
        })
        return capitalizedWords.join(' ')
    }
}

export default new View()