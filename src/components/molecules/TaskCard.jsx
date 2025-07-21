import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const TaskCard = ({ task, onEdit, onDelete, ...dragHandlers }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "high";
      case "Medium": return "medium";
      case "Low": return "low";
      default: return "default";
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return format(new Date(dateString), "MMM dd");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group"
      draggable
      {...dragHandlers}
    >
      <div className="space-y-3">
        {/* Title and Priority */}
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 pr-2">
            {task.title}
          </h4>
          <Badge variant={getPriorityColor(task.priority)} className="text-xs flex-shrink-0">
            {task.priority}
          </Badge>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Due Date */}
        {task.dueDate && (
          <div className="flex items-center text-gray-500 text-xs">
            <ApperIcon name="Calendar" size={12} className="mr-1.5" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          {/* Assignee */}
          <div className="flex items-center">
            <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
              {getInitials(task.assignee)}
            </div>
            <span className="ml-2 text-xs text-gray-600 truncate max-w-[100px]">
              {task.assignee}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(task);
              }}
              className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors duration-200"
            >
              <ApperIcon name="Edit" size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(task);
              }}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
            >
              <ApperIcon name="Trash2" size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;