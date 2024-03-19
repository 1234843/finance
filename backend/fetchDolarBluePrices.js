const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

// Define endpoint for /quotes
app.get('/quotes', async (req, res) => {
    try {
        // Array to store quotes from different sources
        const quotes = [];

        // URLs of the sources
        // const sources = [
        //     'https://www.ambito.com/contenidos/dolar.html',
        //     'https://www.dolarhoy.com',
        //     'https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB'
        // ];
              const sources = [
        'https://www.dolarhoy.com',
        ];

        // Fetch quotes from each source
        for (const source of sources) {
            const response = await axios.get(source);
            const $ = cheerio.load(response.data);

            const buyPriceElement = $('.Buys');
            const sellPriceElement = $('.Sale');
            
            // Extract text content and parse into numeric values
            const buyPriceText = buyPriceElement.text();
            const sellPriceText = sellPriceElement.text();
            
            // Log extracted text to verify correctness
            console.log('Buy Price Text:', buyPriceText);
            console.log('Sell Price Text:', sellPriceText);
            
            // Ensure numeric parsing is successful
            const buyPrice = parseFloat(buyPriceText);
            const sellPrice = parseFloat(sellPriceText);
            
            // Log parsed prices to verify correctness
            console.log('Parsed Buy Price:', buyPrice);
            console.log('Parsed Sell Price:', sellPrice);
            // Construct quote object
            const quote = {
                buy_price: buyPrice,
                sell_price: sellPrice,
                source: source
            };
console.log(quote);
            // Push quote object to array
            quotes.push(quote);
        }

        // Send the array of quotes as response
        res.json(quotes);
    } catch (error) {
        console.error('Error fetching quotes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
