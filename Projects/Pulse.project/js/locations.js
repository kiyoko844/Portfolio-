/* export const locations = () => {
	const buttons = document.querySelectorAll(".locations__button");
	const panels = document.querySelectorAll(".locations__panel");

	buttons.forEach((button, index) => {
		button.addEventListener("click", () => {
			buttons.forEach((button) => {
				button.classList.remove("locations__button--active");
			});
			button.classList.add("locations__button--active");
			panels.forEach((panel) => {
				panel.classList.remove("locations__panel--active");
			});
			panels[index].classList.add("locations__panel--active");
		});
	});
};
 */

export const locations = () => {
	const defaultButton = document.querySelector(".locations__button--default");
	let firstClick = true;

	document.querySelectorAll(".locations__accordion").forEach((accordion) => {
		accordion.addEventListener("toggle", () => {
			if (firstClick) {
				defaultButton?.classList.remove("locations__button--default");
				firstClick = false;
			}
		});
	});
};
