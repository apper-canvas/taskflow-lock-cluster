import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import ApperIcon from "@/components/ApperIcon";
import TaskModal from "@/components/molecules/TaskModal";
import TaskCard from "@/components/molecules/TaskCard";
import taskService from "@/services/api/taskService";

const KanbanColumn = ({ 
  column, 
  tasks, 
  onTaskUpdate, 
  onEdit,
  onTaskEdit, 
  onTaskDelete,
  selectedTaskIds,
  handleTaskSelect,
  dragHandlers,
  isDragOver
}) => {
  const getColumnIcon = (status) => {
    switch (status) {
      case "To Do": return "Circle";
      case "In Progress": return "Clock";
      case "Done": return "CheckCircle2";
      default: return "Circle";
    }
  };

  const getColumnColor = (status) => {
    switch (status) {
      case "To Do": return "text-gray-600 bg-gray-50";
      case "In Progress": return "text-blue-600 bg-blue-50";
      case "Done": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="flex-1 min-w-[300px]">
      {/* Column Header */}
      <div className={`p-4 rounded-lg mb-4 ${getColumnColor(column.name)} border-2 ${isDragOver ? "border-primary-300 bg-primary-50" : "border-transparent"} transition-all duration-200`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ApperIcon 
              name={getColumnIcon(column.name)} 
              size={18} 
              className={getColumnColor(column.name).split(" ")[0]}
            />
            <h3 className="font-semibold text-gray-900 font-display">
              {column.name}
            </h3>
            <span className="bg-white text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full border">
              {tasks.length}
            </span>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div
        className={`space-y-3 min-h-[500px] p-2 rounded-lg transition-all duration-200 ${
          isDragOver ? "bg-primary-50/50" : ""
        }`}
        {...dragHandlers}
      >
        <AnimatePresence>
{tasks.map((task) => (
            <TaskCard
              key={task.Id}
              task={task}
              onEdit={onTaskEdit}
              onDelete={onTaskDelete}
              onDragStart={(e) => dragHandlers.onDragStart?.(e, task)}
              onDragEnd={dragHandlers.onDragEnd}
              isSelected={selectedTaskIds.has(task.Id)}
              onSelect={(isSelected) => handleTaskSelect(task.Id, isSelected)}
            />
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <ApperIcon name="Plus" size={24} className="mb-2" />
            <p className="text-sm">Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
};

const BulkActionToolbar = ({ selectedCount, onBulkMove, onBulkDelete, onClearSelection }) => {
  const [showMoveOptions, setShowMoveOptions] = useState(false);
  
  const statusOptions = [
    { value: "To Do", label: "To Do" },
    { value: "In Progress", label: "In Progress" }, 
    { value: "Done", label: "Done" }
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <ApperIcon name="CheckSquare" size={20} className="text-primary-600" />
          <span className="font-medium text-gray-900">
            {selectedCount} task{selectedCount !== 1 ? 's' : ''} selected
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              onClick={() => setShowMoveOptions(!showMoveOptions)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors duration-200"
            >
              <ApperIcon name="ArrowRight" size={16} />
              <span>Move To</span>
            </button>
            
            {showMoveOptions && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onBulkMove(option.value);
                      setShowMoveOptions(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
<button
            onClick={onBulkDelete}
            className="flex items-center space-x-2 px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            <ApperIcon name="Trash2" size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
      
      <button
        onClick={onClearSelection}
        className="text-gray-500 hover:text-gray-700 text-sm font-medium"
      >
        Clear Selection
      </button>
    </div>
  );
};

const KanbanBoard = ({ projectId, tasks, onTasksChange }) => {
  const [groupedTasks, setGroupedTasks] = useState({
    "To Do": [],
    "In Progress": [],
    "Done": []
  });
const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState(new Set());

  const {
    draggedItem,
    dragOverColumn,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useDragAndDrop();

  // Group tasks by status
  useEffect(() => {
    const grouped = {
      "To Do": tasks.filter(task => task.status === "To Do"),
      "In Progress": tasks.filter(task => task.status === "In Progress"),
      "Done": tasks.filter(task => task.status === "Done")
    };
    setGroupedTasks(grouped);
  }, [tasks]);

  const columns = [
    { Id: 1, name: "To Do", order: 1 },
    { Id: 2, name: "In Progress", order: 2 },
    { Id: 3, name: "Done", order: 3 }
  ];

  const handleTaskMove = async (task, targetStatus) => {
    if (task.status === targetStatus) return;

    try {
      const updatedTask = await taskService.update(task.Id, {
status: targetStatus
      });
      
      const updatedTasks = tasks.map(t => 
        t.Id === task.Id ? { ...t, status: targetStatus } : t
      );
      onTasksChange(updatedTasks);
      toast.success(`Task moved to ${targetStatus}!`);
    } catch (error) {
      toast.error("Failed to move task");
      console.error("Error moving task:", error);
    }
  };
const handleTaskView = (task) => {
    setSelectedTask(task);
    setIsViewOnly(true);
    setIsModalOpen(true);
  };

  const handleTaskEdit = (task) => {
    setSelectedTask(task);
    setIsViewOnly(false);
    setIsModalOpen(true);
  };

  const handleTaskSave = async (taskData) => {
    try {
      let updatedTask;
      if (selectedTask) {
        updatedTask = await taskService.update(selectedTask.Id, taskData);
        const updatedTasks = tasks.map(t => 
          t.Id === selectedTask.Id ? updatedTask : t
        );
        onTasksChange(updatedTasks);
        toast.success("Task updated successfully!");
      } else {
        updatedTask = await taskService.create(taskData);
        onTasksChange([...tasks, updatedTask]);
        toast.success("Task created successfully!");
      }
setSelectedTask(null);
      setIsViewOnly(false);
    } catch (error) {
      toast.error(selectedTask ? "Failed to update task" : "Failed to create task");
      console.error("Error saving task:", error);
    }
  };

  const handleTaskDelete = async (task) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.delete(task.Id);
        const updatedTasks = tasks.filter(t => t.Id !== task.Id);
        onTasksChange(updatedTasks);
        toast.success("Task deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete task");
        console.error("Error deleting task:", error);
      }
    }
  };
const handleTaskSelect = (taskId, isSelected) => {
    setSelectedTaskIds(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(taskId);
      } else {
        newSet.delete(taskId);
      }
      return newSet;
    });
  };
  const handleBulkMove = async (targetStatus) => {
    const selectedTasks = tasks.filter(task => selectedTaskIds.has(task.Id));
    const tasksToMove = selectedTasks.filter(task => task.status !== targetStatus);
    
    if (tasksToMove.length === 0) {
      toast.info(`All selected tasks are already in ${targetStatus}`);
      return;
    }

    try {
      const updatedTasks = await taskService.bulkUpdate(
        Array.from(selectedTaskIds),
        { status: targetStatus }
      );
      
      const newTasks = tasks.map(task => {
        const updated = updatedTasks.find(ut => ut.Id === task.Id);
        return updated || task;
      });
      
      onTasksChange(newTasks);
      setSelectedTaskIds(new Set());
      toast.success(`${tasksToMove.length} task${tasksToMove.length !== 1 ? 's' : ''} moved to ${targetStatus}!`);
    } catch (error) {
      toast.error("Failed to move selected tasks");
      console.error("Error moving tasks:", error);
    }
  };

  const handleBulkDelete = async () => {
    const selectedCount = selectedTaskIds.size;
    if (window.confirm(`Are you sure you want to delete ${selectedCount} selected task${selectedCount !== 1 ? 's' : ''}?`)) {
      try {
        await taskService.bulkDelete(Array.from(selectedTaskIds));
        const updatedTasks = tasks.filter(task => !selectedTaskIds.has(task.Id));
        onTasksChange(updatedTasks);
        setSelectedTaskIds(new Set());
        toast.success(`${selectedCount} task${selectedCount !== 1 ? 's' : ''} deleted successfully!`);
      } catch (error) {
        toast.error("Failed to delete selected tasks");
        console.error("Error deleting tasks:", error);
      }
    }
  };

  const handleClearSelection = () => {
    setSelectedTaskIds(new Set());
  };

  // Clear selection when tasks change externally (like from filters)
  useEffect(() => {
    const currentTaskIds = new Set(tasks.map(task => task.Id));
    setSelectedTaskIds(prev => {
      const filtered = new Set([...prev].filter(id => currentTaskIds.has(id)));
      return filtered.size !== prev.size ? filtered : prev;
    });
  }, [tasks]);

  return (
    <>
      {selectedTaskIds.size > 0 && (
        <BulkActionToolbar
          selectedCount={selectedTaskIds.size}
          onBulkMove={handleBulkMove}
          onBulkDelete={handleBulkDelete}
          onClearSelection={handleClearSelection}
        />
      )}
<div className="flex gap-6 overflow-x-auto pb-6 px-6">
        {columns.map((column) => (
          <KanbanColumn
            key={column.Id}
            column={column}
            tasks={groupedTasks[column.name] || []}
            onTaskUpdate={handleTaskMove}
onEdit={handleTaskView}
            onTaskEdit={handleTaskEdit}
            onTaskDelete={handleTaskDelete}
            selectedTaskIds={selectedTaskIds}
            handleTaskSelect={handleTaskSelect}
            isDragOver={dragOverColumn === column.name}
            dragHandlers={{
              onDragStart: handleDragStart,
              onDragEnd: handleDragEnd,
              onDragOver: (e) => handleDragOver(e, column.name),
              onDragLeave: handleDragLeave,
              onDrop: (e) => handleDrop(e, column.name, handleTaskMove)
            }}
          />
        ))}
      </div>
<TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
          setIsViewOnly(false);
        }}
        onSave={handleTaskSave}
        task={selectedTask}
        projectId={projectId}
        isViewOnly={isViewOnly}
      />
    </>
  );
};

export default KanbanBoard;