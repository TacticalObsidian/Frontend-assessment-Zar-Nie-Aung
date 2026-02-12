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
        class="task-state"
        :class="{
          'task-state--todo': selectedFilter === 'TODO',
          'task-state--in_progress': selectedFilter === 'IN_PROGRESS',
          'task-state--done': selectedFilter === 'DONE',
          'task-state--blocked': selectedFilter === 'BLOCKED'
        }"
        > Filter
          <option value=""> All </option>
          <option value="BLOCKED"> Blocked </option>
          <option value="TODO"> Todo </option>
          <option value="IN_PROGRESS"> In Progress </option>
          <option value="DONE"> Done </option>
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
            <div class="task-header">
              <div v-text="task.id" class="task-id"></div>
              <span v-text="task.title" class="task-title"></span>
            
              <!-- blocker list -->
            <div 
            class="task-blocker"> 

              <span>
                Blockers: 
              </span>

              <span v-if="task.blockers.length > 0">
                <ul class="blocker-list">
                  <li 
                  v-for="blocker in task.blockers" 
                  :key="blocker"
                  class="blocker-id">
                    {{ blocker }}
                  </li>
                </ul>
              </span>

            <span v-else class="blocker-id no-blockers"> 
              No Blockers
            </span>

            </div>
            
            </div>

            <span> 
            <!-- dropbox for user to change progress state. hidden on blocked -->
              <span class="task-state-wrapper">
                <span class="task-state-label">
                  Task Status: 
                </span>

                <select
                  name = "task-state-updater"
                  v-model = task.state
                  @change="updateTaskStatus(task)"
                  :hidden="task.state === 'BLOCKED'"
                  class="task-state"
                  :class="['task-state', `task-state--${task.state.toLowerCase()}`]"
                  >
                  <option class="task-state state-todo" value="TODO">To-do</option>
                  <option class="task-state state-progress" value="IN_PROGRESS">In-progress</option>
                  <option class="task-state state-done" value="DONE">Done</option>
                </select>

                <!-- Condition to remove the dropbox on task.status === 'blocked' -->
                <span 
                v-if="task.state === 'BLOCKED'"
                class="task-state task-state--blocked"> 
                  <div>
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
const selectedFilter = ref<string>("")
const filteredTasks = computed(() => {
  if (!selectedFilter.value) return tasks

  return tasks.filter(task => task.state === selectedFilter.value)
})

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
  }

  .task-list, .blocker-list{
    list-style-type: none;
  }

  .task-blocker{
    display: flex;
    justify-content: left;
    width: 300px;
    align-items: center;
    gap: 10px;
  }

  .blocker-list{
    height: 30px;
    display: flex;
    gap: 5px;
  }

  .blocker-id{
    display: flex;
    align-items: center;
    height: 30px;
    padding: 0px 10px;
    border-radius: 5px;
    background-color: rgb(0, 0, 0, 10%);
  }

  .no-blockers{
    background-color: rgb(0, 255, 0, 50%);
  }

  .task-item{
    padding: 15px;
  }

  .task-item:hover{
    background-color: rgb(255, 255, 255);
    border-radius: 5px;
  }

  .task-state-wrapper{
    gap: 10px;
    align-items: center;
    height: 30px;
  }

  .blocker-task{
    width: 10px;
    height: 30px;
    font-size: 14px;
    font-weight: 700;
    justify-content: center;
    align-items: center;
  }

  .task-state{
    width: 100px;
    font-size: 14px;
    font-weight: 700;
    height: 30px;
    border-radius: 2.5px;
    background-color: rgb(0, 0, 0, 10%);
    border: 0px;
    align-items: center;
  }

  .task-state--todo{
    background-color: rgb(200, 200, 0, 20%);
    color: rgb(120, 120, 0);
  }
  
  .task-state--in_progress{
    background-color: rgb(0, 200, 200, 20%);
    color: rgb(0, 120, 120);
  }

  .task-state--done{
    background-color: rgb(0, 200, 0, 20%);
    color: rgb(0, 120, 0);
  }

  .task-state--blocked{
    color: rgb(120, 0, 0);
    width: 95px;
    background-color: rgb(180, 0, 0, 20%);
    padding-left: 5px;
  }

  .scale-out-and-shadow:hover
  {
    transform: scale(1.005);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.25s ease-in;
  }

  .task-item span {
    justify-content: space-between;
    display: flex;
  }

  .task-header{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }

  .task-id{
    display: flex;
    height: 30px;
    width: 30px;
    border-radius: 5px;
    background-color: rgb(0, 0, 0, 20%);
    justify-content: center;
    align-items: center;
  }

  .task-title{
    font-weight: 800;
    width: 180px;
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
</style>