const gameBoard = document.getElementById("snake_board");
const BOARD_SIZE = 16;
let snake,
	snakeMove,
	foodLocation,
	lastMove,
	delayKey,
	currentScore,
	highestScore = 0;

//for setting all varibles and rendered all function that needed
function start() {
	snake = [{ x: 8, y: 10 }, { x: 8, y: 11 }, , { x: 8, y: 12 }, { x: 8, y: 13 }];

	foodLocation = { x: 9, y: 8 };
	snakeMove = { x: 0, y: -1 };
	lastMove = "ArrowUp";
	delayKey = false;
	currentScore = 0;

	const renderAll = setInterval(() => {
		gameBoard.innerHTML = "";

		updateFood();
		updateSnakeBody();
		renderSnake();
		renderFood();

		if (checkDeath()) {
			showLostModal(true);
			updateScore(0);
			clearInterval(renderAll);
			new Audio("https://pangilinanervin22.github.io/simon/res/lose.wav").play();
		}
	}, 200);
}

function updateSnakeBody() {
	for (let i = snake.length - 2; i >= 0; i--) snake[i + 1] = { ...snake[i] };

	snake[0].y += snakeMove.y;
	snake[0].x += snakeMove.x;
}

function updateFood() {
	if (equalPosition(foodLocation, getSnakeHead())) {
		expandSnake();
		updateScore(++currentScore);
		foodLocation = getRandomFood();
		new Audio("https://pangilinanervin22.github.io/simon/res/coin_sound.wav").play();
	}
}

function renderSnake() {
	snake.forEach((eachBody) => {
		const element = document.createElement("div");
		element.style.gridRowStart = eachBody.y;
		element.style.gridColumnStart = eachBody.x;
		element.classList.add("snake");
		gameBoard.appendChild(element);
	});
}

function renderFood() {
	const element = document.createElement("div");
	element.style.gridRowStart = foodLocation.y;
	element.style.gridColumnStart = foodLocation.x;
	element.classList.add("food");
	gameBoard.appendChild(element);
}

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

function updateScore(score) {
	if (currentScore > highestScore) highestScore = currentScore = score;
	else currentScore = score;

	document.getElementById("current_score").textContent = "Current : " + currentScore;
	document.getElementById("highest_score").textContent = "Highest : " + highestScore;
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

// controls
for (const item of document.getElementsByClassName("snake_control"))
	item.addEventListener("click", () => {
		handleControls(item.getAttribute("id"));
	});

window.addEventListener("keydown", (event) => {
	if (event.defaultPreventedevented) return;

	handleControls(event.code);
});

function handleControls(move) {
	if (lastMove === move) return;

	if (move === "ArrowDown") {
		if (lastMove === "ArrowUp") return;
		snakeMove = { x: 0, y: 1 };
	} else if (move === "ArrowUp") {
		if (lastMove === "ArrowDown") return;
		snakeMove = { x: 0, y: -1 };
	} else if (move === "ArrowLeft") {
		if (lastMove === "ArrowRight") return;
		snakeMove = { x: -1, y: 0 };
	} else if (move === "ArrowRight") {
		if (lastMove === "ArrowLeft") return;
		snakeMove = { x: 1, y: 0 };
	}

	lastMove = move;
}

//border design
const boardDesign = document.getElementById("design_board");

let noRepeat = false;
for (let i = 0; i < BOARD_SIZE; i++) {
	noRepeat = !noRepeat;
	for (let y = 0; y < BOARD_SIZE; y += 2) {
		const element = document.createElement("div");
		element.style.gridRowStart = y;
		element.classList.add(i % 2 === 0 ? "black_box" : "white_box");
		boardDesign.appendChild(element);
	}

	for (let u = 1; u < BOARD_SIZE; u += 2) {
		const element = document.createElement("div");
		element.style.gridRowStart = u;
		element.classList.add(i % 2 === 0 ? "white_box" : "black_box");
		boardDesign.appendChild(element);
	}
}

// starting point
start();
