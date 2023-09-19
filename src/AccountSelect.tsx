import React from 'react';
import { Select } from 'antd';
import './index.css'

const { Option } = Select;

function AccountSelect({ accountNames, selectedAccount, handleAccountChange }) {


    
  return (
    <div>
    {accountNames.length > 0 ? (
      <Select
        showSearch
        style={{ width: 300 }}
        placeholder="Select an account"
        value={selectedAccount}
        onChange={handleAccountChange}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {accountNames.map(accountName => (
          <Option key={accountName} value={accountName}>
            {accountName}
          </Option>
        ))}
      </Select>
    ) : (
      <p>Loading account names...</p>
    )}
  </div>
);
    }

export default AccountSelect;
