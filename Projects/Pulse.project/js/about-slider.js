export const aboutSlider = () => {
	const buttons = document.querySelectorAll(".about__pagination-button");

	let slider = null;
	let currentDirection = null;

	const getDirection = () => {
		return window.matchMedia("(max-width: 900px)").matches
			? "horizontal"
			: "vertical";
	};

	const initSlider = () => {
		const direction = getDirection();

		if (slider && direction === currentDirection) {
			return;
		}

		const activeIndex = slider ? slider.activeIndex : 0;

		if (slider) {
			slider.destroy(true, true);
		}

		slider = new Swiper(".about__slider", {
			direction: direction,
			slidesPerView: 1,
			slidesPerGroup: 1,
			speed: 700,
			loop: false,
		});

		currentDirection = direction;

		slider.slideTo(activeIndex, 0);

		updatePagination();
	};

	const updatePagination = () => {
		buttons.forEach((button) => {
			button.classList.remove("about__pagination-button--active");
		});

		if (slider && buttons[slider.activeIndex]) {
			buttons[slider.activeIndex].classList.add(
				"about__pagination-button--active",
			);
		}
	};

	buttons.forEach((button, index) => {
		button.addEventListener("click", () => {
			slider.slideTo(index);
		});
	});

	slider = null;

	initSlider();

	let resizeTimer;

	window.addEventListener("resize", () => {
		clearTimeout(resizeTimer);

		resizeTimer = setTimeout(() => {
			initSlider();
		}, 150);
	});

	slider.on("slideChange", updatePagination);
};
