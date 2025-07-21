import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const DesktopSidebar = ({ projects, currentProject, onCreateProject }) => {
  return (
    <div className="hidden lg:flex lg:flex-col lg:w-80 lg:bg-white lg:border-r lg:border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
            <ApperIcon name="Zap" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 font-display">TaskFlow Pro</h1>
            <p className="text-sm text-gray-500">Project Management</p>
          </div>
        </div>

        <Button
          onClick={onCreateProject}
          variant="primary"
          size="sm"
          className="w-full flex items-center justify-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>New Project</span>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6">
        <div className="space-y-6">
          {/* Main Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Navigation
            </h3>
            <div className="space-y-1">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-primary-50 text-primary-700 border-r-2 border-primary-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`
                }
              >
                <ApperIcon name="BarChart3" size={18} className="mr-3" />
                Dashboard
              </NavLink>
              
              <NavLink
                to="/calendar"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-primary-50 text-primary-700 border-r-2 border-primary-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`
                }
              >
                <ApperIcon name="Calendar" size={18} className="mr-3" />
                Calendar
              </NavLink>
              
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-primary-50 text-primary-700 border-r-2 border-primary-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`
                }
              >
                <ApperIcon name="Settings" size={18} className="mr-3" />
                Settings
              </NavLink>
            </div>
          </div>

          {/* Projects */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Projects
            </h3>
            <div className="space-y-1 max-h-[400px] overflow-y-auto">
              {projects.map((project) => (
                <NavLink
                  key={project.Id}
                  to={`/project/${project.Id}`}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 group ${
                      isActive
                        ? "bg-primary-50 text-primary-700 border-r-2 border-primary-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`
                  }
                >
                  <div className="w-2 h-2 bg-primary-400 rounded-full mr-3 flex-shrink-0"></div>
                  <span className="truncate">{project.name}</span>
                </NavLink>
              ))}
              
              {projects.length === 0 && (
                <div className="text-sm text-gray-400 italic px-3 py-2">
                  No projects yet
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

const MobileSidebar = ({ isOpen, onClose, projects, currentProject, onCreateProject }) => {
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
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
                    <ApperIcon name="Zap" size={20} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 font-display">TaskFlow Pro</h1>
                    <p className="text-sm text-gray-500">Project Management</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <Button
                onClick={() => {
                  onCreateProject();
                  onClose();
                }}
                variant="primary"
                size="sm"
                className="w-full flex items-center justify-center space-x-2"
              >
                <ApperIcon name="Plus" size={16} />
                <span>New Project</span>
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Main Navigation */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Navigation
                  </h3>
                  <div className="space-y-1">
                    <NavLink
                      to="/dashboard"
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                          isActive
                            ? "bg-primary-50 text-primary-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`
                      }
                    >
                      <ApperIcon name="BarChart3" size={18} className="mr-3" />
                      Dashboard
                    </NavLink>
                    
                    <NavLink
                      to="/calendar"
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                          isActive
                            ? "bg-primary-50 text-primary-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`
                      }
                    >
                      <ApperIcon name="Calendar" size={18} className="mr-3" />
                      Calendar
                    </NavLink>
                    
                    <NavLink
                      to="/settings"
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                          isActive
                            ? "bg-primary-50 text-primary-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`
                      }
                    >
                      <ApperIcon name="Settings" size={18} className="mr-3" />
                      Settings
                    </NavLink>
                  </div>
                </div>

                {/* Projects */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Projects
                  </h3>
                  <div className="space-y-1">
                    {projects.map((project) => (
                      <NavLink
                        key={project.Id}
                        to={`/project/${project.Id}`}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                            isActive
                              ? "bg-primary-50 text-primary-700"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          }`
                        }
                      >
                        <div className="w-2 h-2 bg-primary-400 rounded-full mr-3 flex-shrink-0"></div>
                        <span className="truncate">{project.name}</span>
                      </NavLink>
                    ))}
                    
                    {projects.length === 0 && (
                      <div className="text-sm text-gray-400 italic px-3 py-2">
                        No projects yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Sidebar = ({ projects = [], currentProject, onCreateProject }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        <ApperIcon name="Menu" size={20} className="text-gray-600" />
      </button>

      {/* Desktop Sidebar */}
      <DesktopSidebar
        projects={projects}
        currentProject={currentProject}
        onCreateProject={onCreateProject}
      />

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        projects={projects}
        currentProject={currentProject}
        onCreateProject={onCreateProject}
      />
    </>
  );
};

export default Sidebar;