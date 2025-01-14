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
    <Card className="w-full max-w-6xl mx-auto p-6 bg-blue-950 rounded-xl shadow-lg shadow-blue-900/20 border border-blue-800/50">
      <div className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
        Transaction History
      </div>
      <Table>
        <TableHead className="border-b-2 border-blue-800/50">
          <TableRow className="bg-blue-900/50 rounded-lg">
            <TableHeaderCell className="text-blue-300">Date</TableHeaderCell>
            <TableHeaderCell className="text-blue-300">Amount (BTC)</TableHeaderCell>
            <TableHeaderCell className="text-blue-300">Price (USD)</TableHeaderCell>
            <TableHeaderCell className="text-blue-300">Price (EUR)</TableHeaderCell>
            <TableHeaderCell className="text-blue-300">Total (USD)</TableHeaderCell>
            <TableHeaderCell className="text-blue-300">Total (EUR)</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction, index) => (
            <TableRow 
              key={index}
              className="border-b border-blue-800/30 hover:bg-blue-900/30 transition-colors"
            >
              <TableCell className="font-medium text-blue-200">
                {new Date(transaction.date).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-blue-100">{transaction.amount.toFixed(2)}</TableCell>
              <TableCell className="text-blue-100">${transaction.priceUSD.toLocaleString()}</TableCell>
              <TableCell className="text-blue-100">€{transaction.priceEUR.toLocaleString()}</TableCell>
              <TableCell className="text-blue-100">${transaction.totalUSD.toLocaleString()}</TableCell>
              <TableCell className="text-blue-100">€{transaction.totalEUR.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
} 