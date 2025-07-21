import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import TaskCard from "@/components/molecules/TaskCard";
import TaskModal from "@/components/molecules/TaskModal";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import taskService from "@/services/api/taskService";

const KanbanColumn = ({ 
  column, 
  tasks, 
  onTaskUpdate, 
  onTaskEdit, 
  onTaskDelete,
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

const KanbanBoard = ({ projectId, tasks, onTasksChange }) => {
  const [groupedTasks, setGroupedTasks] = useState({
    "To Do": [],
    "In Progress": [],
    "Done": []
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      
      if (updatedTask) {
        const updatedTasks = tasks.map(t => 
          t.Id === task.Id ? updatedTask : t
        );
        onTasksChange(updatedTasks);
        toast.success("Task moved successfully!");
      }
    } catch (error) {
      toast.error("Failed to move task");
      console.error("Error moving task:", error);
    }
  };

  const handleTaskEdit = (task) => {
    setSelectedTask(task);
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

  return (
    <>
      <div className="flex gap-6 overflow-x-auto pb-6 px-6">
        {columns.map((column) => (
          <KanbanColumn
            key={column.Id}
            column={column}
            tasks={groupedTasks[column.name] || []}
            onTaskUpdate={handleTaskMove}
            onTaskEdit={handleTaskEdit}
            onTaskDelete={handleTaskDelete}
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
        }}
        onSave={handleTaskSave}
        task={selectedTask}
        projectId={projectId}
      />
    </>
  );
};

export default KanbanBoard;