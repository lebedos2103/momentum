import {addZero} from "./common.js";

export class TimeFormatter {
    static getStandartFormat(time) {
        let hours = time.getHours(),
            minutes = time.getMinutes(),
            seconds = time.getSeconds(),
            ampm = hours < 12 ? "AM" : "PM";

        return `${hours % 12}<span>:</span>${addZero(minutes)}<span>:</span>${addZero(seconds)} ${ampm}`
    }

    static getStringFormat(time) {
        let month = time.toLocaleString("en", {month: "long"}),
            weekday = time.toLocaleString("en", {weekday: "long"}),
            day = time.getDate(),
            hours = time.getHours(),
            minutes = time.getMinutes();

        return `${weekday}<span>,</span> ${day}<br>${month} ${hours}<span>:</span>${addZero(minutes)}`;
    }

    static get24HourFormat(time){
        let hours = time.getHours(),
            minutes = time.getMinutes(),
            seconds = time.getSeconds();

        return `${hours}<span>:</span>${addZero(minutes)}<span>:</span>${addZero(seconds)}`
    }
}