import { useState, useEffect } from 'react';
import axios from 'axios';
import Home from './Home.tsx';
import './index.css'
import 'react-datepicker/dist/react-datepicker.css'; // Import the styles
import Header from './Header.tsx';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Facebook from './Facebook.tsx';
import Ga from './Ga.tsx';



function App() {

  const [accountNames, setAccountNames] = useState('');
  const [accountNamesGA, setGAAccountNames] = useState('');
  console.log('ga account names',accountNamesGA)
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  // const [showReport, setShowReport] = useState(false);
  
  
  useEffect(() => {
    // Check local storage for saved account names
    const savedAccountNames = localStorage.getItem('accountNames');

    if (savedAccountNames) {
      setAccountNames(JSON.parse(savedAccountNames));
    } else {
      // Fetch account names from API
      fetchAccountNamesFromTable2();
    }
  }, []);

  const fetchAccountNamesFromTable2 = async () => {
    try {
      const response = await axios.get('/api/account-names');
      const fetchedAccountNames = response.data;
      setAccountNames(fetchedAccountNames);
      console.log(fetchedAccountNames)
      localStorage.setItem('accountNames', JSON.stringify(fetchedAccountNames));
    } catch (error) {
      console.error('Error fetching account names:', error);
    }
  };

  useEffect(() => {
    // Check local storage for saved account names
    const savedGAAccountNames = localStorage.getItem('accountNamesGA');

    if (savedGAAccountNames) {
      setGAAccountNames(JSON.parse(savedGAAccountNames));
    } else {
      // Fetch account names from API
      fetchGAAccountNames();
    }
  }, []);

  const fetchGAAccountNames = async () => {
    try {
      const response = await axios.get('/api/account-names-ga');
      console.log(response)
      const fetchedGAAccountNames = response.data;
      console.log(fetchedGAAccountNames)
      setGAAccountNames(fetchedGAAccountNames);
      localStorage.setItem('accountNamesGA', JSON.stringify(fetchedGAAccountNames));
    } catch (error) {
      console.error('Error fetching account names:', error);
    }
  };


  return (
    <Router>
        {/* <Header/> */}
        <Header/>
        
        <Routes>
          <Route path="/" element={<Home/>}>
          </Route>
          <Route path="/facebook/:accountName" element= {<Facebook accountNames={accountNames}/>}>
           </Route>
          <Route path="/facebook" element={<Facebook accountNames={accountNames} />} />
          <Route path="/ga" element={<Ga accountNamesGA={accountNamesGA} />} />
          <Route path="/ga/:accountNameGA" element={<Ga accountNamesGA={accountNamesGA} />} />

        </Routes>
        
        

    </Router>
    

  );
}

export default App;