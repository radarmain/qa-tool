import express from 'express'

import { fetchBigQueryData, fetchAccountNamesFromTable2, fetchSpendData, fetchBigQueryDataWithMetrics, fetchSpendDataGA, calculateGADiscrepancies, calculatedv3Discrepancies, calculategcmDiscrepancies, calculateFBDiscrepancies, fetchGABigQueryData } from './authenticate.mjs'

import cors from 'cors'
import esm from 'express'
import axios from 'axios' 

const app = express();
app.use(cors());
esm(app);

const port = process.env.PORT || 5173;


app.get('*', (req, res) => {
  // Serve the main HTML file for client-side routing
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.get('/api/fetch-data', async (req, res) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const accountName = req.query.accountName;

  try {
    const data = await fetchBigQueryData(startDate, endDate, accountName);
    res.json(data);
  } catch (error) {
    console.error('Error fetching data from BigQuery:', error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});

app.get('/api/fetch-ga-data', async (req, res) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const accountName = req.query.accountName;

  try {
    const data = await fetchGABigQueryData(startDate, endDate, accountName);
    res.json(data);
  } catch (error) {
    console.error('Error fetching data from BigQuery:', error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});

app.get('/api/account-names', async (req, res) => {
  try {
    const accountNames = await fetchSpendData();
    res.json(accountNames);
  } catch (error) {
    console.error('Error fetching account names:', error);
    res.status(500).json({ error: 'An error occurred while fetching account names.' });
  }
});

app.get('/api/account-names-ga', async (req, res) => {
  try {
    const accountNames = await fetchSpendDataGA();
    res.json(accountNames);
    console.log(accountNames)
  } catch (error) {
    console.error('Error fetching account names:', error);
    res.status(500).json({ error: 'An error occurred while fetching account names.' });
  }
});

app.get('/api/fetch-spend', async (req, res) => {
  const accountName = req.query.accountName;

  try {
    const spendData = await fetchSpendData(accountName);

    // Filter spend data for accounts with current spend (within the last 4 months)
    const currentDate = new Date();
    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(currentDate.getMonth() - 4);

    const filteredSpendData = spendData.filter((item) => {
      const itemDate = new Date(item.date); // Assuming there's a date field in spendData
      return itemDate >= fourMonthsAgo;
    });

    res.json(filteredSpendData);
  } catch (error) {
    console.error('Error fetching spend data:', error);
    res.status(500).json({ error: 'An error occurred while fetching spend data.' });
  }
});


app.get('/api/fetch-all-metrics', async (req, res) => {
  try {
    // Fetch the list of account names from the API
    const accountNamesResponse = await fetchSpendData();
    // console.log('Account Names Response Data:', accountNamesResponse);
  
    // Extract the accountName values from the response
    const accountNames = accountNamesResponse.map(response => response.accountName);
    // console.log('Account Names Response Data:', accountNames);
  
    // Loop through the account names and fetch data for each account
    const allMetricsData = [];
  
    for (const accountName of accountNames) {
      let metricsData = await fetchBigQueryDataWithMetrics(accountName);
  
      
        console.log('Metrics data fetched successfully:', metricsData);
        allMetricsData.push(metricsData);
      
    }
  
    res.json(allMetricsData);
  } catch (error) {
    console.error('Error fetching metrics data:', error);
    res.status(500).json({ error: 'An error occurred while fetching metrics data.' });
  }

  function isValidMetricsData(metricsData) {
    // You can define your criteria here, for example:
    // Check if clicks, spend, and impressions are not NaN
    return (
      !isNaN(metricsData.table1Metrics.clicks) &&
      !isNaN(metricsData.table1Metrics.spend) &&
      !isNaN(metricsData.table1Metrics.imps)
    );
  }
  
});

app.get('/api/fetch-metrics/:accountName', async (req, res) => {
  try {
    const accountName = req.params.accountName;
    // console.log('req.params:', req.params);
    // console.log('Fetching metrics data for account:', accountName);
    
    // Fetch metrics data for the specified account using the accountName
    const metricsData = await fetchBigQueryDataWithMetrics(accountName);
    // console.log('Metrics data:', metricsData);

    const response = {
      accountName: accountName,
      table1Metrics: metricsData.table1Metrics,
      table2Metrics: metricsData.table2Metrics,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching metrics data:', error);
    res.status(500).json({ error: 'An error occurred while fetching metrics data.' });
  }
});


app.get('/api/calculate-discrepancies-ga', async (req, res) => {
  try {
    const rows = await calculateGADiscrepancies();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/calculate-discrepancies-dv3', async (req, res) => {
  try {
    const rows = await calculatedv3Discrepancies();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/calculate-discrepancies-gcm', async (req, res) => {
  try {
    const rows = await calculategcmDiscrepancies();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/calculate-discrepancies-fb', async (req, res) => {
  try {
    const rows = await calculateFBDiscrepancies();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});