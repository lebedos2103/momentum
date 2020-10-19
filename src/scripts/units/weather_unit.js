import {Geolocation} from "../models/geolocation.js";
import {Weather} from "../models/weather.js";
import {togglePopup} from "./popup_unit.js";

let weatherElem = document.querySelector(".weather"),
    weatherPopupElem = weatherElem.querySelector(".weather__popup"),
    forecastElem = weatherPopupElem.querySelector(".forecast"),
    cityElem = weatherPopupElem.querySelector(".weather__city"),
    geolocationElem = weatherPopupElem.querySelector(".weather__geolocation");

let weather;

export async function initWeather() {
    weather = new Weather(await getGeolocationCity());

    setInterval(updateWeather, 1000 * 60 * 60);
    updateWeather();
    updateCurrentCity(weatherElem);

    weatherElem.addEventListener('click', togglePopup);
    cityElem.addEventListener("keypress", updateCityName);
    cityElem.addEventListener("blur", updateCityName);
    geolocationElem.addEventListener("click", async () => {
        setCityName(await getGeolocationCity());
    })
    forecastElem.addEventListener("click", selectForecastDay);
}

// CITY

function updateCurrentCity(weatherElem) {
    let citys = weatherElem.querySelectorAll('.weather__city');
    citys.forEach(city => city.innerHTML = weather.city);
}

async function updateCityName(event) {
    if (event.type === "keypress") {
        if (event.key === "Enter") {
            setCityName(event.target.innerHTML);
            event.target.blur();
        }
    } else
        setCityName(event.target.innerHTML);
}

async function setCityName(city) {
    if (await weather.isCityExist(city)) {
        weather.city = city;
        localStorage.setItem("city", city);

        updateWeather();
    } else {
        weather.city = await getDefaultCityName();
    }

    updateCurrentCity(weatherElem);
}

async function getDefaultCityName() {
    return localStorage.getItem('city') || getGeolocationCity();
}

async function getGeolocationCity() {
    let geolocator = new Geolocation();
    let coords = await getGeoCoords().catch(error => alert(error.message));
    return await geolocator.getCity(coords, localStorage.getItem('city') || "Minsk");
}

async function getGeoCoords() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(success => {
            resolve({
                lat: success.coords.latitude,
                lon: success.coords.longitude
            });
        }, error => {
            reject(new Error("You should unblock your geoposition to get your city"))
        });
    });
}

// WEATHER

async function updateWeather() {
    await updateCurrentWeather(weatherElem, weather);
    await updateForecast(forecastElem, weather);
    updatePopupWeather(weatherPopupElem, forecastElem);
}

async function updateCurrentWeather(weatherElem, weather) {
    let temp = weatherElem.querySelector(".weather__temp");
    let icon = weatherElem.querySelector(".weather__image");
    let desc = weatherElem.querySelector(".weather__description");

    let data = await weather.getCurrentWeather();

    temp.innerHTML = data.temp;
    desc.innerHTML = data.description;
    icon.src = data.src;
}

async function updateForecast(forecastElem, weather) {
    const dayElem =
        "<li class=\"forecast__day day\">\n" +
        "    <h5 class=\"day__name\">{weekDay}</h5>\n" +
        "    <div class=\"day__weather weather\">\n" +
        "        <div class=\"weather__content\">\n" +
        "            <img class=\"weather__image weather__image_size_small\" src=\"{src}\">\n" +
        "            <p class=\"weather__temp-wrapper\">\n" +
        "                <span class=\"weather__temp weather__temp_font_small\">{temp}</span>\n" +
        "                <span class=\"weather__celsius weather__celsius_size_small weather__celsius_dark\"></span>\n" +
        "            </p>\n" +
        "            <p class=\"weather__description weather__description_hidden\">{desc}</p>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "</li>";

    let days = await weather.getForecastWeather(3);

    forecastElem.innerHTML = days.map(day => dayElem.replace('{weekDay}', day.weekDay)
        .replace('{src}', day.src)
        .replace('{temp}', day.temp)
        .replace('{desc}', day.description)
    ).join("\n");
}

function selectForecastDay(event) {
    let day = event.target.closest(".day");
    if (day) {
        forecastElem.querySelectorAll(".day").forEach(day => day.classList.remove("day_selected"));
        day.classList.add("day_selected");
        updatePopupWeather(weatherPopupElem, forecastElem);
    }
}

function updatePopupWeather(weatherPopupElem, forecastElem) {
    let days = [...forecastElem.querySelectorAll(".day")];
    let curDay = days.find((item) => item.classList.contains("day_selected"));

    if (curDay && curDay !== days[0]) {
        setWeather(weatherPopupElem,
            curDay.querySelector(".weather__temp").innerHTML,
            curDay.querySelector(".weather__image").src,
            curDay.querySelector(".weather__description").innerHTML);
    } else {
        let weatherElem = weatherPopupElem.closest(".weather");

        setWeather(weatherPopupElem,
            weatherElem.querySelector(".weather__temp").innerHTML,
            weatherElem.querySelector(".weather__image").src,
            weatherElem.querySelector(".weather__description").innerHTML);
    }
}

function setWeather(weatherElem, temp, icon, desc) {
    let tempElem = weatherElem.querySelector(".weather__temp");
    let iconElem = weatherElem.querySelector(".weather__image");
    let descElem = weatherElem.querySelector(".weather__description");

    tempElem.innerHTML = temp;
    descElem.innerHTML = desc;
    iconElem.src = icon;
}