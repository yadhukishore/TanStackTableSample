import { Box, Icon, Input, InputGroup, InputLeftElement } from "@chakra-ui/react"
import SearchIcon from "./icons/SearchIcon";


const Filters = ({columnFilters,setColumnFilters}) => {
    const taskName = columnFilters.find(f=>f.id === "task")?.value || "";
    const onFilterChane = (id,value)=>setColumnFilters(
        prev => prev.filter(f=>f.id !== id).concat({id,value})
    )
  return (
    <Box mb={6} >
        <InputGroup size="sm" maxW="12rem" >
        <InputLeftElement pointerEvents="none" >
            <Icon as={SearchIcon} />
        </InputLeftElement>
        <Input
        placeholder="Search"
        type="text"
        variant="filled"
        borderRadius={5}
        value={taskName}
        onChange={e=>onFilterChane("task",e.target.value)}
        />
        </InputGroup>
    </Box>
  )
}

export default Filters