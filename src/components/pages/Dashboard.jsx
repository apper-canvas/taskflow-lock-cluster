import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ProjectGrid from "@/components/organisms/ProjectGrid";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import projectService from "@/services/api/projectService";
import taskService from "@/services/api/taskService";

const Dashboard = ({ onProjectCreate }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [projectsData, tasksData] = await Promise.all([
        projectService.getAll(),
        taskService.getAll()
      ]);
      
      setProjects(projectsData);
      setTasks(tasksData);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const handleCreateProject = () => {
    onProjectCreate();
  };

  if (loading) {
    return <Loading type="projects" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === "Done").length;
  const inProgressTasks = tasks.filter(task => task.status === "In Progress").length;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold font-display mb-2">
                Project Dashboard
              </h1>
              <p className="text-primary-100 text-lg">
                Manage your projects and track progress
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <ApperIcon name="Download" size={18} className="mr-2" />
                Export
              </Button>
              
              <Button
                variant="accent"
                size="lg"
                onClick={handleCreateProject}
                className="shadow-lg"
              >
                <ApperIcon name="Plus" size={18} className="mr-2" />
                New Project
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-100 text-sm">Total Projects</p>
                  <p className="text-3xl font-bold font-display">{projects.length}</p>
                </div>
                <ApperIcon name="Folder" size={32} className="text-primary-200" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-100 text-sm">Total Tasks</p>
                  <p className="text-3xl font-bold font-display">{totalTasks}</p>
                </div>
                <ApperIcon name="CheckSquare" size={32} className="text-primary-200" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-100 text-sm">In Progress</p>
                  <p className="text-3xl font-bold font-display">{inProgressTasks}</p>
                </div>
                <ApperIcon name="Clock" size={32} className="text-primary-200" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-100 text-sm">Completed</p>
                  <p className="text-3xl font-bold font-display">{overallProgress}%</p>
                </div>
                <ApperIcon name="TrendingUp" size={32} className="text-primary-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-gray-50 min-h-screen">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 font-display">
              Your Projects
            </h2>
            <div className="flex items-center space-x-4">
              <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option>All Projects</option>
                <option>Active</option>
                <option>Completed</option>
              </select>
            </div>
          </div>

          <ProjectGrid
            projects={projects}
            tasks={tasks}
            onProjectClick={handleProjectClick}
            onCreateProject={handleCreateProject}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;