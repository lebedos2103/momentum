export class Quote {
    constructor(text, author, delay = 3 * 1000) {
        this.text = text;
        this.author = author;
        this.quotes = [];

        this.generateQuotes(true, delay);
    }

    async getQuote() {
        try {
            let quote = this.quotes.pop();

            this.text.innerHTML = quote.quoteText;
            this.author.innerHTML = quote.quoteAuthor;
        } catch (e) {
            this.text.innerHTML = "The moment one gives close attention to anything, even a blade of grass, it becomes a mysterious, awesome, indescribably magnificent world in itself. ";
            this.author.innerHTML = "Henry Miller";
        }
    }

    async generateQuotes(state, delay) {
        try {
            if (state){
                let quote = await this.getServerQuote();
                this.quotes.push(quote);
            }
        }
        catch (e){
            console.log(e.message);
        }
        finally {
            setTimeout(this.generateQuotes.bind(this, this.quotes.length < 20, delay));
        }
    }

    async getServerQuote() {
        const url = "https://cors-anywhere.herokuapp.com/https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en#";
        let response = await fetch(url);
        return await response.json();
    }

    async toggleQuoteClasses(elem) {
        elem.classList.add("quote_changed");
        setTimeout(() => elem.classList.remove("quote_changed"));
    }
}