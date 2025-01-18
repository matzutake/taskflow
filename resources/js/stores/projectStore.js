import { defineStore } from 'pinia'
import axios from 'axios'

export const useProjectStore = defineStore('project', {
    state: () => ({
        projects: [],
        loading: false,
        error: null
    }),

    actions: {
        async fetchProjects() {
            this.loading = true
            try {
                const response = await axios.get('/api/projects')
                this.projects = response.data
            } catch (error) {
                this.error = error.message
            } finally {
                this.loading = false
            }
        },

        async createProject(project) {
            try {
                const response = await axios.post('/api/projects', project)
                this.projects.unshift(response.data)
                return response.data
            } catch (error) {
                this.error = error.message
                throw error
            }
        }
    }
}) 