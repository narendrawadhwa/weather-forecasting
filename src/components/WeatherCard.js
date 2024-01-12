import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import LoadingComponent from './Loading';
import { BsArrowDown, BsArrowUp, BsExclamationTriangle } from 'react-icons/bs';
import { humidity } from '../assets';


const WeatherCard = ({ lat, lon, city }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiKey = config.openWeatherMapApiKey;
  const currentDate = new Date();
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let apiUrl;
        let forecastApiUrl;

        if (city) {
          apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
          forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
        } else if (lat && lon) {
          apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
          forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        }

        if (apiUrl) {
          setLoading(true);

          // Fetching current weather data
          const weatherResponse = await axios.get(apiUrl);



          setWeatherData(weatherResponse.data);
          setLoading(false);
          setError(null);


          // Fetching 5-day forecast data
          const forecastResponse = await axios.get(forecastApiUrl);
          const dailyForecastData = extractDailyForecast(forecastResponse.data.list);
          setForecastData(dailyForecastData);
        }
      } catch (error) {
        console.error(error);
        setError('Error fetching weather data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [lat, lon, city, apiKey]);


  const kelvinToCelsius = (kelvin) => Math.round(kelvin - 273.15);
  const metersPerSecondToMilesPerHour = (metersPerSecond) => (metersPerSecond * 2.23694).toFixed(2);

  const formatAMPM = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours %= 12;
    hours = hours ? hours : 12;
    const strTime = hours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + ampm;
    return strTime;
  };

  const getAbbreviatedDay = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}.png`;
  };
  // Function to extract daily forecast data (minimum and maximum temperatures)
  const extractDailyForecast = (forecastList) => {
    const dailyForecastData = {};

    forecastList.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();

      if (!dailyForecastData[dayKey]) {
        dailyForecastData[dayKey] = {
          date: date,
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          humidity: item.main.humidity,
        };
      } else {
        // Update min and max temperatures if a more recent reading is found
        dailyForecastData[dayKey].temp_min = Math.min(
          dailyForecastData[dayKey].temp_min,
          item.main.temp_min
        );
        dailyForecastData[dayKey].temp_max = Math.max(
          dailyForecastData[dayKey].temp_max,
          item.main.temp_max
        );
      }
    });

    return Object.values(dailyForecastData);
  };
  return (
    <div className='mt-5'>
      {loading && <LoadingComponent />}

      {error && (
        <div className='text-white flex flex-row items-center justify-center'>
          <BsExclamationTriangle className="m-0 w-12" /><h6 className='m-0'>{error}</h6>
        </div>
      )}

      {weatherData && !loading && !error && (

        <div className='text-white justify-content-between flex lg:flex-row flex-col'>
          <span className='flex justify-between min-w-[20%]'>
            <span className='text-left'>
              <img src={getWeatherIcon(weatherData.weather[0].icon)} alt='Weather Icon' className='rounded-full bg-white w-14 h-14' />
              <p className='fs-6 mt-1 mb-0'>{weatherData.name}, {weatherData.sys.country}</p>
              <h2 style={{ fontSize: '60px' }} className='mb-1 mt-0'>{kelvinToCelsius(weatherData.main.temp)}°C</h2>
              <p className='fs-6 m-0 mb-2 fw-semibold'>{weatherData.weather[0].main}</p>

            </span>
            <span className='text-right lg:hidden block'>
              <p className='fs-6 m-0'>{getAbbreviatedDay(currentDate)}, {formatAMPM(currentDate)}</p>
              <p className='fs-6 m-0'>{currentDate.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </span>
          </span>


          <div className={`justify-between lg:hidden flex gap-1 sm:w-[60%] w-[80vw] bg-white mx-auto bg-opacity-25 rounded-3 px-3 py-2 my-4 border border-white`} >
            <span>
              <p className='details-heading'>Feels Like</p>
              <h3 className='details-content'>{kelvinToCelsius(weatherData.main.feels_like)}°C</h3>
            </span>
            <span>
              <p className='details-heading'>Humidity</p>
              <h3 className='details-content'>{weatherData.main.humidity}%</h3>
            </span>
            <span>
              <p className='details-heading'>Wind</p>
              <h3 className='details-content'>{metersPerSecondToMilesPerHour(weatherData.wind.speed)} mp/h</h3>
            </span>
          </div>


          {forecastData && (
            <div className='my-4 flex justify-between flex-col items-center'>
              <>
                <h3 className='text-center'>5-Days Forecast</h3>
                <span className='flex flex-row flex-wrap justify-center items-center'>
                  {forecastData.map((day, index) => (
                    <div
                      key={index}
                      className='border-2 border-white gap-4 bg-white bg-opacity-25 rounded-2 m-1 p-2 w-[270px] flex justify-center items-center'
                    >
                      <p>
                        {getAbbreviatedDay(day.date)}{' '}
                      </p>

                      <span className='flex flex-row justify-center items-start'>
                        <img
                          src={humidity}
                          alt='Humidity Icon'
                          className='w-3 h-3 mr-1 mt-2'
                        />
                        <p className=''>{day.humidity}</p>
                      </span>
                      <p className='flex flex-row'>
                        {kelvinToCelsius(day.temp_min)}°
                        <BsArrowDown className='text-white w-3 mr-1 mt-1' />
                        {kelvinToCelsius(day.temp_max)}°
                        <BsArrowUp className='text-white mt-1 w-3' />
                      </p>

                    </div>
                  ))}
                </span>
              </>

              <div className={`justify-between hidden lg:flex w-[50%] absolute bottom-5 bg-white mx-auto bg-opacity-25 rounded-3 p-3 border border-white`} >
                <span>
                  <p className='details-heading'>Feels Like</p>
                  <h3 className='details-content'>{kelvinToCelsius(weatherData.main.feels_like)}°C</h3>
                </span>
                <span>
                  <p className='details-heading'>Humidity</p>
                  <h3 className='details-content'>{weatherData.main.humidity}%</h3>
                </span>
                <span>
                  <p className='details-heading'>Wind</p>
                  <h3 className='details-content'>{metersPerSecondToMilesPerHour(weatherData.wind.speed)} mph</h3>
                </span>
                <span>
                  <p className='details-heading'>Pressure</p>
                  <h3 className='details-content'>{weatherData.main.pressure} mb</h3>
                </span>
                <span>
                  <p className='details-heading'>Visibility</p>
                  <h3 className='details-content'>{weatherData.visibility / 1000} km</h3>
                </span>
              </div>
            </div>
          )}
          <span className='text-right hidden lg:block w-[25%]'>
            <p className='fs-6 m-0'>{getAbbreviatedDay(currentDate)}, {formatAMPM(currentDate)}</p>
            <p className='fs-6 m-0'>{currentDate.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </span>


        </div>
      )}
    </div>
  );
};

export default WeatherCard;
