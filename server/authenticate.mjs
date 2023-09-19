import { BigQuery } from '@google-cloud/bigquery';
import path from 'path';
import { fileURLToPath } from 'url';
import NodeCache from 'node-cache'
const cache = new NodeCache({ stdTTL: 12 * 60 * 60 });

// Replace with the path to your service account JSON key file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const keyFilename = path.join(__dirname, 'radar-377104-dad742fdcccc.json');
// const logFilePath = 'qa_tool_log.txt'
// const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// Create a new instance of the BigQuery client with authentication
const bigquery = new BigQuery({
  projectId: 'radar-377104', // Your Google Cloud Project ID here!
  keyFilename,
});

// Your API route or function for fetching BigQuery data
export async function fetchBigQueryData(startDate, endDate, accountName) {
  const queryTable1 = `
    SELECT *
    FROM \`radar-377104.api_connection.FACEBOOK_QA\`
    WHERE date_start BETWEEN '${startDate}' AND '${endDate}'
    AND account_name = "${accountName}"
  `;

  const queryTable2 = `
    SELECT clicks,spend,account_name, date,account_id,imps
    FROM \`radar-377104.radardata.facebook_ads_placements\`
    WHERE date BETWEEN '${startDate}' AND '${endDate}'
    AND account_name = "${accountName}"
  `;
  // console.log('Executing Query for Table 1:', queryTable1);
  // console.log('Executing Query for Table 2:', queryTable2);

  const options = {
    location: 'US',
  };

  const [rowsTable1, rowsTable2] = await Promise.all([
    bigquery.query({ ...options, query: queryTable1 }),
    bigquery.query({ ...options, query: queryTable2 }),
  ]);
  // console.log('Rows from Table 1:', rowsTable1);
  // console.log('Rows from Table 2:', rowsTable2);

  return [...rowsTable1, ...rowsTable2];
}

export async function fetchGABigQueryData(startDate, endDate, accountName) {
  const queryTable1 = `
    SELECT descriptive_name,impressions,clicks,CAST(cost_micros / 1000000 AS FLOAT64) AS cost_micros
    FROM \`radar-377104.api_connection.google_ads_reports\`
    WHERE segments_date BETWEEN '${startDate}' AND '${endDate}'
    AND descriptive_name = "${accountName}"
  `;

  const queryTable2 = `
    SELECT account_name, impressions,cost,clicks
    FROM \`radar-377104.radardata.google_ads_ads\`
    WHERE date BETWEEN '${startDate}' AND '${endDate}'
    AND account_name = "${accountName}"
  `;
  // console.log('Executing Query for Table 1:', queryTable1);
  // console.log('Executing Query for Table 2:', queryTable2);

  const options = {
    location: 'US',
  };

  const [rowsTable1, rowsTable2] = await Promise.all([
    bigquery.query({ ...options, query: queryTable1 }),
    bigquery.query({ ...options, query: queryTable2 }),
  ]);
  console.log('Rows from Table 1:', rowsTable1);
  // console.log('Rows from Table 2:', rowsTable2);

  return [...rowsTable1, ...rowsTable2];
}

// Export the function for use in your API route or other parts of your code
// module.exports = {  };


// Fetch distinct account names from Table 2
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

export async function fetchSpendData() {
  const query = `
  SELECT DISTINCT account_name
  FROM \`radar-377104.radardata.facebook_ads_placements\`
  WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 4 MONTH) AND spend > 0;
  
`;
  // console.log('Executing Query for spend data from improvado:', query);

  const options = {
    query,
    location: 'US',
    // params: {
    //   accountName, // Use the parameter name here
    // },
  };

  try {
    const [rows] = await bigquery.query(options);
    // console.log('Rows from accounts:', rows);
    return rows.map(row => ({
      accountName: row.account_name,
    }));
  } catch (error) {
    console.error('Error fetching spend data:', error);
    throw error;
  }
}




export async function fetchBigQueryDataWithMetrics(accountName) {
  const currentDate = new Date();
  const startYear = currentDate.getFullYear();
  const startDate = new Date(startYear, 0, 1);
  const endDt = new Date(currentDate);
  endDt.setDate(currentDate.getDate() - 2);
  const startDateFormatted = formatDate(startDate);
  const endDateFormatted = formatDate(endDt);

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const cacheKey = `${accountName}-${startDateFormatted}-${endDateFormatted}`;

  // Check if data is in cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log('Using cached data for', cacheKey);
    return cachedData;
  }

  const queryTable1 = `
    SELECT clicks, spend, account_name, date_start, impressions
    FROM \`radar-377104.api_connection.fb_reports\`
    WHERE date_start BETWEEN '${startDateFormatted}' AND '${endDateFormatted}'
    AND account_name = "${accountName}"
  `;

  const queryTable2 = `
    SELECT clicks, spend, account_name, date, account_id, imps
    FROM \`radar-377104.radardata.facebook_ads_placements\`
    WHERE date BETWEEN '${startDateFormatted}' AND '${endDateFormatted}'
    AND account_name = "${accountName}"
  `;

  const options = {
    location: 'US',
  };

  const [rowsTable1, rowsTable2] = await Promise.all([
    bigquery.query({ ...options, query: queryTable1 }),
    bigquery.query({ ...options, query: queryTable2 }),
  ]);

  const table1Metrics = calculateMetrics(rowsTable1);
  

  const table2Metrics = calculateMetrics(rowsTable2);
  

  const combinedData = {
    table1Data: rowsTable1,
    table2Data: rowsTable2,
    table1Metrics,
    table2Metrics,
  };

  // Store the data in the cache
  cache.set(cacheKey, combinedData);

  return combinedData;
}


// Example metrics calculation function
export function calculateMetrics(data) {
  // Initialize variables to accumulate values
  let clicks = 0;
  let spend = 0;
  let impressions = 0;

  // Iterate through the outer list
  for (const outerItem of data) {
    // Check if the outer item is an array (inner list)
    if (Array.isArray(outerItem)) {
      // Iterate through the inner list
      for (const innerItem of outerItem) {
        // Ensure that each inner item has the expected fields and that they are numeric
        if (
          typeof innerItem.clicks === 'number' &&
          typeof innerItem.spend === 'number'
        ) {
          // Add valid numeric values to the accumulators
          clicks += innerItem.clicks;
          spend += innerItem.spend;

          // Check if the data contains either 'imps' or 'impressions'
          if ('imps' in innerItem) {
            impressions += innerItem.imps;
          } else if ('impressions' in innerItem) {
            impressions += innerItem.impressions;
          } else {
            // Handle cases where the data is missing both 'imps' and 'impressions'
            console.error('Missing impressions data for item:', innerItem);
          }
        } else {
          // Handle cases where the data is not as expected (e.g., missing or non-numeric values)
          console.error('Invalid data for inner item:', innerItem);
        }
      }
    } else {
      // Handle cases where the data is not as expected (outer item is not an array)
      console.error('Invalid data for outer item:', outerItem);
    }
  }

  return { clicks, spend, impressions };
}


export async function fetchSpendDataGA() {
  const query = `
  SELECT DISTINCT account_name
  FROM \`radar-377104.radardata.google_ads_ads\`
  WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 4 MONTH) AND cost > 0;
  
`;
  // console.log('Executing Query for spend data from improvado:', query);

  const options = {
    query,
    location: 'US',
    // params: {
    //   accountName, // Use the parameter name here
    // },
  };

  try {
    const [rows] = await bigquery.query(options);
    // console.log('Rows from accounts:', rows);
    return rows.map(row => ({
      accountName: row.account_name,
    }));
  } catch (error) {
    console.error('Error fetching spend data:', error);
    throw error;
  }
}

export async function calculateGADiscrepancies() {
  try {
    console.log('Starting GA calculations...');

    // Construct a dynamic SQL query to calculate discrepancies for the provided account names
    const query = `
    WITH AccountNames AS (
      SELECT DISTINCT account_name
      FROM \`radar-377104.radardata.google_ads_ads\`
      WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 4 MONTH) AND cost > 0
    ),
    
    Metrics AS (
      SELECT
        a.account_name,
        a.total_impressions AS impressions_ads,
        a.total_clicks AS clicks_ads,
        a.total_cost_in_dollars AS cost_ads,
        r.total_impressions AS impressions_reports,
        r.total_clicks AS clicks_reports,
        r.total_cost_in_dollars AS cost_reports
      FROM
        \`radar-377104.radardata.improvado_ga_qa_data\` AS a
      JOIN
        \`radar-377104.api_connection.radar_ga_qa_data\` AS r
      ON
        a.account_name = r.account_name
      
    )
    
    SELECT
      an.account_name,
      m.impressions_reports - m.impressions_ads AS impressions_discrepancy,
      (m.impressions_reports - m.impressions_ads) / m.impressions_ads AS impressions_percent_difference,
      m.clicks_reports - m.clicks_ads AS clicks_discrepancy,
      (m.clicks_reports - m.clicks_ads) / m.clicks_ads AS clicks_percent_difference,
      (m.cost_reports - m.cost_ads) AS cost_discrepancy_in_dollars,
      (m.cost_reports - m.cost_ads) / m.cost_ads AS cost_percent_difference
    FROM
      AccountNames AS an
    JOIN
      Metrics AS m
    ON
      an.account_name = m.account_name;
    
    `;

    // Run the dynamic GBQ query
    const [rows] = await bigquery.query(query);
    // console.log('returned ga data :', rows)

    return rows;
  } catch (error) {
    console.error('Error calculating discrepancies:', error);
    throw error; // Re-throw the error for handling in the calling function
  }
};


export async function calculatedv3Discrepancies() {
  try {
    console.log('Starting DV3 calculations...');

    // Construct a dynamic SQL query to calculate discrepancies for the provided account names
    const query = `
    WITH AccountNames AS (
      SELECT DISTINCT REGEXP_REPLACE(account_name, r'\(MightyHive - Coegi - US\)', '') AS account_name
      FROM \`radar-377104.radardata.dbm_creatives\`
      WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 4 MONTH) AND media_cost_advertiser > 0
    ),
    
    Metrics AS (
      SELECT
        a.account_name,
        a.total_impressions AS impressions_ads,
        a.total_clicks AS clicks_ads,
        a.total_cost_in_dollars AS cost_ads,
        r.total_impressions AS impressions_reports,
        r.total_clicks AS clicks_reports,
        r.total_cost_in_dollars AS cost_reports
      FROM
        \`radar-377104.api_connection.improvado_qa_dv360_data\` AS a
      JOIN
        \`radar-377104.api_connection.radar_dv360_qa_data\` AS r
      ON
        a.account_name = r.account_name
      
    )
    
    SELECT
      an.account_name,
      m.impressions_reports - m.impressions_ads AS impressions_discrepancy,
      (m.impressions_reports - m.impressions_ads) / m.impressions_ads AS impressions_percent_difference,
      m.clicks_reports - m.clicks_ads AS clicks_discrepancy,
      (m.clicks_reports - m.clicks_ads) / m.clicks_ads AS clicks_percent_difference,
      (m.cost_reports - m.cost_ads) AS cost_discrepancy_in_dollars,
      (m.cost_reports - m.cost_ads) / m.cost_ads AS cost_percent_difference
    FROM
      AccountNames AS an
    JOIN
      Metrics AS m
    ON
      an.account_name = m.account_name;
    
    `;

    // Run the dynamic GBQ query
    const [rows] = await bigquery.query(query);
    // console.log('returned ga data :', rows)

    return rows;
  } catch (error) {
    console.error('Error calculating discrepancies:', error);
    throw error; // Re-throw the error for handling in the calling function
  }
};


export async function calculategcmDiscrepancies() {
  try {
    console.log('Starting gcm calculations...');

    // Construct a dynamic SQL query to calculate discrepancies for the provided account names
    const query = `
    WITH AccountNames AS (
      SELECT DISTINCT account_name AS account_name
      FROM \`radar-377104.radardata.google_cm_ads_placement_sites\`
      WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 4 MONTH) AND mediacost > 0
    ),
    
    Metrics AS (
      SELECT
        a.account_name,
        a.total_impressions AS impressions_ads,
        a.total_clicks AS clicks_ads,
        a.total_cost_in_dollars AS cost_ads,
        r.total_impressions AS impressions_reports,
        r.total_clicks AS clicks_reports,
        r.total_cost_in_dollars AS cost_reports
      FROM
        \`radar-377104.api_connection.improvado_gcm_qa_data\` AS a
      JOIN
        \`radar-377104.api_connection.radar_gcm_qa_data\` AS r
      ON
        a.account_name = r.account_name
      
    )
    
    SELECT
      an.account_name,
      m.impressions_reports - m.impressions_ads AS impressions_discrepancy,
      (m.impressions_reports - m.impressions_ads) / m.impressions_ads AS impressions_percent_difference,
      m.clicks_reports - m.clicks_ads AS clicks_discrepancy,
      (m.clicks_reports - m.clicks_ads) / m.clicks_ads AS clicks_percent_difference,
      (m.cost_reports - m.cost_ads) AS cost_discrepancy_in_dollars,
      (m.cost_reports - m.cost_ads) / m.cost_ads AS cost_percent_difference
    FROM
      AccountNames AS an
    JOIN
      Metrics AS m
    ON
      an.account_name = m.account_name;
    
    `;

    // Run the dynamic GBQ query
    const [rows] = await bigquery.query(query);
    // console.log('returned ga data :', rows)

    return rows;
  } catch (error) {
    console.error('Error calculating discrepancies:', error);
    throw error; // Re-throw the error for handling in the calling function
  }
};


export async function calculateFBDiscrepancies() {
  try {
    console.log('Starting facebook calculations...');

    // Construct a dynamic SQL query to calculate discrepancies for the provided account names
    const query = `
    WITH AccountNames AS (
      SELECT DISTINCT account_name
      FROM \`radar-377104.radardata.facebook_ads_placements\`
      WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 4 MONTH) AND spend > 0
    ),
    
    Metrics AS (
      SELECT
        a.account_name,
        a.total_impressions AS impressions_ads,
        a.total_clicks AS clicks_ads,
        a.total_cost_in_dollars AS cost_ads,
        r.total_impressions AS impressions_reports,
        r.total_clicks AS clicks_reports,
        r.total_cost_in_dollars AS cost_reports
      FROM
        \`radar-377104.api_connection.radar_facebook_qa_data\` AS a
      JOIN
        \`radar-377104.api_connection.improvado_facebook_qa_data\` AS r
      ON
        a.account_name = r.account_name

      WHERE
      a.total_impressions != 0
      AND a.total_clicks != 0
      AND a.total_cost_in_dollars != 0
      
    )
    
    SELECT
      an.account_name,
      m.impressions_reports - m.impressions_ads AS impressions_discrepancy,
      (m.impressions_reports - m.impressions_ads) / m.impressions_ads AS impressions_percent_difference,
      m.clicks_reports - m.clicks_ads AS clicks_discrepancy,
      (m.clicks_reports - m.clicks_ads) / m.clicks_ads AS clicks_percent_difference,
      (m.cost_reports - m.cost_ads) AS cost_discrepancy_in_dollars,
      (m.cost_reports - m.cost_ads) / m.cost_ads AS cost_percent_difference
    FROM
      AccountNames AS an
    JOIN
      Metrics AS m
    ON
      an.account_name = m.account_name;
    `;

    // Run the dynamic GBQ query
    const [rows] = await bigquery.query(query);
    // console.log('returned ga data :', rows)

    return rows;
  } catch (error) {
    console.error('Error calculating discrepancies:', error);
    throw error; // Re-throw the error for handling in the calling function
  }
};







