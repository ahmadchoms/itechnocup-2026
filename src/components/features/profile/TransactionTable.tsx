import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TransactionStatusBadge } from "./TransactionStatusBadge";
import { formatIdDate, formatRupiah } from "@/lib/format";
import type { ProfileTransaction } from "./types";

interface TransactionTableProps {
  transactions: ProfileTransaction[];
  isSeller: boolean;
}

export function TransactionTable({ transactions, isSeller }: TransactionTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-zinc-100 md:block">
      <Table className="text-xs">
        <TableHeader className="bg-[#F7F4EE]">
          <TableRow className="border-b border-zinc-100 hover:bg-transparent">
            <TableHead className="font-bold uppercase tracking-wider text-[#78766B]">
              {isSeller ? "Mitra Pengepul" : "Mitra Penjual"}
            </TableHead>
            <TableHead className="font-bold uppercase tracking-wider text-[#78766B]">
              Kategori / Item
            </TableHead>
            <TableHead className="font-bold uppercase tracking-wider text-[#78766B]">
              Jumlah &amp; Satuan
            </TableHead>
            <TableHead className="font-bold uppercase tracking-wider text-[#78766B]">
              Total Harga
            </TableHead>
            <TableHead className="font-bold uppercase tracking-wider text-[#78766B]">
              Status Transaksi
            </TableHead>
            <TableHead className="text-right font-bold uppercase tracking-wider text-[#78766B]">
              Tanggal
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-zinc-100">
          {transactions.map((tx) => (
            <TableRow key={tx.id} className="transition-colors hover:bg-[#F7F4EE]/50">
              <TableCell className="font-bold text-[#171717]">
                {isSeller
                  ? tx.buyer?.fullName || "Pengepul DaurNusa"
                  : tx.seller?.fullName || "Penjual DaurNusa"}
              </TableCell>
              <TableCell className="font-semibold text-[#6B7B4F]">
                {tx.category?.name || "Limbah Sirkular"}
              </TableCell>
              <TableCell className="text-[#171717]">
                {tx.finalQuantity || 25} {tx.unit || "kg"}
              </TableCell>
              <TableCell className="font-extrabold text-[#171717]">
                {formatRupiah(Number(tx.finalPrice))}
              </TableCell>
              <TableCell>
                <TransactionStatusBadge status={tx.status} />
              </TableCell>
              <TableCell className="text-right font-mono text-[#8A8778]">
                {formatIdDate(tx.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
