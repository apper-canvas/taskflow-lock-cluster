import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ProjectHeader = ({ project, taskStats, onAddTask }) => {
  const { total = 0, completed = 0, inProgress = 0, todo = 0 } = taskStats;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          {/* Project Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="Folder" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-display">
                  {project.name}
                </h1>
                <p className="text-gray-600 mt-1">
                  {project.description}
                </p>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-500 space-x-6">
              <div className="flex items-center">
                <ApperIcon name="Calendar" size={16} className="mr-1.5" />
                <span>Updated {format(new Date(project.updatedAt), "MMM dd, yyyy")}</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="CheckCircle2" size={16} className="mr-1.5" />
                <span>{total} total tasks</span>
              </div>
            </div>
          </div>

          {/* Stats and Actions */}
          <div className="flex items-center space-x-6">
            {/* Progress Stats */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 font-display">
                  {progress}%
                </div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 font-display">
                  {inProgress}
                </div>
                <div className="text-sm text-gray-500">In Progress</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 font-display">
                  {completed}
                </div>
                <div className="text-sm text-gray-500">Done</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                size="md"
                className="flex items-center space-x-2"
              >
                <ApperIcon name="Settings" size={16} />
                <span className="hidden sm:inline">Settings</span>
              </Button>
              
              <Button
                variant="primary"
                size="md"
                onClick={onAddTask}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="Plus" size={16} />
                <span>Add Task</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="md:hidden mt-6 grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-primary-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600 font-display">
              {progress}%
            </div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 font-display">
              {inProgress}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 font-display">
              {completed}
            </div>
            <div className="text-sm text-gray-600">Done</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Overall Progress</span>
            <span>{completed} of {total} tasks completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;