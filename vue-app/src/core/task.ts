// This file defines the Task interface and TaskStatus type used in the application.

// task statuses
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'blocked';
// 'todo' - task is not started yet
// 'in_progress' - task is currently being worked on
// 'done' - task is completed
// 'blocked' - task is blocked by another task and cannot be started until the blocking task is completed. Is automatically derived.

// task body
export type Task = {
    'id': String,
    'title': String,
    'description': String,
    'status': TaskStatus,
    'created_at': Date, 
    'updated_at': Date,
    'dependents': String[] // array of task ids that depend on this task
}