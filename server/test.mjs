import { fetchSpendDataGA, fetchSpendData } from "./authenticate.mjs";

const startDate = '2023-08-01';
const endDate = '2023-08-31';
const accountName = 'Runnings';


async function run() {
    try {
  
      const gaBigQueryData = await fetchSpendDataGA();
      console.log('Google Ads BigQuery Data:', gaBigQueryData);
      const fbBigQueryData = await fetchSpendData();
      console.log('Google Ads BigQuery Data:', fbBigQueryData);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  run();