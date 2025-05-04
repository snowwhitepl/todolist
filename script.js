document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-input");
    const taskList = document.getElementById("task-list");
    const emptyMessage = document.querySelector(".empty-list-message");
  
    // Funkcja do aktualizacji widoczności wiadomości
    function updateEmptyMessage() {
      if (taskList.children.length === 0) {
        emptyMessage.style.display = "block";
      } else {
        emptyMessage.style.display = "none";
      }
    }
  
    // Funkcja do zapisu zadań do localStorage
    function saveTasks() {
      const tasks = [];
      taskList.querySelectorAll("li").forEach((li) => {
        tasks.push(li.firstChild.textContent.trim());
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  
    // Funkcja do stworzenia pojedynczego elementu listy
    function createTaskElement(text) {
      const li = document.createElement("li");
      li.textContent = text;
  
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "X";
      deleteBtn.classList.add("delete");
      deleteBtn.addEventListener("click", () => {
        li.remove();
        updateEmptyMessage();
        saveTasks();
      });
  
      li.appendChild(deleteBtn);
      return li;
    }
  
    // Obsługa dodawania zadania
    taskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const taskText = taskInput.value.trim();
  
      if (taskText !== "") {
        const taskItem = createTaskElement(taskText);
        taskList.appendChild(taskItem);
        taskInput.value = "";
        updateEmptyMessage();
        saveTasks();
      }
    });
  
    // Wczytywanie zadań z localStorage po załadowaniu strony
    function loadTasks() {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks.forEach((taskText) => {
        const taskItem = createTaskElement(taskText);
        taskList.appendChild(taskItem);
      });
      updateEmptyMessage();
    }
  
    // Wyświetlanie bieżącej daty i dnia tygodnia
    function displayCurrentDate() {
      const dateDisplay = document.getElementById("date-display");
      const now = new Date();
  
      const days = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
      const months = [
        "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
        "lipca", "sierpnia", "września", "października", "listopada", "grudnia"
      ];
  
      const dayName = days[now.getDay()];
      const day = now.getDate();
      const month = months[now.getMonth()];
      const year = now.getFullYear();
  
      dateDisplay.textContent = `${dayName}, ${day} ${month} ${year}`;
    }
  
    displayCurrentDate();
    loadTasks();
  });