export class Weather {
    _token = '258398dc28e141dd9cf214842201210';
    _url = "https://api.weatherapi.com/v1/{file}?{key}&{search}";

    constructor(city) {
        this._city = city;
    }

    get city() {
        return this._city;
    }

    set city(value) {
        this._city = value;
    }

    _getUrl(file, key, search) {
        return this._url.replace('{file}', file)
            .replace('{key}', key)
            .replace('{search}', search);
    }

    _loadWeatherPicture(src) {
        return new Promise((resolve, reject) => {
            let img = document.createElement('img');
            img.src = src;

            img.onload = () => resolve();
            img.onerror = () => reject();
        })
    }

    async getForecastWeather(daysCount) {
        let url = this._getUrl('forecast.json',`key=${this._token}`, `q=${this.city}&days=${daysCount}`);
        let response = await fetch(url);
        let data = await response.json();

        return Promise.all(data.forecast.forecastday.map(item => {
            let weekDay = new Date(item.date).toLocaleString("en", {weekday: "short"}),
                weekDayLong = new Date(item.date).toLocaleString("en", {weekday: "long"}),
                temp = item.day.avgtemp_c;

            return this._loadWeatherPicture(item.day.condition.icon).then(() => {
                return {
                    weekDay,
                    weekDayLong,
                    temp: Math.round(temp),
                    src: item.day.condition.icon,
                    description: item.day.condition.text
                }
            });
        }));
    }

    async getCurrentWeather() {
        let url = this._getUrl('current.json',`key=${this._token}`, `q=${this.city}`);
        let response = await fetch(url);
        let data = await response.json();
        await this._loadWeatherPicture(data.current.condition.icon);

        return {
            temp: data.current.temp_c,
            description: data.current.condition.text,
            src: data.current.condition.icon
        }
    }

    async isCityExist(city) {
        let url = this._getUrl('current.json',`key=${this._token}`, `q=${city}`);
        let response = await fetch(url);

        if (response.ok)
            return true;

        return false;
    }
}