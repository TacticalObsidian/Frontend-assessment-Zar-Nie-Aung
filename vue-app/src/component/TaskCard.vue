<!-- components/TaskItem.vue -->
<script setup lang="ts">
import type { Task } from '../core/task'; //Get the Task type from core module task

const props = defineProps<{ task: Task }>(); //Define the task props
</script>

<template>
    <!-- Frontend template component -->
  <div>
    <span>{{ props.task.id }}</span>
    <span>{{ props.task.title }}</span>
    <span>[{{ props.task.status }}]</span>
    <span>[{{ props.task.created_at }}]</span>
  </div>
</template>