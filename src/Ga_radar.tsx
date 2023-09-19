import React from 'react';
import { GAradarTableDataType } from './types';
import './Table.css';

interface DTProps {
  tableData: GAradarTableDataType[];
}

function Ga_radar({ tableData }: DTProps) {
    const sumClicks = tableData.reduce((totalClicks, item) => totalClicks + item.clicks, 0);
    const limitedTableData = tableData.slice(0, 10);
    const sumImpsTable1 = tableData.reduce((totalImps, item) => totalImps + item.impressions, 0);


    return (

  <div>
    {/* <p>Total Clicks: {sumClicks}</p>
    <p>Total imps: {sumImpsTable1}</p> */}
    <table>
        <thead>
          <tr>
            
            
            <th>Account</th>
            <th>Clicks</th>
            <th>Spend</th>
            <th>Imp.</th>
          </tr>
        </thead>
        <tbody>
          {limitedTableData.map(item => (
            <tr key={item.id}>
              <td>{item.descriptive_name}</td>
              <td>{item.clicks}</td>
              <td>{item.cost_micros}</td>
              <td>{item.impressions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    
  </div>
    );
};

export default Ga_radar;