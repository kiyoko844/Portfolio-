const hero = document.querySelector(".hero");
const canvas = document.querySelector(".hero__canvas");
const isMobile = window.matchMedia("(max-width: 1024px)").matches;

const ctx = canvas.getContext("2d", {
	alpha: true,
	desynchronized: true,
});

const particles = [];

/* =========================
   SETTINGS
========================= */

const PARTICLE_COUNT = 400;

const CONNECTION_DISTANCE = 150;
const MOUSE_RADIUS = 320;

const PARTICLE_COLOR = "120, 180, 240";

const MAX_DPR = 1.5;

const GRID_SIZE = CONNECTION_DISTANCE;

/* =========================
   STATE
========================= */

const mouse = {
	x: 0,
	y: 0,
	active: false,
};

const clickEffect = {
	active: false,
	x: 0,
	y: 0,
	radius: 0,
	maxRadius: 500,
	strength: 12,
};

let heroRect;
let animationFrame = null;
let isVisible = true;
let resizeTimeout;

/* =========================
   CANVAS
========================= */

function resizeCanvas() {
	heroRect = hero.getBoundingClientRect();

	const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

	canvas.width = Math.floor(heroRect.width * dpr);
	canvas.height = Math.floor(heroRect.height * dpr);

	canvas.style.width = `${heroRect.width}px`;
	canvas.style.height = `${heroRect.height}px`;

	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

/* =========================
   CREATE PARTICLES
========================= */

function createParticles() {
	particles.length = 0;

	for (let i = 0; i < PARTICLE_COUNT; i++) {
		particles.push({
			x: Math.random() * heroRect.width,
			y: Math.random() * heroRect.height,

			width: Math.random() * 4 + 2,
			height: Math.random() * 3 + 1,

			speedX: (Math.random() - 0.5) * 0.85,
			speedY: (Math.random() - 0.5) * 0.85,

			opacity: Math.random() * 0.12 + 0.025,

			visible: 0,

			angle: Math.random() * Math.PI * 2,

			rotationSpeed: (Math.random() - 0.5) * 0.003,
		});
	}
}

/* =========================
   UPDATE CLICK EFFECT
========================= */

function updateClickEffect() {
	if (!clickEffect.active) {
		return;
	}

	clickEffect.radius += 14;

	clickEffect.strength *= 0.94;

	if (
		clickEffect.radius >= clickEffect.maxRadius ||
		clickEffect.strength < 0.1
	) {
		clickEffect.active = false;
	}
}

/* =========================
   UPDATE PARTICLES
========================= */

function updateParticles() {
	for (const particle of particles) {
		/* =====================
		   Normal movement
		===================== */

		particle.x += particle.speedX;
		particle.y += particle.speedY;

		particle.angle += particle.rotationSpeed;

		/* =====================
		   Loop
		===================== */

		if (particle.x < -20) {
			particle.x = heroRect.width + 20;
		} else if (particle.x > heroRect.width + 20) {
			particle.x = -20;
		}

		if (particle.y < -20) {
			particle.y = heroRect.height + 20;
		} else if (particle.y > heroRect.height + 20) {
			particle.y = -20;
		}

		/* =====================
		   Mouse interaction
		===================== */

		if (mouse.active) {
			const dx = particle.x - mouse.x;
			const dy = particle.y - mouse.y;

			const distanceSquared = dx * dx + dy * dy;
			const radiusSquared = MOUSE_RADIUS * MOUSE_RADIUS;

			if (distanceSquared < radiusSquared) {
				const distance = Math.sqrt(distanceSquared);

				const targetVisibility = 1 - distance / MOUSE_RADIUS;

				particle.visible += (targetVisibility - particle.visible) * 0.12;
			} else {
				particle.visible += (0 - particle.visible) * 0.03;
			}
		}

		/* =====================
		   Click impulse
		===================== */

		if (clickEffect.active) {
			const dx = particle.x - clickEffect.x;
			const dy = particle.y - clickEffect.y;

			const distance = Math.sqrt(dx * dx + dy * dy);

			const waveWidth = 70;
			const waveDistance = Math.abs(distance - clickEffect.radius);

			if (waveDistance < waveWidth) {
				const force = 1 - waveDistance / waveWidth;
				const safeDistance = Math.max(distance, 1);

				particle.x += (dx / safeDistance) * force * clickEffect.strength;

				particle.y += (dy / safeDistance) * force * clickEffect.strength;

				particle.visible = Math.max(particle.visible, force);
			}
		}
	}
}

/* =========================
   SPATIAL GRID
========================= */

const grid = new Map();

function buildGrid() {
	grid.clear();

	for (let i = 0; i < particles.length; i++) {
		const particle = particles[i];

		if (particle.visible < 0.05) {
			continue;
		}

		const cellX = Math.floor(particle.x / GRID_SIZE);
		const cellY = Math.floor(particle.y / GRID_SIZE);

		const key = `${cellX},${cellY}`;

		let cell = grid.get(key);

		if (!cell) {
			cell = [];
			grid.set(key, cell);
		}

		cell.push(i);
	}
}

/* =========================
   DRAW CONNECTIONS
========================= */

function drawConnections() {
	if (!mouse.active && !clickEffect.active) {
		return;
	}

	buildGrid();

	const maxDistanceSquared = CONNECTION_DISTANCE * CONNECTION_DISTANCE;

	for (let i = 0; i < particles.length; i++) {
		const particleA = particles[i];

		if (particleA.visible < 0.05) {
			continue;
		}

		const cellX = Math.floor(particleA.x / GRID_SIZE);
		const cellY = Math.floor(particleA.y / GRID_SIZE);

		for (let offsetX = -1; offsetX <= 1; offsetX++) {
			for (let offsetY = -1; offsetY <= 1; offsetY++) {
				const key = `${cellX + offsetX},${cellY + offsetY}`;

				const cell = grid.get(key);

				if (!cell) {
					continue;
				}

				for (const j of cell) {
					if (j <= i) {
						continue;
					}

					const particleB = particles[j];

					const dx = particleA.x - particleB.x;
					const dy = particleA.y - particleB.y;

					const distanceSquared = dx * dx + dy * dy;

					if (distanceSquared > maxDistanceSquared) {
						continue;
					}

					const distance = Math.sqrt(distanceSquared);

					const distanceOpacity = 1 - distance / CONNECTION_DISTANCE;

					const visibility = Math.min(particleA.visible, particleB.visible);

					const opacity = distanceOpacity * visibility * 0.65;

					ctx.beginPath();

					ctx.moveTo(particleA.x, particleA.y);
					ctx.lineTo(particleB.x, particleB.y);

					ctx.strokeStyle = `rgba(${PARTICLE_COLOR}, ${opacity})`;

					ctx.lineWidth = 0.6 + visibility * 0.5;

					ctx.stroke();
				}
			}
		}
	}
}

/* =========================
   DRAW CLICK WAVE
========================= */

function drawClickEffect() {
	if (!clickEffect.active) {
		return;
	}

	const progress = clickEffect.radius / clickEffect.maxRadius;

	const opacity = (1 - progress) * 0.35;

	ctx.beginPath();

	ctx.arc(clickEffect.x, clickEffect.y, clickEffect.radius, 0, Math.PI * 2);

	ctx.strokeStyle = `rgba(120, 180, 240, ${opacity})`;

	ctx.lineWidth = 1.5;

	ctx.stroke();
}

/* =========================
   DRAW PARTICLES
========================= */

function drawParticles() {
	for (const particle of particles) {
		const width = particle.width + particle.visible * 7;

		const height = particle.height + particle.visible * 3;

		const opacity = particle.opacity + particle.visible * 0.8;

		ctx.fillStyle = `rgba(235, 248, 255, ${opacity})`;

		ctx.save();

		ctx.translate(particle.x, particle.y);
		ctx.rotate(particle.angle);

		/* =====================
		   Small glow
		===================== */

		if (particle.visible > 0.35) {
			ctx.shadowBlur = 5;

			ctx.shadowColor = `rgba(${PARTICLE_COLOR}, ${particle.visible * 0.25})`;
		}

		ctx.beginPath();

		ctx.roundRect(-width / 2, -height / 2, width, height, height);

		ctx.fill();

		ctx.restore();
	}
}

/* =========================
   DRAW
========================= */

function draw() {
	ctx.clearRect(0, 0, heroRect.width, heroRect.height);

	drawClickEffect();
	drawConnections();
	drawParticles();
}

/* =========================
   ANIMATION
========================= */

function animate() {
	if (!isVisible || document.hidden) {
		animationFrame = null;

		return;
	}

	updateClickEffect();
	updateParticles();
	draw();

	animationFrame = requestAnimationFrame(animate);
}

function startAnimation() {
	if (animationFrame === null || animationFrame === undefined) {
		animationFrame = requestAnimationFrame(animate);
	}
}

function stopAnimation() {
	if (animationFrame !== null) {
		cancelAnimationFrame(animationFrame);

		animationFrame = null;
	}
}

/* =========================
   DESKTOP ONLY
========================= */

if (isMobile) {
	canvas.style.display = "none";
} else {
	/* =========================
	   MOUSE
	========================= */

	hero.addEventListener(
		"mousemove",
		(event) => {
			mouse.x = event.clientX - heroRect.left;
			mouse.y = event.clientY - heroRect.top;
			mouse.active = true;
		},
		{
			passive: true,
		},
	);

	hero.addEventListener(
		"mouseleave",
		() => {
			mouse.active = false;
		},
		{
			passive: true,
		},
	);

	/* =========================
	   CLICK
	========================= */

	hero.addEventListener("click", (event) => {
		clickEffect.x = event.clientX - heroRect.left;
		clickEffect.y = event.clientY - heroRect.top;

		clickEffect.radius = 0;
		clickEffect.strength = 12;
		clickEffect.active = true;

		startAnimation();
	});

	/* =========================
	   RESIZE
	========================= */

	window.addEventListener(
		"resize",
		() => {
			clearTimeout(resizeTimeout);

			resizeTimeout = setTimeout(() => {
				resizeCanvas();
				createParticles();
			}, 150);
		},
		{
			passive: true,
		},
	);

	/* =========================
	   INTERSECTION OBSERVER
	========================= */

	const observer = new IntersectionObserver(
		(entries) => {
			const entry = entries[0];

			isVisible = entry.isIntersecting;

			if (isVisible) {
				startAnimation();
			} else {
				stopAnimation();
			}
		},
		{
			threshold: 0,
		},
	);

	observer.observe(hero);

	/* =========================
	   TAB VISIBILITY
	========================= */

	document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			stopAnimation();
		} else if (isVisible) {
			startAnimation();
		}
	});

	/* =========================
	   START
	========================= */

	resizeCanvas();
	createParticles();

	startAnimation();
}
