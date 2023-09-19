import { useLocation } from 'react-router-dom';
import './index.css'
import { Layout, Card, Select, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Account, GaAccType } from 'types';



function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [accountsWithDiscrepancies, setAccountsWithDiscrepancies] = useState<Account[]>([]);
  const [apiRunning, setApiRunning] = useState(true);
  const location = useLocation();
  const [gaaccountDiscrepancies, setGAAccountDiscrepancies] = useState<GaAccType[]>([]);
  const [dv3accountDiscrepancies, setDV3AccountDiscrepancies] = useState<GaAccType[]>([]);
  const [gcmaccountDiscrepancies, setgcmAccountDiscrepancies] = useState<GaAccType[]>([]);
  const [fbaccountDiscrepancies, setFBAccountDiscrepancies] = useState<GaAccType[]>([]);


useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch data from the API
      const response = await axios.get('/api/calculate-discrepancies-ga');
      // console.log('ga response :', response)
      
      const gaaccountDiscrepancies = response.data;

      // Map over the array and transform each item
      const transformedDiscrepancies = gaaccountDiscrepancies.map(discrepancy => ({
        account_name: discrepancy.account_name,
        impressions_discrepancy: discrepancy.impressions_discrepancy,
        impressions_percent_difference: discrepancy.impressions_percent_difference,
        clicks_discrepancy: discrepancy.clicks_discrepancy,
        clicks_percent_difference: discrepancy.clicks_percent_difference,
        cost_discrepancy_in_dollars: discrepancy.cost_discrepancy_in_dollars,
        cost_percent_difference: discrepancy.cost_percent_difference
      }));

      // Set the transformed discrepancies in state
      setGAAccountDiscrepancies(transformedDiscrepancies);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  fetchData();
}, []);


useEffect(() => {
  const fetchdv3Data = async () => {
    try {
      // Fetch data from the API
      const response = await axios.get('/api/calculate-discrepancies-dv3');
      // console.log('ga response :', response)
      
      const dv3accountDiscrepancies = response.data;

      // Map over the array and transform each item
      const transformedDiscrepancies = dv3accountDiscrepancies.map(discrepancy => ({
        account_name: discrepancy.account_name,
        impressions_discrepancy: discrepancy.impressions_discrepancy,
        impressions_percent_difference: discrepancy.impressions_percent_difference,
        clicks_discrepancy: discrepancy.clicks_discrepancy,
        clicks_percent_difference: discrepancy.clicks_percent_difference,
        cost_discrepancy_in_dollars: discrepancy.cost_discrepancy_in_dollars,
        cost_percent_difference: discrepancy.cost_percent_difference
      }));

      // Set the transformed discrepancies in state
      setDV3AccountDiscrepancies(transformedDiscrepancies);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  fetchdv3Data();
}, []);


useEffect(() => {
  const fetchgcmData = async () => {
    try {
      // Fetch data from the API
      const response = await axios.get('/api/calculate-discrepancies-gcm');
      // console.log('ga response :', response)
      
      const gcmaccountDiscrepancies = response.data;

      // Map over the array and transform each item
      const transformedDiscrepancies = gcmaccountDiscrepancies.map(discrepancy => ({
        account_name: discrepancy.account_name,
        impressions_discrepancy: discrepancy.impressions_discrepancy,
        impressions_percent_difference: discrepancy.impressions_percent_difference,
        clicks_discrepancy: discrepancy.clicks_discrepancy,
        clicks_percent_difference: discrepancy.clicks_percent_difference,
        cost_discrepancy_in_dollars: discrepancy.cost_discrepancy_in_dollars,
        cost_percent_difference: discrepancy.cost_percent_difference
      }));

      // Set the transformed discrepancies in state
      setgcmAccountDiscrepancies(transformedDiscrepancies);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  fetchgcmData();
}, []);

useEffect(() => {
  const fetchfbData = async () => {
    try {
      // Fetch data from the API
      const response = await axios.get('/api/calculate-discrepancies-fb');
      // console.log('ga response :', response)
      
      const fbaccountDiscrepancies = response.data;

      // Map over the array and transform each item
      const transformedDiscrepancies = fbaccountDiscrepancies.map(discrepancy => ({
        account_name: discrepancy.account_name,
        impressions_discrepancy: discrepancy.impressions_discrepancy,
        impressions_percent_difference: discrepancy.impressions_percent_difference,
        clicks_discrepancy: discrepancy.clicks_discrepancy,
        clicks_percent_difference: discrepancy.clicks_percent_difference,
        cost_discrepancy_in_dollars: discrepancy.cost_discrepancy_in_dollars,
        cost_percent_difference: discrepancy.cost_percent_difference
      }));

      // Set the transformed discrepancies in state
      setFBAccountDiscrepancies(transformedDiscrepancies);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  fetchfbData();
}, []);


  return (
    <div style={{ display: 'flex' }}>
      <div style={{ marginRight: '25px' }}>
      {/* Separate Card for Account Names */}
      <Card title="GA Accounts with Discrepancies" style={{ width: 300, marginTop: '20px' }}>
  {isLoading ? (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <Spin size="small" />
      <p>Loading...</p>
    </div>
  ) : (
    <ul>
    <h3>Total Accounts with Discrepancies: {gaaccountDiscrepancies.length}</h3>
  {gaaccountDiscrepancies.map((account, index) => (
    <div key={index} style={{ padding: '8px' }}>
      <Link to={`/ga/${account.account_name}`}>
      <p style={{ fontWeight: 'bold' }}>{account.account_name}</p>
      </Link>
      
      <p>Impression Dif Percent: {Math.floor(account.impressions_percent_difference)}%</p>
      
      <p>Clicks Dif Percent: {Math.floor(account.clicks_percent_difference)}%</p>
      
      <p>Cost Dif Percent: {Math.floor(account.cost_percent_difference)}%</p>
    </div>
  ))}
</ul>
  )}
</Card>
</div>
<div style={{ marginRight: '25px' }}>
      {/* Separate Card for Account Names */}
      <Card title="Facebook Accounts with Discrepancies" style={{ width: 300, marginTop: '20px' }}>
  {isLoading ? (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <Spin size="small" />
      <p>Loading...</p>
    </div>
  ) : (
    <ul>
    <h3>Total Accounts with Discrepancies: {fbaccountDiscrepancies.length}</h3>
  {fbaccountDiscrepancies.map((account, index) => (
    <div key={index} style={{ padding: '8px' }}>
            <p style={{ fontWeight: 'bold' }}>
        <Link to={`/facebook/${account.account_name}`}>
          {account.account_name}
        </Link>
        </p>
      
      <p>Impression Dif Percent: {Math.floor(account.impressions_percent_difference)}%</p>
      
      <p>Clicks Dif Percent: {Math.floor(account.clicks_percent_difference)}%</p>
      
      <p>Cost Dif Percent: {Math.floor(account.cost_percent_difference)}%</p>
    </div>
  ))}
</ul>
  )}
</Card>
</div>
      <div style={{ marginRight: '25px' }}>
      {/* Separate Card for Account Names */}
      <Card title="DV360 Accounts with Discrepancies" style={{ width: 300, marginTop: '20px' }}>
  {isLoading ? (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <Spin size="small" />
      <p>Loading...</p>
    </div>
  ) : (
    <ul>
    <h3>Total Accounts with Discrepancies: {dv3accountDiscrepancies.length}</h3>
  {dv3accountDiscrepancies.map((account, index) => (
    <div key={index} style={{ padding: '8px' }}>
      <p style={{ fontWeight: 'bold' }}>{account.account_name}</p>
      
      <p>Impression Dif Percent: {Math.floor(account.impressions_percent_difference)}%</p>
      
      <p>Clicks Dif Percent: {Math.floor(account.clicks_percent_difference)}%</p>
      
      <p>Cost Dif Percent: {Math.floor(account.cost_percent_difference)}%</p>
    </div>
  ))}
</ul>
  )}
</Card>
</div>
<div style={{ marginRight: '25px' }}>
      {/* Separate Card for Account Names */}
      <Card title="GCM Accounts with Discrepancies" style={{ width: 300, marginTop: '20px' }}>
  {isLoading ? (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <Spin size="small" />
      <p>Loading...</p>
    </div>
  ) : (
    <ul>
    <h3>Total Accounts with Discrepancies: {gcmaccountDiscrepancies.length}</h3>
  {gcmaccountDiscrepancies.map((account, index) => (
    <div key={index} style={{ padding: '8px' }}>
      <p style={{ fontWeight: 'bold' }}>{account.account_name}</p>
      
      <p>Impression Dif Percent: {Math.floor(account.impressions_percent_difference)}%</p>
      
      <p>Clicks Dif Percent: {Math.floor(account.clicks_percent_difference)}%</p>
      
      <p>Cost Dif Percent: {Math.floor(account.cost_percent_difference)}%</p>
    </div>
  ))}
</ul>
  )}
</Card>
</div>
    </div>
  );
};

export default Home;