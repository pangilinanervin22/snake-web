const gameBoard = document.getElementById("board");
const BOARD_SIZE = 24;
let snake;
let snakeMove;
let foodLocation;
let lastMove;
let delayKey;

function start() {
	snake = [
		{ x: 11, y: 11 },
		{ x: 12, y: 11 },
		{ x: 13, y: 11 },
		{ x: 14, y: 11 },
	];

	snakeMove = { x: -1, y: 0 };
	foodLocation = { x: 8, y: 8 };
	lastMove = "ArrowUp";
	delayKey = false;

	const play = setInterval(() => {
		gameBoard.innerHTML = "";

		updateFood();
		updateSnake();
		renderSnake();
		renderFood();

		if (checkDeath()) {
			showLostModal(true);
			clearInterval(play);
			new Audio("https://pangilinanervin22.github.io/simon/res/lose.wav").play();
		}
	}, 150);
}

function updateSnake() {
	for (let i = snake.length - 2; i >= 0; i--) snake[i + 1] = { ...snake[i] };

	snake[0].y += snakeMove.y;
	snake[0].x += snakeMove.x;
}

function updateFood() {
	if (equalPosition(foodLocation, getSnakeHead())) {
		expandSnake();
		foodLocation = getRandomFood();
		new Audio("https://pangilinanervin22.github.io/simon/res/coin_sound.wav").play();
	}
}

function renderSnake() {
	snake.forEach((eachBody) => {
		const element = document.createElement("div");
		element.style.gridRowStart = eachBody.x;
		element.style.gridColumnStart = eachBody.y;
		element.classList.add("snake");
		gameBoard.appendChild(element);
	});
}

function renderFood() {
	const element = document.createElement("div");
	element.style.gridRowStart = foodLocation.x;
	element.style.gridColumnStart = foodLocation.y;
	element.classList.add("food");
	gameBoard.appendChild(element);
}

window.addEventListener("keydown", (event) => {
	if (event.defaultPreventedevented || lastMove === event.code) {
		return;
	}

	if (event.code === "ArrowDown") {
		if (lastMove === "ArrowUp") return;

		snakeMove = { x: 1, y: 0 };
	} else if (event.code === "ArrowUp") {
		if (lastMove === "ArrowDown") return;

		snakeMove = { x: -1, y: 0 };
	} else if (event.code === "ArrowLeft") {
		if (lastMove === "ArrowRight") return;

		snakeMove = { x: 0, y: -1 };
	} else if (event.code === "ArrowRight") {
		if (lastMove === "ArrowLeft") return;

		snakeMove = { x: 0, y: 1 };
	}

	lastMove = event.code;
});

function onSnake(item) {
	return snake.some((segment, index) => {
		if (index === 0) return false;
		return equalPosition(segment, item);
	});
}

function equalPosition(firstSegment, secondSegment) {
	if (firstSegment === undefined || secondSegment === undefined) return false;

	return firstSegment.x === secondSegment.x && firstSegment.y === secondSegment.y;
}

function expandSnake() {
	snake.push({ ...snake[snake.length - 1] });
}

function getRandomFood() {
	let tempPosition;
	while (tempPosition === undefined || onSnake(tempPosition) || isOutSide(tempPosition)) {
		tempPosition = {
			y: Math.floor(Math.random() * BOARD_SIZE),
			x: Math.floor(Math.random() * BOARD_SIZE),
		};
	}

	return tempPosition;
}

function getSnakeHead() {
	return snake[0];
}

function checkDeath() {
	return isOutSide(getSnakeHead()) || snakeIntersection();
}

function isOutSide(position) {
	return position.x < 1 || position.x > BOARD_SIZE || position.y < 1 || position.y > BOARD_SIZE;
}

function snakeIntersection() {
	return onSnake(getSnakeHead());
}

// modal script
const modal = document.getElementById("modal_overlay");
const modalButton = document.getElementById("modal_button");

modalButton.addEventListener("click", () => {
	start();
	showLostModal(false);
	new Audio("https://pangilinanervin22.github.io/simon/res/start.wav").play();
});

function showLostModal(enabler) {
	if (enabler) {
		modal.classList.remove("hide");
	} else {
		modal.classList.add("hide");
	}
}

// starting point
start();
