<script setup>
import { onMounted, ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore'

const projectStore = useProjectStore()
const showModal = ref(false)
const newProject = ref({
    name: '',
    description: ''
})

onMounted(() => {
    projectStore.fetchProjects()
})

const createProject = async () => {
    try {
        await projectStore.createProject(newProject.value)
        showModal.value = false
        newProject.value = { name: '', description: '' }
    } catch (error) {
        console.error('Error creating project:', error)
    }
}
</script>

<template>
    <div>
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold">Проекты</h2>
            <button 
                @click="showModal = true"
                class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
                Новый проект
            </button>
        </div>

        <div v-if="projectStore.loading" class="text-center py-4">
            Загрузка...
        </div>

        <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div 
                v-for="project in projectStore.projects" 
                :key="project.id"
                class="bg-white p-4 rounded-lg shadow"
            >
                <h3 class="text-lg font-semibold">{{ project.name }}</h3>
                <p class="text-gray-600 mt-2">{{ project.description }}</p>
            </div>
        </div>

        <!-- Modal -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded-lg w-full max-w-md">
                <h3 class="text-lg font-bold mb-4">Новый проект</h3>
                <form @submit.prevent="createProject">
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-1">Название</label>
                        <input 
                            v-model="newProject.name"
                            type="text"
                            class="w-full border rounded-md px-3 py-2"
                            required
                        >
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-1">Описание</label>
                        <textarea
                            v-model="newProject.description"
                            class="w-full border rounded-md px-3 py-2"
                            rows="3"
                        ></textarea>
                    </div>
                    <div class="flex justify-end gap-2">
                        <button 
                            type="button"
                            @click="showModal = false"
                            class="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Отмена
                        </button>
                        <button 
                            type="submit"
                            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Создать
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template> 