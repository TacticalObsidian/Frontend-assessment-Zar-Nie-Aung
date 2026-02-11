<template>
  <div>
    <div class="title">
      <h1>
        ZN-Task Tracker
      </h1>
      <h5>
        Your trusted task tracker
      </h5>
    </div>

  <!-- Filter bar -->
    <div class="filter-panel">
      <span> Filter: </span>
      <span class="filter-option-wrapper">
        <button id="filter-blocked" @click="filterTasks('BLOCKED')"> Blocked </button>
        <button id="filter-todo" @click="filterTasks('TODO')"> Todo </button>
        <button id="filter-in_progress" @click="filterTasks('IN_PROGRESS')"> In Progress </button>
        <button id="filter-done" @click="filterTasks('DONE')"> Done </button>
      </span>
    </div>

    <div>
      <!-- Task List -->
      <ul class="task-list">
        <li class="task-item" v-for="(task, index) in filteredTasks"
          :key="task.id"
          :class="index % 2 === 0 ? 'even' : 'odd'">
          <!-- <span v-for="item in task" v-text="item"></span> -->

          <span>
          <span v-text="task.title"></span>

          <!-- dropbox for user to change progress state. hidden on blocked -->
          <select
            v-model = task.state
            @change="updateTaskStatus(task)"
            :disabled="task.state === 'BLOCKED'"
            >
            <option value="TODO">To-do</option>
            <option value="IN_PROGRESS">In-progress</option>
            <option value="DONE">Done</option>
          </select>

          <!-- Condition to remove the dropbox on task.status === 'blocked' -->
          <span v-if="task.state === 'BLOCKED'"> Blocked </span>
          </span>
          
          <!-- TODO, add a kanban style dialog popup for edit -->
          <span> More </span>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue' //reflects changes across the object 'Tasks'.

export type Task2 = {
  'title': string,
  'description': string,
  'due_date': string,
  'id': number,
  'state': string,
  'completed_at': string,
  'created_at': string,
  'updated_at': string,
  'blockers': [],
  'dependents': []
}

// GET tasks from task list
async function fetchTasks(): Promise<void> {
  try {
    const response : Response = await fetch('http://localhost:8000/tasks')
    tasksAPI.splice(0, tasksAPI.length, ...await response.json()) //replace the tasks array with the fetched data
  }
  catch (error) {
    console.error('Error fetching tasks:', error);
  }
}

// FILTER the tasks from task list
// For future documentation purposes:
// Requires computed, ref, + a new referential list to store tasks and allowed for dynamic filtering.
// Subject to resturcturing for better maintaianability and readability
const selectedFilter = ref<string | null>(null)
const filteredTasks = computed(() => {
  if (!selectedFilter.value) return tasksAPI

  return tasksAPI.filter(task => task.state === selectedFilter.value)
})

async function filterTasks(filter: string): Promise<void> {
  selectedFilter.value = filter
}

// PUSH (create) a task to the task list
async function createTask(newTask: Task2): Promise<void> {
  try {

  }
  catch (error) {
    console.error('Error creating task:', error);
  }
}

// POST (edit) task status
async function updateTaskStatus(task: Task2): Promise<void> {
  // const stringifiedTaskStatus : string = (taskState.target as HTMLSelectElement).value
  await fetch(`http://localhost:8000/tasks/${task.id}/state/${task.state}`, 
  {
    method: 'POST'
  }
  ) 
  fetchTasks() //refresh the tasks list to reflect the updated status
}

const tasksAPI = reactive<Task2[]>([])

//Mounting, following best practice learnt from internship
onMounted(() => {
  fetchTasks()
})

</script>

<style scoped>

  *{
    margin: 0px;
    padding: 0px;
  }

  .task-list{
    list-style-type: none;
  }

  .task-item{
    padding:5px 0px 5px 0px;
    display: flex;
    justify-content: space-between;
  }

  .task-item span {
    padding-right: 10px;
  }

  .even {
    background-color: rgb(0, 0, 0, 10%);
  }

  .odd {
    background-color: rgb(0, 0, 0, 5%);
  }

  .title{
    background-color: rgb(0, 200, 120);
    padding: 15px;
    color: rgb(250, 250, 200);
  }

  .filter-panel{
    padding: 15px;
    background-color: rgb(0, 0, 0, 5%);
  }

  .filter-option-wrapper{
    display: flex;
    gap: 10px;
  }

  .filter-option-wrapper span{
    padding: 2.5px 5px;
    width: 80px;
    height: 20px;
    font-weight: 700;
    border-radius: 5px;
    display: flex;
    justify-content: center;
  }

  #filter-blocked {
    background-image: linear-gradient(red, rgb(100, 0, 0));
    color: white;
  }

  #filter-todo {
    background-image: linear-gradient(rgb(0, 123, 255), rgb(0, 83, 125));
    color: white;
  }

  #filter-in_progress {
    background-image: linear-gradient(rgb(123, 0, 255), rgb(83, 0, 125));
    color: white;
  }

  #filter-done {
    background-image: linear-gradient(rgb(0, 255, 0), rgb(0, 100, 0));
    color: white;
  }

</style>