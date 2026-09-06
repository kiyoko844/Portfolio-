export default function Reviews() {
	const moreLink = document.querySelector(".reviews__more-link");
	const hiddenReviews = document.querySelectorAll(".review--hidden");
	const moreText = document.querySelector(".reviews__more-text");
	const moreIcon = document.querySelector(".reviews__more-icon");

	if (moreLink && hiddenReviews.length) {
		moreLink.addEventListener("click", () => {
			const isOpen = hiddenReviews[0].classList.contains("review--visible");

			hiddenReviews.forEach((review) => {
				review.classList.toggle("review--visible", !isOpen);
			});

			moreText.textContent = isOpen ? "Показать еще" : "Скрыть отзывы";

			moreIcon.classList.toggle("reviews__more-icon--up", !isOpen);
		});
	}

	const photoLinks = document.querySelectorAll(".review__photos-link");

	photoLinks.forEach((link) => {
		link.addEventListener("click", () => {
			const photos = link
				.closest(".review__content")
				.querySelectorAll(".review__photo--hidden");

			const isOpen = photos[0]?.classList.contains("review__photo--visible");

			photos.forEach((photo) => {
				photo.classList.toggle("review__photo--visible", !isOpen);
			});

			link.textContent = isOpen ? "Показать еще" : "Скрыть";
		});
	});
}
