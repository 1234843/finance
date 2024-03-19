const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

async function getPriceFeed() {
    try {
        const source = 'https://dolarhoy.com/';
        const { data } = await axios.get(source);
        const $ = cheerio.load(data);
        const elementsSelect = "#home_0 > div.modulo.modulo_bloque > section > div > div > div > div.tile.is-parent.is-9.cotizacion.is-vertical > div > div.tile.is-parent.is-5 > div > div.values > div.compra > div.val";
        const elementsSelect1 = "#home_0 > div.modulo.modulo_bloque > section > div > div > div > div.tile.is-parent.is-9.cotizacion.is-vertical > div > div.tile.is-parent.is-5 > div > div.values > div.venta > div.val";
        const buyPrices = [];
        const sellPrices = [];
        $(elementsSelect).each((index, element) => {
            const buyPrice = $(element).text().trim();
            buyPrices.push(buyPrice);
        });
        $(elementsSelect1).each((index, element) => {
            const sellPrice = $(element).text().trim();
            sellPrices.push(sellPrice);
        });
        return { buyPrices, sellPrices, source };
    } catch (error) {
        console.error('Error fetching Dólar Blue prices:', error);
        throw error; // Throw error to handle it in the calling function
    }
}
async function getPriceFeed1() {
    try {
        const source = 'https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB';
        const { data } = await axios.get(source);
        const $ = cheerio.load(data);
        const elementsSelect = "#market-scrll-1 > tbody > tr > td.buy > a > div > div.buy-value";
        const elementsSelect1 = "#market-scrll-1 > tbody > tr > td.sell > a > div > div.sell-value";
        const buyPrices = [];
        const sellPrices = [];
        $(elementsSelect).each((index, element) => {
            const buyPrice = $(element).text().trim();
            buyPrices.push(buyPrice);
        });
        $(elementsSelect1).each((index, element) => {
            const sellPrice = $(element).text().trim();
            sellPrices.push(sellPrice);
        });
        return { buyPrices, sellPrices, source };
    } catch (error) {
        console.error('Error fetching Dólar Blue prices:', error);
        throw error; // Throw error to handle it in the calling function
    }
}

// Define endpoint for /quotes
app.get('/quotes', async (req, res) => {
    try {
        // Fetch data from both sources
        const data1 = await getPriceFeed();
        const data2 = await getPriceFeed1();
        
        // Send the data as response
        res.json([data1, data2]);
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Define endpoint for /average
app.get('/average', async (req, res) => {
    try {
        // Fetch data from both sources
        const data1 = await getPriceFeed();
        const data2 = await getPriceFeed1();

        // Calculate average buy price
        const buyPrices = [...data1.buyPrices.map(price => parseFloat(price.slice(1))), ...data2.buyPrices.map(price => parseFloat(price.slice(1)))];
        const averageBuyPrice = buyPrices.reduce((acc, price) => acc + price, 0) / buyPrices.length;

        // Calculate average sell price
        const sellPrices = [...data1.sellPrices.map(price => parseFloat(price.slice(1))), ...data2.sellPrices.map(price => parseFloat(price.slice(1)))];
        const averageSellPrice = sellPrices.reduce((acc, price) => acc + price, 0) / sellPrices.length;

        // Send the calculated averages as response
        res.json({
            average_buy_price: averageBuyPrice.toFixed(2),
            average_sell_price: averageSellPrice.toFixed(2)
        });
    } catch (error) {
        // Handle errors
        console.error('Error calculating average:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
