const list = document.querySelector(".todo__list");

const todoTitle = document.querySelector(".todo__title");
const todoCount = document.querySelector(".todo__count");
const todoRemaining = document.querySelector(".todo__remaining");
const todoCompleted = document.querySelector(".todo__completed");

const navLinks = document.querySelectorAll(".todo__nav-link[data-category]");

const addProjectButton = document.querySelector(".todo__add-project");

const modal = document.querySelector(".modal");

const modalTitle = document.querySelector(".modal__title");

const modalInput = document.querySelector(".modal__input");

const modalCategory = document.querySelector(".modal__select");

const modalDate = document.querySelector("#modal-date");

const modalTime = document.querySelector("#modal-time");

const modalCancel = document.querySelector(".modal__cancel");

const modalSave = document.querySelector(".modal__save");

const modalClose = document.querySelector(".modal__close");

const priorityInputs = document.querySelectorAll(
	'.priority input[name="priority"]',
);

const projects = [
	{
		id: "home",
		name: "Home",
	},
	{
		id: "today",
		name: "Today",
	},
	{
		id: "week",
		name: "Week",
	},
	{
		id: "gym",
		name: "Gym",
	},
	{
		id: "study",
		name: "Study",
	},
	{
		id: "work",
		name: "Work",
	},
	{
		id: "notes",
		name: "Notes",
	},
];

let todos = [];

let currentCategory = "home";

let currentEditTodo = null;

function saveTodos() {
	localStorage.setItem("todos", JSON.stringify(todos));
}

function getProject(categoryId) {
	return projects.find((project) => project.id === categoryId) || projects[0];
}

function getPriorityText(priority) {
	switch (priority) {
		case "low":
			return "Низкий";

		case "high":
			return "Высокий";

		default:
			return "Средний";
	}
}

function formatDate(date, time) {
	if (!date && !time) {
		return "";
	}

	let result = "";

	if (date) {
		const parts = date.split("-");

		if (parts.length === 3) {
			result = `${parts[2]}.${parts[1]}.${parts[0]}`;
		}
	}

	if (time) {
		result += result ? ` • ${time}` : time;
	}

	return result;
}

function updateTodoCount() {
	const tasks = todos.filter((todo) => todo.category !== "notes");

	const completedCount = tasks.filter((todo) => todo.isCompleted).length;

	const remainingCount = tasks.length - completedCount;

	todoCount.textContent = `Всего задач: ${tasks.length}`;

	todoRemaining.textContent = `Осталось: ${remainingCount}`;

	todoCompleted.textContent = `Выполнено: ${completedCount}`;

	updateBadges();
}

function updateBadges() {
	navLinks.forEach((link) => {
		const badge = link.querySelector(".todo__badge");

		if (!badge) {
			return;
		}

		const categoryId = link.dataset.category;

		const count = todos.filter(
			(todo) =>
				todo.category === categoryId &&
				todo.category !== "notes" &&
				!todo.isCompleted,
		).length;

		badge.textContent = count;
	});
}

function renderEmpty() {
	const empty = document.createElement("li");

	empty.className = "todo__empty";

	empty.textContent =
		currentCategory === "notes"
			? "Здесь пока нет заметок."
			: "Здесь пока нет задач.";

	list.append(empty);
}

function getEditIcon() {
	return `
		<svg
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M4 20h4L18.5 9.5
				a2.12 2.12 0 0 0 0-3
				l-1-1
				a2.12 2.12 0 0 0-3 0
				L4 16v4z"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linejoin="round"
			/>

			<path
				d="M13.5 7.5l3 3"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
			/>
		</svg>
	`;
}

function getDeleteIcon() {
	return `
		<svg
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M4 7h16"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
			/>

			<path
				d="M9 7V4h6v3"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
			/>

			<path
				d="M6.5 7l.8 13h9.4l.8-13"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linejoin="round"
			/>

			<path
				d="M10 11v5M14 11v5"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
			/>
		</svg>
	`;
}

function deleteTodo(todo) {
	const index = todos.indexOf(todo);

	if (index === -1) {
		return;
	}

	todos.splice(index, 1);

	saveTodos();

	updateTodoCount();

	render();
}

function toggleTodo(todo) {
	if (todo.category === "notes") {
		return;
	}

	todo.isCompleted = !todo.isCompleted;

	saveTodos();

	updateTodoCount();

	render();
}

function createActions(todo) {
	const actions = document.createElement("div");

	actions.className = "todo__item-actions";

	const editButton = document.createElement("button");

	editButton.type = "button";

	editButton.className = "todo__item-action";

	editButton.setAttribute("aria-label", "Редактировать");

	editButton.title = "Редактировать";

	editButton.innerHTML = getEditIcon();

	editButton.addEventListener("click", (event) => {
		event.stopPropagation();

		openModal(todo);
	});

	const deleteButton = document.createElement("button");

	deleteButton.type = "button";

	deleteButton.className = "todo__item-action todo__item-action--delete";

	deleteButton.setAttribute("aria-label", "Удалить");

	deleteButton.title = "Удалить";

	deleteButton.innerHTML = getDeleteIcon();

	deleteButton.addEventListener("click", (event) => {
		event.stopPropagation();

		deleteTodo(todo);
	});

	actions.append(editButton, deleteButton);

	return actions;
}

function createTodoItem(todo) {
	const item = document.createElement("li");

	item.className = "todo__item";

	if (todo.category === "notes") {
		item.classList.add("todo__item--note");

		const body = document.createElement("div");

		body.className = "todo__item-body";

		const text = document.createElement("span");

		text.className = "todo__item-text";

		text.textContent = todo.text;

		body.append(text);

		const meta = document.createElement("div");

		meta.className = "todo__item-meta";

		const noteLabel = document.createElement("span");

		noteLabel.textContent = "Заметка";

		meta.append(noteLabel);

		const formattedDate = formatDate(todo.date, todo.time);

		if (formattedDate) {
			const date = document.createElement("span");

			date.className = "todo__item-date";

			date.textContent = formattedDate;

			meta.append(date);
		}

		body.append(meta);

		item.append(body, createActions(todo));

		return item;
	}

	item.classList.add(`todo__item--priority-${todo.priority || "medium"}`);

	if (todo.isCompleted) {
		item.classList.add("completed");
	}

	const checkButton = document.createElement("button");

	checkButton.type = "button";

	checkButton.className = "todo__item-check";

	checkButton.setAttribute(
		"aria-label",
		todo.isCompleted ? "Отметить как невыполненную" : "Выполнить задачу",
	);

	checkButton.addEventListener("click", (event) => {
		event.stopPropagation();

		toggleTodo(todo);
	});

	const body = document.createElement("div");

	body.className = "todo__item-body";

	const text = document.createElement("span");

	text.className = "todo__item-text";

	text.textContent = todo.text;

	body.append(text);

	const meta = document.createElement("div");

	meta.className = "todo__item-meta";

	const project = document.createElement("span");

	project.textContent = getProject(todo.category).name;

	meta.append(project);

	const formattedDate = formatDate(todo.date, todo.time);

	if (formattedDate) {
		const date = document.createElement("span");

		date.className = "todo__item-date";

		date.textContent = formattedDate;

		meta.append(date);
	}

	const priority = document.createElement("span");

	priority.className = `todo__priority todo__priority--${
		todo.priority || "medium"
	}`;

	priority.textContent = getPriorityText(todo.priority);

	meta.append(priority);

	body.append(meta);

	item.append(checkButton, body, createActions(todo));

	item.addEventListener("dblclick", () => {
		toggleTodo(todo);
	});

	return item;
}

function render() {
	list.innerHTML = "";

	let visibleTodos;

	if (currentCategory === "home") {
		visibleTodos = todos;
	} else {
		visibleTodos = todos.filter((todo) => todo.category === currentCategory);
	}

	if (visibleTodos.length === 0) {
		renderEmpty();

		return;
	}

	visibleTodos.forEach((todo) => {
		list.append(createTodoItem(todo));
	});
}

function setCategory(categoryId) {
	currentCategory = categoryId;

	navLinks.forEach((link) => {
		link.classList.toggle(
			"todo__nav-link--active",
			link.dataset.category === categoryId,
		);
	});

	const project = getProject(categoryId);

	todoTitle.textContent =
		categoryId === "home" ? "// Home" : `// ${project.name}`;

	render();
}

function openModal(todo = null) {
	currentEditTodo = todo;

	if (todo) {
		modalTitle.textContent = "Редактировать";

		modalInput.value = todo.text;

		modalCategory.value = todo.category;

		modalDate.value = todo.date || "";

		modalTime.value = todo.time || "";

		const priority = todo.priority || "medium";

		priorityInputs.forEach((radio) => {
			radio.checked = radio.value === priority;
		});
	} else {
		modalTitle.textContent = "Новая задача";

		modalInput.value = "";

		modalCategory.value = currentCategory;

		modalDate.value = "";

		modalTime.value = "";

		priorityInputs.forEach((radio) => {
			radio.checked = radio.value === "medium";
		});
	}

	modal.hidden = false;

	document.body.style.overflow = "hidden";

	requestAnimationFrame(() => {
		modalInput.focus();
	});
}

function closeModal() {
	modal.hidden = true;

	currentEditTodo = null;

	document.body.style.overflow = "";
}

function getSelectedPriority() {
	const selected = document.querySelector(
		'.priority input[name="priority"]:checked',
	);

	return selected ? selected.value : "medium";
}

function saveModal() {
	const text = modalInput.value.trim();

	if (!text) {
		modalInput.focus();

		return;
	}

	const selectedCategory = modalCategory.value;

	const selectedDate = modalDate.value;

	const selectedTime = modalTime.value;

	const selectedPriority = getSelectedPriority();

	if (currentEditTodo) {
		currentEditTodo.text = text;

		currentEditTodo.category = selectedCategory;

		currentEditTodo.date = selectedDate;

		currentEditTodo.time = selectedTime;

		currentEditTodo.priority = selectedPriority;

		if (selectedCategory === "notes") {
			currentEditTodo.isCompleted = false;
		}

		saveTodos();

		closeModal();

		updateTodoCount();

		setCategory(selectedCategory);

		return;
	}

	const newTodo = {
		id: Date.now(),

		text,

		category: selectedCategory,

		date: selectedDate,

		time: selectedTime,

		priority: selectedPriority,

		isCompleted: false,
	};

	todos.push(newTodo);

	saveTodos();

	closeModal();

	updateTodoCount();

	setCategory(selectedCategory);
}

addProjectButton.addEventListener("click", () => {
	openModal();
});

modalCancel.addEventListener("click", closeModal);

modalClose.addEventListener("click", closeModal);

modalSave.addEventListener("click", saveModal);

modal.addEventListener("click", (event) => {
	if (event.target === modal) {
		closeModal();
	}
});

navLinks.forEach((link) => {
	link.addEventListener("click", (event) => {
		event.preventDefault();

		setCategory(link.dataset.category);
	});
});

document.addEventListener("keydown", (event) => {
	if (modal.hidden) {
		return;
	}

	if (event.key === "Escape") {
		closeModal();
	}

	if (event.key === "Enter" && event.target === modalInput) {
		event.preventDefault();

		saveModal();
	}
});

const storedTodos = localStorage.getItem("todos");

try {
	todos = storedTodos ? JSON.parse(storedTodos) : [];
} catch {
	todos = [];
}

todos = todos.map((todo) => ({
	id: todo.id || Date.now() + Math.random(),

	text: todo.text || "Без названия",

	category: todo.category || "home",

	date: todo.date || "",

	time: todo.time || "",

	priority: todo.priority || "medium",

	isCompleted: Boolean(todo.isCompleted),
}));

todos.forEach((todo) => {
	if (todo.category === "notes") {
		todo.isCompleted = false;
	}
});

saveTodos();

updateTodoCount();

setCategory("home");
