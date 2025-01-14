import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import { BitcoinTransaction } from "../types";

interface TransactionTableProps {
  transactions: BitcoinTransaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <Card className="w-full max-w-6xl mx-auto p-4 bg-blue-950">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Amount (BTC)</TableHeaderCell>
            <TableHeaderCell>Price (USD)</TableHeaderCell>
            <TableHeaderCell>Price (EUR)</TableHeaderCell>
            <TableHeaderCell>Total (USD)</TableHeaderCell>
            <TableHeaderCell>Total (EUR)</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction, index) => (
            <TableRow key={index}>
              <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
              <TableCell>{transaction.amount.toFixed(2)}</TableCell>
              <TableCell>${transaction.priceUSD.toLocaleString()}</TableCell>
              <TableCell>€{transaction.priceEUR.toLocaleString()}</TableCell>
              <TableCell>${transaction.totalUSD.toLocaleString()}</TableCell>
              <TableCell>€{transaction.totalEUR.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
} 