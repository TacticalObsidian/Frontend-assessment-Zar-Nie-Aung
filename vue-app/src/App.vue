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
        <span id="filter-blocked" @click="filterBlocked"> Blocked </span>
        <span id="filter-todo"> Todo </span>
        <span id="filter-in_progress"> In Progress </span>
        <span id="filter-done"> Done </span>
      </span>
    </div>

    <div>
      <!-- Task List -->
      <ul class="task-list">
        <li class="task-item" v-for="(task, index) in tasks"
          :key="task.id"
          :class="index % 2 === 0 ? 'even' : 'odd'">
          <!-- <span v-for="item in task" v-text="item"></span> -->

          <span>
          <span v-text="task.title"></span>

          <!-- dropbox for user to change progress state. hidden on blocked -->
          <select v-model="task.status" :hidden="task.status === 'blocked'">
            <option value="todo">To-do</option>
            <option value="in_progress">In-progress</option>
            <option value="done">Done</option>
          </select>

          <!-- Condition to remove the dropbox on task.status === 'blocked' -->
          <span v-if="task.status === 'blocked'"> Blocked </span>
          </span>
          
          <!-- TODO, add a kanban style dialog popup for edit -->
          <span> More </span>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup lang="ts">
// This file defines the Task interface and TaskStatus type used in the application.

// task statuses
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'blocked';
// 'todo' - task is not started yet
// 'in_progress' - task is currently being worked on
// 'done' - task is completed
// 'blocked' - task is blocked by another task and cannot be started until the blocking task is completed. Is automatically derived.

// task body
export type Task = {
    'id': string,
    'title': String,
    //'description': String,
    'status': TaskStatus,
    //'created_at': Date, 
    //'updated_at': Date,
    'dependents': String[] // array of task ids that depend on this task
}

const tasks: Task[] = [
  { id: '1', title: 'Task A', status: 'todo', dependents: [] },
  { id: '2', title: 'Task B', status: 'blocked', dependents: ['1'] },
  { id: '3', title: 'Task C', status: 'in_progress', dependents: [] },
  { id: '4', title: 'Task D', status: 'done', dependents: ['1'] },
];

/*
function recursiveRead(task: Task): void {
  if (task.status != "done") 
    for (const dependent in task.dependents)

}
*/

function filterBlocked(): void{}

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