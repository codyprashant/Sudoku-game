var table;
var gameId = 0;
var puzzle = [];
var solution = [];
var leaderBoard = [];
var remaining = [9, 9, 9, 9, 9, 9, 9, 9, 9];
var isSolved = false;
var canSolved = true;
var timer = 0;
var pauseTimer = false;
var intervalId;
var gameOn = false;
var username = "";
var autoSubmit = false;
var maxHints = 0;
var brd = document.createElement("DIV");
var gameStatus='';
seeds = [];
		particles = [];

		const fwkPtcIniV = 0.5;
		const fwkSedIniV = 0.5;
		const fwkPtcIniT = 2500;
		const fwkSedIniT = 1000;
		const a = 0.0005;
		const g = 0.0005;
		const v = 0.3;
		const cursorXOffset = 5;
		const cursorYOffset = 0;

function newGame(difficulty) {
  var grid = getGridInit();
  var rows = grid;
  var cols = getColumns(grid);
  var blks = getBlocks(grid);
  var psNum = generatePossibleNumber(rows, cols, blks);
  solution = solveGrid(psNum, rows, true);
  timer = 0;
  for (var i in remaining) remaining[i] = 9;

  puzzle = makeItPuzzle(solution, difficulty);
  gameOn = difficulty < 5 && difficulty >= 0;
  maxHints = 0;
  ViewPuzzle(puzzle);
  if (gameOn) startTimer();
  document.getElementById("game-run-status").innerText = "Started";
  document.getElementById("game-hint").style.display = "block";
  document.getElementById("game-submit").style.display = "block";
  document.getElementById("game-reset").style.display = "block";
  document.getElementById("game-new").style.display = "none";
}

function getGridInit() {
  var rand = [];

  for (var i = 1; i <= 9; i++) {
    var row = Math.floor(Math.random() * 9);
    var col = Math.floor(Math.random() * 9);
    var accept = true;
    for (var j = 0; j < rand.length; j++) {
      if ((rand[j][0] == i) | ((rand[j][1] == row) & (rand[j][2] == col))) {
        accept = false;
        i--;
        break;
      }
    }
    if (accept) {
      rand.push([i, row, col]);
    }
  }

  // initialize new empty grid
  var result = [];
  for (var i = 0; i < 9; i++) {
    var row = "000000000";
    result.push(row);
  }

  // putting numbers in the grid
  for (var i = 0; i < rand.length; i++) {
    result[rand[i][1]] = replaceCharAt(
      result[rand[i][1]],
      rand[i][2],
      rand[i][0]
    );
  }

  return result;
}

// return columns from a row grid
function getColumns(grid) {
  var result = ["", "", "", "", "", "", "", "", ""];
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) result[j] += grid[i][j];
  }
  return result;
}

// return blocks from a row grid
function getBlocks(grid) {
  var result = ["", "", "", "", "", "", "", "", ""];
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++)
      result[Math.floor(i / 3) * 3 + Math.floor(j / 3)] += grid[i][j];
  }
  return result;
}

// function to replace char in string
function replaceCharAt(string, index, char) {
  if (index > string.length - 1) return string;
  return string.substr(0, index) + char + string.substr(index + 1);
}

// get allowed numbers that can be placed in each cell
function generatePossibleNumber(rows, columns, blocks) {
  var psb = [];

  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      psb[i * 9 + j] = "";
      if (rows[i][j] != 0) {
        psb[i * 9 + j] += rows[i][j];
      } else {
        for (var k = "1"; k <= "9"; k++) {
          if (!rows[i].includes(k))
            if (!columns[j].includes(k))
              if (
                !blocks[Math.floor(i / 3) * 3 + Math.floor(j / 3)].includes(k)
              )
                psb[i * 9 + j] += k;
        }
      }
    }
  }
  return psb;
}

function solveGrid(possibleNumber, rows, startFromZero) {
  var solution = [];
  var result = nextStep(0, possibleNumber, rows, solution, startFromZero);
  if (result == 1) return solution;
}

// level is current row number in the grid
function nextStep(level, possibleNumber, rows, solution, startFromZero) {
  var x = possibleNumber.slice(level * 9, (level + 1) * 9);
  var y = generatePossibleRows(x);
  if (y.length == 0) return 0;

  // to allow check is solution is unique
  var start = startFromZero ? 0 : y.length - 1;
  var stop = startFromZero ? y.length - 1 : 0;
  var step = startFromZero ? 1 : -1;
  var condition = startFromZero ? start <= stop : start >= stop;

  // try every numbers sequence in this list and go to next row
  for (var num = start; condition; num += step) {
    var condition = startFromZero ? num + step <= stop : num + step >= stop;
    for (var i = level + 1; i < 9; i++) solution[i] = rows[i];
    solution[level] = y[num];
    if (level < 8) {
      var cols = getColumns(solution);
      var blocks = getBlocks(solution);
      var poss = generatePossibleNumber(solution, cols, blocks);
      if (nextStep(level + 1, poss, rows, solution, startFromZero) == 1)
        return 1;
    }
    if (level == 8) return 1;
  }
  return -1;
}

// generate possible numbers sequence that fit in the current row
function generatePossibleRows(possibleNumber) {
  var result = [];
  function step(level, PossibleRow) {
    if (level == 9) {
      result.push(PossibleRow);
      return;
    }
    for (var i in possibleNumber[level]) {
      if (PossibleRow.includes(possibleNumber[level][i])) continue;
      step(level + 1, PossibleRow + possibleNumber[level][i]);
    }
  }

  step(0, "");

  return result;
}

// empty cell from grid depends on the difficulty to make the puzzle
function makeItPuzzle(grid, difficulty) {
  if (!(difficulty < 5 && difficulty > -1)) difficulty = 13;
  var remainedValues = 81;
  var puzzle = grid.slice(0);

  // function to remove value from a cell and its symmetry then return remained values
  function clearValue(grid, x, y, remainedValues) {
    function getSymmetry(x, y) {
      var symX = 8 - x; //Symmetry
      var symY = 8 - y;
      return [symX, symY];
    }
    var sym = getSymmetry(x, y);
    if (grid[y][x] != 0) {
      grid[y] = replaceCharAt(grid[y], x, "0");
      remainedValues--;
      if (x != sym[0] && y != sym[1]) {
        grid[sym[1]] = replaceCharAt(grid[sym[1]], sym[0], "0");
        remainedValues--;
      }
    }
    return remainedValues;
  }

  // remove value from a cell and its symmetry to reach the expected empty cells amount
  while (remainedValues > difficulty * 5 + 20) {
    var x = Math.floor(Math.random() * 9);
    var y = Math.floor(Math.random() * 9);
    remainedValues = clearValue(puzzle, x, y, remainedValues);
  }
  return puzzle;
}

// view grid in html page
function ViewPuzzle(grid) {
  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid[i].length; j++) {
      var input = table.rows[i].cells[j].getElementsByTagName("input")[0];
      addClassToCell(table.rows[i].cells[j].getElementsByTagName("input")[0]);
      if (grid[i][j] == "0") {
        input.disabled = false;
        input.value = "";
      } else {
        input.disabled = true;
        input.value = grid[i][j];
        remaining[grid[i][j] - 1]--;
      }
    }
  }
}

// read current grid
function readInput() {
  var result = [];
  for (var i = 0; i < 9; i++) {
    result.push("");
    for (var j = 0; j < 9; j++) {
      var input = table.rows[i].cells[j].getElementsByTagName("input")[0];
      if (input.value == "" || input.value.length > 1 || input.value == "0") {
        input.value = "";
        result[i] += "0";
      } else result[i] += input.value;
    }
  }
  return result;
}

function checkValue(value, row, column, block, defaultValue, currectValue) {
  if (value === "" || value === "0") return 0;
  if (!(value > "0" && value < ":")) return 4;
  if (value === defaultValue) return 0;
  if (
    row.indexOf(value) != row.lastIndexOf(value) ||
    column.indexOf(value) != column.lastIndexOf(value) ||
    block.indexOf(value) != block.lastIndexOf(value)
  ) {
    return 3;
  }
  if (value !== currectValue) return 2;
  return 1;
}

// remove old class from input and add a new class to represent current cell's state
function addClassToCell(input, className) {
  input.classList.remove("right-cell");
  input.classList.remove("worning-cell");
  input.classList.remove("wrong-cell");

  if (className != undefined) input.classList.add(className);
}

// start stopwatch timer
function startTimer() {
  var timerDiv = document.getElementById("timer");
  clearInterval(intervalId);
  pauseTimer = false;
  intervalId = setInterval(function () {
    if (!pauseTimer) {
      timer++;
      var min = Math.floor(timer / 60);
      var sec = timer % 60;
      timerDiv.innerText =
        (("" + min).length < 2 ? "0" + min : min) +
        ":" +
        (("" + sec).length < 2 ? "0" + sec : sec);
    }
  }, 1000);
}

// function that must run when document loaded
window.onload = function () {

  table = document.getElementById("puzzle-grid");
  var rippleButtons = document.getElementsByClassName("button");
  for (var i = 0; i < rippleButtons.length; i++) {
    rippleButtons[i].onmousedown = function (e) {
      var x = e.pageX - this.offsetLeft;
      var y = e.pageY - this.offsetTop;


      var rippleItem = document.createElement("div");
      rippleItem.classList.add("ripple");
      rippleItem.setAttribute("style", "left: " + x + "px; top: " + y + "px");

      var rippleColor = this.getAttribute("ripple-color");
      if (rippleColor) rippleItem.style.background = rippleColor;
      this.appendChild(rippleItem);
      setTimeout(function () {
        rippleItem.parentElement.removeChild(rippleItem);
      }, 1500);
    };
  }
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      var input = table.rows[i].cells[j].getElementsByTagName("input")[0];


      input.onchange = function () {
        //remove color from cell
        addClassToCell(this);

        // check if the new value entered is allowed
        function checkInput(input) {
          if (input.value[0] < "1" || input.value[0] > "9") {
            if (input.value != "?" && input.value != "؟") {
              input.value = "";
              alert("only numbers [1-9] and question mark '?' are allowed!!");
              input.focus();
            }
          }
        }
        checkInput(this);

        // compare old value and new value then update remaining numbers table
        if (this.value > 0 && this.value < 10) remaining[this.value - 1]--;
        if (this.oldvalue !== "") {
          if (this.oldvalue > 0 && this.oldvalue < 10)
            remaining[this.oldvalue - 1]++;
        }
        canSolved = true;
      };

      //change cell 'old value' when it got focused to track numbers and changes on grid
      input.onfocus = function () {
        this.oldvalue = this.value;
      };
    }
  }
  loadLeaderboard();
  gameStatus = document.getElementById("game-run-status");
  document.body.insertBefore(brd, document.getElementById("board"));
};

// function to hide dialog opened in window
window.onclick = function (event) {
  var d1 = document.getElementById("dialog");
  if (event.target == d1) {
    hideDialogButtonClick("dialog");
  }
};

// show hamburger menu
function HamburgerButtonClick() {
  var div = document.getElementById("hamburger-menu");
  var menu = document.getElementById("nav-menu");
  div.style.display = "block";
  div.style.visibility = "visible";
  setTimeout(function () {
    div.style.opacity = 1;
    menu.style.left = 0;
  }, 50);
}

function verifyBeforeGameStart() {
  var user = document.getElementById("username").value;
  var difficulties = document.getElementsByName("difficulty");
  var checkedCount = 0;
  for (var i = 0; i < difficulties.length; i++) {
    if (difficulties[i].checked) {
      checkedCount++;
      break;
    }
  }
  if (user != "") {
    if (checkedCount > 0) {
      username = user;
      startGameButtonClick();
    } else {
      alert("Please select difficulty level, before starting game.");
    }
  } else {
    alert("Please enter Username, before starting game.");
  }
}

// start new game
function startGameButtonClick() {
  var difficulties = document.getElementsByName("difficulty");
  var difficulty = 5;

  for (var i = 0; i < difficulties.length; i++) {
    if (difficulties[i].checked) {
      newGame(4 - i);
      difficulty = i;
      break;
    }
  }
  if (difficulty > 4) newGame(5);

  hideDialogButtonClick("dialog");
  setTimeout(function () {
    autoSubmit = true;
    checkButtonClick();
  }, 241000);
  gameId++;
  document.getElementById("game-number").innerText = "Game #" + gameId;
  document.getElementById("start-btn").style.display = "block";
  document.getElementById("timer-label").innerText = "Time";
  document.getElementById("timer").innerText = "00:00";
  document.getElementById("game-difficulty-label").innerText =
    "Game difficulty";
  document.getElementById("game-difficulty").innerText =
    difficulty < difficulties.length
      ? difficulties[difficulty].value
      : "Solved";
}

// check grid if correct
function checkButtonClick() {
  // check if game is started
  if (gameOn) {
    var currentGrid = [];
    currentGrid = readInput();

    var columns = getColumns(currentGrid);
    var blocks = getBlocks(currentGrid);

    var errors = 0;
    var currects = 0;

    for (var i = 0; i < currentGrid.length; i++) {
      for (var j = 0; j < currentGrid[i].length; j++) {
        if (currentGrid[i][j] == "0") continue;

        // check value if it is correct or wrong
        var result = checkValue(
          currentGrid[i][j],
          currentGrid[i],
          columns[j],
          blocks[Math.floor(i / 3) * 3 + Math.floor(j / 3)],
          puzzle[i][j],
          solution[i][j]
        );

        // remove old class from input and add a new class to represent current cell's state
        addClassToCell(
          table.rows[i].cells[j].getElementsByTagName("input")[0],
          result === 1
            ? "right-cell"
            : result === 2
            ? "worning-cell"
            : result === 3
            ? "wrong-cell"
            : undefined
        );

        if (result === 1 || result === 0) {
          currects++;
        } else if (result === 3) {
          errors++;
        }
      }
    }

    if (currects === 81) {
      gameOn = false;
      pauseTimer = true;
      clearInterval(intervalId);
      saveLeaderBoard();

      document.getElementById("congo").innerText = 'Congrats "'+ username+'"';
      showDialogClick("congrats");
      var diff= screen.width /10;
      newFireworkSeed((screen.width -diff), 578);
      newFireworkSeed((screen.width -diff*2), 500);
      newFireworkSeed((screen.width -diff*3), 450);
      newFireworkSeed((screen.width -diff*4), 400);
      newFireworkSeed((screen.width -diff*5), 300);
      newFireworkSeed((screen.width -diff*6), 300);
      newFireworkSeed((screen.width -diff*7), 400);
      newFireworkSeed((screen.width -diff*8), 450);
      newFireworkSeed((screen.width -diff*9), 500);
      document.getElementById("game-run-status").innerText = "Completed";
      document.getElementById("game-hint").style.display = "none";
      document.getElementById("game-submit").style.display = "none";
      document.getElementById("game-reset").style.display = "none";
      document.getElementById("game-new").style.display = "block";
      
    } else if (errors === 0 && currects === 0) {
      alert(
        "You solved it, but this is not the solution that I want. Keep Trying"
      );
    } else if (autoSubmit == true) {
      if (
        confirm("Bad Luck!!! you lost the sudoku challenge. DO you want to see Answer?")
      ) {
        document.getElementById("game-run-status").innerText = "Times up";
        pauseTimer = true;
        clearInterval(intervalId);
        SurrenderButtonClick();
      document.getElementById("game-hint").style.display = "none";
      document.getElementById("game-submit").style.display = "none";
      document.getElementById("game-reset").style.display = "none";
      document.getElementById("game-new").style.display = "block";
      } else {
        document.getElementById("game-run-status").innerText = "Times up";
      document.getElementById("game-hint").style.display = "none";
      document.getElementById("game-submit").style.display = "none";
      document.getElementById("game-reset").style.display = "none";
      document.getElementById("game-new").style.display = "block";
        // location.reload();
      }
    } else {
      var r = confirm(
        "It seems you havent completed game. Are you sure, you want to submit?"
      );
      if (r == true) {
        if (
          confirm(
            "Bad Luck!!! you lost the sudoku challenge. DO you want to see Answer?"
          )
        ) {
          document.getElementById("game-run-status").innerText = "Failed";
          pauseTimer = true;
        clearInterval(intervalId);
          SurrenderButtonClick();
          document.getElementById("game-run-status").innerText = "Failed";
          document.getElementById("game-hint").style.display = "none";
          document.getElementById("game-submit").style.display = "none";
          document.getElementById("game-reset").style.display = "none";
          document.getElementById("game-new").style.display = "block";
        } else {
          document.getElementById("game-run-status").innerText = "Failed";
          document.getElementById("game-hint").style.display = "none";
          document.getElementById("game-submit").style.display = "none";
          document.getElementById("game-reset").style.display = "none";
          document.getElementById("game-new").style.display = "block";
        }
      } 
      // else{
      //   document.getElementById("game-run-status").innerText = "Failed";
      //   document.getElementById("game-hint").style.display = "none";
      //   document.getElementById("game-submit").style.display = "none";
      //   document.getElementById("game-reset").style.display = "none";
      //   document.getElementById("game-new").style.display = "block";
      // }
    }
  }
}

function saveLeaderBoard() {
  var leaderStorage = localStorage.getItem("sudoku-leaderBoard");
  var userSecs = 0;
  if (leaderStorage == null) {
    var userTime = document.getElementById("timer").innerText;
    var tempUserSecs = userTime.split(':').map(Number);
    userSecs +=  tempUserSecs[0]*60 + tempUserSecs[1];
    var tempObj = { name: username, time: userTime, secs: userSecs };
    leaderBoard.push(tempObj);
    localStorage.setItem("sudoku-leaderBoard", JSON.stringify(leaderBoard));
  } else {
    leaderBoard = JSON.parse(leaderStorage);
    var userTime = document.getElementById("timer").innerText;
    var tempUserSecs = userTime.split(':').map(Number);
    userSecs +=  tempUserSecs[0]*60 + tempUserSecs[1];
    var tempObj = { name: username, time: userTime, secs: userSecs };
    leaderBoard.push(tempObj);
    localStorage.setItem("sudoku-leaderBoard", JSON.stringify(leaderBoard));
  }
}
function loadLeaderboard() {
  var leaderStorage = localStorage.getItem("sudoku-leaderBoard");
  if (leaderStorage == null) {
    var userTime = document.getElementById("totalLeaderboards");
    var entry = document.createElement("p");
    var boldTag = document.createElement("b");
    entry.innerHTML = "&emsp;No one won and placed in Leaderboard.";
    entry.appendChild(boldTag);
    userTime.innerHTML = entry.innerHTML;
  } else {
    leaderBoard = JSON.parse(leaderStorage);
    leaderBoard.sort((a, b) => { return a.secs - b.secs; });
    var userTime = document.getElementById("entriesLeaderboards");
    var tempcount =0;
    for (let i = 0; i < leaderBoard.length; i++) {
      if(tempcount == 10){
        break;
      }
      var userRow = document.createElement("tr");
      var userColummn1 = document.createElement("td");
      userColummn1.innerText = leaderBoard[i].name;

      var userColummn2 = document.createElement("td");
      userColummn2.innerText = leaderBoard[i].time;

      userRow.append(userColummn1, userColummn2);
      userTime.appendChild(userRow);
      tempcount++;
      
    }
  }
}

// hint
function hintButtonClick() {
  if (gameOn) {
    if (maxHints < 5) {
      // get list of empty cells and list of wrong cells
      var empty_cells_list = [];
      var wrong_cells_list = [];
      for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
          var input = table.rows[i].cells[j].getElementsByTagName("input")[0];
          if (
            input.value == "" ||
            input.value.length > 1 ||
            input.value == "0"
          ) {
            empty_cells_list.push([i, j]);
          } else {
            if (input.value !== solution[i][j]) wrong_cells_list.push([i, j]);
          }
        }
      }

      if (empty_cells_list.length === 0 && wrong_cells_list.length === 0) {
        gameOn = false;
        pauseTimer = true;
        clearInterval(intervalId);
        saveLeaderBoard();
        document.getElementById("congo").innerText = 'Congrats "'+ username+'"';
        showDialogClick("congrats");
        var diff= screen.width /10;
        newFireworkSeed((screen.width -diff), 578);
        newFireworkSeed((screen.width -diff*2), 500);
        newFireworkSeed((screen.width -diff*3), 450);
        newFireworkSeed((screen.width -diff*4), 400);
        newFireworkSeed((screen.width -diff*5), 300);
        newFireworkSeed((screen.width -diff*6), 300);
        newFireworkSeed((screen.width -diff*7), 400);
        newFireworkSeed((screen.width -diff*8), 450);
        newFireworkSeed((screen.width -diff*9), 500);
        // alert("Congrats, You solved it. Check your name in Leaderboard");
        document.getElementById("game-run-status").innerText = "Completed";
        document.getElementById("game-hint").style.display = "none";
        document.getElementById("game-submit").style.display = "none";
        document.getElementById("game-reset").style.display = "none";
        document.getElementById("game-new").style.display = "block";
      } else {
        var input;
        if (
          (Math.random() < 0.5 && empty_cells_list.length > 0) ||
          wrong_cells_list.length === 0
        ) {
          var index = Math.floor(Math.random() * empty_cells_list.length);
          input = table.rows[empty_cells_list[index][0]].cells[
            empty_cells_list[index][1]
          ].getElementsByTagName("input")[0];
          input.oldvalue = input.value;
          input.value =
            solution[empty_cells_list[index][0]][empty_cells_list[index][1]];
          remaining[input.value - 1]--;
        } else {
          var index = Math.floor(Math.random() * wrong_cells_list.length);
          input = table.rows[wrong_cells_list[index][0]].cells[
            wrong_cells_list[index][1]
          ].getElementsByTagName("input")[0];
          input.oldvalue = input.value;
          remaining[input.value - 1]++;
          input.value =
            solution[wrong_cells_list[index][0]][wrong_cells_list[index][1]];
          remaining[input.value - 1]--;
        }
      }

      // make updated cell blinking
      var count = 0;
      for (var i = 0; i < 6; i++) {
        setTimeout(function () {
          if (count % 2 == 0) input.classList.add("right-cell");
          else input.classList.remove("right-cell");
          count++;
        }, i * 750);
      }
      maxHints++;
    } else {
      alert(
        "You have used all 5 hints. No more hints availble. You are on your own now!!!"
      );
    }
  }
}

function showDialogClick(dialogId) {
  // to hide navigation bar if it opened
  hideHamburgerClick();

  var dialog = document.getElementById(dialogId);
  var dialogBox = document.getElementById(dialogId + "-box");
  dialogBox.focus();
  dialog.style.opacity = 0;
  dialogBox.style.marginTop = "-500px";
  dialog.style.display = "block";
  dialog.style.visibility = "visible";

  // to view and move the dialog to the correct position after it set visible
  setTimeout(function () {
    dialog.style.opacity = 1;
    dialogBox.style.marginTop = "64px";
  }, 200);
}

function hideDialogButtonClick(dialogId) {
  var dialog = document.getElementById(dialogId);
  var dialogBox = document.getElementById(dialogId + "-box");
  dialog.style.opacity = 0;
  dialogBox.style.marginTop = "-500px";

  setTimeout(function () {
    dialog.style.visibility = "collapse";
  }, 500);
}

// hide hamburger menu when click outside
function hideHamburgerClick() {
  var div = document.getElementById("hamburger-menu");
  var menu = document.getElementById("nav-menu");
  menu.style.left = "-256px";

  setTimeout(function () {
    div.style.opacity = 0;
    div.style.visibility = "collapse";
  }, 200);
}


function restartButtonClick() {

  if (gameOn) {
      for (var i in remaining)
          remaining[i] = 9;

      ViewPuzzle(puzzle);
      
  }
}
function SurrenderButtonClick() {

  if (gameOn) {
       for (var i in remaining)
          remaining[i] = 9;

      // review puzzle
      ViewPuzzle(solution);
      gameOn = false;
      pauseTimer = true;
      clearInterval(intervalId);

      // document.getElementById("game-difficulty").innerText = "Solved";
  }
}

function newFireworkParticle(x, y, angle)
		{
			var fwkPtc = document.createElement("DIV");
			fwkPtc.setAttribute('class', 'fireWorkParticle');
			fwkPtc.time = fwkPtcIniT;
			while(angle > 360)
				angle -= 360;
			while(angle < 0)
				angle += 360;
			fwkPtc.velocity = [];
			if(angle > 270)
			{
				fwkPtc.velocity.x = fwkPtcIniV * Math.sin(angle * Math.PI / 180) * (1 - Math.random() * v);
				fwkPtc.velocity.y = fwkPtcIniV * Math.cos(angle * Math.PI / 180) * (1 - Math.random() * v);
			}
			else if(angle > 180)
			{
				fwkPtc.velocity.x = fwkPtcIniV * Math.sin(angle * Math.PI / 180) * (1 - Math.random() * v);
				fwkPtc.velocity.y = fwkPtcIniV * Math.cos(angle * Math.PI / 180) * (1 - Math.random() * v);
			}
			else if(angle > 90)
			{
				fwkPtc.velocity.x = fwkPtcIniV * Math.sin(angle * Math.PI / 180) * (1 - Math.random() * v);
				fwkPtc.velocity.y = fwkPtcIniV * Math.cos(angle * Math.PI / 180) * (1 - Math.random() * v);
			}
			else
			{
				fwkPtc.velocity.x = fwkPtcIniV * Math.sin(angle * Math.PI / 180) * (1 - Math.random() * v);
				fwkPtc.velocity.y = fwkPtcIniV * Math.cos(angle * Math.PI / 180) * (1 - Math.random() * v);
			}
			fwkPtc.position = [];
			fwkPtc.position.x = x;
			fwkPtc.position.y = y;
			fwkPtc.style.left = fwkPtc.position.x + 'px';
			fwkPtc.style.top = fwkPtc.position.y + 'px';
			if(particles == null)
				particles = [];
			particles.push(fwkPtc);
			return fwkPtc;
		}

		function newFireworkSeed(x, y)
		{
            console.log(x+'  '+y)
			var fwkSed = document.createElement("DIV");
			fwkSed.setAttribute('class', 'fireWorkSeed');
			brd.appendChild(fwkSed);
			fwkSed.time = fwkSedIniT;
			fwkSed.velocity = [];
			fwkSed.velocity.x = 0;
			fwkSed.velocity.y = fwkSedIniV;
			fwkSed.position = [];
			fwkSed.position.x = x;
			fwkSed.position.y = y;
			fwkSed.style.left = fwkSed.position.x + 'px';
			fwkSed.style.top = fwkSed.position.y + 'px';
			if(seeds == null)
				seeds = [];
			seeds.push(fwkSed);
			return fwkSed;
		}
		
		function newFireWorkStar(x, y)
		{
			var fwkBch = document.createElement("DIV");
			fwkBch.setAttribute('class', 'fireWorkBatch');
			var a = 0;
			while(a < 360)
			{
				var fwkPtc = newFireworkParticle(x, y, a);
				fwkBch.appendChild(fwkPtc);
				a += 5;
			}
			brd.appendChild(fwkBch);
		}

		var before = Date.now();
		var id = setInterval(frame, 5);
		
		function frame()
		{
			var current = Date.now();
			var deltaTime = current - before;
			before = current;
			for(i in seeds)
			{
				var fwkSed = seeds[i];
				fwkSed.time -= deltaTime;
				if(fwkSed.time > 0)
				{
					fwkSed.velocity.x -= fwkSed.velocity.x * a * deltaTime;
					fwkSed.velocity.y -= g * deltaTime + fwkSed.velocity.y * a * deltaTime;
					fwkSed.position.x += fwkSed.velocity.x * deltaTime;
					fwkSed.position.y -= fwkSed.velocity.y * deltaTime;
					fwkSed.style.left = fwkSed.position.x + 'px';
					fwkSed.style.top = fwkSed.position.y + 'px';
				}
				else
				{
					newFireWorkStar(fwkSed.position.x, fwkSed.position.y);
					fwkSed.parentNode.removeChild(fwkSed);
					seeds.splice(i, 1);
				}
			}
			for(i in particles)
			{
				var fwkPtc = particles[i];
				fwkPtc.time -= deltaTime;
				if(fwkPtc.time > 0)
				{
					fwkPtc.velocity.x -= fwkPtc.velocity.x * a * deltaTime;
					fwkPtc.velocity.y -= g * deltaTime + fwkPtc.velocity.y * a * deltaTime;
					fwkPtc.position.x += fwkPtc.velocity.x * deltaTime;
					fwkPtc.position.y -= fwkPtc.velocity.y * deltaTime;
					fwkPtc.style.left = fwkPtc.position.x + 'px';
					fwkPtc.style.top = fwkPtc.position.y + 'px';
				}
				else
				{
					fwkPtc.parentNode.removeChild(fwkPtc);
					particles.splice(i, 1);
				}
			}
		}
		
    var id = setInterval(frame, 5);
    
