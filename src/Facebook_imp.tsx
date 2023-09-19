import React from 'react';
import { TableDataType } from './types';
import './Table.css';

interface DTProps {
  tableData: TableDataType[];
}

function Facebook_imp({ tableData }: DTProps) {
    const sumClicks = tableData.reduce((totalClicks, item) => totalClicks + item.clicks, 0);
    const limitedTableData = tableData.slice(0, 10);
    const sumImpsTable1 = tableData.reduce((totalImps, item) => totalImps + item.imps, 0);


    return (

  <div>
    {/* <p>Total Clicks: {sumClicks}</p>
    <p>Total imps: {sumImpsTable1}</p> */}
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
              <td>{item.date.value}</td>
              <td>{item.account_name}</td>
              <td>{item.clicks}</td>
              <td>{item.spend}</td>
              <td>{item.imps}</td>
            </tr>
          ))}
        </tbody>
      </table>
    
  </div>
    );
};

export default Facebook_imp;