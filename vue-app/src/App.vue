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
        <span id="filter-blocked"> Blocked </span>
        <span id="filter-todo"> Todo </span>
        <span id="filter-in_progress"> In Progress </span>
        <span id="filter-done"> Done </span>
      </span>
    </div>

    <div>
      <!-- Task List -->
      <ul class="task-list">
        <li class="task-item" v-for="(task, index) in tasksAPI"
          :key="task.id"
          :class="index % 2 === 0 ? 'even' : 'odd'">
          <!-- <span v-for="item in task" v-text="item"></span> -->

          <span>
          <span v-text="task.title"></span>

          <!-- dropbox for user to change progress state. hidden on blocked -->
          <select
            v-model = task.state
            @change="updateTaskStatus(task.id, $event)"
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
import { reactive, onMounted } from 'vue' //reflects changes across the object 'Tasks'.

// fetch the tasks

// task statuses
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'blocked'


// task body
export type Task = {
    'id': string,
    'title': String,
    //'description': String,
    'status': TaskStatus,
    //'created_at': Date, 
    //'updated_at': Date,
    'dependencies': String[] // array of tasks this task depends on. If any of the dependencies are not done, this task is blocked.
}

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
async function fetchTasks() {
  try {
    const response = await fetch('http://localhost:8000/tasks')
    const data = await response.json()
    tasksAPI.splice(0, tasksAPI.length, ...data) //replace the tasks array with the fetched data
  }
  catch (error) {
    console.error('Error fetching tasks:', error);
  }
}

onMounted(() => {
  fetchTasks()
})

// PATCH (edit) task status
async function updateTaskStatus(taskID: number, taskState: Event){
  const stringifiedTaskStatus = (taskState.target as HTMLSelectElement).value as string
  await fetch(`http://localhost:8000/tasks/${taskID}/state/${stringifiedTaskStatus}`, 
  {
    method: 'POST'
  }
  ) 
}

// RECURSIVE PATCH (edit) dependent task status to blocked or todo

// Filter GET Tasks by Task.State

const tasksAPI = reactive<Task2[]>([])

const tasks = reactive<Task[]> ([
  { id: '1', title: 'Task A', status: 'blocked', dependencies: ['2', '3', '4'] },
  { id: '2', title: 'Task B', status: 'blocked', dependencies: ['3', '4'] },
  { id: '3', title: 'Task C', status: 'blocked', dependencies: ['4'] },
  { id: '4', title: 'Task D', status: 'todo', dependencies: [] },
]);

//Aligns with req 3. Automates the state changes of a task across the system.
function onStatusChange(event: Event, task: Task): void {
  const taskStatus = (event.target as HTMLSelectElement).value as TaskStatus //the value is captured
  task.status = taskStatus; //the status is changed

  //On 'done', we...
  if(taskStatus == 'done'){

    //scan for any tasks in the tasks array...
    for(const dependentTask of tasks){
      if(dependentTask.dependencies.includes(task.id)){ //with a dependency to this task (relies on updated tasks)
        const allDepsDone = dependentTask.dependencies.every(depId => { //checks to see if all dependent tasks are done to mark it as 'to-do'
          const depTask = tasks.find(task => task.id === depId); 
          return depTask?.status === 'done'; 
        });
        dependentTask.status = allDepsDone ? 'todo' : 'blocked'; //true? 'to-do', false? 'blocked'
      }
    }
  }

  //scans for any tasks in the tasks array with a dependency to this task, if the new status is not 'done', mark it all dependents as 'blocked'.
  if(taskStatus != 'done'){
    for(const dependentTask of tasks){
      if(dependentTask.dependencies.includes(task.id)){
        dependentTask.status = 'blocked'
      }
    }
  }

  // TODO, update the backend with the new status
  // TODO, update the frontend with the new status
}

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