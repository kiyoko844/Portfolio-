export default function News() {
	const moreLink = document.querySelector(".news__more-link");
	const hiddenNews = document.querySelectorAll(".news--hidden");
	const moreText = document.querySelector(".news__more-text");
	const moreIcon = document.querySelector(".news__more-icon");

	if (!moreLink || !hiddenNews.length) {
		return;
	}

	moreLink.addEventListener("click", (event) => {
		event.preventDefault();

		const isHidden = hiddenNews[0].classList.contains("news--hidden");

		hiddenNews.forEach((news) => {
			if (isHidden) {
				news.classList.remove("news--hidden");
				news.classList.add("news--show");
			} else {
				news.classList.remove("news--show");
				news.classList.add("news--hidden");
			}
		});

		if (isHidden) {
			moreText.textContent = "Скрыть новости";
			moreIcon.classList.add("news__more-icon--up");
		} else {
			moreText.textContent = "Показать еще";
			moreIcon.classList.remove("news__more-icon--up");
		}
	});
}
