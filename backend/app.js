import fs from 'node:fs/promises';

import bodyParser from 'body-parser';
import express from 'express';

const app = express();
const ECB_DAILY_RATES_URL =
  'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';
const EXCHANGE_RATE_CACHE_MS = 60 * 60 * 1000;
let cachedExchangeRates = null;

app.use(bodyParser.json());
app.use(express.static('public'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

async function getExchangeRates() {
  if (
    cachedExchangeRates &&
    Date.now() - cachedExchangeRates.fetchedAt < EXCHANGE_RATE_CACHE_MS
  ) {
    return cachedExchangeRates.data;
  }

  const response = await fetch(ECB_DAILY_RATES_URL);

  if (!response.ok) {
    throw new Error('Could not fetch ECB exchange rates.');
  }

  const xml = await response.text();
  const dateMatch = xml.match(/time=['"](\d{4}-\d{2}-\d{2})['"]/);
  const rateEntries = [...xml.matchAll(/currency=['"]([A-Z]{3})['"]\s+rate=['"]([\d.]+)['"]/g)];

  if (!dateMatch || rateEntries.length === 0) {
    throw new Error('Could not parse ECB exchange rates.');
  }

  const rates = { EUR: 1 };

  for (const [, currencyCode, rate] of rateEntries) {
    rates[currencyCode] = Number(rate);
  }

  const exchangeRateData = {
    baseCurrency: 'EUR',
    date: dateMatch[1],
    rates,
  };

  cachedExchangeRates = {
    data: exchangeRateData,
    fetchedAt: Date.now(),
  };

  return exchangeRateData;
}

app.get('/meals', async (req, res) => {
  const meals = await fs.readFile('./data/available-meals.json', 'utf8');
  res.json(JSON.parse(meals));
});

app.get('/exchange-rates', async (req, res) => {
  try {
    const exchangeRateData = await getExchangeRates();
    res.json(exchangeRateData);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Could not load exchange rates.' });
  }
});

app.post('/orders', async (req, res) => {
  const orderData = req.body.order;
  if (orderData === null || orderData.items === null || orderData.items.length === 0) {
    return res
      .status(400)
      .json({ message: 'Missing data.' });
  }

  if (
    orderData.customer.email === null ||
    !orderData.customer.email.includes('@') ||
    orderData.customer.name === null ||
    orderData.customer.name.trim() === '' ||
    orderData.customer.street === null ||
    orderData.customer.street.trim() === '' ||
    orderData.customer['postal-code'] === null ||
    orderData.customer['postal-code'].trim() === '' ||
    orderData.customer.city === null ||
    orderData.customer.city.trim() === ''
  ) {
    return res.status(400).json({
      message:
        'Missing data: Email, name, street, postal code or city is missing.',
    });
  }

  const newOrder = {
    ...orderData,
    id: (Math.random() * 1000).toString(),
  };
  const orders = await fs.readFile('./data/orders.json', 'utf8');
  const allOrders = JSON.parse(orders);
  allOrders.push(newOrder);
  await fs.writeFile('./data/orders.json', JSON.stringify(allOrders));
  res.status(201).json({ message: 'Order created!' });
});

app.use((req, res) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  res.status(404).json({ message: 'Not found' });
});

app.listen(3000);
