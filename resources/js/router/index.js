import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/Layouts/MainLayout.vue'
import Dashboard from '@/Pages/Dashboard.vue'
import Projects from '@/Pages/Projects.vue'
import Tasks from '@/Pages/Tasks.vue'

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: '',
                name: 'dashboard',
                component: Dashboard
            },
            {
                path: 'projects',
                name: 'projects',
                component: Projects
            },
            {
                path: 'tasks',
                name: 'tasks',
                component: Tasks
            }
        ]
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes
}) 