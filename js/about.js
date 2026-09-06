const skills = [...document.querySelectorAll(".skills__item")];

const shuffledSkills = skills.sort(() => Math.random() - 0.5);

shuffledSkills.forEach((skill, index) => {
	const directions = [
		[-35, 20],
		[0, 35],
		[35, 20],
	];

	const [x, y] = directions[Math.floor(Math.random() * directions.length)];

	skill.style.setProperty("--skill-x", `${x}px`);
	skill.style.setProperty("--skill-y", `${y}px`);

	skill.style.animationDelay = `${0.4 + index * 0.13}s`;
});
