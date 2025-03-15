import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { portserver } from '../../../utils/portserver';

interface Voucher {
  voucherId: number;
  code: string;
  discount: number;
  expirationDate: string;
}

const CreateVoucher = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState<number | string>('');
  const [expirationDate, setExpirationDate] = useState('');

  const fetchVouchers = async () => {
    try {
      const response = await axios.get(`${portserver}/voucher/get-all`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log("Fetched Vouchers:", response.data); // Log the response

      setVouchers(response.data);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

 
  
  const handleCreateVoucher = async () => {
    const newVoucher = {
      code,
      discount: Number(discount),
      expirationDate,
    };
  
    try {
      const response = await axios.post(`${portserver}/voucher/create`, newVoucher, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.status === 201) {
        // Fetch the updated list instead of manually appending
        fetchVouchers();
  
        // Clear input fields
        setCode('');
        setDiscount('');
        setExpirationDate('');
      } else {
        console.error('Failed to create voucher');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" component="div" sx={{ mb: 2 }}>
        Create Voucher
      </Typography>
      <Box component="form" sx={{ mb: 2 }}>
        <TextField
          label="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          sx={{ mr: 2 }}
        />
        <TextField
          label="Discount"
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          sx={{ mr: 2 }}
        />
        <TextField
          label="Expiration Date"
          type="datetime-local"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          sx={{ mr: 2 }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button variant="contained" color="primary" onClick={handleCreateVoucher}>
          Create
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Voucher ID</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Expiration Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vouchers.map((voucher) => (
              <TableRow key={voucher.voucherId}>
                <TableCell>{voucher.voucherId}</TableCell>
                <TableCell>{voucher.code}</TableCell>
                <TableCell>{voucher.discount}</TableCell>
                <TableCell>{new Date(voucher.expirationDate).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CreateVoucher;