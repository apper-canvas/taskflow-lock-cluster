import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Dashboard from "@/components/pages/Dashboard";
import ProjectView from "@/components/pages/ProjectView";
import Calendar from "@/components/pages/Calendar";
import Settings from "@/components/pages/Settings";
import TaskModal from "@/components/molecules/TaskModal";
import projectService from "@/services/api/projectService";

function App() {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectFormData, setProjectFormData] = useState({
    name: "",
    description: ""
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const projectsData = await projectService.getAll();
      setProjects(projectsData);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast.error("Failed to load projects");
    }
  };

  const handleCreateProject = () => {
    setProjectFormData({ name: "", description: "" });
    setIsProjectModalOpen(true);
  };

  const handleProjectSave = async (projectData) => {
    try {
      const newProject = await projectService.create(projectData);
      setProjects(prev => [...prev, newProject]);
      toast.success("Project created successfully!");
      setIsProjectModalOpen(false);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    }
  };

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar
          projects={projects}
          currentProject={currentProject}
          onCreateProject={handleCreateProject}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/dashboard" 
              element={<Dashboard onProjectCreate={handleCreateProject} />} 
            />
            <Route path="/project/:projectId" element={<ProjectView />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>

        {/* Project Creation Modal */}
        <ProjectModal
          isOpen={isProjectModalOpen}
          onClose={() => setIsProjectModalOpen(false)}
          onSave={handleProjectSave}
          formData={projectFormData}
          setFormData={setProjectFormData}
        />

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastStyle={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
          }}
        />
      </div>
    </Router>
  );
}

// Project Modal Component
const ProjectModal = ({ isOpen, onClose, onSave, formData, setFormData }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Project name is required");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 font-display">
            Create New Project
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter project name..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter project description..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;