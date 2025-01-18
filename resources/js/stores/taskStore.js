import { defineStore } from 'pinia'
import axios from 'axios'

export const useTaskStore = defineStore('task', {
    state: () => ({
        tasks: [],
        loading: false,
        error: null
    }),

    actions: {
        async fetchTasks() {
            this.loading = true
            try {
                const response = await axios.get('/api/tasks')
                this.tasks = response.data
            } catch (error) {
                this.error = error.message
            } finally {
                this.loading = false
            }
        },

        async createTask(task) {
            try {
                const response = await axios.post('/api/tasks', task)
                this.tasks.unshift(response.data)
                return response.data
            } catch (error) {
                this.error = error.message
                throw error
            }
        },

        async updateTask(id, task) {
            try {
                const response = await axios.put(`/api/tasks/${id}`, task)
                const index = this.tasks.findIndex(t => t.id === id)
                if (index !== -1) {
                    this.tasks[index] = response.data
                }
            } catch (error) {
                this.error = error.message
                throw error
            }
        },

        async deleteTask(id) {
            try {
                await axios.delete(`/api/tasks/${id}`)
                this.tasks = this.tasks.filter(t => t.id !== id)
            } catch (error) {
                this.error = error.message
                throw error
            }
        }
    }
}) 