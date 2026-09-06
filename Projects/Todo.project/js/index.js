// Находим HTML-элементы Todo и сохраняем их в переменные,
// чтобы потом управлять ими через JavaScript.

const form = document.querySelector(".todo__form");
// Находит форму добавления задачи.

const input = document.querySelector(".todo__input");
// Находит поле, куда вводим текст задачи.

const category = document.querySelector(".todo__category");
// Находит select с выбором категории.

const todoTitle = document.querySelector(".todo__title");

const navLinks = document.querySelectorAll(".todo__nav-link");
// Находит ВСЕ ссылки sidebar:
// Home, Today, Week, Gym, Study, Work, Notes.

const badge = document.querySelector(".todo__badge");

const ul = document.querySelector(".todo__list");
// Находит <ul>, внутри которого будут создаваться задачи.

const todoCount = document.querySelector(".todo__count");
// Находит место для количества всех задач.

const todoCompleted = document.querySelector(".todo__completed");
// Находит место для количества выполненных задач.

const todoRemaining = document.querySelector(".todo__remaining");
// Находит место для количества оставшихся задач.

// Элементы модального окна.

const modal = document.querySelector(".modal");
// Всё модальное окно.

const modalInput = document.querySelector(".modal__input");
// Поле ввода внутри модального окна.

const modalCancel = document.querySelector(".modal__cancel");
// Кнопка "Отмена".

const modalSave = document.querySelector(".modal__save");
// Кнопка "Сохранить".

// Основные переменные состояния.

let todos = [];
// Массив всех задач.
// Изначально пустой.

let currentEditTodo = null;
// Здесь хранится задача, которую сейчас редактируем.
// null = сейчас ничего не редактируем.

let currentCategory = "home";
// Хранит текущую открытую категорию.
// При запуске открыта Home.

// =====================================================
// СТАТИСТИКА
// =====================================================

function updateTodoCount() {
	// Функция пересчитывает статистику задач.

	let completedCount = 0;
	// Счётчик выполненных задач.
	// Начинаем с 0.

	for (let i = 0; i < todos.length; i++) {
		// Проходим по всем задачам.

		if (todos[i].isCompleted) {
			// Проверяем:
			// выполнена ли текущая задача?

			completedCount++;
			// Если выполнена → увеличиваем счётчик на 1.
		}
	}

	let remainingCount = todos.length - completedCount;
	// Осталось задач =
	// все задачи - выполненные.

	todoCount.textContent = `Всего задач: ${todos.length}`;
	// Выводим количество всех задач на страницу.

	todoRemaining.textContent = `Осталось: ${remainingCount}`;
	// Выводим количество оставшихся задач.

	todoCompleted.textContent = `Выполнено: ${completedCount}`;
	// Выводим количество выполненных задач.
}

// =====================================================
// ЗАГРУЗКА ИЗ LOCAL STORAGE
// =====================================================

const result = localStorage.getItem("todos");
// Получаем сохранённые задачи из localStorage.
// Если ничего нет → result будет null.

todos = JSON.parse(result) || [];
// JSON.parse превращает строку из localStorage обратно в массив.
//
// Если result существует:
// todos = сохранённый массив.
//
// Если result отсутствует:
// todos = [].

// =====================================================
// СТАРЫЕ ЗАДАЧИ
// =====================================================

for (let i = 0; i < todos.length; i++) {
	// Проходим по всем загруженным задачам.

	const currentTodo = todos[i];
	// Берём текущую задачу.

	if (!currentTodo.category) {
		// Если у старой задачи нет category...

		currentTodo.category = "home";
		// ...назначаем ей категорию Home.
	}
}

saveTodos();
// Сохраняем изменённый массив обратно в localStorage.
// Теперь старые задачи тоже получают category.

// =====================================================
// SIDEBAR
// =====================================================

for (let i = 0; i < navLinks.length; i++) {
	navLinks[i].addEventListener("click", (event) => {
		event.preventDefault();

		currentCategory = navLinks[i].dataset.category;

		for (let j = 0; j < navLinks.length; j++) {
			navLinks[j].classList.remove("todo__nav-link--active");
		}

		navLinks[i].classList.add("todo__nav-link--active");

		todoTitle.textContent =
			"// " + currentCategory[0].toUpperCase() + currentCategory.slice(1);

		renderTodos(todos);
	});
}

// =====================================================
// ПЕРВЫЙ ЗАПУСК
// =====================================================

updateTodoCount();
// Показываем статистику после загрузки данных.

renderTodos(todos);
// Показываем задачи на странице.

// =====================================================
// ДОБАВЛЕНИЕ ЗАДАЧИ
// =====================================================

form.addEventListener("submit", (event) => {
	// Срабатывает при отправке формы.

	event.preventDefault();
	// Не даём странице перезагрузиться.

	const todoText = input.value.trim();
	// Берём текст из input.
	// trim() убирает пробелы по краям.

	if (todoText === "") {
		// Если поле пустое...

		return;
		// ...ничего не делаем.
	}

	const todo = {
		// Создаём НОВЫЙ объект задачи.

		text: todoText,
		// Текст задачи.

		isCompleted: false,
		// Новая задача изначально невыполнена.

		category: category.value,
		// Сохраняем выбранную категорию.
	};

	todos.push(todo);
	// Добавляем новую задачу в массив todos.

	saveTodos();
	// Сохраняем весь массив в localStorage.

	renderTodos(todos);
	// Перерисовываем список.

	input.value = "";
	// Очищаем поле ввода.

	input.focus();
	// Снова ставим курсор в input.

	updateTodoCount();
	// Пересчитываем статистику.
});

// =====================================================
// СОХРАНЕНИЕ
// =====================================================

function saveTodos() {
	// Функция сохраняет массив todos.

	localStorage.setItem("todos", JSON.stringify(todos));
	// JSON.stringify превращает массив в строку.
	// setItem записывает эту строку в localStorage.
}

// =====================================================
// ОТОБРАЖЕНИЕ ЗАДАЧ
// =====================================================

function renderTodos(todos) {
	// Функция отвечает за отображение задач на странице.

	ul.innerHTML = "";
	// Полностью очищаем старый список.
	// Старые <li> удаляются из HTML.

	const filteredTodos = todos.filter(
		(todo) => todo.category === currentCategory,
	);
	// Создаём новый массив только с задачами
	// текущей категории.
	//
	// Например:
	// currentCategory = "study"
	// → сюда попадут только category === "study".

	for (let i = 0; i < filteredTodos.length; i++) {
		// ВАЖНЫЙ МОМЕНТ:
		// здесь сейчас снова проходим ПО ВСЕМ todos.
		//
		// Поэтому filteredTodos выше пока НЕ используется.
		// Это именно тот кусок, который мы должны потом исправить.

		const currentTodo = filteredTodos[i];
		// Берём текущую задачу.

		const todoElement = document.createElement("li");
		// Создаём новый <li> через JavaScript.

		todoElement.classList.add("todo__item");
		// Добавляем CSS-класс.

		todoElement.textContent = currentTodo.text;
		// Выводим текст задачи.

		if (currentTodo.isCompleted === true) {
			// Если задача выполнена...

			todoElement.classList.add("completed");
			// ...добавляем класс completed.
		}

		// =================================================
		// ВЫПОЛНЕНИЕ
		// =================================================

		todoElement.addEventListener("dblclick", () => {
			// Двойной клик по задаче.

			currentTodo.isCompleted = !currentTodo.isCompleted;
			// Переключаем true ↔ false.

			saveTodos();
			// Сохраняем новое состояние.

			todoElement.classList.toggle("completed");
			// Визуально добавляем или убираем completed.

			updateTodoCount();
			// Обновляем статистику.
		});

		// =================================================
		// РЕДАКТИРОВАНИЕ
		// =================================================

		const editButton = document.createElement("button");
		// Создаём кнопку редактирования.

		editButton.textContent = "Редактировать";
		// Текст кнопки.

		todoElement.append(editButton);
		// Добавляем кнопку внутрь <li>.

		editButton.addEventListener("click", (event) => {
			// Клик по "Редактировать".

			event.stopPropagation();
			// Останавливаем всплытие события.
			// Клик по кнопке не считается кликом по всей задаче.

			modal.hidden = false;
			// Показываем модальное окно.

			modalInput.value = currentTodo.text;
			// Вставляем текущий текст задачи в поле модалки.

			modalInput.focus();
			// Ставим курсор в поле.

			currentEditTodo = currentTodo;
			// Запоминаем:
			// какую именно задачу сейчас редактируем.
		});

		// =================================================
		// УДАЛЕНИЕ
		// =================================================

		const deleteButton = document.createElement("button");
		// Создаём кнопку удаления.

		deleteButton.textContent = "Удалить";
		// Текст кнопки.

		todoElement.append(deleteButton);
		// Добавляем кнопку внутрь <li>.

		ul.append(todoElement);
		// Добавляем весь <li> в <ul>.
		// Теперь задача появляется на странице.

		deleteButton.addEventListener("click", (event) => {
			// Клик по "Удалить".

			event.stopPropagation();
			// Не даём клику пойти дальше на <li>.

			const todoIndex = todos.indexOf(currentTodo);
			// Находим индекс текущей задачи в массиве todos.

			todos.splice(todoIndex, 1);
			// Удаляем 1 элемент из массива todos
			// по индексу todoIndex.

			updateTodoCount();
			// Обновляем статистику.

			saveTodos();
			// Сохраняем изменённый массив.

			renderTodos(todos);
			// Перерисовываем список.
		});
	}
}

// =====================================================
// ЗАКРЫТИЕ МОДАЛКИ
// =====================================================

function closeModal() {
	// Общая функция закрытия модалки.

	modal.hidden = true;
	// Скрываем окно.

	currentEditTodo = null;
	// Сбрасываем выбранную для редактирования задачу.
}

// =====================================================
// ОТМЕНА
// =====================================================

modalCancel.addEventListener("click", () => {
	// Клик по "Отмена".

	closeModal();
	// Закрываем модалку.
});

// =====================================================
// КЛИК ПО ФОНУ
// =====================================================

modal.addEventListener("click", (event) => {
	// Отслеживаем клик по модальному окну.

	if (event.target === modal) {
		// Если кликнули именно по фону,
		// а не по белому содержимому...

		closeModal();
		// ...закрываем модалку.
	}
});

// =====================================================
// ESCAPE
// =====================================================

modalInput.addEventListener("keydown", (event) => {
	// Отслеживаем нажатие клавиш в modalInput.

	if (event.key === "Escape") {
		// Если нажали Escape...

		closeModal();
		// ...закрываем модалку.
	}
});

// =====================================================
// СОХРАНЕНИЕ РЕДАКТИРОВАНИЯ
// =====================================================

function saveEditedTodo() {
	// Функция сохраняет отредактированную задачу.

	const newText = modalInput.value.trim();
	// Получаем новый текст.

	if (newText === "") {
		// Если текст пустой...

		return;
		// ...ничего не сохраняем.
	}

	currentEditTodo.text = newText;
	// Меняем text у выбранной задачи.

	saveTodos();
	// Сохраняем изменения в localStorage.

	renderTodos(todos);
	// Перерисовываем список.

	modal.hidden = true;
	// Закрываем модалку.

	currentEditTodo = null;
	// Сбрасываем выбранную задачу.
}

// =====================================================
// КНОПКА SAVE
// =====================================================

modalSave.addEventListener("click", () => {
	// Нажали "Сохранить".

	saveEditedTodo();
	// Запускаем функцию сохранения.
});

// =====================================================
// ENTER
// =====================================================

modalInput.addEventListener("keydown", (event) => {
	// Отслеживаем клавиши в modalInput.

	if (event.key === "Enter") {
		// Если нажали Enter...

		saveEditedTodo();
		// Сохраняем задачу.
	}
});
