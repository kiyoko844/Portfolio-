export const advantages = () => {
	const tabs = document.querySelectorAll(".advantages__tab");
	const panels = document.querySelectorAll(".advantages__panel");
	const circle = document.querySelector(".advantages__circle");

	const moveCircle = (element) => {
		circle.style.top = element.offsetTop + "px";
	};

	moveCircle(document.querySelector(".advantages__tab--active"));

	tabs.forEach((tab, index) => {
		tab.addEventListener("click", () => {
			tabs.forEach((button) =>
				button.classList.remove("advantages__tab--active"),
			);

			panels.forEach((panel) =>
				panel.classList.remove("advantages__panel--active"),
			);

			tab.classList.add("advantages__tab--active");
			panels[index].classList.add("advantages__panel--active");

			moveCircle(tab);
		});
	});
};
