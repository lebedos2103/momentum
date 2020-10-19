import {Timer} from "../models/timer.js";
import {TimeFormatter} from "../models/timeFormatter.js";
import {getDayState} from "../models/common.js";
import {togglePopup} from "./popup_unit.js";

let time = document.querySelector(".time__current"),
    greeting = document.querySelector(".content__greeting"),
    timeMenuElem = document.querySelector(".time__menu"),
    timePopupElem = timeMenuElem.querySelector(".time__popup");

let dayState = '';

let timer = new Timer();
timer.addObserver(updateGreeting);
timer.addObserver(updateTime);
timer.start();

export async function initTimer() {
    let date = new Date();

    updateTime(date);
    updateGreeting(date);

    timeMenuElem.addEventListener('click', function (event) {
        togglePopup.call(this, event, [(elem) => {
            if (elem.classList.contains("popup_hidden"))
                this.classList.remove("menu_popuped");
            else
                this.classList.add("menu_popuped");
        }]);
    });
    createFormatMenu(timePopupElem);
}

function updateTime(date) {
    let format = parseInt(localStorage.getItem("time-format")) || 1;

    time.innerHTML = getFormatTime(date, format);
}

function getFormatTime(date, formatNumber) {
    switch (formatNumber) {
        case 1:
            return TimeFormatter.getStandartFormat(date);
        case 2:
            return TimeFormatter.getStringFormat(date);
        case 3:
            return TimeFormatter.get24HourFormat(date);
    }
}

function createFormatTimeElem(index) {
    let elem = document.createElement("time");
    elem.dataset.id = index;

    elem.classList.add("time__format");
    if (parseInt(localStorage.getItem("time-format")) === index)
        elem.classList.add("time__format_selected");

    elem.addEventListener("click", changeFormatTime.bind(elem, index));
    timer.addObserver((date) => elem.innerHTML = getFormatTime(date, index));

    return elem;
}

function changeFormatTime(index) {
    let formats = timeMenuElem.querySelectorAll(".time__format");
    formats.forEach(format => {
        if (parseInt(format.dataset.id) === index)
            format.classList.add("time__format_selected");
        else
            format.classList.remove("time__format_selected");
    });

    localStorage.setItem("time-format", index);
}

function createFormatMenu(parent) {
    Array.from({length: 3}, (_, index) =>
        parent.appendChild(createFormatTimeElem(index + 1)));
}

function updateGreeting(time) {
    let state = getDayState(time);
    if (dayState === state) return;

    dayState = state;

    greeting.innerHTML = getGreeting(dayState);
}

function getGreeting(state) {
    switch (state) {
        case 1:
            return "Good night";
        case 2:
            return "Good morning";
        case 3:
            return "Good afternoon";
        case 4:
            return "Good evening";
    }
}