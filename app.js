let state = {};

const bodyElem = document.querySelector('body');

const resetState = () => {
    state.board = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
    state.players = ['', ''];
    state.playerTurnIdx = 0;
    state.countTurns = 0;
    state.winner = false;
    state.draw = false;
}

function renderTitle(){
    const titleElem = document.createElement('h1');
    titleElem.classList.add('title');
    bodyElem.appendChild(titleElem);
    titleElem.innerText = 'Tic-Tac-Toe';
}

const renderBoard = (state) => {
    if(!document.querySelector('.board')){
        const boardElem = document.createElement('div');
        boardElem.classList.add('board');
        bodyElem.appendChild(boardElem);
    }
    const boardElem = document.querySelector('.board');
    while (boardElem.hasChildNodes()){
        boardElem.removeChild(boardElem.firstChild);
    }
    for (let i = 0; i < state.board.length; i++){
        const cellElem = document.createElement('div');
        cellElem.classList.add('cell');
        boardElem.appendChild(cellElem);
        cellElem.dataset.index = i;
    }
}

function renderPlayerTurn(){
    const playerTurnElem = document.createElement('h2');
    playerTurnElem.classList.add('playerTurn');
    bodyElem.appendChild(playerTurnElem);
    playerTurnElem.innerText = 'Enter your names below and hit Start Game!';
}

function renderPlayerNames(){
    const playerNamesElem = document.createElement('div');
    playerNamesElem.classList.add('playerNames');
    bodyElem.appendChild(playerNamesElem);
    playerNamesElem.innerHTML =  `
    <input name="playerX" placeholder="Enter Player X">
    <input name="playerO" placeholder="Enter Player O">
    <button class="start">Start Game</button>
    `;
    playerNamesElem.addEventListener('click', (event) => startGame(event));
}

function initialRender(state){
    while (bodyElem.hasChildNodes()){
        bodyElem.removeChild(bodyElem.firstChild);
    }
    renderTitle();
    resetState();
    renderBoard(state);
    renderPlayerTurn();
    renderPlayerNames();
}

function startGame (event) {
    if (event.target.className === 'start') {
        const playerXinput = document.querySelector('input[name=playerX]');
        const playerXvalue = playerXinput.value;
        const playerOinput = document.querySelector('input[name=playerO]');
        const playerOvalue = playerOinput.value;
        
        if (!playerXvalue || !playerOvalue){
            const playerTurnElem = document.querySelector('.playerTurn');
            playerTurnElem.innerText = 'You must enter a name for each player in order to start the game.';
        } else{
            state.players[0] = playerXvalue;
            state.players[1] = playerOvalue;
            const playerNamesElem = document.querySelector('.playerNames');
            playerNamesElem.innerHTML = `
            <h3>Player X: ${state.players[0]}</h3>
            <h3>Player O: ${state.players[1]}</h3>
            <button class="newGame">New Game</button>
            `;
            playerNamesElem.addEventListener('click', (event) => {
                if (event.target.className === 'newGame'){
                    initialRender(state);
                }
            });
            const boardElem = document.querySelector('.board');
            boardElem.addEventListener('click', (event) => updateBoard(event, state));
            const playerIdx = state.playerTurnIdx;
            const currentPlayer = state.players[playerIdx];
            const playerTurnElem = document.querySelector('.playerTurn');
            playerTurnElem.innerText = `${currentPlayer}'s turn`;
        }
    }
}

function updateBoard(event, state) {
    if (event.target.className !== 'cell') return;
    const cellIdx = event.target.dataset.index;
    if (state.board[cellIdx] === 'X' || state.board[cellIdx] === 'O'){
        return;
    } else if (!state.playerTurnIdx){
        state.board[cellIdx] = 'X';
    } else {
        state.board[cellIdx] = 'O';
    }
    event.target.innerText = state.board[cellIdx];
    changeTurn(state);
}

function checkForWin (state) {
    let c = state.board;
    if ((c[0] === c[1] && c[1] === c[2])||(c[3] === c[4] && c[4] === c[5])||(c[6] === c[7] && c[7] === c[8])||(c[0] === c[3] && c[3] === c[6])||(c[1] === c[4] && c[4] === c[7])||(c[2] === c[5] && c[5] === c[8])||(c[0] === c[4] && c[4] === c[8])||(c[2] === c[4] && c[4] === c[6])){
        state.winner = true;
        const playerIdx = state.playerTurnIdx;
        const currentPlayer = state.players[playerIdx];
        const playerTurnElem = document.querySelector('.playerTurn');
        playerTurnElem.innerText = `${currentPlayer} wins! Click New Game to play again.`;
        const boardElem = document.querySelector('.board');
        boardElem.replaceWith(boardElem.cloneNode(true));
    } else if (state.countTurns === 9){
        state.draw = true;
        const playerTurnElem = document.querySelector('.playerTurn');
        playerTurnElem.innerText = `It's a draw! Click New Game to play again.`;
        const boardElem = document.querySelector('.board');
        boardElem.replaceWith(boardElem.cloneNode(true));
    }
}

function changeTurn(state) {
    state.countTurns += 1;
    checkForWin (state);
    if(!state.winner && !state.draw){
        state.playerTurnIdx = Math.abs(state.playerTurnIdx - 1);
        const playerIdx = state.playerTurnIdx;
        const currentPlayer = state.players[playerIdx];
        const playerTurnElem = document.querySelector('.playerTurn');
        playerTurnElem.innerText = `${currentPlayer}'s Turn`;
    }
}

initialRender(state);
