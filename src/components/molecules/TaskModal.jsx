import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Select from "@/components/atoms/Select";

const TaskModal = ({ isOpen, onClose, onSave, task = null, projectId, isViewOnly = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
    assignee: "",
    dueDate: ""
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "To Do",
        priority: task.priority || "Medium",
        assignee: task.assignee || "",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : ""
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "To Do",
        priority: "Medium",
        assignee: "",
        dueDate: ""
      });
    }
  }, [task, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      ...formData,
      projectId: parseInt(projectId),
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
    };
    onSave(taskData);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
              {/* Header */}
<div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 font-display">
                  {isViewOnly ? "Task Details" : (task ? "Edit Task" : "Create New Task")}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Title */}
                <div>
                  <Label htmlFor="title">Task Title</Label>
<Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Enter task title..."
                    required
                    disabled={isViewOnly}
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description</Label>
<textarea
                    id="description"
                    rows="3"
                    className="flex w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm ring-offset-white placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Enter task description..."
                    disabled={isViewOnly}
                  />
                </div>

                {/* Status and Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
<Select
                      id="status"
                      value={formData.status}
                      onChange={(e) => handleChange("status", e.target.value)}
                      disabled={isViewOnly}
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
<Select
                      id="priority"
                      value={formData.priority}
                      onChange={(e) => handleChange("priority", e.target.value)}
                      disabled={isViewOnly}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </Select>
                  </div>
                </div>

                {/* Assignee */}
                <div>
                  <Label htmlFor="assignee">Assignee</Label>
<Input
                    id="assignee"
                    value={formData.assignee}
                    onChange={(e) => handleChange("assignee", e.target.value)}
                    placeholder="Enter assignee name..."
                    disabled={isViewOnly}
                  />
                </div>

                {/* Due Date */}
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
<Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleChange("dueDate", e.target.value)}
                    disabled={isViewOnly}
                  />
                </div>

                {/* Actions */}
<div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                  >
                    {isViewOnly ? "Close" : "Cancel"}
                  </Button>
                  {!isViewOnly && (
                    <Button
                      type="submit"
                      variant="primary"
                    >
                      {task ? "Update Task" : "Create Task"}
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;