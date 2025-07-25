import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Generic type for table data
export interface TableColumn<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}

export interface DynamicTableProps<T extends Record<string, any>> {
  data: T[];
  columns: TableColumn<T>[];
  title?: string;
  className?: string;
  emptyMessage?: string;
}

export default function DynamicTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  className = "",
  emptyMessage = "No data available",
}: DynamicTableProps<T>) {
  return (
    <div className={className}>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((column) => (
                <TableHead key={String(column.key)} className="h-9 py-2">
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-4 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={item.id || index}>
                  {columns.map((column) => (
                    <TableCell key={String(column.key)} className="py-2">
                      {column.render
                        ? column.render(item[column.key], item)
                        : String(item[column.key] || "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {title && (
        <p className="text-muted-foreground mt-4 text-center text-sm">
          {title}
        </p>
      )}
    </div>
  );
}