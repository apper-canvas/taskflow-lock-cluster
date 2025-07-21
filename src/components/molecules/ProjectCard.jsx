import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";

const ProjectCard = ({ project, taskCount, completedTasks, onClick }) => {
  const progress = taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0;
  
  const circumference = 2 * Math.PI * 16;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 cursor-pointer"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg truncate font-display">
              {project.name}
            </h3>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {project.description}
            </p>
          </div>
          <ApperIcon name="ChevronRight" size={18} className="text-gray-400 flex-shrink-0 ml-2" />
        </div>

        {/* Progress Section */}
        <div className="flex items-center space-x-4">
          {/* Progress Ring */}
          <div className="relative flex items-center justify-center">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="16"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="24"
                cy="24"
                r="16"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="text-primary-600 transition-all duration-300 ease-in-out"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-900">
              {progress}%
            </span>
          </div>

          {/* Progress Details */}
          <div className="flex-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-900">
                {completedTasks} of {taskCount} tasks
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-50">
          <div className="flex items-center">
            <ApperIcon name="Calendar" size={14} className="mr-1" />
            <span>Updated {format(new Date(project.updatedAt), "MMM dd")}</span>
          </div>
          <div className="flex items-center">
            <ApperIcon name="CheckCircle2" size={14} className="mr-1" />
            <span>{taskCount} tasks</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;