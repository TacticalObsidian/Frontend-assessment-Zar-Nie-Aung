# Fullstack Developer Take-Home Assessment (Frontend focused) for Rooftop Energy Tech Sdn Bhd
## Solution By Zar Nie Aung

Hello examiner! Thank you for you for the opportunity to showcase my coding skills in this technical assesment. This repository showcases my solution for the todo-list assesment at hand.

# Prerequisites
- This project is developed using `VueJS v3.5.12` and `TypeScript` as the frontend packages.
- To run this vue project, please have `VITE v7.3.1`, `Node.js 20.17.0` (or 20.19+).
- To run the project, please run `npm install` and `npm run dev`

`TypeScript` is used as it is a mandatory requirement for this assesment.
`VueJS v3.5+` is used since I find it is a package familiar to me and one that I prefer over standard JavaScript.

# My approach to dependency evaluation and propagation
When testing the API directly, I found that the backend already automatically handled the state changes. I used this knowledge to reflect the backend behaviours onto the frontend as explained below.
These rules were all reinforced using VueJS's v-binding, including `v-model` and shorthand v-bind notations such as `:hidden`.

- Rules 1 and 3.
These rules are enforced using the v-binding methods. Using `:disable = "task.state === 'BLOCKED'"`, I forcefully blocked the `<select>` field named `task-state-updater` to prevent the user from changing the state of a blocked task. Likewise, using `v-if="task.state === 'blocked'"`, I hid the 'Blocked' tag from non-blocked tasks and only reveal it for blocked tasks. These 2 `v-bind` based logics allowed me to enforce both rules. 

- Rules 1, 2, 4, 5, 6.
These rules are enforced in the function `updateTaskStatus(task: Task)` used by the vue `<select>` tag named `task-state-updater`. The method works by posting the new value as derived from the `<option>` tag's `value` clause. Later in the function, the changes are forcefully reimplemented by calling the `fetchTask()`, reloading the lists and propagating the changes following the changes in the backend. 

# Data structures and algorithms used
Only 2 arrays were used in this assesment, both being arrays. The first being from the `fetchTasks()` method, which provides a array of tasks `Task` called `Tasks`, and the second array called `filteredTasks`, an array using VueJS's `computed` clause, enabling it to be more dynamic.
`Tasks` is fixed, serving as a complete record of tasks pulled from the database, whereas `filteredList` is more dynamic, being changed based on a filter conditioned called `selectedFilter`, a vue referential object which can either be of type `string` or `null`. Vue's `ref` object clause means that Vue will listen to changes to it.

Only 2 algorithms are used. The first is `fetchTask()` which populates the `Tasks` array. The second is in the declaration of `filteredList` where it filters out the `Tasks` array based on the `selectedFilter` value. This value is provided from the `option` in the `<select>` field called `task-filter`. One can liken the filtering as a face-mask, the face itself `Tasks` remains behind the mask `selectedFilter`, and the shape of the face that peers through the filter is what is seen `filteredList`.

# Assumptions and trade-offs
## Repository Structure
Assuming the requirements are quite simple, and most of the propagation logic is already handled in the backend from my own testing, I opted to keep the display logic and filter/state-update logic in the same source file `App.vue`. This way, it would be easier for me to develop the source code building up the app and also avoid having to go through different files. However, in doing so, I had made the file responsible for filter handling and task state changes with the display logic, making the source code handle more responsibilities. 

## Approach to the dependency evaluation and propagation
From my testing, I found that the rules were mostly done by the backend logic. From this assumption, I had simplied made enforcements to these rules on the frontend side to meet the expected frontend behaviour as specified, such as locking the user-transitions for `blocked` tasks by using Vue's `:disable` clause (rules 1 and 3), and running `fetchTask()` again after a state update to enforce rules (2, 4, 5, and 6).
This way, enforcing the frontend to behave as expected could be done in a simple way. However, this approach is strictly dependant that the rules 2, 4, 5, 6 are already done automatically by the backend and that the `task.state` value can be reused for frontend display logic. This makes the frontend display logic dependent on the backend logic. 

## Data Structures and Algorithms
Looking at the documentation, and having attempted it before, I could not find a feasible way to make a filtered API call using `task?state=`. Not wanting to constantly recall the `fetchTask()` method which could slow down the system, I opted for the 2-array approach used here. The arrays and their algorithms being easy to implement as they were simple. However, this means that the code would take up excess memory space when running which could hamper the performance of the system had the task array had a large number of records. 

# What more I would do had I had more time?
## CRUD functionalities
So far, only editing the task's state has been implemented. Had I had more time, I would have added a way to add and delete tasks, and update the other fields.

## Other visualization styles
From my experience, I found that other to-do lists had different ways to represent the tasks, their states, and dependencies. I initially aimed to allow for 3 different visual layouts, featuring the now seen list view, the kanban view, and the gantt-chart view. This way the application can be usable for users with different UI preferences.

## Multi-filter checkbox
Currently, the code only supports filtering one task state at a time. In other similar applications, I found that they allow a user to filter out multiple different details from a larger list. For example, I planned to allow the user to filter out task states `todo` and `in-progress` from the full list so that they can see those 2 groups of tasks.

## Better UI/UX
I also hoped to have feature better fonts and styling to make the app look similar to those in the modern market featuring icons (to make the system more accessible for those not-fluent in English) and give it a modern style to it.
