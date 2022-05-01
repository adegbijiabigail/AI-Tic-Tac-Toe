
let board = [0, 0, 0, 0, 0, 0, 0, 0, 0]; //0--empty, 1-you, 2-ai
let turn = Math.floor(Math.random() * 2); //0-you, 1-ai

let divs = [];
let board_ui = document.getElementById("board");

function check_if_won(board, player) {
 	if ( (board[0] == player && board[1] == player && board[2] == player) ||
 	(board[3] == player && board[4] == player && board[5] == player) ||
 	(board[6] == player && board[7] == player && board[8] == player) ||
 	(board[0] == player && board[3] == player && board[6] == player) ||
 	(board[1] == player && board[4] == player && board[7] == player) ||
 	(board[2] == player && board[5] == player && board[8] == player) ||
 	(board[0] == player && board[4] == player && board[8] == player) ||
 	(board[2] == player && board[4] == player && board[6] == player) ) {

		return true;
	} else {
		return false;
	}
}

function mark(index, player) {
	if (board[index] == 0) {
		board[index] = player;
	}
}

function getEmptySpots(board_to_check) {
	let empty_indexes = [];
	for (let i = 0; i < board_to_check.length; i++) {
		if (board[i] === 0) {
			empty_indexes.push(i);
		}
	}
	return empty_indexes;
}

function minimax(new_board, player) {
	let empty_spots = getEmptySpots(new_board);
	let moves = [];
	
	//human won--> -1 | AI won --> 1 | Draw --> 0
	if (check_if_won(new_board, 1) === true) {
		return {score:-1};
	} else if (check_if_won(new_board, 2) === true) {
		return {score:1};
	} else if (empty_spots.length === 0) {
		return {score:0}
	}

	for (let i = 0; i < empty_spots.length; i++) {
		let move = {};
		move.index = empty_spots[i];

		new_board[empty_spots[i]] = player;

		if (player === 2){ //if player = aiplayer
			let result = minimax(new_board, 1); //human player
			move.score = result.score;
		} else {
			let result = minimax(new_board, 2); // ai player
			move.score = result.score;
		}

		new_board[empty_spots[i]] = 0;
		moves.push(move);
	}

	let best_move;
	if (player === 2) { //ai player
		let best_score = -10000;
		for (let i = 0; i < moves.length; i++) {
			if (moves[i].score > best_score) {
				best_score = moves[i].score;
				best_move = i;
			}
		}
	} else {
		let best_score = 10000;
		for (let i = 0; i < moves.length; i++) {
			if (moves[i].score < best_score) {
				best_score = moves[i].score;
				best_move = i;
			}
		}
	}

	return moves[best_move];
}

function ai_move() {
	let new_board = board;

	let ai_move = minimax(new_board, 2);

	board[ai_move.index] = 2;

	turn = 0;
}

function logic() {
	for (let i = 0; i < divs.length; i++) {
		let div = divs[i];
		if (board[i] === 1) {
			div.children[0].innerHTML = "X";
			div.children[0].style.color = "#f23838";
		} else if (board[i] === 2) {
			div.children[0].innerHTML = "O";
			div.children[0].style.color = "#3b83ff";
		}
	}

	let game_is_won_player = check_if_won(board, 1);
	let game_is_won_ai = check_if_won(board, 2);
	let empty_count = getEmptySpots(board).length;
	
	//game is not won and not draw
	if (game_is_won_player === false && game_is_won_ai === false && empty_count != 0) {

		let turn_text = document.getElementById("turn_text");
		if (turn === 0) {
			turn_text.innerHTML = "It's your turn";
		} else if (turn === 1) {
			turn_text.innerHTML = "Ai's turn";
		}

		if (turn === 1) {
			ai_move();
		}
	} else {
		let turn_text = document.getElementById("turn_text");
		if (empty_count === 0) {
			turn_text.innerHTML = "It's a draw.";
			turn = 2; //so player can't input
		}
		if (game_is_won_ai === true) {
			turn_text.innerHTML = "The AI won.";
			turn = 2;
		}
		if (game_is_won_player === true) {
			turn_text.innerHTML = "You won.";
			turn = 2;
		}
	}
}

function setup() {
	for (let div of board_ui.children) {
		divs.push(div);
	}

	for (let i = 0; i < divs.length; i++) {
		let div = divs[i];
		div.onclick = () => {
			if (turn === 0) { //if player turn
				mark(i, 1);
				turn = 1; //to ai turn
			}
		}
	}

	let restart_button = document.getElementById("restart");

	restart_button.onclick = () => {
		board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	}

	setInterval(logic, 100);
}