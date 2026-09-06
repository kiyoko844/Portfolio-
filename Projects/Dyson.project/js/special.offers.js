export default function SpecialOffers() {
	// ELEMENTS
	const sliderElement = document.querySelector(".special-offers__list");
	const items = document.querySelectorAll(".special-offers__item");

	const prevButton = document.querySelector(".swipe__button--prev");
	const nextButton = document.querySelector(".swipe__button--next");
	const counter = document.querySelector(".swipe__text");

	const showMoreButton = document.querySelector(".special-offers-tags__link");
	const hiddenTags = document.querySelectorAll(
		".special-offers-tags__item--hidden",
	);

	const catalogs = document.querySelector(".special-offers__catalogs");
	const catalogsButton = document.querySelector(
		".special-offers__catalogs-button",
	);
	const catalogsList = document.querySelector(".special-offers__catalogs-list");
	const catalogsText = document.querySelector(".special-offers__catalogs-text");
	const catalogsOptions = document.querySelectorAll(
		".special-offers__catalogs-option",
	);

	// SHOW MORE
	if (showMoreButton) {
		showMoreButton.addEventListener("click", () => {
			const isExpanded = showMoreButton.classList.toggle(
				"special-offers-tags__link--active",
			);

			hiddenTags.forEach((tag) => {
				tag.classList.toggle("special-offers-tags__item--visible", isExpanded);
			});

			showMoreButton.textContent = isExpanded ? "Скрыть" : "Показать еще";
		});
	}

	// CATALOGS
	if (
		catalogs &&
		catalogsButton &&
		catalogsList &&
		catalogsText &&
		catalogsOptions.length
	) {
		catalogsButton.addEventListener("click", () => {
			const isOpen = catalogsList.classList.toggle(
				"special-offers__catalogs-list--active",
			);

			catalogsButton.classList.toggle(
				"special-offers__catalogs-button--active",
				isOpen,
			);

			catalogsButton.setAttribute("aria-expanded", isOpen);
		});

		catalogsOptions.forEach((option) => {
			option.addEventListener("click", () => {
				catalogsText.textContent = option.textContent.trim();

				catalogsOptions.forEach((item) => {
					item.classList.remove("special-offers__catalogs-option--active");
				});

				option.classList.add("special-offers__catalogs-option--active");

				catalogsList.classList.remove("special-offers__catalogs-list--active");

				catalogsButton.classList.remove(
					"special-offers__catalogs-button--active",
				);

				catalogsButton.setAttribute("aria-expanded", "false");
			});
		});

		document.addEventListener("click", (event) => {
			if (!catalogs.contains(event.target)) {
				catalogsList.classList.remove("special-offers__catalogs-list--active");

				catalogsButton.classList.remove(
					"special-offers__catalogs-button--active",
				);

				catalogsButton.setAttribute("aria-expanded", "false");
			}
		});
	}

	// CHECK SLIDER
	if (
		!sliderElement ||
		!items.length ||
		!prevButton ||
		!nextButton ||
		!counter
	) {
		return;
	}

	// SWIPER
	const slider = new Swiper(".special-offers__list", {
		slidesPerView: 3,
		slidesPerGroup: 3,
		spaceBetween: 20,
		speed: 700,
		loop: false,
		simulateTouch: true,

		breakpoints: {
			0: {
				slidesPerView: 2,
				slidesPerGroup: 2,
			},

			769: {
				slidesPerView: 3,
				slidesPerGroup: 3,
			},
		},
	});

	// COUNTER
	const updateCounter = () => {
		const slidesPerView = slider.params.slidesPerView;

		const currentPage = Math.floor(slider.activeIndex / slidesPerView) + 1;

		const totalPages = Math.ceil(slider.slides.length / slidesPerView);

		counter.textContent = `${currentPage} из ${totalPages}`;

		prevButton.disabled = slider.isBeginning;
		nextButton.disabled = slider.isEnd;
	};

	// PREV
	prevButton.addEventListener("click", () => {
		slider.slidePrev();
	});

	// NEXT
	nextButton.addEventListener("click", () => {
		slider.slideNext();
	});

	// SLIDER EVENTS
	slider.on("slideChange", updateCounter);
	slider.on("breakpoint", updateCounter);

	updateCounter();

	// PRODUCT COUNTERS
	items.forEach((item) => {
		const minusButton = item.querySelector(".special-offers__counter-minus");

		const plusButton = item.querySelector(".special-offers__counter-plus");

		const counterNumber = item.querySelector(".special-offers__counter-number");

		let count = 1;

		plusButton.addEventListener("click", () => {
			count++;
			counterNumber.textContent = count;

			if (count > 1) {
				minusButton.classList.add("is-active");
			}
		});

		minusButton.addEventListener("click", () => {
			if (count > 1) {
				count--;
				counterNumber.textContent = count;
			}

			if (count === 1) {
				minusButton.classList.remove("is-active");
			}
		});
	});
}
