import HeaderFixed from "./header.js";
import BurgerMenu from "./burger.js";
import SpecialOffers from "./special.offers.js";
import Reviews from "./reviews.js";
import Modal from "./modal.js";
import News from "./news.js";

try {
	const headerFixed = new HeaderFixed({
		HEADER: "header",
		HEADER_FIXED: "header--fixed",
	});

	new BurgerMenu(
		{
			BURGER: "burger",
			BURGER_OPEN: "burger--open",
			HEADER_MENU: "burger-menu",
			HEADER_MENU_OPEN: "burger-menu--active",
			lABEL: {
				OPEN: "Открыть меню",
				CLOSE: "Закрыть меню",
			},
			PAGE_BODY: "page__body",
			PAGE_BODY_NO_SCROLL: "page__body--no-scroll",
			MENU_LINK: "burger-menu__link",
		},
		headerFixed,
	);

	SpecialOffers();

	Reviews();

	new Modal({
		MODAL_WRAPPER: "modal",
		PAGE_BODY: "page__body",
		PAGE_BODY_NO_SCROLL: "page__body--no-scroll",
	});

	News();
} catch (error) {
	console.error(error);
}
