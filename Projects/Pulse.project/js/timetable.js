/* export const timetable = () => {
	const tabs = document.querySelectorAll(".timetable__button");

	tabs.forEach((tab) => {
		tab.addEventListener("click", () => {
			tabs.forEach((button) => {
				button.classList.remove("timetable__button--active");
			});
			tab.classList.add("timetable__button--active");
		});
	});
}; */

/* export const timetable = () => {
	const tabs = document.querySelectorAll(".timetable__button");
	const panels = document.querySelectorAll(".timetable__panel");
	const circle = document.querySelector(".timetable__circle");

	const moveCircle = (element) => {
		circle.style.left = element.offsetLeft - circle.offsetWidth / 3 + "px";
	};

	moveCircle(document.querySelector(".timetable__button--active"));

	tabs.forEach((tab, index) => {
		tab.addEventListener("click", () => {
			tabs.forEach((button) =>
				button.classList.remove("timetable__button--active"),
			);

			panels.forEach((panel) =>
				panel.classList.remove("timetable__panel--active"),
			);

			tab.classList.add("timetable__button--active");
			panels[index].classList.add("timetable__panel--active");

			moveCircle(tab);
		});
	});
}; */

export const timetable = () => {
	const tabs = document.querySelectorAll(".timetable__button");
	const panels = document.querySelectorAll(".timetable__panel");
	const circle = document.querySelector(".timetable__circle");

	const moveCircle = (element) => {
		circle.style.left = element.offsetLeft - 15 + "px";
		circle.style.top =
			element.offsetTop +
			element.offsetHeight / 2 -
			circle.offsetHeight / 2 +
			"px";
	};

	const activeTab = document.querySelector(".timetable__button--active");

	if (activeTab) {
		moveCircle(activeTab);
	}

	tabs.forEach((tab, index) => {
		tab.addEventListener("click", () => {
			tabs.forEach((button) =>
				button.classList.remove("timetable__button--active"),
			);

			panels.forEach((panel) =>
				panel.classList.remove("timetable__panel--active"),
			);

			tab.classList.add("timetable__button--active");
			panels[index].classList.add("timetable__panel--active");

			moveCircle(tab);
		});
	});

	window.addEventListener("resize", () => {
		const activeTab = document.querySelector(".timetable__button--active");

		if (activeTab) {
			moveCircle(activeTab);
		}
	});
};
