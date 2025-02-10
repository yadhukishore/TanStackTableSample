import React, { useState } from "react";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Box,
} from "@chakra-ui/react";
import { STATUSES } from "../data";

const ColorIcon = ({ color, ...props }) => (
  <Box w="12px" h="12px" bg={color} borderRadius="3px" display="inline-block" mr={2} {...props} />
);

const StatusCell = ({ getValue, row, column, table }) => {
  const initialStatus = getValue() || {};
  const [selectedStatus, setSelectedStatus] = useState(initialStatus); 

  const updateData = table?.options?.meta?.updateData; 

  const handleSelect = (status) => {
    setSelectedStatus(status); 
    updateData && updateData(row.id, column.id, status); 
  };
  const handleReset = () => {
    setSelectedStatus({ name: "None", color: "transparent" }); 
    updateData && updateData(row.id, column.id, null); 
  };

  return (
    <Menu isLazy offset={[0, 0]} flip={false} autoSelect={false}>
      <MenuButton as={Button} h="100%" w="100%" textAlign="left" p={1.5} bg={selectedStatus.color || "transparent"} color="gray.900">
        {selectedStatus.name || "Select Status"}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={handleReset}>
          <ColorIcon color="red.500" mr={3} /> None
        </MenuItem>
        {STATUSES.map((status) => (
          <MenuItem onClick={() => handleSelect(status)} key={status.id}>
            <ColorIcon color={status.color} mr={3} />
            {status.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default StatusCell;
