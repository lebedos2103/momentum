export class Timer {
    constructor() {
        // this.time = new Date();
        this.observers = [];
    }

    start() {
        setInterval(this.notifyObservers.bind(this), 1000);
    }

    removeObserver(observer) {
        let index = this.observers.indexOf(observer);
        if (!~index) return false;

        this.observers.splice(index, 1);

        return true;
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    notifyObservers() {
        let time = new Date();
        for (let observer of this.observers) {
            observer(time);
        }
    }
}