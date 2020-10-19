import {addZero, getDayState} from "./common.js";

export class Background {
    _base = 'https://raw.githubusercontent.com/irinainina/ready-projects/momentum/momentum/assets/images/';
    _timeOfDay = ["night", "morning", "day", "evening"];

    constructor(element, delay) {
        this.element = element;
        this.delay = delay;
        this._index = 0;
        this._lenght = 20;
        this._dayState = getDayState(new Date());

        this._init();
    }

    _init() {
        this._next();
    }

    _next() {
        this._dayState = getDayState(new Date());
        let uri = this.getImageSrc(this._timeOfDay[this._dayState - 1]);
        this.change(uri);
    }

    scroll() {
        this.timeId = setInterval(this._next.bind(this), this.delay);
    }

    change(uri) {
        new Promise((resolve, reject) => {
            let image = document.createElement("img");
            image.src = uri;

            image.onload = () => {
                resolve(image.src);
            }
            image.onerror = () => {
                reject()
            }
        }).then(src => {
            this.element.style.backgroundImage = `url(${src})`;
        }).catch(() => {
            this._next();
        });
    }

    getImageSrc(dayState) {
        this._index = this._index % this._lenght + 1;
        return this._base + dayState + '/' + addZero(this._index) + '.jpg';
    }
}