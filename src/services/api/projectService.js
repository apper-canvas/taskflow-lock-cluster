import projectsData from "@/services/mockData/projects.json";

let projects = [...projectsData];

const projectService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...projects];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const project = projects.find(p => p.Id === parseInt(id));
    return project ? { ...project } : null;
  },

  async create(project) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...projects.map(p => p.Id), 0);
    const newProject = {
      ...project,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    projects.push(newProject);
    return { ...newProject };
  },

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = projects.findIndex(p => p.Id === parseInt(id));
    if (index !== -1) {
      projects[index] = {
        ...projects[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      return { ...projects[index] };
    }
    return null;
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = projects.findIndex(p => p.Id === parseInt(id));
    if (index !== -1) {
      const deleted = projects.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }
};

export default projectService;