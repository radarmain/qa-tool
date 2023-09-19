
import { useState, useEffect } from 'react';
import axios from 'axios';
import Facebook_imp from './Facebook_imp.tsx';
import Facebook_radar from './Facebook_radar.tsx';
import { TableDataType, OtherTableDataType } from './types.tsx';
import './index.css'
import { Layout,DatePicker, Button, Alert, Select } from 'antd'; // Import the required components from Ant Design
import AccountSelect from './AccountSelect.tsx';
import { useParams } from 'react-router-dom';


const { Content } = Layout;
const { Option } = Select;

  function Facebook({ accountNames }){
  
    const handleStartDateChange = date => {
        // console.log('Start Date:', date); // Log the object returned by the DatePicker
        // console.log('Start Date (stringified):', JSON.stringify(date, null, 2)); // Detailed breakdown
        setStartDate(date);
      };
    
      const handleEndDateChange = date => {
        // console.log('End Date:', date); // Log the object returned by the DatePicker
        // console.log('End Date (stringified):', JSON.stringify(date, null, 2)); // Detailed breakdown
        setEndDate(date);
      };
      const handleAccountChange = value => {
        setSelectedAccount(value);
      };
  
    const [table1Data, setTable1Data] = useState<Array<TableDataType>>([]);
    const [table2Data, setTable2Data] = useState<Array<OtherTableDataType>>([]);
    const [isLoading, setIsLoading] = useState(false);
    // const [accountNames, setAccountNames] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [showReport, setShowReport] = useState(false);


    const formatDateForServer = dateObj => {
        const year = dateObj.$y;
        const month = String(dateObj.$M + 1).padStart(2, '0');
        const day = String(dateObj.$D).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
    
    
    
    
    const toggleReport = () => {
      setShowReport(!showReport);
    };
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const formattedStartDate = formatDateForServer(startDate);
        const formattedEndDate = formatDateForServer(endDate);
        const response = await axios.get('/api/fetch-data', {
          params: {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            accountName: selectedAccount,
          },
        });
        
  
        // Separate the data from each table in the response
        // const { table1Data, table2Data } = response.data;
        // console.log(response.data)
        const [table1Data, table2Data] = response.data
  
        // Update the state for both tables
        setTable1Data(table1Data);
        setTable2Data(table2Data);
        if (sumClicksTable1 !== sumClicksTable2) {
          setShowReport(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    // Calculate the sum of clicks in table2Data
    const sumClicksTable1 = table1Data.reduce((totalClicks, item) => totalClicks + item.clicks, 0);
    const sumClicksTable2 = table2Data.reduce((totalClicks, item) => totalClicks + item.clicks, 0);
    const sumSpendTable1 = table1Data.reduce((totalSpend, item) => totalSpend + item.spend, 0);
    const sumSpendTable2 = table2Data.reduce((totalSpend, item) => totalSpend + item.spend, 0);

    // Calculate the sum of imps in table2Data
    const sumImpsTable1 = table1Data.reduce((totalImps, item) => totalImps + item.imps, 0);
    const sumImpsTable2 = table2Data.reduce((totalImps, item) => totalImps + item.impressions, 0);
    const { accountName } = useParams();
    console.log('accountNamesFAcebook:', accountName);

    useEffect(() => {
        if (accountName) {
          setSelectedAccount(accountName);
        }
      }, [accountName]);


    return(
        <Layout>
      <Content>
        <div className='pickers'>
          <label>
            Start Date:
            <DatePicker value={startDate} onChange={handleStartDateChange} />
          </label>
          <label>
            End Date:
            <DatePicker value={endDate} onChange={handleEndDateChange} />
          </label>
          Account Name
          {/* {isLoading ? (
              <p>Loading account names...</p>
            ) : ( */}
                
                <AccountSelect
                accountNames={accountNames}
                selectedAccount={selectedAccount}
                handleAccountChange={handleAccountChange}
              />
              
            {/* )} */}
        

        <Button className='submit-button' type="primary" onClick={fetchData}>Submit</Button>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
            <div>
            {/* Report section */}
            {sumClicksTable1 !== sumClicksTable2 && (
              <Alert
                message="Clicks Mismatch"
                description={
                  <>
                    <p>Radar Data: {sumClicksTable1} clicks</p>
                    <p>Improvado Data: {sumClicksTable2} clicks</p>
                  </>
                }
                type="error"
                showIcon
                closable
                onClose={toggleReport}
              />
                  )}
                  {/* Spend Mismatch Alert */}
            {sumSpendTable1 !== sumSpendTable2 && (
              <Alert
                message="Spend Mismatch"
                description={
                  <>
                    <p>Radar Data: {sumSpendTable1} spend</p>
                    <p>Improvado Data: {sumSpendTable2} spend</p>
                  </>
                }
                type="error"
                showIcon
                closable
                onClose={toggleReport}
              />
            )}

            {/* Imps Mismatch Alert */}
            {sumImpsTable1 !== sumImpsTable2 && (
              <Alert
                message="Impressions Mismatch"
                description={
                  <>
                    <p>Radar Data: {sumImpsTable2} impressions</p>
                    <p>Improvado Data: {sumImpsTable1} impressions</p>
                  </>
                }
                type="error"
                showIcon
                closable
                onClose={toggleReport}
              />
            )}
  
                  {/* Side-by-side tables */}
                  <div style={{ display: 'flex', marginLeft: '30px' }}>
                    <div style={{ flex: 1, marginRight: '30px' }}>
                      <h3>Radar Data</h3>
                      <Facebook_radar tableData={table1Data} />
                    </div>
                    <div style={{ flex: 1, marginLeft: '50px' }}>
                      <h3>Improvado Data</h3>
                      <Facebook_imp tableData={table2Data} />
                    </div>
                  </div>
                </div>
              )}
            </Content>
    </Layout>
    )
}
export default Facebook;