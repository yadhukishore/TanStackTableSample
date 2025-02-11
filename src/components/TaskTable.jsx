import { Box, ButtonGroup, Text, Button } from "@chakra-ui/react";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import DATA from "../data";
import EditableCell from "./EditableCell";
import StatusCell from "./StatusCell";
import DateCell from "./DateCell";
import Filters from "./Filters";

const columns = [
  {
    accessorKey: 'task',
    header: 'Task',
    size: 225,
    cell: EditableCell
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: StatusCell
  },
  {
    accessorKey: 'due',
    header: 'Due',
    cell: DateCell
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
    size: 225,
    cell: EditableCell
  },
];

const TaskTable = () => {
  const [data, setData] = useState(DATA);
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    columnResizeMode: "onChange",
    //  default pagination
    initialState: {
      pagination: {
        pageSize: 5, 
      },
    },
    meta: {
      updateData: (rowIndex, columnId, value) => setData(
        prev => prev.map(
          (row, index) =>
            index === rowIndex ? {
              ...prev[rowIndex],
              [columnId]: value,
            }
            : row
        )
      )
    }
  });

  return (
    <Box>
      <Filters
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
      <Box className="table" w={table.getTotalSize()}>
        {table.getHeaderGroups().map(headerGroup => (
          <Box className="tr" key={headerGroup.id}>
            {headerGroup.headers.map(
              header => (
                <Box className="th" w={header.getSize()} key={header.id}>
                  {header.column.columnDef.header}
                  <Box
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ""}`}
                  />
                </Box>
              )
            )}
          </Box>
        ))}
        {table.getRowModel().rows.map(row => (
          <Box className="tr" key={row.id}>
            {row.getVisibleCells().map(cell => (
              <Box className="td" w={cell.column.getSize()} key={cell.id}>
                {flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
      <br />
      <Text mb={2}>
        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
      </Text>
      <ButtonGroup size="sm" isAttached variant="outline">
        <Button
          onClick={() => table.previousPage()}
          isDisabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </Button>
        <Button
          onClick={() => table.nextPage()}
          isDisabled={!table.getCanNextPage()}
        >
          {">"}
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default TaskTable;