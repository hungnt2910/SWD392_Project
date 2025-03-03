import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./OrderList.css";

interface Order {
  name: string;
  trackingId: number;
  date: string;
  status: "Approved" | "Pending" | "Delivered";
}

const createData = (name: string, trackingId: number, date: string, status: "Approved" | "Pending" | "Delivered"): Order => {
  return { name, trackingId, date, status };
};

const rows: Order[] = [
  createData("Lasania Chiken Fri", 18908424, "2 March 2022", "Approved"),
  createData("Big Baza Bang", 18908424, "2 March 2022", "Pending"),
  createData("Mouth Freshner", 18908424, "2 March 2022", "Approved"),
  createData("Cupcake", 18908421, "2 March 2022", "Delivered"),
];

const makeStyle = (status: "Approved" | "Pending" | "Delivered"): React.CSSProperties => {
  switch (status) {
    case "Approved":
      return {
        background: "rgb(145 254 159 / 47%)",
        color: "green",
      };
    case "Pending":
      return {
        background: "#ffadad8f",
        color: "red",
      };
    case "Delivered":
    default:
      return {
        background: "#59bfff",
        color: "white",
      };
  }
};

const OrderList: React.FC = () => {
  return (
    <div className="Table">
      <h3>Recent Orders</h3>
      <TableContainer component={Paper} style={{ boxShadow: "0px 13px 20px 0px #80808029" }}>
        <Table sx={{ minWidth: 850 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="left">Tracking ID</TableCell>
              <TableCell align="left">Date</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ color: "white" }}>
            {rows.map((row) => (
              <TableRow key={row.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="left">{row.trackingId}</TableCell>
                <TableCell align="left">{row.date}</TableCell>
                <TableCell align="left">
                  <span className="status" style={makeStyle(row.status)}>{row.status}</span>
                </TableCell>
                <TableCell align="left" className="Details">Details</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default OrderList;
