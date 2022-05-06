let board = [0,0,0,0,0,0,0,0,0]; //0--empty, 1-you, 2-ai
let turn = Math.floor(Math.random() * 2); //0-you, 1-ai

let interval;

let restart_button = document.getElementById("restart");
restart_button.style.visibility = "hidden";

let divs = [];
let board_ui = document.getElementById("board");
let turn_text = document.getElementById("turn_text");

function lighten_text(indexes) {
	for (let i = 0; i < indexes.length; i++) {
		div = divs[indexes[i]];
		div.children[0].style.color = "#ffffff";
	}
}

function darken_text(indexes) {
	for (let i = 0; i < divs.length; i++) {
		let div = divs[i];
		if (indexes.includes(i)) {
			continue;
		} else { div.children[0].style.color = "#8a8a8a"; }
	} 
}

function reset_match() {
	board = [0,0,0,0,0,0,0,0,0];

	for (let div of divs) {
		div.children[0].innerHTML = "";
		div.children[0].style.color = "#ffffff";
	}

	divs = [];
	restart_button.style.visibility = "hidden";
	turn = Math.floor(Math.random() * 2);
	setup();
}

function mark_who_won(player) {
	let indexes;
	if (board[0] == player && board[1] == player && board[2] == player) {
		indexes = [0,1,2];
		darken_text(indexes);
	}
	if (board[3] == player && board[4] == player && board[5] == player) {
		indexes = [3, 4, 5];
		darken_text(indexes);
	}
	if (board[6] == player && board[7] == player && board[8] == player) {
		indexes = [6, 7, 8];
		darken_text(indexes);
	}
	if (board[0] == player && board[3] == player && board[6] == player) {
		indexes = [0, 3, 6];
		darken_text(indexes);
	}
	if (board[1] == player && board[4] == player && board[7] == player) {
		indexes = [1, 4, 7];
		darken_text(indexes);
	}
	if (board[2] == player && board[5] == player && board[8] == player) {
		indexes = [2, 5, 8];
		darken_text(indexes);
	}
	if (board[0] == player && board[4] == player && board[8] == player) {
		indexes = [0, 4, 8];
		darken_text(indexes);
	}
	if (board[2] == player && board[4] == player && board[6] == player) {
		indexes = [2, 4, 6];
		darken_text(indexes);
	}
	return indexes;
}

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
		return true;
	} else {
		return false;
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
			div.children[0].style.color = "#b0b0b0";
		} else if (board[i] === 2) {
			div.children[0].innerHTML = "O";
		}
	}

	let game_is_won_player = check_if_won(board, 1);
	let game_is_won_ai = check_if_won(board, 2);
	let empty_count = getEmptySpots(board).length;
	
	//game is not won and not draw
	if (game_is_won_player === false && game_is_won_ai === false && empty_count != 0) {
		if (turn === 1) {
			setTimeout(ai_move, 70);
		}
	} else { 
		restart_button.style.visibility = "visible";

		let turn_text = document.getElementById("turn_text");
		if (empty_count === 0) {
			turn_text.innerHTML = "Game over -- It's a draw.";
			clearInterval(interval);
			turn = 2; //so player can't input
		}
		if (game_is_won_ai === true) {
			turn = 2;
			turn_text.innerHTML = "Game over -- The AI won.";
			let indexes = mark_who_won(2); //mark ai
			darken_text(indexes);
			clearInterval(interval);
		}
		if (game_is_won_player === true) {
			turn_text.innerHTML = "Game over -- You won.";
			clearInterval(interval);
			turn = 2;
		}
	}}

function setup() {
	turn_text.innerHTML = "";
	for (let div of board_ui.children) {
		divs.push(div);
	}

	for (let i = 0; i < divs.length; i++) {
		let div = divs[i];
		div.onclick = () => {
			if (turn === 0) { //if player turn
				is_markable = mark(i, 1);
				if (is_markable === true) {
					turn = 1; //to ai turn
				}
			}
		}
	}

	restart_button.onclick = () => {
		reset_match();
	}

	interval = setInterval(logic, 100);
}