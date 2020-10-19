import {Quote} from "../models/quote.js";

let quote_next = document.querySelector(".quote__next"),
    quote_phrase = document.querySelector(".quote__phrase"),
    quote_author = document.querySelector(".quote__author-name");

export async function initQuote() {
    let quote = new Quote(quote_phrase, quote_author);

    document.addEventListener('DOMContentLoaded', quote.getQuote.bind(quote));
    quote_next.addEventListener('click', quote.getQuote.bind(quote));
}