export class Geolocation {
    _token = "2cd9ded067e24c99bf97e12eff088e8a";
    _url = "https://api.opencagedata.com/geocode/v1/json";

    async getCity(coords, defaultCity = 'Minsk') {
        let query = `q=${coords.lat},${coords.lon}`;
        let key = `key=${this._token}`;

        try {
            let response = await fetch(`${this._url}?${query}&${key}&language=en`);
            let result = await response.json();
            return result.results[0].components.city;
        } catch (e) {
            return defaultCity;
        }
    }
}