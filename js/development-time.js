const startDate = new Date("2025-05-08T00:00:00");

const yearsElement = document.querySelector("#years");
const monthsElement = document.querySelector("#months");
const daysElement = document.querySelector("#days");
const hoursElement = document.querySelector("#hours");
const minutesElement = document.querySelector("#minutes");
const secondsElement = document.querySelector("#seconds");

function updateDevelopmentTime() {
	const now = new Date();

	let years = now.getFullYear() - startDate.getFullYear();
	let months = now.getMonth() - startDate.getMonth();
	let days = now.getDate() - startDate.getDate();

	let hours = now.getHours() - startDate.getHours();
	let minutes = now.getMinutes() - startDate.getMinutes();
	let seconds = now.getSeconds() - startDate.getSeconds();

	if (seconds < 0) {
		seconds += 60;
		minutes--;
	}

	if (minutes < 0) {
		minutes += 60;
		hours--;
	}

	if (hours < 0) {
		hours += 24;
		days--;
	}

	if (days < 0) {
		const daysInPreviousMonth = new Date(
			now.getFullYear(),
			now.getMonth(),
			0,
		).getDate();

		days += daysInPreviousMonth;
		months--;
	}

	if (months < 0) {
		months += 12;
		years--;
	}

	yearsElement.textContent = years;
	monthsElement.textContent = months;
	daysElement.textContent = days;
	hoursElement.textContent = String(hours).padStart(2, "0");
	minutesElement.textContent = String(minutes).padStart(2, "0");
	secondsElement.textContent = String(seconds).padStart(2, "0");
}

updateDevelopmentTime();

setInterval(updateDevelopmentTime, 1000);
