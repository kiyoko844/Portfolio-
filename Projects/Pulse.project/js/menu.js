export const menuLinks = () => {
	const menuLinks = document.querySelectorAll(".menu__link");

	menuLinks.forEach((link) => {
		link.addEventListener("click", () => {
			menuLinks.forEach((item) => item.classList.remove("menu__link--active"));

			link.classList.add("menu__link--active");
		});
	});
};
