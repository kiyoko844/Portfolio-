import HeaderFixed from "./header.js";
import BurgerMenu from "./burger.js";
import { menuLinks } from "./menu.js";
import { aboutSlider } from "./about-slider.js";
import { advantages } from "./advantages.js";
import { locations } from "./locations.js";
import { timetable } from "./timetable.js";

try {
	const headerFixed = new HeaderFixed({
		HEADER: "header",
		HEADER_FIXED: "header--fixed",
	});

	new BurgerMenu(
		{
			BURGER: "burger",
			BURGER_OPEN: "burger--open",
			HEADER_MENU: "header__menu",
			HEADER_MENU_OPEN: "header__menu--open",
			lABEL: {
				OPEN: "Открыть меню",
				CLOSE: "Закрыть меню",
			},
			PAGE_BODY: "page__body",
			PAGE_BODY_NO_SCROLL: "page__body--no-scroll",
			MENU_LINK: "menu__link",
			BREAKPOINT: 768,
		},
		headerFixed,
	);
	menuLinks();

	aboutSlider();

	advantages();

	locations();

	timetable();
} catch (error) {
	console.error(error);
}
