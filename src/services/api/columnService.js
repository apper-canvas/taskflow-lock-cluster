import { toast } from "react-toastify";

const columnService = {
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
          { field: { Name: "order_c" } },
          { field: { Name: "color_c" } }
        ],
        orderBy: [
          {
            fieldName: "order_c",
            sorttype: "ASC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('column_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Map database fields to UI field names
      return (response.data || []).map(column => ({
        Id: column.Id,
        name: column.Name,
        projectId: column.projectId_c?.Id || column.projectId_c,
        order: column.order_c,
        color: column.color_c,
        tags: column.Tags,
        owner: column.Owner?.Name || column.Owner
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching columns:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error("Failed to fetch columns");
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
          { field: { Name: "order_c" } },
          { field: { Name: "color_c" } }
        ],
        where: [
          {
            FieldName: "projectId_c",
            Operator: "EqualTo",
            Values: [parseInt(projectId)]
          }
        ],
        orderBy: [
          {
            fieldName: "order_c",
            sorttype: "ASC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('column_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Map database fields to UI field names
      return (response.data || []).map(column => ({
        Id: column.Id,
        name: column.Name,
        projectId: column.projectId_c?.Id || column.projectId_c,
        order: column.order_c,
        color: column.color_c,
        tags: column.Tags,
        owner: column.Owner?.Name || column.Owner
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching columns by project:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error("Failed to fetch columns for project");
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
          { field: { Name: "order_c" } },
          { field: { Name: "color_c" } }
        ]
      };

      const response = await apperClient.getRecordById('column_c', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      const column = response.data;
      return {
        Id: column.Id,
        name: column.Name,
        projectId: column.projectId_c?.Id || column.projectId_c,
        order: column.order_c,
        color: column.color_c,
        tags: column.Tags,
        owner: column.Owner?.Name || column.Owner
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching column with ID ${id}:`, error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error("Failed to fetch column");
      }
      return null;
    }
  },

  async create(columnData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map UI field names to database field names and filter only Updateable fields
      const dbColumnData = {
        Name: columnData.name,
        Tags: columnData.tags || "",
        projectId_c: parseInt(columnData.projectId),
        order_c: columnData.order || 1,
        color_c: columnData.color || "#6b7280"
      };

      const params = {
        records: [dbColumnData]
      };

      const response = await apperClient.createRecord('column_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} columns:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const createdColumn = successfulRecords[0].data;
          return {
            Id: createdColumn.Id,
            name: createdColumn.Name,
            projectId: createdColumn.projectId_c?.Id || createdColumn.projectId_c,
            order: createdColumn.order_c,
            color: createdColumn.color_c,
            tags: createdColumn.Tags,
            owner: createdColumn.Owner?.Name || createdColumn.Owner
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating column:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error("Failed to create column");
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

      if (data.name !== undefined) dbData.Name = data.name;
      if (data.projectId !== undefined) dbData.projectId_c = parseInt(data.projectId);
      if (data.order !== undefined) dbData.order_c = data.order;
      if (data.color !== undefined) dbData.color_c = data.color;
      if (data.tags !== undefined) dbData.Tags = data.tags;

      const params = {
        records: [dbData]
      };

      const response = await apperClient.updateRecord('column_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} columns:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const updatedColumn = successfulUpdates[0].data;
          return {
            Id: updatedColumn.Id,
            name: updatedColumn.Name,
            projectId: updatedColumn.projectId_c?.Id || updatedColumn.projectId_c,
            order: updatedColumn.order_c,
            color: updatedColumn.color_c,
            tags: updatedColumn.Tags,
            owner: updatedColumn.Owner?.Name || updatedColumn.Owner
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating column:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error("Failed to update column");
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

      const response = await apperClient.deleteRecord('column_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} columns:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting column:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error("Failed to delete column");
      }
      return null;
    }
  }
};

export default columnService;