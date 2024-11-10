import "./styles.css";
import clear_day from '../images/clear-day.svg';
import clear_night from '../images/clear-night.svg';
import cloudy from '../images/cloudy.svg';
import foggy from '../images/foggy.svg';
import partly_cloudy_day from '../images/partly-cloudy-day.svg';
import partly_cloudy_night from '../images/partly-cloudy-night.svg';
import rainy from '../images/rainy.svg';
import windy from '../images/windy.svg';
import snowy from '../images/snowy.svg';


async function fetchWeatherData(city) {
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=XTLQ3RNJPFN4QWMFDXREBV9KH`, { mode: 'cors' });
        const data = await response.json();
        console.log("Full API Response:", data); // Logs the complete JSON response
        return data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}


function processWeatherData(data) {
    if (!data || !data.currentConditions) return null;

    // Extract necessary fields
    const address = data.resolvedAddress;
    const tempMin = data.days[0].tempmin;
    const tempMax = data.days[0].tempmax;
    const { temp, icon, datetime, sunrise, sunset } = data.currentConditions;
    const processedData = {
        address: address,
        temperature: temp,
        icon: icon,
        tempmin: tempMin,
        tempmax: tempMax,
        datetime: datetime,
        sunrise: sunrise,
        sunset: sunset,
    };

    return processedData;
}


async function getWeather(city) {
    const rawData = await fetchWeatherData(city);  // Step 1: Fetch raw data
    const weatherData = processWeatherData(rawData); // Step 2: Process the data
    console.log(weatherData); // Final output

    displayData(weatherData);
}

const clearInput = () => {
    input.value = '';
}

const setIcon = (data) => {
    let src = '';
    switch (data.icon) {
        case 'snow': 
            src = snowy;
            break;
        case 'rain':
            src = rainy;
            break;
        case 'fog':
            src = foggy;
            break;
        case 'wind':
            src = windy;
            break;
        case 'cloudy':
            src = cloudy;
            break;
        case 'partly-cloudy-day':
            src = partly_cloudy_day;
            break;
        case 'partly-cloudy-night':
            src = partly_cloudy_night;
            break;
        case 'clear-day':
            src = clear_day;
            break;
        case 'clear-night':
            src = clear_night;
            break;
    }

    const iconImg = document.createElement('img');
    iconImg.classList.add('iconImg');
    iconImg.src = src;

    return iconImg;
}

const toFarenheit = (tempDiv, tempRangeDiv, data) => {
    tempDiv.textContent = `${data.temperature}°F`;
    tempRangeDiv.textContent = `L: ${data.tempmin}°F | H: ${data.tempmax}°F`;
}

const toCelsius = (tempDiv, tempRangeDiv, data) => {
    const temp = ((data.temperature - 32) * (5/9)).toFixed(1);
    const lowTemp = ((data.tempmin - 32) * (5/9)).toFixed(1);
    const highTemp = ((data.tempmax - 32) * (5/9)).toFixed(1);
    
    tempDiv.textContent = `${temp}°C`;
    tempRangeDiv.textContent = `L: ${lowTemp}°C | H: ${highTemp}°C`;
}

const displayData = (data) => {
    const locationDiv = document.querySelector('.locationDiv');
    const tempDiv = document.querySelector('.tempDiv');
    const iconDiv = document.querySelector('.iconDiv');
    const tempRangeDiv = document.querySelector('.tempRangeDiv');

    locationDiv.textContent = data.address;

    iconDiv.textContent = ''; // so that weather icon doesnt keep getting printed.
    iconDiv.appendChild(setIcon(data));

    if(data.address.includes('United States')) {
        toFarenheit(tempDiv, tempRangeDiv, data);
    } 
    else {
        toCelsius(tempDiv, tempRangeDiv, data);
    }

}

// get user input 
const input = document.querySelector('input');

input.addEventListener('keydown', (event) => {
    if(event.key == 'Enter') {
        const city = event.target.value;
        clearInput();
        getWeather(city);
    }
})





