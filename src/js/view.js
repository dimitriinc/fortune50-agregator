import { takeWhile } from 'lodash'
import spinner from '../images/spinner.svg'
import { stockExchanges, VISIBLE, HIDDEN } from './conifg'


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

    renderCompany(company, index) {
        const marketCap = this._formatMarketCap(company.marketCap)
        const html = `
            <div class="grid-item">
                <div class="grid-item--rating">
                    <span class="grid-item--rating--content">${index + 1}</span>
                </div>
                <div class="grid-item--card" data-symbol="${company.symbol}">
                    <div class="grid-item--card--name">
                        <div class="grid-item--card--name--company-name">${company.companyName}</div>
                        <div class="grid-item--card--name--symbol">${company.symbol}</div>
                    </div>
                    <div class="grid-item--card--marketcap">${marketCap}</div>
                </div>
            </div> 
        `
        this._gridContainer.insertAdjacentHTML('beforeend', html)
    }

    renderSelectedCard() {
        const html = `
            <div class="selected-container">
                <img class="selected--spinner" src="${spinner}">
            </div>
        `
        this._overlayDouble.insertAdjacentHTML('afterbegin', html)
        this._blankSelectedCard = document.querySelector('.selected-container')
        
    }

    renderCompanySelected(company) {
        const html = `
            <div class="selected--head">
                ${company.Name}
            </div>
            <div class="selected--options">
                <div class="selected--options-option" id="options-graph">Graph</div>
                <div class="selected--options-option" id="options-info">Info</div>
                <div class="selected--options-option" id="options-stats">Stats</div>
            </div>
        `
        this._blankSelectedCard.querySelector('.selected--spinner').classList.add('hidden')
        this._blankSelectedCard.insertAdjacentHTML('afterbegin', html)
    }

    renderSpinner() {
        if (document.querySelector('.error-message')) document.querySelector('.error-message').remove()
        
        this.emptyGridContainer()
        this._spinner.setAttribute('style', 'opacity: 1')
    }


    renderError(message) {
        this.hideSpinner()
        this.emptyGridContainer()

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
        console.log('HTML CREATED!!!');
        try {
            console.log(this._blankSelectedCard);
            this._blankSelectedCard.insertAdjacentHTML('afterbegin', html)
            document.querySelector('.error-message').setAttribute('style', 'opacity:1')
            console.log('INSERT SUCCESSFUL!!!!');
        } catch(error) {
            console.error(error)
        }
        
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
            
            handler(card.dataset.symbol)
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
}

export default new View()