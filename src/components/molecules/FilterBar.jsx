import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import SearchBar from "@/components/molecules/SearchBar";

const FilterBar = ({ onFilterChange, onSearch, onAddTask }) => {
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    assignee: "all"
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        {/* Left Side - Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <SearchBar 
            onSearch={onSearch}
            placeholder="Search tasks..."
            className="w-full sm:w-64"
          />

          {/* Status Filter */}
          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-full sm:w-auto"
          >
            <option value="all">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </Select>

          {/* Priority Filter */}
          <Select
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            className="w-full sm:w-auto"
          >
            <option value="all">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Select>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Filter" size={16} />
            <span className="hidden sm:inline">More Filters</span>
          </Button>
          
          <Button
            variant="primary"
            size="sm"
            onClick={onAddTask}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={16} />
            <span>Add Task</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;