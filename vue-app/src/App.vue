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
  
  <!-- Action Bar -->
   <div class="action-panel">
      <span> 
        <div>
          <h3>
            Tasks
          </h3>
        </div>
        <div>
          {{ tasks.length }} Tasks
        </div>
      </span>
      <!-- Action Options -->
      <!-- Filter -->
      <span> 
        <span>
          Filter by Status:
        </span>
        <select 
        name="task-filter"
        v-model="selectedFilter"
        @change="filterTasks(selectedFilter)"> Filter
          <option value="" @click="filterTasks(null)"> All </option>
          <option value="BLOCKED" @click="filterTasks('BLOCKED')"> Blocked </option>
          <option value="TODO" @click="filterTasks('TODO')"> Todo </option>
          <option value="IN_PROGRESS" @click="filterTasks('IN_PROGRESS')"> In Progress </option>
          <option value="DONE" @click="filterTasks('DONE')"> Done </option>
        </select> 
      </span>
   </div>

        <!-- Task List -->
    <div>
      <ul class="task-list">
        <li class="task-item scale-out-and-shadow" v-for="(task, index) in filteredTasks"
          :key="task.id"
          :class="index % 2 === 0 ? 'even' : 'odd'">
          <!-- <span v-for="item in task" v-text="item"></span> -->

          <span>
          <span v-text="task.title" class="task-title"></span>

          <span> 
          <!-- dropbox for user to change progress state. hidden on blocked -->
              <span class="task-state-wrapper">
                <span>
                  Task Status: 
                </span>

                <select
                  name = "task-state-updater"
                  v-model = task.state
                  @change="updateTaskStatus(task)"
                  :hidden="task.state === 'BLOCKED'"
                  class="task-state"
                  >
                  <option value="TODO">To-do</option>
                  <option value="IN_PROGRESS">In-progress</option>
                  <option value="DONE">Done</option>
                </select>

                <!-- Condition to remove the dropbox on task.status === 'blocked' -->
                <span 
                v-if="task.state === 'BLOCKED'"
                class="task-state"> 
                    <div class="task-state-blocked-wrapper">
                      Blocked
                    </div>
                  </span>
              </span>
            </span>
          </span>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue' //reflects changes across the object 'Tasks'.

export type Task = {
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
    tasks.splice(0, tasks.length, ...await response.json()) //replace the tasks array with the fetched data
  }
  catch (error) {
    console.error('Error fetching tasks:', error);
  }
}

// FILTER the tasks from task list
// For future documentation purposes:
// Requires computed, ref, + a new referential list to store tasks and allowed for dynamic filtering.
const selectedFilter = ref<string | null>(null)
const filteredTasks = computed(() => {
  if (!selectedFilter.value) return tasks

  return tasks.filter(task => task.state === selectedFilter.value)
})

async function filterTasks(filter: string | null) : Promise<void> {
  selectedFilter.value = filter
}

// PUSH (create) a task to the task list
async function createTask(newTask: Task): Promise<void> {
  try {

  }
  catch (error) {
    console.error('Error creating task:', error);
  }
}

// POST (edit) task status
async function updateTaskStatus(task: Task): Promise<void> {
  // const stringifiedTaskStatus : string = (taskState.target as HTMLSelectElement).value
  await fetch(`http://localhost:8000/tasks/${task.id}/state/${task.state}`, 
  {
    method: 'POST'
  }
  ) 
  fetchTasks() //refresh the tasks list to reflect the updated status
}

const tasks = reactive<Task[]>([])

//Mounting, following best practice learnt from internship
onMounted(() => {
  fetchTasks()
})

</script>

<style scoped>

  *{
    margin: 0px;
    padding: 0px;
    font-family: Arial, Helvetica, sans-serif;
  }

  template{
    background-color: rgb(200, 200, 200);
  }

  .action-panel{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background-color: rgb(0, 0, 0, 5%);
    margin-top: 10px;
  }

  .task-list{
    list-style-type: none;
  }

  .task-item{
    padding: 15px;
  }

  .task-item:hover{
    background-color: rgb(255, 255, 255);
    border-radius: 5px;
  }

  .scale-out-and-shadow:hover
  {
    transform: scale(1.005);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.25s ease-in;
  }

  .task-state-wrapper{
    gap: 10px;
    align-items: center;
    height: 30px;
  }

  .task-state-blocked-wrapper{
    font-weight: 700;
    color: rgb(120, 0, 0);
    width: 100%;
    background-color: rgb(180, 0, 0, 20%);
    padding: 5px;
  }

  .task-state{
    width: 100px;
    font-size: 14px;
    height: 100%;
    border-radius: 2.5px;
    background-color: rgb(0, 0, 0, 10%);
    border: 0px;
    align-items: center;
  }

  .darken-on-hover:hover
  {
    filter: brightness(90%);
    transition: all 0.25s ease-in;
  }

  .task-item span {
    justify-content: space-between;
    display: flex;
  }

  .task-title{
    font-weight: 800;
    width: 300px;
  }

  .task-buttons button{
    padding: 5px 10px;
    border-radius: 5px;
    border: none;
    color: rgb(250, 250, 250);
    font-weight: 700;
    cursor: pointer;
    height: 100%;
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

</style>