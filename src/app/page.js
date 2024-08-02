'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [input, setInput] = useState('{"data":["M","1","334","4","B"]}');
  const [response, setResponse] = useState(null);
  const [filters, setFilters] = useState(['Numbers', 'Highest Alphabet', 'Alphabets']);
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

  const handleFilterChange = (filter) => {
    setFilters(prevFilters => 
      prevFilters.includes(filter) 
        ? prevFilters.filter(f => f !== filter) 
        : [...prevFilters, filter]
    );
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Data Filter Application</h1>
        <div className="input-container">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"data":["M","1","334","4","B"]}'
            className="json-input"
          />
          <button onClick={handleSubmit} className="submit-button">Submit</button>
        </div>

        {error && <div className="error">{error}</div>}

        {response && (
          <div className="response-container">
            <div className="multi-filter">
              <span>Multi Filter</span>
              <div className="filter-options">
                {['Numbers', 'Alphabets', 'Highest Alphabet'].map(filter => (
                  <label key={filter} className="filter-label">
                    <input 
                      type="checkbox" 
                      checked={filters.includes(filter)}
                      onChange={() => handleFilterChange(filter)}
                      className="filter-checkbox"
                    />
                    {filter}
                  </label>
                ))}
              </div>
            </div>

            <div className="filtered-response">
              <h3>Filtered Response</h3>
              {filters.includes('Numbers') && (
                <p>Numbers: {response.numbers.join(', ')}</p>
              )}
              {filters.includes('Alphabets') && (
                <p>Alphabets: {response.alphabets.join(', ')}</p>
              )}
              {filters.includes('Highest Alphabet') && (
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
