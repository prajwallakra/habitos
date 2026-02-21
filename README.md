# Habitos - Habit & Task Tracking App


A modern, full-featured habit and task tracking application built with React and TailwindCSS. Track your daily habits, manage tasks, and build consistency with beautiful visual feedback.

## 💡 Features
 - **Calendar :** have daily task tracking feature 
 - **Habit Tracker :** have daily task related habit-tracking feature 
 - **ToDos :** have list of all the task that is to be done today, arranged with different kind of filters

## 🌐 Live Demo

### Try It Out

- **Frontend Demo**: [https://habitos.xyz](https://habitos.xyz)
- **UI Design Preview**: [https://excalidraw.com/#room=84640e4c6e2a7c832277,tBIcfKAGkP3AbTKeo3MxHw](https://excalidraw.com/#room=84640e4c6e2a7c832277,tBIcfKAGkP3AbTKeo3MxHw)

## 🛠️ Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **State Management:** React Context API
- **Storage:** LocalStorage
- **Icons:** SVG icons
- **Animations:** CSS Transitions

## 📁 Project Structure
```bash
src/
├── buildLayout/
│ ├── Mainlayout/
│ │  ├── Mainlayout.jsx
│ │  └── components/
│ │      ├── Calendar/
│ │      │ ├── Calendar.jsx
│ │      │ ├── SelectDate.jsx
│ │      │ ├── AddTaskModal.jsx
│ │      │ └── ShowTasks.jsx
│ │      └── habit/
│ │        ├── habit.jsx
│ │        ├── HabitCard.jsx
│ │        ├── HabitDetailModal.jsx
│ │        ├── HabitForm.jsx
│ │        ├── HabitStats.jsx
│ │        ├── HabitFilters.jsx
│ │        └── hooks/
│ │            └── useHabitData.js
│ └── Rightbar/
│     ├── Rightbar.jsx
│     ├── components/
│     │ ├── Header.jsx
│     │ ├── FilterTabs.jsx
│     │ ├── TaskSection.jsx
│     │ ├── TaskItem.jsx
│     │ ├── TaskList.jsx
│     │ └── NotesSection.jsx
│     └── hooks/
│       └── useTaskFilters.js
├── context/
│ └── AppContext.jsx
└── App.jsx

```
##  🔰 Getting Started


### Prerequisites
- **Node.js** (v14 or higher)
- **npm** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/prajwallakra/habitos
   cd habitos
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Start the development server**
   ```bash
   npm run dev
   ```
4. **Open your browser navigate to see the app in action** 
   ```bash
   http://localhost:5173 
   ```


---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Made with ❤️ for better education management**

[Report Bug](https://github.com/prajwallakra/habitos/issues) · [Request Feature](https://github.com/prajwallakra/habitos/issues) · [Contribute](./CONTRIBUTING.md)

</div>