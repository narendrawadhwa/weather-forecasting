import React, { useState, useEffect } from 'react';
import WeatherCard from './components/WeatherCard';
import SearchBar from './components/SearchBar';
import './App.css'; 

const App = () => {
  const [position, setPosition] = useState(null);
  const [searchedCity, setSearchedCity] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().getHours());

  useEffect(() => {
    // Get user's location using Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setPosition(position.coords),
        (error) => console.error(error)
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }

    // Updating current time every minute
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().getHours());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const handleSearch = (city) => {
    setSearchedCity(city);
  };
  const getGradientClass = () => {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();     
    const period = currentHour >= 12 ? 'pm' : 'am';
       console.log(currentHour)
    if (period === 'am') {
      if (currentHour >= 7 && currentHour < 12) {
        return 'morning-gradient';
      } else {
        return 'dark-night-gradient';
      }
    } else {
      if (currentHour >= 12 && currentHour < 18) {
        return 'noon-gradient';
      } else  {
        return 'light-night-gradient';
      }
    }
  };

  return (
    <div className={`${getGradientClass()} px-4  sm:px-6 py-4 min-h-[100vh]`}>
      <SearchBar onSearch={handleSearch} />
      {position && !searchedCity && <WeatherCard lat={position.latitude} lon={position.longitude} />}
      {searchedCity && <WeatherCard city={searchedCity} />}
    </div>
  );
};

export default App;
