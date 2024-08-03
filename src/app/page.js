'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [input, setInput] = useState('{"data":["M","1","334","4","B"]}');
  const [response, setResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "RA2111003030345";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const parsedInput = JSON.parse(input);
      const result = await axios.post('https://backend-bajaj.vercel.app/bfhl', parsedInput);
      setResponse(result.data);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Invalid JSON input");
      } else {
        setError("An error occurred while processing your request");
      }
    }
  };

  const handleFilterChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue && !selectedFilters.includes(selectedValue)) {
      setSelectedFilters([...selectedFilters, selectedValue]);
    }
    e.target.value = '';
  };

  const removeFilter = (filter) => {
    setSelectedFilters(selectedFilters.filter(f => f !== filter));
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Data Filter Application</h1>
        <div className="input-container">
          <div className="input-label">API Input</div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Enter API input JSON here'
            className="json-input"
          />
          <button onClick={handleSubmit} className="submit-button">Submit</button>
        </div>

        {error && <div className="error">{error}</div>}

        {response && (
          <div className="response-container">
            <div className="multi-filter">
              <div className="filter-label">Multi Filter</div>
              <select onChange={handleFilterChange} className="dropdown">
                <option value="">Select a filter</option>
                <option value="Numbers">Numbers</option>
                <option value="Alphabets">Alphabets</option>
                <option value="Highest Alphabet">Highest Alphabet</option>
              </select>
              <div className="filter-bar">
                {selectedFilters.map(filter => (
                  <div key={filter} className="filter-tag">
                    <span>{filter}</span>
                    <button onClick={() => removeFilter(filter)}>×</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="filtered-response">
              <h3>Filtered Response</h3>
              {selectedFilters.includes('Numbers') && (
                <p>Numbers: {response.numbers.join(', ')}</p>
              )}
              {selectedFilters.includes('Alphabets') && (
                <p>Alphabets: {response.alphabets.join(', ')}</p>
              )}
              {selectedFilters.includes('Highest Alphabet') && (
                <p>Highest Alphabet: {response.highest_alphabet.join(', ')}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
