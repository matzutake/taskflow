<script setup>
import { onMounted, ref } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const taskStore = useTaskStore()
const showModal = ref(false)
const isEditing = ref(false)
const currentTask = ref({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    due_date: ''
})

const statusOptions = [
    { value: 'todo', label: 'К выполнению', class: 'bg-gray-100 text-gray-800' },
    { value: 'in_progress', label: 'В процессе', class: 'bg-yellow-100 text-yellow-800' },
    { value: 'done', label: 'Выполнено', class: 'bg-green-100 text-green-800' }
]

const priorityOptions = [
    { value: 'low', label: 'Низкий', class: 'bg-blue-100 text-blue-800' },
    { value: 'medium', label: 'Средний', class: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'Высокий', class: 'bg-red-100 text-red-800' }
]

onMounted(() => {
    taskStore.fetchTasks()
})

const openCreateModal = () => {
    isEditing.value = false
    currentTask.value = {
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        due_date: ''
    }
    showModal.value = true
}

const openEditModal = (task) => {
    isEditing.value = true
    currentTask.value = { ...task }
    showModal.value = true
}

const handleSubmit = async () => {
    try {
        if (isEditing.value) {
            await taskStore.updateTask(currentTask.value.id, currentTask.value)
        } else {
            await taskStore.createTask(currentTask.value)
        }
        showModal.value = false
    } catch (error) {
        console.error('Error saving task:', error)
    }
}

const deleteTask = async (id) => {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
        try {
            await taskStore.deleteTask(id)
        } catch (error) {
            console.error('Error deleting task:', error)
        }
    }
}

const getStatusBadgeClass = (status) => {
    return statusOptions.find(opt => opt.value === status)?.class || 'bg-gray-100'
}

const getPriorityBadgeClass = (priority) => {
    return priorityOptions.find(opt => opt.value === priority)?.class || 'bg-gray-100'
}
</script>

<template>
    <div>
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold">Задачи</h2>
            <button 
                @click="openCreateModal"
                class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
                Новая задача
            </button>
        </div>

        <div v-if="taskStore.loading" class="text-center py-4">
            Загрузка...
        </div>

        <div v-else-if="taskStore.tasks.length === 0" class="text-center py-4 text-gray-500">
            Нет задач. Создайте новую задачу!
        </div>

        <div v-else class="grid gap-4">
            <div 
                v-for="task in taskStore.tasks" 
                :key="task.id"
                class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold">{{ task.title }}</h3>
                        <p class="text-gray-600 mt-1">{{ task.description }}</p>
                        <div class="flex gap-2 mt-2">
                            <span :class="[getStatusBadgeClass(task.status), 'px-2 py-1 text-sm rounded-full']">
                                {{ statusOptions.find(opt => opt.value === task.status)?.label }}
                            </span>
                            <span :class="[getPriorityBadgeClass(task.priority), 'px-2 py-1 text-sm rounded-full']">
                                {{ priorityOptions.find(opt => opt.value === task.priority)?.label }}
                            </span>
                            <span v-if="task.due_date" class="text-sm text-gray-500">
                                Срок: {{ new Date(task.due_date).toLocaleDateString() }}
                            </span>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button 
                            @click="openEditModal(task)"
                            class="text-blue-600 hover:text-blue-800"
                        >
                            Редактировать
                        </button>
                        <button 
                            @click="deleteTask(task.id)"
                            class="text-red-600 hover:text-red-800"
                        >
                            Удалить
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded-lg w-full max-w-md">
                <h3 class="text-lg font-bold mb-4">
                    {{ isEditing ? 'Редактировать задачу' : 'Новая задача' }}
                </h3>
                <form @submit.prevent="handleSubmit">
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-1">Название</label>
                        <input 
                            v-model="currentTask.title"
                            type="text"
                            class="w-full border rounded-md px-3 py-2"
                            required
                        >
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-1">Описание</label>
                        <textarea
                            v-model="currentTask.description"
                            class="w-full border rounded-md px-3 py-2"
                            rows="3"
                        ></textarea>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Статус</label>
                            <select 
                                v-model="currentTask.status"
                                class="w-full border rounded-md px-3 py-2"
                            >
                                <option 
                                    v-for="option in statusOptions" 
                                    :key="option.value"
                                    :value="option.value"
                                >
                                    {{ option.label }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Приоритет</label>
                            <select 
                                v-model="currentTask.priority"
                                class="w-full border rounded-md px-3 py-2"
                            >
                                <option 
                                    v-for="option in priorityOptions" 
                                    :key="option.value"
                                    :value="option.value"
                                >
                                    {{ option.label }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-1">Срок выполнения</label>
                        <input 
                            v-model="currentTask.due_date"
                            type="date"
                            class="w-full border rounded-md px-3 py-2"
                        >
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
                            {{ isEditing ? 'Сохранить' : 'Создать' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>