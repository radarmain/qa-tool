import { BigQuery } from '@google-cloud/bigquery';
import path from 'path';
import { fileURLToPath } from 'url';
import { MetricsType } from 'types';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const keyFilename = path.join(__dirname, 'radar-377104-dad742fdcccc.json');

// Create a new instance of the BigQuery client with authentication
const bigquery = new BigQuery({
  projectId: 'radar-377104', // Your Google Cloud Project ID here!
  keyFilename,
});



export async function fetchBigQueryDataWithMetrics() {
    // Get the current date
    const currentDate = new Date();
    const { startDt, endDate, accountName } = data;
  
    // Set the start date to the first day of the current year
    // const startYear = currentDate.getFullYear();
    // const startDate = new Date(startYear, 0, 1);
  
    // Set the end date to two days prior to the current day
    const endDt = new Date();
    endDt.setDate(currentDate.getDate() - 2);
  
    const queryTable1 = `
      SELECT *
      FROM \`radar-377104.api_connection.FACEBOOK_QA\`
      WHERE date_start BETWEEN '${startDt}' AND '${endDate}'
      AND account_name = "${accountName}"
    `;
  
    const queryTable2 = `
      SELECT clicks, spend, account_name, date, account_id, imps
      FROM \`radar-377104.radardata.facebook_ads_placements\`
      WHERE date BETWEEN '${startDt}' AND '${endDate}'
      AND account_name = "${accountName}"
    `;
  
    const options = {
      location: 'US',
    };
  
    const [rowsTable1, rowsTable2] = await Promise.all([
      bigquery.query({ ...options, query: queryTable1 }),
      bigquery.query({ ...options, query: queryTable2 }),
    ]);
  
    // Calculate metrics for Table 1 data
    const table1Metrics = calculateMetrics(rowsTable1);
  
    // Calculate metrics for Table 2 data
    const table2Metrics = calculateMetrics(rowsTable2);
  
    // Combine fetched data and metrics
    const combinedData = {
      table1Data: rowsTable1,
      table2Data: rowsTable2,
      table1Metrics,
      table2Metrics,
    };
  
    return combinedData;
  }
  
  // Example metrics calculation function
  export function calculateMetrics(data) {
    const clicks = data.reduce((total, item) => total + item.clicks, 0);
    const spend = data.reduce((total, item) => total + item.spend, 0);
    const impressions = data.reduce((total, item) => total + item.imps, 0);
  
    return { clicks, spend, impressions };
  }


  export async function fetchAccountNamesFromTable2() {
    const query = `
      SELECT DISTINCT account_name
      FROM \`radar-377104.radardata.facebook_ads_placements\`
    `;
    // console.log('Executing Query for Improvado:', query);
    
    const options = {
      location: 'US',
    };
  
    try {
      const [rows] = await bigquery.query({ ...options, query });
      // console.log('Rows from accounts:', rows);
      return rows.map(row => row.account_name);
      
    } catch (error) {
      console.error('Error fetching account names:', error);
      return [];
    }
  }