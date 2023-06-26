class View {

    _gridContainer

    renderHeader() {
        const html = `
            <header>
                <div class='header--title'>
                    Fortune 50
                </div>
            </header>
        `
        document.body.insertAdjacentHTML('afterbegin', html)
    }

    renderGrid() {
        const html = `
            <div class="grid-container">
            </div>
        `
        document.body.insertAdjacentHTML('beforeend', html)
        this._gridContainer = document.querySelector('.grid-container')
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
}

export default new View()