export default class Modal {
	constructor(config) {
		const defaultConfig = {
			MODAL_WRAPPER: "modal",
		};

		this.config = Object.assign(defaultConfig, config);
		this.modal = document.querySelector(`.${this.config.MODAL_WRAPPER}`);
		this.body = document.querySelector(`.${this.config.PAGE_BODY}`);
		this.speed = 0;
		this.isOpen = false;
		this.modalWindow = null;
		this.lastActiveElement = null;

		this.focusElements = [
			"a[href]",
			"button",
			"input",
			"select",
			"textarea",
			"[tabindex]",
		];

		if (!this.modal) {
			throw new Error("Modal element is missing.");
		}

		this.onDocumentClick = this.onDocumentClick.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onModalClick = this.onModalClick.bind(this);
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.enableScroll = this.enableScroll.bind(this);
		this.disableScroll = this.disableScroll.bind(this);
		this.catchFocus = this.catchFocus.bind(this);
		this.trapFocus = this.trapFocus.bind(this);

		this.initEvents();
	}

	initEvents() {
		document.addEventListener("click", this.onDocumentClick);
		window.addEventListener("keydown", this.onKeyDown);
		this.modal.addEventListener("click", this.onModalClick);
	}

	onDocumentClick(event) {
		const targetButton = event.target.closest("[data-modal-button]");

		if (targetButton) {
			const target = targetButton.dataset.modalButton;
			const speed = targetButton.dataset.modalSpeed;

			this.lastActiveElement = document.activeElement;
			this.speed = speed ? parseInt(speed) : 300;
			this.modalWindow = document.querySelector(
				`[data-modal-window="${target}"]`,
			);

			return this.open();
		}

		const targetClose = event.target.closest("[data-modal-close]");

		if (targetClose) {
			return this.close();
		}
	}

	onKeyDown(event) {
		if (event.key === "Escape" && this.isOpen) {
			this.close();
		}

		if (event.key === "Tab" && this.isOpen) {
			return this.catchFocus(event);
		}
	}

	onModalClick(event) {
		const target = event.target;

		if (!target.closest("[data-modal-window]") && this.isOpen) {
			this.close();
		}
	}

	open() {
		this.modal.style.setProperty("--transition-time", `${this.speed / 1000}s`);
		this.modal.classList.add("modal--open");
		this.modalWindow.classList.add("modal__window--open");

		this.isOpen = true;
		this.disableScroll();

		setTimeout(() => {
			this.trapFocus();
		}, this.speed - 16);
	}

	close() {
		this.modal.classList.remove("modal--open");
		this.modalWindow.classList.remove("modal__window--open");

		this.isOpen = false;
		this.enableScroll();

		if (this.lastActiveElement) {
			this.lastActiveElement.focus();
		}

		this.lastActiveElement = null;
	}

	enableScroll() {
		this.body.classList.remove(this.config.PAGE_BODY_NO_SCROLL);
	}

	disableScroll() {
		this.body.classList.add(this.config.PAGE_BODY_NO_SCROLL);
	}

	catchFocus(event) {
		const focusableElements = this.modalWindow.querySelectorAll(
			this.focusElements,
		);

		const focusArray = Array.prototype.slice.call(focusableElements);

		if (!focusArray.length) {
			return;
		}

		const focusIndex = focusArray.indexOf(document.activeElement);

		if (event.shiftKey && focusIndex === 0) {
			focusArray[focusArray.length - 1].focus();
			event.preventDefault();
		}

		if (!event.shiftKey && focusIndex === focusArray.length - 1) {
			focusArray[0].focus();
			event.preventDefault();
		}
	}

	trapFocus() {
		if (!this.modalWindow) {
			return;
		}

		const focusableElements = this.modalWindow.querySelectorAll(
			this.focusElements,
		);

		if (this.isOpen && focusableElements.length) {
			focusableElements[0].focus();
		}
	}
}

const stars = document.querySelectorAll(".review-form__star");

stars.forEach((star, index) => {
	star.addEventListener("click", () => {
		stars.forEach((item, itemIndex) => {
			item.classList.toggle("review-form__star--active", itemIndex >= index);
		});
	});
});
