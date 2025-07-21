import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

const taskService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...tasks];
  },

  async getByProjectId(projectId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return tasks.filter(t => t.projectId === parseInt(projectId)).map(t => ({ ...t }));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const task = tasks.find(t => t.Id === parseInt(id));
    return task ? { ...task } : null;
  },

  async create(task) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...tasks.map(t => t.Id), 0);
    const newTask = {
      ...task,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index !== -1) {
      tasks[index] = {
        ...tasks[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      return { ...tasks[index] };
    }
    return null;
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index !== -1) {
      const deleted = tasks.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
},

  async bulkUpdate(ids, data) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const updatedTasks = [];
    
    for (const id of ids) {
      const index = tasks.findIndex(t => t.Id === parseInt(id));
      if (index !== -1) {
        tasks[index] = {
          ...tasks[index],
          ...data,
          updatedAt: new Date().toISOString()
        };
        updatedTasks.push({ ...tasks[index] });
      }
    }
    
    return updatedTasks;
  },

  async bulkDelete(ids) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const deletedTasks = [];
    
    // Sort IDs in descending order to maintain array indices during deletion
    const sortedIds = ids.map(id => parseInt(id)).sort((a, b) => b - a);
    
    for (const id of sortedIds) {
      const index = tasks.findIndex(t => t.Id === id);
      if (index !== -1) {
        const deleted = tasks.splice(index, 1)[0];
        deletedTasks.push({ ...deleted });
      }
    }
    
    return deletedTasks;
  }
};

export default taskService;