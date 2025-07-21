import { motion } from "framer-motion";
import ProjectCard from "@/components/molecules/ProjectCard";
import Empty from "@/components/ui/Empty";

const ProjectGrid = ({ projects, tasks, onProjectClick, onCreateProject }) => {
  const getProjectStats = (projectId) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    const completedTasks = projectTasks.filter(task => task.status === "Done").length;
    return {
      taskCount: projectTasks.length,
      completedTasks
    };
  };

  if (projects.length === 0) {
    return (
      <Empty
        icon="FolderPlus"
        title="No projects yet"
        description="Create your first project to start organizing tasks and tracking progress."
        actionLabel="Create Project"
        onAction={onCreateProject}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
    >
      {projects.map((project, index) => {
        const stats = getProjectStats(project.Id);
        return (
          <motion.div
            key={project.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProjectCard
              project={project}
              taskCount={stats.taskCount}
              completedTasks={stats.completedTasks}
              onClick={() => onProjectClick(project.Id)}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default ProjectGrid;