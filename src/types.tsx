// types.ts
export interface TableDataType {
    id: string;
    account_id: string,
    date: {
      value: string;
    };
    account_name: string;
    clicks: number;
    spend: number;
    imps: number;
    // ... other properties
  }
  
  export interface OtherTableDataType {
    // Define the structure of the data for the other table
    // ...
    id: string;
    account_id: string,
    date_start: {
      value: string;
    };
    account_name: string;
    clicks: number;
    spend: number;
    impressions: number;
  }
  
  export type GaAccType = {

    account_name: string,
    impressions_discrepancy: number,
    impressions_percent_difference: number,
    clicks_discrepancy: number,
    clicks_percent_difference: number,
    cost_discrepancy_in_dollars: number,
    cost_percent_difference: number
  }

  export interface Account {
    accountName: string;
    table1Metrics: {
      clicks: number;
      spend: number;
      impressions: number;
    };
    table2Metrics: {
      clicks: number;
      spend: number;
      impressions: number;
    };
  }

  export interface GAradarTableDataType {
    id: string;
    descriptive_name: string;
    clicks: number;
    cost_micros: number;
    impressions: number;
    // ... other properties
  }
  
  export interface GAimpOtherTableDataType {
    // Define the structure of the data for the other table
    // ...
    id: string;
    account_name: string;
    clicks: number;
    cost: number;
    impressions: number;
  }
  