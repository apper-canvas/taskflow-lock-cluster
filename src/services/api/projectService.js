import { toast } from "react-toastify";

const projectService = {
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
          { field: { Name: "description_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "updatedAt_c" } }
        ]
      };

      const response = await apperClient.fetchRecords('project_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Map database fields to UI field names
      return (response.data || []).map(project => ({
        Id: project.Id,
        name: project.Name,
        description: project.description_c,
        tags: project.Tags,
        owner: project.Owner?.Name || project.Owner,
        createdAt: project.createdAt_c,
        updatedAt: project.updatedAt_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching projects:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error("Failed to fetch projects");
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
          { field: { Name: "description_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "updatedAt_c" } }
        ]
      };

      const response = await apperClient.getRecordById('project_c', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      const project = response.data;
      return {
        Id: project.Id,
        name: project.Name,
        description: project.description_c,
        tags: project.Tags,
        owner: project.Owner?.Name || project.Owner,
        createdAt: project.createdAt_c,
        updatedAt: project.updatedAt_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching project with ID ${id}:`, error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error("Failed to fetch project");
      }
      return null;
    }
  },

  async create(projectData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map UI field names to database field names and filter only Updateable fields
      const dbProjectData = {
        Name: projectData.name,
        Tags: projectData.tags || "",
        description_c: projectData.description || "",
        createdAt_c: new Date().toISOString(),
        updatedAt_c: new Date().toISOString()
      };

      const params = {
        records: [dbProjectData]
      };

      const response = await apperClient.createRecord('project_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} projects:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const createdProject = successfulRecords[0].data;
          return {
            Id: createdProject.Id,
            name: createdProject.Name,
            description: createdProject.description_c,
            tags: createdProject.Tags,
            owner: createdProject.Owner?.Name || createdProject.Owner,
            createdAt: createdProject.createdAt_c,
            updatedAt: createdProject.updatedAt_c
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating project:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error("Failed to create project");
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
      if (data.description !== undefined) dbData.description_c = data.description;
      if (data.tags !== undefined) dbData.Tags = data.tags;
      
      dbData.updatedAt_c = new Date().toISOString();

      const params = {
        records: [dbData]
      };

      const response = await apperClient.updateRecord('project_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} projects:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const updatedProject = successfulUpdates[0].data;
          return {
            Id: updatedProject.Id,
            name: updatedProject.Name,
            description: updatedProject.description_c,
            tags: updatedProject.Tags,
            owner: updatedProject.Owner?.Name || updatedProject.Owner,
            createdAt: updatedProject.createdAt_c,
            updatedAt: updatedProject.updatedAt_c
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating project:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error("Failed to update project");
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

      const response = await apperClient.deleteRecord('project_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} projects:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting project:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error("Failed to delete project");
      }
      return null;
    }
  }
};

export default projectService;