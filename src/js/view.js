class View {

    _gridContainer
    _mySingature
    _myEmail

    renderHeader() {
        const html = `
            <header>
                <div class='header--title'>
                    Fortune 50
                </div>

                <nav>
                    <div class="btn-exchange" data-mic="nyse">NYSE</div>
                    <div class="btn-exchange" data-mic="nasdaq">NASDAQ</div>
                </nav>
            </header>
        `
        document.body.insertAdjacentHTML('afterbegin', html)
    }

    renderEmptyGrid() {
        const html = `
            <div class="grid-container">
            </div>
        `
        document.body.insertAdjacentHTML('beforeend', html)
        this._gridContainer = document.querySelector('.grid-container')
    }

    renderGrid() {

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
            <div class="grid-item" data-symbol="${company.symbol}">
                <div class="grid-item--rating">
                    <span class="grid-item--rating--content">${index + 1}</span>
                </div>
                <div class="grid-item--card">
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