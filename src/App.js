import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; // Import your CSS file
import logo from './stock.jpeg'; // Import your logo image

function Quotes() {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/quotes'); // Specify the complete URL
        setQuotes(response.data);
      } catch (error) {
        console.error('Error fetching quotes:', error);
      }
    };

    fetchQuotes();

    const intervalId = setInterval(fetchQuotes, 15000); // Refresh data every 15 seconds

    return () => clearInterval(intervalId); // Cleanup function to clear interval
  }, []);

  return (
    <div className="container">
            <h1>Financial Data</h1>

      <img src={logo} alt="Logo" className="logo" />
      <h2>Quotes</h2>
      <ul>
        {quotes.map((quote, index) => (
          <li key={index}>
            <p className="source">Source: {quote.source}</p>
            <p className="price">Buy Price: {quote.buyPrices.join(', ')}</p>
            <p className="price">Sell Price: {quote.sellPrices.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Average() {
  const [average, setAverage] = useState({});

  useEffect(() => {
    const fetchAverage = async () => {
      try {
        const response = await axios.get('http://localhost:3000/average'); // Specify the complete URL
        setAverage(response.data);
      } catch (error) {
        console.error('Error fetching average:', error);
      }
    };

    fetchAverage();

    const intervalId = setInterval(fetchAverage, 15000); // Refresh data every 15 seconds

    return () => clearInterval(intervalId); // Cleanup function to clear interval
  }, []);

  return (
    <div className="container">
      <h2>Average</h2>
      <p className="average">Average Buy Price: {average.average_buy_price}</p>
      <p className="average">Average Sell Price: {average.average_sell_price}</p>
    </div>
  );
}

function App() {
  return (
    <div>
      <Quotes />
      <Average />
    </div>
  );
}

export default App;
