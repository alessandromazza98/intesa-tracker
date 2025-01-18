import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@tremor/react';
import { BitcoinTransaction } from '../types';

interface TransactionTableProps {
  transactions: BitcoinTransaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <Card className="bg-blue-950 rounded-xl shadow-lg shadow-blue-900/20 border border-blue-800/50 p-3 md:p-6 overflow-x-auto">
      <div className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 px-2">
        Transaction History
      </div>
      <div className="min-w-[600px]">
        <Table>
          <TableHead className="border-b-2 border-blue-800/50">
            <TableRow className="bg-blue-900/50 rounded-lg">
              <TableHeaderCell className="text-blue-300 text-sm md:text-base">Date</TableHeaderCell>
              <TableHeaderCell className="text-blue-300 text-sm md:text-base">
                Amount (BTC)
              </TableHeaderCell>
              <TableHeaderCell className="text-blue-300 text-sm md:text-base">
                Price (USD)
              </TableHeaderCell>
              <TableHeaderCell className="text-blue-300 text-sm md:text-base">
                Price (EUR)
              </TableHeaderCell>
              <TableHeaderCell className="text-blue-300 text-sm md:text-base">
                Total (USD)
              </TableHeaderCell>
              <TableHeaderCell className="text-blue-300 text-sm md:text-base">
                Total (EUR)
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow
                key={index}
                className="border-b border-blue-800/30 hover:bg-blue-900/30 transition-colors"
              >
                <TableCell className="font-medium text-blue-200 text-sm md:text-base">
                  {new Date(transaction.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-blue-100 text-sm md:text-base">
                  {transaction.amount.toFixed(2)}
                </TableCell>
                <TableCell className="text-blue-100 text-sm md:text-base">
                  ${transaction.priceUSD.toLocaleString()}
                </TableCell>
                <TableCell className="text-blue-100 text-sm md:text-base">
                  €{transaction.priceEUR.toLocaleString()}
                </TableCell>
                <TableCell className="text-blue-100 text-sm md:text-base">
                  ${transaction.totalUSD.toLocaleString()}
                </TableCell>
                <TableCell className="text-blue-100 text-sm md:text-base">
                  €{transaction.totalEUR.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
