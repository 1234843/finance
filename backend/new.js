const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

async function getPriceFeed() {
    try {
    const siteUrl = 'https://dolarhoy.com/'

    const {data} = await axios({
      method:'GET',
      url: siteUrl,
    })

    const $ = cheerio.load(data)

    const elementsSelect = "#home_0 > div.modulo.modulo_bloque > section > div > div > div > div.tile.is-parent.is-9.cotizacion.is-vertical > div > div.tile.is-parent.is-5 > div > div.values > div.compra > div.val"
    const elementsSelect1 = "#home_0 > div.modulo.modulo_bloque > section > div > div > div > div.tile.is-parent.is-9.cotizacion.is-vertical > div > div.tile.is-parent.is-5 > div > div.values > div.venta > div.val"

    $(elementsSelect).each((parerntIdx,parentElem)=> {
      const tdValue1 = $(parentElem).text().trim();
      const buyPrice = tdValue1;
      console.log('DOLAR BLUE - Buy Price:', buyPrice);
    })
    $(elementsSelect1).each((parerntIdx,parentElem)=> {
      const tdValue2 = $(parentElem).text().trim();
      const buyPrice = tdValue2;
      console.log('DOLAR BLUE - Buy Price:', buyPrice);
    })

    } catch (error) {
        console.error('Error fetching Dólar Blue prices:', error);
    }
}

getPriceFeed();
