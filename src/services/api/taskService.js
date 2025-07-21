import { toast } from "react-toastify";

const taskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "projectId_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "updatedAt_c" } }
        ]
      };

      const response = await apperClient.fetchRecords('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error("Failed to fetch tasks");
      }
      return [];
    }
  },

  async getByProjectId(projectId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "projectId_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "updatedAt_c" } }
        ],
        where: [
          {
            FieldName: "projectId_c",
            Operator: "EqualTo",
            Values: [parseInt(projectId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Map database fields to UI field names
      return (response.data || []).map(task => ({
        Id: task.Id,
        projectId: task.projectId_c?.Id || task.projectId_c,
        title: task.title_c || task.Name,
        description: task.description_c,
        status: task.status_c,
        priority: task.priority_c,
        assignee: task.assignee_c,
        dueDate: task.dueDate_c,
        createdAt: task.createdAt_c,
        updatedAt: task.updatedAt_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks by project:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error("Failed to fetch tasks for project");
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "projectId_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "updatedAt_c" } }
        ]
      };

      const response = await apperClient.getRecordById('task_c', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      const task = response.data;
      return {
        Id: task.Id,
        projectId: task.projectId_c?.Id || task.projectId_c,
        title: task.title_c || task.Name,
        description: task.description_c,
        status: task.status_c,
        priority: task.priority_c,
        assignee: task.assignee_c,
        dueDate: task.dueDate_c,
        createdAt: task.createdAt_c,
        updatedAt: task.updatedAt_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error("Failed to fetch task");
      }
      return null;
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map UI field names to database field names and filter only Updateable fields
      const dbTaskData = {
        Name: taskData.title,
        Tags: taskData.tags || "",
        projectId_c: parseInt(taskData.projectId),
        title_c: taskData.title,
        description_c: taskData.description || "",
        status_c: taskData.status || "To Do",
        priority_c: taskData.priority || "Medium",
        assignee_c: taskData.assignee || "",
        dueDate_c: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
        createdAt_c: new Date().toISOString(),
        updatedAt_c: new Date().toISOString()
      };

      const params = {
        records: [dbTaskData]
      };

      const response = await apperClient.createRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} tasks:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const createdTask = successfulRecords[0].data;
          return {
            Id: createdTask.Id,
            projectId: createdTask.projectId_c?.Id || createdTask.projectId_c,
            title: createdTask.title_c || createdTask.Name,
            description: createdTask.description_c,
            status: createdTask.status_c,
            priority: createdTask.priority_c,
            assignee: createdTask.assignee_c,
            dueDate: createdTask.dueDate_c,
            createdAt: createdTask.createdAt_c,
            updatedAt: createdTask.updatedAt_c
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error("Failed to create task");
      }
      return null;
    }
  },

  async update(id, data) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map UI field names to database field names and filter only Updateable fields
      const dbData = {
        Id: parseInt(id)
      };

      if (data.title !== undefined) {
        dbData.Name = data.title;
        dbData.title_c = data.title;
      }
      if (data.description !== undefined) dbData.description_c = data.description;
      if (data.status !== undefined) dbData.status_c = data.status;
      if (data.priority !== undefined) dbData.priority_c = data.priority;
      if (data.assignee !== undefined) dbData.assignee_c = data.assignee;
      if (data.dueDate !== undefined) {
        dbData.dueDate_c = data.dueDate ? new Date(data.dueDate).toISOString() : null;
      }
      if (data.projectId !== undefined) dbData.projectId_c = parseInt(data.projectId);
      if (data.tags !== undefined) dbData.Tags = data.tags;
      
      dbData.updatedAt_c = new Date().toISOString();

      const params = {
        records: [dbData]
      };

      const response = await apperClient.updateRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} tasks:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const updatedTask = successfulUpdates[0].data;
          return {
            Id: updatedTask.Id,
            projectId: updatedTask.projectId_c?.Id || updatedTask.projectId_c,
            title: updatedTask.title_c || updatedTask.Name,
            description: updatedTask.description_c,
            status: updatedTask.status_c,
            priority: updatedTask.priority_c,
            assignee: updatedTask.assignee_c,
            dueDate: updatedTask.dueDate_c,
            createdAt: updatedTask.createdAt_c,
            updatedAt: updatedTask.updatedAt_c
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error("Failed to update task");
      }
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} tasks:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error("Failed to delete task");
      }
      return null;
    }
  },

  async bulkUpdate(ids, data) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map UI field names to database field names
      const dbData = {};
      if (data.status !== undefined) dbData.status_c = data.status;
      if (data.priority !== undefined) dbData.priority_c = data.priority;
      if (data.assignee !== undefined) dbData.assignee_c = data.assignee;
      
      dbData.updatedAt_c = new Date().toISOString();

      const records = ids.map(id => ({
        Id: parseInt(id),
        ...dbData
      }));

      const params = {
        records
      };

      const response = await apperClient.updateRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} tasks:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulUpdates.map(result => {
          const task = result.data;
          return {
            Id: task.Id,
            projectId: task.projectId_c?.Id || task.projectId_c,
            title: task.title_c || task.Name,
            description: task.description_c,
            status: task.status_c,
            priority: task.priority_c,
            assignee: task.assignee_c,
            dueDate: task.dueDate_c,
            createdAt: task.createdAt_c,
            updatedAt: task.updatedAt_c
          };
        });
      }

      return [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error bulk updating tasks:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error("Failed to update tasks");
      }
      return [];
    }
  },

  async bulkDelete(ids) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: ids.map(id => parseInt(id))
      };

      const response = await apperClient.deleteRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} tasks:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.map(result => result.data);
      }

      return [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error bulk deleting tasks:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error("Failed to delete tasks");
      }
      return [];
    }
  }
};

export default taskService;