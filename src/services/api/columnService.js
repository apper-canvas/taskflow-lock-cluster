import columnsData from "@/services/mockData/columns.json";

let columns = [...columnsData];

const columnService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...columns];
  },

  async getByProjectId(projectId) {
    await new Promise(resolve => setTimeout(resolve, 150));
    return columns
      .filter(c => c.projectId === parseInt(projectId))
      .sort((a, b) => a.order - b.order)
      .map(c => ({ ...c }));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const column = columns.find(c => c.Id === parseInt(id));
    return column ? { ...column } : null;
  },

  async create(column) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const maxId = Math.max(...columns.map(c => c.Id), 0);
    const newColumn = {
      ...column,
      Id: maxId + 1
    };
    columns.push(newColumn);
    return { ...newColumn };
  },

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = columns.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      columns[index] = {
        ...columns[index],
        ...data
      };
      return { ...columns[index] };
    }
    return null;
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = columns.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      const deleted = columns.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }
};

export default columnService;