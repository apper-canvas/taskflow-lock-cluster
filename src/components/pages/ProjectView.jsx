import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ProjectHeader from "@/components/organisms/ProjectHeader";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import FilterBar from "@/components/molecules/FilterBar";
import TaskModal from "@/components/molecules/TaskModal";
import projectService from "@/services/api/projectService";
import taskService from "@/services/api/taskService";

const ProjectView = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    assignee: "all"
  });
  const [searchQuery, setSearchQuery] = useState("");

  const loadProjectData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [projectData, tasksData] = await Promise.all([
        projectService.getById(projectId),
        taskService.getByProjectId(projectId)
      ]);
      
      if (!projectData) {
        setError("Project not found");
        return;
      }
      
      setProject(projectData);
      setTasks(tasksData);
      setFilteredTasks(tasksData);
    } catch (err) {
      console.error("Error loading project data:", err);
      setError("Failed to load project data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...tasks];

    // Apply status filter
    if (filters.status !== "all") {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority !== "all") {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Apply assignee filter
    if (filters.assignee !== "all") {
      filtered = filtered.filter(task => task.assignee === filters.assignee);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.assignee.toLowerCase().includes(query)
      );
    }

    setFilteredTasks(filtered);
  }, [tasks, filters, searchQuery]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleAddTask = () => {
    setIsTaskModalOpen(true);
  };

  const handleTaskSave = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      toast.success("Task created successfully!");
    } catch (error) {
      toast.error("Failed to create task");
      console.error("Error creating task:", error);
    }
  };

  const handleTasksChange = (updatedTasks) => {
    setTasks(updatedTasks);
  };

  if (loading) {
    return <Loading type="kanban" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadProjectData} />;
  }

  if (!project) {
    return <Error message="Project not found" />;
  }

  // Calculate task stats
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === "Done").length,
    inProgress: tasks.filter(task => task.status === "In Progress").length,
    todo: tasks.filter(task => task.status === "To Do").length
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Project Header */}
      <ProjectHeader
        project={project}
        taskStats={taskStats}
        onAddTask={handleAddTask}
      />

      {/* Filter Bar */}
      <FilterBar
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onAddTask={handleAddTask}
      />

      {/* Kanban Board */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <KanbanBoard
          projectId={projectId}
          tasks={filteredTasks}
          onTasksChange={handleTasksChange}
        />
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleTaskSave}
        projectId={projectId}
      />
    </div>
  );
};

export default ProjectView;