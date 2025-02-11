import { Box, ButtonGroup, Text, Button, Switch, HStack } from "@chakra-ui/react";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { useState, useEffect } from "react";
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

const STATUS_ON_DECK = { id: 1, name: "On Deck", color: "blue.300" };
const STATUS_IN_PROGRESS = { id: 2, name: "In Progress", color: "yellow.400" };
const STATUS_TESTING = { id: 3, name: "Testing", color: "pink.300" };
const STATUS_DEPLOYED = { id: 4, name: "Deployed", color: "green.300" };

const TaskTable = () => {
  const [data, setData] = useState(DATA);
  const [columnFilters, setColumnFilters] = useState([]);
  const [useApiData, setUseApiData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const transformApiData = (apiData) => {
    return apiData.map(item => ({
      task: item.title.slice(0, 50), 
      status: [STATUS_ON_DECK, STATUS_IN_PROGRESS, STATUS_TESTING, STATUS_DEPLOYED][Math.floor(Math.random() * 4)],
      due: Math.random() > 0.5 ? new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)) : null,
      notes: item.body.slice(0, 50) 
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (useApiData) {
        setIsLoading(true);
        try {
          const response = await fetch('https://jsonplaceholder.typicode.com/posts');
          const apiData = await response.json();
          const transformedData = transformApiData(apiData.slice(0, 48));
          setData(transformedData);
        } catch (error) {
          console.error('Error fetching data:', error);
          setData(DATA);
        }
        setIsLoading(false);
      } else {
        setData(DATA);
      }
    };

    fetchData();
  }, [useApiData]);

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
      <HStack spacing={2} mb={4}>
        <Text>Use API Data:</Text>
        <Switch
          isChecked={useApiData}
          onChange={(e) => setUseApiData(e.target.checked)}
          colorScheme="teal"
        />
        {isLoading && <Text color="gray.500">(Loading...)</Text>}
      </HStack>

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