'use strict';

interface Habit {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  type: string;
  progress: number;
  goal: number;
}

let habits: Habit[] = [];
const habitForm = document.querySelector('.form1') as HTMLFormElement;
const goodHabitsContainer = document.getElementById('good') as HTMLElement;
const badHabitsContainer = document.querySelector('.bad') as HTMLElement;

// Function to calculate the number of days between two dates
function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Function to create a habit element
function createHabitElement(habit: Habit): HTMLElement {
  const habitElement = document.createElement('div');
  habitElement.classList.add('habit');
  habitElement.innerHTML = `
    <div class="habithead">
      <p style"font-size: 25px;">${habit.name}</p>
      <p>${habit.progress}/${habit.goal} to goal</p>
    </div>
    <div class="habitcontent">
      <button class="incrementor">+1</button>
      <div class="progress-bar-container">
        <div class="progress-bar" style="width: ${(habit.progress / habit.goal) * 100}%;"></div>
      </div>
    </div>
    <div class="habittail">
      <button class="delete"><ion-icon name="trash-outline"></ion-icon> &nbsp;Delete</button>
      <button class="reset"><ion-icon name="refresh-outline"></ion-icon>&nbsp;Reset</button>
    </div>
  `;

  habitElement.querySelector('.incrementor')!.addEventListener('click', () => incrementProgress(habit));
  habitElement.querySelector('.delete')!.addEventListener('click', () => deleteHabit(habit.id));
  habitElement.querySelector('.reset')!.addEventListener('click', () => resetHabit(habit));
  return habitElement;
}

// Function to load habits from the JSON server
async function loadHabits(): Promise<void> {
  const response = await fetch('http://localhost:3000/streakData');
  habits = await response.json();
  renderHabits();
}

// Function to render habits on the UI
function renderHabits(): void {
  goodHabitsContainer.innerHTML = '<h2>New Habits</h2>';
  badHabitsContainer.innerHTML = '<h2>Dropped Habits</h2>';
  habits.forEach(habit => {
    const habitElement = createHabitElement(habit);
    if (habit.type === 'good') {
      goodHabitsContainer.appendChild(habitElement);
    } else {
      badHabitsContainer.appendChild(habitElement);
    }
  });
}

// Function to handle habit form submission
habitForm.addEventListener('submit', async (event: Event) => {
  event.preventDefault();

  const name = (document.getElementById('name') as HTMLInputElement).value;
  const startDate = (document.getElementById('startDate') as HTMLInputElement).value;
  const endDate = (document.getElementById('endDate') as HTMLInputElement).value;
  const type = (document.querySelector('input[name="option"]:checked') as HTMLInputElement).value;
  const goal = calculateDays(startDate, endDate);

  const newHabit: Habit = {
    id: Date.now(),
    name,
    startDate,
    endDate,
    type,
    progress: 0,
    goal,
  };

  habits.push(newHabit);
  await saveHabit(newHabit);
  renderHabits();
  habitForm.reset();
});

// Function to save habit to the JSON server
async function saveHabit(habit: Habit): Promise<void> {
  await fetch('http://localhost:3000/streakData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(habit),
  });
}

// Function to increment habit progress
function incrementProgress(habit: Habit): void {
  if (habit.progress < habit.goal) {
    habit.progress++;
    updateHabit(habit);
    renderHabits();
  }
}

// Function to delete a habit
async function deleteHabit(id: number): Promise<void> {
  habits = habits.filter(habit => habit.id !== id);
  const url = `http://localhost:3000/streakData/${id}`;  // Use ID in the path
  console.log(`Sending DELETE request to: ${url}`);
  const response = await fetch(url, {
    method: 'DELETE',
  });
  if (!response.ok) {
    console.error(`Failed to delete habit. Server responded with status: ${response.status}`);
  } else {
    console.log(`Successfully deleted habit with id: ${id}`);
  }
  renderHabits();
}

// Function to reset habit progress
function resetHabit(habit: Habit): void {
  habit.progress = 0;
  updateHabit(habit);
  renderHabits();
}

// Function to update habit on the JSON server
async function updateHabit(habit: Habit): Promise<void> {
  const url = `http://localhost:3000/streakData/${habit.id}`;  // Use ID in the path
  console.log(`Sending PUT request to: ${url}`);
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(habit),
  });
  if (!response.ok) {
    console.error(`Failed to update habit. Server responded with status: ${response.status}`);
  } else {
    console.log(`Successfully updated habit with id: ${habit.id}`);
  }
}

// Initial load of habits
loadHabits();
