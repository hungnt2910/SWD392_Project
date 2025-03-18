import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
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
  const [editingVoucherId, setEditingVoucherId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState('');

  const fetchVouchers = async () => {
    try {
      const response = await axios.get(`${portserver}/voucher/get-all`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setVouchers(response.data);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleCreateOrUpdateVoucher = async () => {
    if (Number(discount) < 0) {
      setError('Discount cannot be negative');
      return;
    }
    if (new Date(expirationDate) <= new Date()) {
      setError('Expiration date must be in the future');
      return;
    }

    setError('');

    const voucherData = {
      code,
      discount: Number(discount),
      expirationDate,
    };

    try {
      if (editingVoucherId) {
        await axios.put(`${portserver}/voucher/update/${editingVoucherId}`, voucherData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } else {
        await axios.post(`${portserver}/voucher/create`, voucherData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
      }
      fetchVouchers();
      setCode('');
      setDiscount('');
      setExpirationDate('');
      setEditingVoucherId(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditVoucher = (voucher: Voucher) => {
    setCode(voucher.code);
    setDiscount(voucher.discount);
    setExpirationDate(voucher.expirationDate);
    setEditingVoucherId(voucher.voucherId);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>{editingVoucherId ? 'Update Voucher' : 'Create Voucher'}</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box component="form" sx={{ mb: 2 }}>
        <TextField label="Code" value={code} onChange={(e) => setCode(e.target.value)} sx={{ mr: 2 }} />
        <TextField label="Discount" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} sx={{ mr: 2 }} />
        <TextField label="Expiration Date" type="datetime-local" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} sx={{ mr: 2 }} InputLabelProps={{ shrink: true }} />
        <Button variant="contained" color="primary" onClick={handleCreateOrUpdateVoucher}>{editingVoucherId ? 'Update' : 'Create'}</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Voucher ID</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Expiration Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vouchers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((voucher) => (
              <TableRow key={voucher.voucherId}>
                <TableCell>{voucher.voucherId}</TableCell>
                <TableCell>{voucher.code}</TableCell>
                <TableCell>{voucher.discount}</TableCell>
                <TableCell>{new Date(voucher.expirationDate).toLocaleString()}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleEditVoucher(voucher)}>Update</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={vouchers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default CreateVoucher;
