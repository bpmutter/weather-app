const queryWeatherAPI = async location => {
  try {
    let locationData = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=5fb47fb1a33c7a53280e6205ffefb653`
    );
    let locJson = await locationData.json();

    //create object out of relevant json data b/c easier to export and work with
    const cityInfo = {
      name: locJson.name,
      country: locJson.sys.country,
      lat: locJson.coord.lat,
      lon: locJson.coord.lon,
      temp: locJson.main.temp,
      tempMin: locJson.main.temp_min,
      tempMax: locJson.main.temp_max,
      feelsLike: locJson.main.feels_like,
      description: locJson.weather[0].description,
      wind: locJson.wind.speed,
      humidity: locJson.main.humidity,
      sunrise: locJson.sys.sunrise,
      sunset: locJson.sys.sunset,
      timezone: locJson.timezone,
      id: locJson.id
    };

    return cityInfo;
  } catch (error) {
    alert("invalid search term! try again");
  }
};
const locToTime = async city => {
  const lat = city.lat;
  const lon = city.lon;
  let timeInfo = await fetch(
    `https://api.timezonedb.com/v2.1/get-time-zone?key=AS3476QV3GGJ&format=json&by=position&lat=${lat}&lng=${lon}`
  );
  let timeJson = await timeInfo.json();
  const timeString = timeJson.formatted;
  const year = timeString.slice(0, 4);
  let month = parseInt(timeString.slice(6, 8));
  //   prettier-ignore
  if (month === 1){ month = "Jan"} else if (month === 2) {month = "Feb" }
    else if (month === 3) { month = "Mar"} else if (month === 4) {  month = "Apr"}
    else if (month === 5) { month = "May" } else if (month === 6) { month = "Jun"}
    else if (month === 7) { month = "Jul" } else if (month === 8) { month = "Aug" }
    else if (month === 9) { month = "Sep" } else if (month === 10) { month = "Oct" }
    else if (month === 11) { month = "Nov" } else if (month === 12) { month = "Dec" }

  const day = parseInt(timeString.slice(8, 10));
  let hour = parseInt(timeString.slice(11, 13));
  const min = timeString.slice(14, 16);
  let amPm = "AM";
  if (hour === 24) {
    hour = 12;
  } else if (hour >= 12 && hour < 24) {
    hour -= 12;
    amPm = "PM";
  }

  const date = `${month} ${day}, ${year}`;
  const time = `${hour}:${min}`;
  const dateTime = `${date} - ${time} ${amPm}`;

  let cityTime = { ...city };
  cityTime.dateTime = dateTime;
  return cityTime;
};

//note: for some reason need to put the function after the async for it to work..weird
queryWeatherAPI("medellin").then(result => {
  locToTime(result).then(result => {
    renderWeather(result);
  });
});

document.getElementById("search-input").addEventListener("submit", e => {
  const search = document.getElementById("search").value;
  queryWeatherAPI(search).then(result => {
    locToTime(result).then(result => {
      renderWeather(result);
    });
  });
  e.preventDefault();
});

const renderWeather = location => {
  document.getElementById("city-name").innerText = location.name;
  document.getElementById("country").innerText = location.country;
  document.getElementById("time-info").innerText = location.dateTime;
  document.getElementById("actual-temp-measure").innerText =
    Math.floor((location.temp - 273.15) * 10) / 10;
  document.getElementById("min-temp-measure").innerText =
    Math.floor((location.tempMin - 273.15) * 10) / 10;
  document.getElementById("max-temp-measure").innerText =
    Math.floor((location.tempMax - 273.15) * 10) / 10;
  document.getElementById("feels-like-measure").innerText =
    Math.floor((location.feelsLike - 273.15) * 10) / 10;
  document.getElementById("weather").innerText = titleCase(
    location.description
  );
  document.getElementById("wind-measure").innerText = location.wind;
  document.getElementById("humidity-measure").innerText = location.humidity;
  document.getElementById("sunrise-time").innerText = convertTimestamptoTime(
    location.sunrise,
    location.timezone
  );
  document.getElementById("sunset-time").innerText = convertTimestamptoTime(
    location.sunset,
    location.timezone
  );
  document.getElementsByClassName("button--temp")[1].classList.add("active");
  document.getElementsByClassName("button--temp")[0].classList.remove("active");
  const tempUnitDisplay = document.getElementsByClassName("temp-unit");
  for (let i = 0; i < tempUnitDisplay.length; i++) {
    tempUnitDisplay[i].innerText = " °C";
  }

  document.getElementById("celc").addEventListener("click", () => {
    document.getElementsByClassName("button--temp")[1].classList.add("active");
    document
      .getElementsByClassName("button--temp")[0]
      .classList.remove("active");

    document.getElementById("actual-temp-measure").innerText =
      Math.floor((location.temp - 273.15) * 10) / 10;
    document.getElementById("min-temp-measure").innerText =
      Math.floor((location.tempMin - 273.15) * 10) / 10;
    document.getElementById("max-temp-measure").innerText =
      Math.floor((location.tempMax - 273.15) * 10) / 10;
    document.getElementById("feels-like-measure").innerText =
      Math.floor((location.feelsLike - 273.15) * 10) / 10;
    const tempUnitDisplay = document.getElementsByClassName("temp-unit");
    for (let i = 0; i < tempUnitDisplay.length; i++) {
      tempUnitDisplay[i].innerText = " °C";
    }
  });
  document.getElementById("far").addEventListener("click", () => {
    document.getElementsByClassName("button--temp")[0].classList.add("active");
    document
      .getElementsByClassName("button--temp")[1]
      .classList.remove("active");
    document.getElementById("actual-temp-measure").innerText =
      Math.floor(((location.temp * 9) / 5 - 459.67) * 10) / 10;
    document.getElementById("min-temp-measure").innerText =
      Math.floor(((location.temp * 9) / 5 - 459.67) * 10) / 10;
    document.getElementById("max-temp-measure").innerText =
      Math.floor(((location.temp * 9) / 5 - 459.67) * 10) / 10;
    document.getElementById("feels-like-measure").innerText =
      Math.floor(((location.temp * 9) / 5 - 459.67) * 10) / 10;
    const tempUnitDisplay = document.getElementsByClassName("temp-unit");
    for (let i = 0; i < tempUnitDisplay.length; i++) {
      tempUnitDisplay[i].innerText = " °F";
    }
  });
};

//support functions
function titleCase(str) {
  str = str.toLowerCase().split(" ");
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
}

function convertTimestamptoTime(time, timezone) {
  // convert to milliseconds and
  // then create a new Date object

  const dateObj = new Date((time + timezone) * 1000);
  const utcString = dateObj.toUTCString();

  let timeCleaned = utcString.slice(17, 22);
  let hours = parseInt(timeCleaned.slice(0, 2));
  if (hours > 12) {
    hours -= 12;
  }
  const mins = timeCleaned.slice(3, 5);
  timeCleaned = hours + ":" + mins;
  return timeCleaned;
}
