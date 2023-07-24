export class InfoError extends Error {
    constructor(message = "The information about this company is not available.") {
        super(message)
        this.name = 'InfoError'
    }
}

export class StatsError extends Error {
    constructor(message = "The statistical data for this company is not available.") {
        super(message)
        this.name = 'StatsError'
    }
}

export class GraphError extends Error {
    constructor(message = "The historical stock prices for this company are not available.") {
        super(message)
        this.name = 'GraphError'
    }
}

export class TimeoutError extends Error {
    constructor(message = "The server took too long to respond. Please try again later.") {
        super(message)
        this.name = 'TimeoutError'
    }
}

export class Error404 extends Error {
    constructor(message = "404: Not found") {
        super(message)
        this.name = 'Error404'
    }
}