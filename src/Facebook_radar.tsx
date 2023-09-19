import React from 'react';
import { OtherTableDataType } from './types';
import './Table.css';

interface Table2ComponentProps {
  tableData: OtherTableDataType[];
}

function Facebook_radar({ tableData }: Table2ComponentProps) {
  const sumClicks = tableData.reduce((totalClicks, item) => totalClicks + item.clicks, 0);
  const limitedTableData = tableData.slice(0, 10);

  return (
    <div>
        {/* <p>Total Clicks: {sumClicks}</p> */}
      <table>
        <thead>
          <tr>
            
            <th>Acct ID</th>
            <th>Date</th>
            <th>Account</th>
            <th>Clicks</th>
            <th>Spend</th>
            <th>Imp.</th>
          </tr>
        </thead>
        <tbody>
          {limitedTableData.map(item => (
            <tr key={item.id}>
                <td>{item.account_id}</td>
              <td>{item.date_start.value}</td>
              <td>{item.account_name}</td>
              <td>{item.clicks}</td>
              <td>{item.spend}</td>
              <td>{item.impressions}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
}

export default Facebook_radar;
