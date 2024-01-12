import React, { useState } from 'react';
import { BsSearch } from 'react-icons/bs'; 

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState('');

  const handleSearch = () => {
    if (city.trim() !== '') {
      onSearch(city);
    }
  };

  return (
    <div className={`rounded-5 lg:w-[50%] w-[80%] border m-0 border-white py-2 px-3 flex mx-auto items-center`}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border-0 outline-none flex-1 bg-transparent text-white w-[60%]"
          style={{outline:'none'}}
          />
        <button onClick={handleSearch} className="bg-transparent text-white border-0 p-1 m-0">
          <BsSearch />
        </button>
    </div>
  );
};

export default SearchBar;
