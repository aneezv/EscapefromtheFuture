
let timeLeft = 45 * 60; // 30 minutes in seconds
let timerInterval;
let currentWall = 1;
const totalWalls = 6;


// puzzle 1-------------
let switches = [false, false, false, false, false, false, false, false];
const correctSwitches = [false, false, true, false, true, false , true, false]; // The correct combination

// puzzle 2----------------
const correctAnswersA = ['1', '3', '5', '8', '2', '4', '7', '6'];
const correctAnswersB = ['6', '7', '4', '2', '8', '5', '3', '1'];

// puzzle 3-----------------
const correctTimes = ['13:15', '13:47', '20:06', '17:28', '16:00']; 
const correctMathAnswers = ['13:15', '13:47', '20:06', '17:28', '16:00']; 

const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const timerElement = document.getElementById('timer');
const currentPlayerElement = document.getElementById('current-player');
const puzzleView = document.getElementById('puzzle-view');
const switchLeftButton = document.getElementById('switch-left');
const switchRightButton = document.getElementById('switch-right');
const selectPlayerAButton = document.getElementById('select-player-a');
const selectPlayerBButton = document.getElementById('select-player-b');

function selectPlayer(player) {
    currentPlayer = player;
    setupScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    currentPlayerElement.textContent = `Player ${currentPlayer}`;
    startGame();
    updatePuzzleView();
}



const switchGrid = document.getElementById('switch-grid');
const checkPuzzleButton = document.getElementById('check-puzzle');
const hintText = document.getElementById('hint-text');


function updatePuzzleView() {

    // puzzle 1 --------------------------



        if(currentPlayer === 'A' && currentWall === 1){
            puzzleView.innerHTML = `

                <div id="switch-grid">
                    ${switches.map((state, index) => `
                        <button class="switch" data-index="${index}">${state ? 'ON' : 'OFF'}</button>
                    `).join('')}
                </div>
                <button id="check-puzzle">Check Puzzle</button>
            `;
            document.getElementById('switch-grid').addEventListener('click', handleSwitchClick);
            document.getElementById('check-puzzle').addEventListener('click', checkPuzzle);
        }else if (currentPlayer === 'B' && currentWall === 1) {
            puzzleView.innerHTML = `

                <div id="clue-image-container">
                    <img id="clue-image" src="img/clue 1 B.png" alt="Clue Image">
                </div>
            `;
        }

    // puzzle 2 --------------------------

        
    if (currentWall === 2) {
        const isPlayerA = currentPlayer === 'A';
        puzzleView.innerHTML = `
            <div class="text-grid">
                <div class="${isPlayerA ? 'right-column' : 'left-column' }">
                    ${Array(8).fill().map((_, index) => `
                        <input type="text" class="text-input" data-index="${index}" 
                            ${isPlayerA ? '' : 'disabled'} 
                            value="${isPlayerA ? '' : correctAnswersA[index]}" >
                    `).join('')}
                </div>
                <div class="${isPlayerA ? 'left-column' : 'right-column'}">
                    ${Array(8).fill().map((_, index) => `
                        <input type="text" class="text-input" data-index="${index}" 
                            ${isPlayerA ? 'disabled' : ''} 
                            value="${isPlayerA ? correctAnswersB[index] : ''}" >
                    `).join('')}
                </div>
            </div>
            <button id="check-connection-${currentPlayer.toLowerCase()}">Check Connection</button>
        `;

        // Ensure the correct inputs are selected and attach event listeners
    const inputs = puzzleView.querySelectorAll('.text-input:not([disabled])');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            validateInput(input);
        });
    });



    // Add event listener for the check connection button
    document.getElementById(`check-connection-${currentPlayer.toLowerCase()}`).addEventListener('click', () => checkConnection(currentPlayer.toLowerCase()));
}

    // puzzle 3------------------
    if (currentWall === 3) {
        const isPlayerA = currentPlayer === 'A';
        
        if (isPlayerA) {
            // HTML for Player A
            puzzleView.innerHTML = `

                <div class="text-grid">
                    <div class="time-mechanisms">
                        ${Array(5).fill().map((_, index) => `
                            <div class="time-mechanism">
                                <label for="time-${index}">Time ${index + 1}:</label>
                                <input type="text" id="time-${index}" class="time-input" data-index="${index}" placeholder="Enter time">
                            </div>
                        `).join('')}
                    </div>
                    <button id="check-times">Check Times</button>
                </div>
            `;
    
            // Add event listener for the check times button
            document.getElementById('check-times').addEventListener('click', checkTimes);
        } else {
            // HTML for Player B
            puzzleView.innerHTML = `

                <div class="math-statements">
                    <div class="statement">
                        <p>What time is 8 hours and 45 minutes after 04:30?</p>
                        
                    </div>
                    <div class="statement">
                        <p>What time is 6 hours and 38 minutes before 20:25?</p>
                        
                    </div>
                    <div class="statement">
                        <p>What time is 7 hours and 54 minutes after 12:12?</p>
                        
                    </div>
                    <div class="statement">
                        <p>What time is 5 hours and 29 minutes before 22:57?</p>
                        
                    </div>
                    <div class="statement">
                        <p>What time is 9 hours and 10 minutes after 06:50?</p>
                        
                    </div>
                 
                </div>
            `;
    
            }
    }

    // puzzle 4--------------------
    if (currentWall === 4) {
        const isPlayerA = currentPlayer === 'A';
    
        // Custom sequences for each player
        const sequenceA = [2, 4, 1, 7, 3, 5, 6, 0]; // Example sequence for Player A
        const sequenceB = [5, 3, 7, 2, 6, 1, 0, 4]; // Example sequence for Player B
    
        let currentStep = 0;
        let currentSequence = isPlayerA ? sequenceA : sequenceB;
    
        function highlightButton(player, index) {
            const buttons = puzzleView.querySelectorAll('.sequence-button');
            buttons.forEach((button, i) => {
                if ((player === 'A' && i === sequenceA[index]) || (player === 'B' && i === sequenceB[index])) {
                    button.style.backgroundColor = 'skyblue';
                } else {
                    button.style.backgroundColor = '';
                }
            });
        }
    
        function handleButtonClick(event) {
            const index = parseInt(event.target.getAttribute('data-index'));
    
            if (isPlayerA) {
                // Player A clicks after getting the clue from Player B's highlight
                if (index === sequenceB[currentStep]) {
                    currentStep++;
                    if (currentStep < sequenceA.length) {
                        highlightButton('A', currentStep);
                    } else {
                        hintText.textContent = "Puzzle completed! The next clue is '7'.";
                        resetPuzzle();
                    }
                } else {
                    hintText.textContent = "Try again. wrong sequence.";
                    resetPuzzle();
                }
            } else {
                // Player B clicks after seeing Player A's highlight
                if (index === sequenceA[currentStep]) {
                    currentStep++;
                    if (currentStep < sequenceB.length) {
                        highlightButton('B', currentStep);
                    } else {
                        hintText.textContent = "Puzzle completed! The next clue is 'j'.";
                        resetPuzzle();
                    }
                } else {
                    hintText.textContent = "Try again, wrong sequence.";
                    resetPuzzle();
                }
            }
        }
    
        function resetPuzzle() {
            currentStep = 0;
            highlightButton(isPlayerA ? 'A' : 'B', 0);
        }
    
        puzzleView.innerHTML = `

            <div id="button-grid">
                ${Array(8).fill().map((_, index) => `
                    <button class="sequence-button" data-index="${index}">${index + 1}</button>
                `).join('')}
            </div>

            <button id="reset-button">Reset Puzzle</button>
        `;
        hintText.textContent = "Follow the sequence";
    
        const buttons = puzzleView.querySelectorAll('.sequence-button');
        buttons.forEach(button => {
            button.addEventListener('click', handleButtonClick);
        });
    
        document.getElementById('reset-button').addEventListener('click', resetPuzzle);
    
        if (isPlayerA) {
            // Start the sequence with Player A's clue for Player B
            highlightButton('A', 0);
        } else {
            // Start the sequence with Player B's clue for Player A
            highlightButton('B', 0);
        }
    }

    // puzzle 5 -----------

    if (currentWall === 5) {
        const isPlayerA = currentPlayer === 'A';
    
        if (isPlayerA) {
            // HTML for Player A
            puzzleView.innerHTML = `

                <div class="letter-grid">
                    ${Array(6).fill().map((_, index) => `
                        <input type="text" class="letter-input" maxlength="1" data-index="${index}">
                    `).join('')}
                </div>
                <button id="check-combination">Check Combination</button>
                <p id="hint-text"></p>
            `;
    
            // Event listener for checking the combination
            document.getElementById('check-combination').addEventListener('click', () => {
                const inputs = puzzleView.querySelectorAll('.letter-input');
                const userCombination = Array.from(inputs).map(input => input.value).join('');
                const correctCombination = 'eaioen'; // Replace with the correct combination
    
                if (userCombination === correctCombination) {
                    hintText.textContent = "Got the correct combination, final clue is 'S'.";
                } else {
                    hintText.textContent = "Dont search for what's in it, Search for what's not on it!!! .";
                }
            });
    
        } else {
            // HTML for Player B
            puzzleView.innerHTML = `

                <div id="clue-image-container">
                    <img id="clue-image" src="img/letterB.png" alt="Clue Image">
                </div>
                <p id="hint-text"></p>
            `;
        }
    }

    // puzzle 6 ------------------------
    if (currentWall === 6) {
        const isPlayerA = currentPlayer === 'A';
    
        if (isPlayerA) {
            // HTML for Player A
            puzzleView.innerHTML = `
                <div>
                    <h2><u>Terminal</u></h2>
                    <h3>Enter the Keys in any order:</h3>
                    <div id="dialer">
                        <input type="text" id="slot1" maxlength="1">
                        <input type="text" id="slot2" maxlength="1">
                        <input type="text" id="slot3" maxlength="1">
                        <input type="text" id="slot4" maxlength="1">
                        <input type="text" id="slot5" maxlength="1">
                        <input type="text" id="slot6" maxlength="1">
                        <input type="text" id="slot7" maxlength="1">
                    </div>
                    <button id="checkButton">Check</button>
                </div>
            `;
    
            document.getElementById('checkButton').addEventListener('click', function() {
                const combination = [
                    document.getElementById('slot1').value,
                    document.getElementById('slot2').value,
                    document.getElementById('slot3').value,
                    document.getElementById('slot4').value,
                    document.getElementById('slot5').value,
                    document.getElementById('slot6').value,
                    document.getElementById('slot7').value
                ].join('');
                
                const correctCombination = '#tx$S7j';
                const hint = document.getElementById('hint');
    
                if (isValidCombination(combination, correctCombination)) {
                    solvePuzzle();
                } else {
                    hintText.textContent = 'Do you know the keys bro??';
                }
            });
        } else {
            // HTML for Player B would be similar, adjust as needed
            // HTML for Player A
            puzzleView.innerHTML = `
                <div>
                    <h2><u>Terminal</u></h2>
                    <h3>Enter the Keys in any order:</h3>
                    <div id="dialer">
                        <input type="text" id="slot1" maxlength="1">
                        <input type="text" id="slot2" maxlength="1">
                        <input type="text" id="slot3" maxlength="1">
                        <input type="text" id="slot4" maxlength="1">
                        <input type="text" id="slot5" maxlength="1">
                        <input type="text" id="slot6" maxlength="1">
                        <input type="text" id="slot7" maxlength="1">
                    </div>
                    <button id="checkButton">Check</button>
                    <p id="hint"></p>
                </div>
            `;
    
            document.getElementById('checkButton').addEventListener('click', function() {
                const combination = [
                    document.getElementById('slot1').value,
                    document.getElementById('slot2').value,
                    document.getElementById('slot3').value,
                    document.getElementById('slot4').value,
                    document.getElementById('slot5').value,
                    document.getElementById('slot6').value,
                    document.getElementById('slot7').value
                ].join('');
                
                const correctCombination = '#tx$S7j';
                const hint = document.getElementById('hint');
    
                if (isValidCombination(combination, correctCombination)) {
                    solvePuzzle();
                } else {
                    hintText.textContent = 'Do you know the keys bro??';
                }
            });
        }
    }
    
    function isValidCombination(input, correct) {
        const inputSorted = input.split('').sort().join('');
        const correctSorted = correct.split('').sort().join('');
        return inputSorted === correctSorted;
    }
    
    
    


}

// puzzle 1 functions --------------

function handleSwitchClick(event) {
    if (event.target.classList.contains('switch')) {
        const index = parseInt(event.target.getAttribute('data-index'));
        switches[index] = !switches[index];
        event.target.textContent = switches[index] ? 'ON' : 'OFF';
    }
}

function checkPuzzle() {
    const isCorrect = switches.every((state, index) => state === correctSwitches[index]);
    if (isCorrect) {
        // hintText.textContent = "Puzzle solved! The clue is .";
        setHintText("Puzzle solved! The clue is '#'. note down this in paper!.");
        // You can replace "X" with the actual clue or next step in the game
    } else {
        // hintText.textContent = "Try checking the arrangements.";
        setHintText("Try checking the arrangements, did you get the correct comnination??.");
    }
}

// puzzle 2 function---------------

function validateInput(input) {
    input.value = input.value.toLowerCase();
    const validColors = ['1', '2', '3', '4', '5', '6', '7', '8'];
    if (!validColors.includes(input.value)) {
        input.value = '';
    }
}
function checkConnection(player) {
    // Get the puzzle element based on player
    const puzzleElement = document.querySelector(`.${player === 'a' ? 'right-column' : 'right-column'}`);
    
    // Ensure the puzzle element exists
    if (!puzzleElement) {
        console.error(`Element with class '${player === 'a' ? 'left-column' : 'right-column'}' not found.`);
        return;
    }
    
    // Get all enabled inputs for the current player
    const inputs = puzzleElement.querySelectorAll('.text-input:not([disabled])');
    
    // Determine which correct answers to use based on the player
    const correctAnswers = player === 'a' ? correctAnswersA : correctAnswersB;
    
    // Check if all inputs match the correct answers
    let isCorrect = false;
    inputs.forEach((input, index) => {
        if (input.value === correctAnswers[index]) {
            isCorrect = true;
        }
    });

    // Display a message based on whether the player's answers are correct
    // hintText.textContent = isCorrect ? "Puzzle solved! The next clue is Y." : "Try communicating the colors.";
    setHintText(isCorrect ? "Puzzle solved! The next clue is " + (player === 'a'? "'t'":"'x'" ) : "Try communicating the orders correct.");
}


// puzzle 3 functions-------------------------
function checkTimes() {
    const isPlayerA = currentPlayer === 'A';
    const inputs = document.querySelectorAll('.time-input');
    let isCorrect = true;
    inputs.forEach((input, index) => {
        if (input.value !== correctTimes[index]) {
            isCorrect = false;
        }
    });

    // hintText.textContent = isCorrect ? "Times are correctly set!. The next clue is Z" : "Incorrect times. Try again. time should be in 24 hour format HH:MM";
    setHintText(isCorrect ? "Times are correctly set!. The next clue is " + (isPlayerA? "'$'":"'S'") : "Incorrect times. Try again. time should be in 24 hour format HH:MM");
}

// --------------------------

function switchWall(direction) {
    currentWall += direction;
    if (currentWall > totalWalls) currentWall = 1;
    if (currentWall < 1) currentWall = totalWalls;
    updatePuzzleView();
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (timeLeft === 0) {
        endGame(false);
    } else {
        timeLeft--;
    }
}

function startGame() {
    timerInterval = setInterval(updateTimer, 1000);
    setInterval(clearHintText, 7000); // Clear hint text every 7 seconds
}

function endGame(solved) {
    clearInterval(timerInterval);
    const isPlayerA = currentPlayer === 'A';
    if (solved && isPlayerA) {
        puzzleView.innerHTML = `
                        <div>
                            <h2>Congratulations!</h2>
                            <p>You have unlocked the terminal<br>
                            you are free to go to present.</p>
                            <br>
                            <p>Wait for the other Player and Press the Button both at the Same Time.</p>
                            <a href="PlayerAEnd.html"><button>Unlock</button></a>
                        </div>
                    `;
    } else if (solved && !isPlayerA) {
        puzzleView.innerHTML = `
                        <div>
                            <h2>Congratulations!</h2>
                            <p>You have unlocked the terminal<br>
                            you can invite him to present.</p>
                            <br>
                            <p>Wait for the other Player and Press the Button both at the Same Time.</p>
                            <a href="PlayerBEnd.html"><button>Unlock</button></a>
                        </div>
                    `; }
    else{
        puzzleView.innerHTML = `
                        <div>
                            <h2>Times Up!</h2>
                            <h3>You Failed to unlock the Terminal!</h3>
                            <p>${isPlayerA ? 'You Continue to be Trapped inside the Future !' : 'You failed to bring him back to present!'}.</p>
                        </div>
                    `; 
    }
}

switchLeftButton.addEventListener('click', () => switchWall(-1));
switchRightButton.addEventListener('click', () => switchWall(1));
selectPlayerAButton.addEventListener('click', () => selectPlayer('A'));
selectPlayerBButton.addEventListener('click', () => selectPlayer('B'));

// For testing purposes, you can add this function to simulate solving the puzzle
function solvePuzzle() {
    endGame(true);
}


function clearHintText() {
    const hintText = document.getElementById('hint-text');
    if (hintText) {
        hintText.textContent = '\u00A0'; // Non-breaking space to keep the box's height
    }
}

function setHintText(text) {
    const hintText = document.getElementById('hint-text');
    if (hintText) {
        hintText.textContent = text;
    }
}
