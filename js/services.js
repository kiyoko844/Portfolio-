const serviceItems = document.querySelectorAll(".services__item");

const servicesModal = document.querySelector("#servicesModal");
const servicesModalOverlay = document.querySelector(".services-modal__overlay");
const servicesModalClose = document.querySelector(".services-modal__close");

const servicesModalNumber = document.querySelector(".services-modal__number");
const servicesModalTitle = document.querySelector(".services-modal__title");
const servicesModalDescription = document.querySelector(
	".services-modal__description",
);

const servicesDescriptions = {
	"01": "Создание современных и интерактивных интерфейсов для сайтов. Помогает превратить дизайн в полноценный работающий сайт, который удобно использовать на компьютере, планшете и телефоне.",

	"02": "Создание и настройка сайтов на WordPress с использованием PHP и ACF. Подходит для проектов, которыми клиент сможет самостоятельно управлять, редактировать и обновлять.",

	"03": "Адаптация сайта под разные размеры экранов. Благодаря responsive design сайт сохраняет удобство, структуру и хороший внешний вид на компьютерах, планшетах и мобильных устройствах.",

	"04": "Обновление существующего сайта: улучшение визуальной части, структуры, удобства использования и адаптивности. Помогает сделать старый сайт современнее, понятнее и удобнее для пользователей.",
};

function openServicesModal(item) {
	const number = item.querySelector(".services__number").textContent.trim();
	const title = item
		.querySelector(".services__name")
		.textContent.replace(/\s+/g, " ")
		.trim();

	servicesModalNumber.textContent = number;
	servicesModalTitle.textContent = title;
	servicesModalDescription.textContent = servicesDescriptions[number];

	servicesModal.classList.add("is-active");

	document.body.style.overflow = "hidden";
}

function closeServicesModal() {
	servicesModal.classList.remove("is-active");

	document.body.style.overflow = "";
}

serviceItems.forEach((item) => {
	item.addEventListener("click", () => {
		openServicesModal(item);
	});
});

servicesModalClose.addEventListener("click", closeServicesModal);

servicesModalOverlay.addEventListener("click", closeServicesModal);

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape" && servicesModal.classList.contains("is-active")) {
		closeServicesModal();
	}
});
