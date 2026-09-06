export default class BurgerMenu {
	constructor(config, headerFixedInstance = null) {
		this.config = config;
		this.headerFixedInstance = headerFixedInstance;

		this.burgerButton = document.querySelector(`.${this.config.BURGER}`);
		this.burgerMenu = document.querySelector(`.${this.config.HEADER_MENU}`);
		this.body = document.querySelector(`.${this.config.PAGE_BODY}`);

		if (!this.burgerButton || !this.burgerMenu || !this.body) {
			throw new Error("Required DOM elements are missing.");
		}

		this.onBurgerClick = this.onBurgerClick.bind(this);
		this.onBodyClick = this.onBodyClick.bind(this);

		this.initEvents();
	}

	initEvents() {
		this.burgerButton.addEventListener("click", this.onBurgerClick);

		this.body.addEventListener("click", this.onBodyClick);
	}

	onBurgerClick() {
		const isOpen = this.burgerMenu.classList.toggle(
			this.config.HEADER_MENU_OPEN,
		);

		this.burgerButton.classList.toggle(this.config.BURGER_OPEN, isOpen);

		this.burgerButton.ariaLabel = isOpen
			? this.config.lABEL.CLOSE
			: this.config.lABEL.OPEN;

		this.burgerButton.ariaExpanded = isOpen;

		this.body.classList.toggle(this.config.PAGE_BODY_NO_SCROLL, isOpen);
	}

	onBodyClick(event) {
		const target = event.target;

		const isClickInsideMenu = target.closest(`.${this.config.HEADER_MENU}`);

		const isClickOnBurger = target.closest(`.${this.config.BURGER}`);

		const isLinkInMenu = target.closest(`.${this.config.MENU_LINK}`);

		if (isLinkInMenu) {
			this.hideBurgerMenu();
			return;
		}

		if (!isClickInsideMenu && !isClickOnBurger) {
			this.hideBurgerMenu();
		}
	}

	hideBurgerMenu() {
		this.burgerMenu.classList.remove(this.config.HEADER_MENU_OPEN);

		this.burgerButton.classList.remove(this.config.BURGER_OPEN);

		this.burgerButton.ariaLabel = this.config.lABEL.OPEN;

		this.burgerButton.ariaExpanded = false;

		this.body.classList.remove(this.config.PAGE_BODY_NO_SCROLL);
	}
}
