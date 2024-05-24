'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let habits = [];
const habitForm = document.querySelector('.form1');
const goodHabitsContainer = document.getElementById('good');
const badHabitsContainer = document.querySelector('.bad');
// Function to calculate the number of days between two dates
function calculateDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}
// Function to create a habit element
function createHabitElement(habit) {
    const habitElement = document.createElement('div');
    habitElement.classList.add('habit');
    habitElement.innerHTML = `
    <div class="habithead">
      <p>${habit.name}</p>
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
    habitElement.querySelector('.incrementor').addEventListener('click', () => incrementProgress(habit));
    habitElement.querySelector('.delete').addEventListener('click', () => deleteHabit(habit.id));
    habitElement.querySelector('.reset').addEventListener('click', () => resetHabit(habit));
    return habitElement;
}
// Function to load habits from the JSON server
function loadHabits() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('http://localhost:3000/streakData');
        habits = yield response.json();
        renderHabits();
    });
}
// Function to render habits on the UI
function renderHabits() {
    goodHabitsContainer.innerHTML = '<h2>New Habits</h2>';
    badHabitsContainer.innerHTML = '<h2>Dropped Habits</h2>';
    habits.forEach(habit => {
        const habitElement = createHabitElement(habit);
        if (habit.type === 'good') {
            goodHabitsContainer.appendChild(habitElement);
        }
        else {
            badHabitsContainer.appendChild(habitElement);
        }
    });
}
// Function to handle habit form submission
habitForm.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const type = document.querySelector('input[name="option"]:checked').value;
    const goal = calculateDays(startDate, endDate);
    const newHabit = {
        id: Date.now(),
        name,
        startDate,
        endDate,
        type,
        progress: 0,
        goal,
    };
    habits.push(newHabit);
    yield saveHabit(newHabit);
    renderHabits();
    habitForm.reset();
}));
// Function to save habit to the JSON server
function saveHabit(habit) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch('http://localhost:3000/streakData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(habit),
        });
    });
}
// Function to increment habit progress
function incrementProgress(habit) {
    if (habit.progress < habit.goal) {
        habit.progress++;
        updateHabit(habit);
        renderHabits();
    }
}
// Function to delete a habit
function deleteHabit(id) {
    return __awaiter(this, void 0, void 0, function* () {
        habits = habits.filter(habit => habit.id !== id);
        const url = `http://localhost:3000/streakData/${id}`; // Use ID in the path
        console.log(`Sending DELETE request to: ${url}`);
        const response = yield fetch(url, {
            method: 'DELETE',
        });
        if (!response.ok) {
            console.error(`Failed to delete habit. Server responded with status: ${response.status}`);
        }
        else {
            console.log(`Successfully deleted habit with id: ${id}`);
        }
        renderHabits();
    });
}
// Function to reset habit progress
function resetHabit(habit) {
    habit.progress = 0;
    updateHabit(habit);
    renderHabits();
}
// Function to update habit on the JSON server
function updateHabit(habit) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `http://localhost:3000/streakData/${habit.id}`; // Use ID in the path
        console.log(`Sending PUT request to: ${url}`);
        const response = yield fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(habit),
        });
        if (!response.ok) {
            console.error(`Failed to update habit. Server responded with status: ${response.status}`);
        }
        else {
            console.log(`Successfully updated habit with id: ${habit.id}`);
        }
    });
}
// Initial load of habits
loadHabits();
