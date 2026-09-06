const menu = document.querySelector(".menu");
const menuLinks = document.querySelectorAll(".menu__link");
const progress = document.querySelector(".menu__progress");

const sections = document.querySelectorAll("section[id]");

function updateMenu() {
	const scrollY = window.scrollY;

	/* Compact menu */

	if (scrollY > 50) {
		menu.classList.add("is-scrolled");
	} else {
		menu.classList.remove("is-scrolled");
	}

	const documentHeight =
		document.documentElement.scrollHeight - window.innerHeight;

	const scrollProgress =
		documentHeight > 0 ? (scrollY / documentHeight) * 100 : 0;

	progress.style.width = `${scrollProgress}%`;

	let currentSection = "";

	sections.forEach((section) => {
		const sectionTop = section.offsetTop - 150;

		const sectionBottom = sectionTop + section.offsetHeight;

		if (scrollY >= sectionTop && scrollY < sectionBottom) {
			currentSection = section.id;
		}
	});

	menuLinks.forEach((link) => {
		link.classList.remove("active");

		if (link.getAttribute("href") === `#${currentSection}`) {
			link.classList.add("active");
		}
	});
}

window.addEventListener("scroll", updateMenu, {
	passive: true,
});

updateMenu();
