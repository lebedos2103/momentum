import {Background} from "../models/background.js";

let page = document.querySelector(".page");

export async function initBackground() {
    let background = new Background(page, 60 * 1000);
    background.scroll();
}