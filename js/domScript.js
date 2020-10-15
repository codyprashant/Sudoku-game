function createDomElement(elementName, className, idName, eventName, eventValue, text){
    var element = document.createElement(elementName);
    if(className != ''){
        element.setAttribute('class', className)
    }
    if(idName != ''){
        element.id = idName;
    }
    if(text != ''){
        element.innerText = text;
    }
    if(eventName != '' && eventValue != ''){
        if (eventName == 'onclick'){
            // element.onclick = eventValue
            element.setAttribute(eventName, eventValue)
        }
        else if (eventName == 'onchange'){
            // element.onchange = eventValue
            element.setAttribute(eventName, eventValue)
        } 
        else if (eventName == 'type'){
            element.type = eventValue
        }
        else if (eventName == 'name'){
            element.name = eventValue
        }
        else if (eventName == 'for'){
            element.htmlFor = eventValue
        }
        else if (eventName == 'style'){
            element.setAttribute('style', eventValue)
        }
        else if (eventName == 'href'){
            element.href = eventValue
        }
        else if (eventName == 'src'){
            element.src = eventValue
        }
        else if(eventName == 'width'){
            element.setAttribute('width', eventValue)
        }

    }
    return element;
}

function createNavbar(){
    var nav = document.createElement('nav');
    nav.setAttribute('class', 'app-bar')
    var button1 = createDomElement('button', 'button bar-button hamburger-button', '', 'onclick', 'HamburgerButtonClick();', '')
    var span1 = createDomElement('span', 'material-icons', '', '', '', 'menu');
    button1.appendChild(span1);

    var div1 = createDomElement('div', 'bar-font title', '', 'onclick', 'javascript:location.reload();', 'codyPrashant | Sudoku')
    var button2 = createDomElement('button', 'button bar-button more-button', 'start-btn', 'onclick', 'showDialogClick("dialog");', '')
    var span2 = createDomElement('span', 'material-icons', '', '', '', 'done_all');
    var span3 = createDomElement('span', '', '', '', '', 'Start New Game');
    button2.append(span2, span3);
    nav.append(button1, div1, button2);

    return nav;
}

function createHamMenu(){
    var div1 = createDomElement('div', 'hamburger-menu', 'hamburger-menu', '', '', '');
    var nav1 = createDomElement('nav', 'nav-menu', 'nav-menu', '', '', '');
    var div2 = createDomElement('div', 'nav-head', '', '', '', '');
    var div3 = createDomElement('div', 'nav-head-img', '', '', '', '');
    var img1 = createDomElement('img', '', '', 'src', '/images/sudoku.jpg', '');
    var div4 = createDomElement('div', 'nav-head-title', '', '', '', 'Sudoku');

    div3.appendChild(img1)
    div2.append(div3, div4)

    var ultag = createDomElement('ul', 'nav-items', '', '', '', '');
    var button1 = createDomElement('button', 'button nav-item vertical-adjust', '', 'onclick', 'showDialogClick("dialog");', '')
    button1.setAttribute('ripple-colour', '#003c8f')
    var span1 = createDomElement('span', 'material-icons', '', '', '', 'add');
    var span2 = createDomElement('span', '', '', '', '', ' Start New Game');
    button1.append(span1, span2)

    var button2 = createDomElement('button', 'button nav-item vertical-adjust', '', 'onclick', 'showDialogClick("rules");', '')
    button2.setAttribute('ripple-colour', '#003c8f')
    var span3 = createDomElement('span', 'material-icons', '', '', '', 'rule');
    var span4 = createDomElement('span', '', '', '', '', ' Rules');
    button2.append(span3, span4)
    
    var button3 = createDomElement('button', 'button nav-item vertical-adjust', '', 'onclick', 'showDialogClick("leaderboard");', '')
    button3.setAttribute('ripple-colour', '#003c8f')
    var span5 = createDomElement('span', 'material-icons', '', '', '', 'leaderboard');
    var span6 = createDomElement('span', '', '', 'style', 'left:12px', ' Leaderboard');
    button3.append(span5, span6)
    ultag.append(button1, button2, button3)

    var div5 = createDomElement('div', 'nav-menu-blank', '', 'onclick', 'hideHamburgerClick()', '')

    nav1.append(div2, ultag)
    div1.append(nav1, div5)
return div1;
}

function createDialogBox(){
    var div1= createDomElement('div', 'dialog', 'dialog', '', '', '');
    var div2= createDomElement('div', 'dialog-content', 'dialog-box', '', '', '');
    var div3= createDomElement('div', 'dialog-header', '', '', '', 'New Game');
    var div4= createDomElement('div', 'dialog-body', '', '', '', '');
    var p1 = createDomElement('p', '', '', '', '', 'Select game difficulty to get started.');

    var ulTag= createDomElement('ul', '', '', '', '', '');
    var liTag1= createDomElement('li', 'radio-option', '', '', '', '');
    var div5= createDomElement('div', 'form-inline', '', '', '', '');

    var label1= createDomElement('label', '', '', 'for', 'username', 'Username:');
    var input1= createDomElement('input', '', 'username', 'name', 'username', 'Username:');

    div5.append(label1, input1)
    liTag1.append(div5)

    var liTag2= createDomElement('li', 'radio-option', '', '', '', '');
    var label2= createDomElement('label', '', '', 'for', 'easy', '');
    var input2= createDomElement('input', '', 'easy', 'type', 'radio', '');
    input2.value = 'Easy';
    input2.name = 'difficulty';

    label2.append(input2, 'Easy')
    liTag2.append(label2)

    var liTag3= createDomElement('li', 'radio-option', '', '', '', '');
    var label3= createDomElement('label', '', '', 'for', 'normal', '');
    var input3= createDomElement('input', '', 'normal', 'type', 'radio', '');
    input3.value = 'Normal';
    input3.name = 'difficulty';

    label3.append(input3, 'Normal')
    liTag3.append(label3)

    var liTag4= createDomElement('li', 'radio-option', '', '', '', '');
    var label4= createDomElement('label', '', '', 'for', 'hard', '');
    var input4= createDomElement('input', '', 'hard', 'type', 'radio', '');
    input4.value = 'Hard';
    input4.name = 'difficulty';

    label4.append(input4, 'Hard')
    liTag4.append(label4)

    
    var liTag5= createDomElement('li', 'radio-option', '', '', '', '');
    var label5= createDomElement('label', '', '', 'for', 'very-hard', '');
    var input5= createDomElement('input', '', 'very-hard', 'type', 'radio', '');
    input5.value = 'Expert';
    input5.name = 'difficulty';

    label5.append(input5, 'Expert')
    liTag5.append(label5)

    ulTag.append(liTag1, liTag2, liTag3, liTag4, liTag5)
    div4.append(p1, ulTag);


    var div6 =  createDomElement('div', 'dialog-footer', '', '', '', '');
    var button1 =  createDomElement('button', 'button dialog-btn vertical-adjust', '', 'onclick', 'verifyBeforeGameStart();', 'OK');
    button1.setAttribute('ripple-color', '#003c8f')

    var button2 =  createDomElement('button', 'button dialog-btn vertical-adjust', '', 'onclick', 'hideDialogButtonClick("dialog");', 'Cancel');
    button2.setAttribute('ripple-color', '#003c8f')

    div6.append(button1, button2)
    div2.append(div3, div4, div6)
    div1.appendChild(div2)
    return div1;
}

function createRulesBox(){
    var div1= createDomElement('div', 'dialog', 'rules', '', '', '');
    var div2= createDomElement('div', 'dialog-content', 'rules-box', '', '', '');
    var div3= createDomElement('div', 'dialog-header', '', '', '', 'Rules of Sudoku game');
    var div4= createDomElement('div', 'dialog-body', '', '', '', '');
    
    var p1 = createDomElement('p', '', '', '', '', '');
    var b1 = createDomElement('b', '', '', '', '', '1. ');
    p1.append(b1, 'The classic Sudoku game involves a grid of 81 squares.')

    var p2 = createDomElement('p', '', '', '', '', '');
    var b2 = createDomElement('b', '', '', '', '', '2. ');
    p2.append(b2, 'The grid is divided into nine blocks, each containing nine squares.')

    var p3 = createDomElement('p', '', '', '', '', '');
    var b3 = createDomElement('b', '', '', '', '', '3. ');
    p3.append(b3, 'Each of the nine blocks has to contain all the numbers 1-9 within its squares and each number can only appear once in a row, column or box.')

    var p4 = createDomElement('p', '', '', '', '', '');
    var b4 = createDomElement('b', '', '', '', '', '4. ');
    p4.append(b4, 'The difficulty lies in that each vertical nine-square column, or horizontal nine-square line across, within the larger square, must also contain the numbers 1-9, without repetition or omission.')

    var p5 = createDomElement('p', '', '', '', '', '');
    var b5 = createDomElement('b', '', '', '', '', '5. ');
    p5.append(b5, 'Game will run only for 4 minutes and will get auto-submitted.')

    var p6 = createDomElement('p', '', '', '', '', '');
    var b6 = createDomElement('b', '', '', '', '', '6. ');
    p6.append(b6, 'User can use Hint option only five times so use it wisely.')

    div4.append(p1, p2, p3, p4, p5, p6)
    var div5 =  createDomElement('div', 'dialog-footer', '', '', '', '');
    var button1 =  createDomElement('button', 'button dialog-btn vertical-adjust', '', 'onclick', 'hideDialogButtonClick("rules");', 'OK');
    button1.setAttribute('ripple-color', '#202020')

    div5.append(button1)
    div2.append(div3, div4, div5)
    div1.appendChild(div2)
    return div1;
}

function createCongratsBox(){
    var div1= createDomElement('div', 'dialog', 'congrats', '', '', '');
    var div2= createDomElement('div', 'dialog-content', 'congrats-box', '', '', '');
    var div3= createDomElement('div', 'dialog-header', '', '', '', 'Congratulations');
    var div4= createDomElement('div', 'dialog-body', '', '', '', '');
    
    var p1 = createDomElement('p', 'congoClass', 'congo', '', '', '');
    var p11 = createDomElement('p', 'congo-imageclass', 'congo-image', '', '', '');
    var img = createDomElement('img', 'congo-image-sect', '', 'src', '/images/congrats.png', '');
    p11.appendChild(img);
    var p2 = createDomElement('p', '', 'congo-message', '', '', 'You have successfully solved the sudoku. Check if you made it to Leaderboard.');

    div4.append(p11,p1, p2)
    var div5 =  createDomElement('div', 'dialog-footer', '', '', '', '');
    var button1 =  createDomElement('button', 'button dialog-btn vertical-adjust', 'congo-close', 'onclick', 'hideDialogButtonClick("congrats");', 'OK');
    button1.setAttribute('ripple-color', '#202020')

    div5.append(button1)
    div2.append(div3, div4, div5)
    div1.appendChild(div2)
    return div1;
}

function createLeaderboardBox(){
    var div1= createDomElement('div', 'dialog', 'leaderboard', '', '', '');
    var div2= createDomElement('div', 'dialog-content', 'leaderboard-box', '', '', '');
    var div3= createDomElement('div', 'dialog-header', '', '', '', 'LeaderBoard');
    var div4= createDomElement('div', 'dialog-body', 'totalLeaderboards', '', '', '');
    
    var table= createDomElement('table', 'leaderboardtable', '', '', '', '');
    var thead= createDomElement('thead', '', '', '', '', '');
    var tr1= createDomElement('tr', '', '', '', '', '');
    var th1= createDomElement('th', '', '', 'width', '70%', 'Name');
    var th2= createDomElement('th', '', '', 'width', '30%', 'Time');
    // var th1= createDomElement('th', '', '', '', '', 'Name');
    // var th2= createDomElement('th', '', '', '', '', 'Time');
    tr1.append(th1, th2)
    thead.appendChild(tr1);

    var tbody= createDomElement('tbody', '', 'entriesLeaderboards', '', '', '');

    table.append(thead, tbody)

    var div5 =  createDomElement('div', 'dialog-footer', '', '', '', '');
    var button1 =  createDomElement('button', 'button dialog-btn vertical-adjust', '', 'onclick', 'hideDialogButtonClick("leaderboard");', 'OK');
    button1.setAttribute('ripple-color', '#202020')
div5.appendChild(button1)
    div4.appendChild(table);
    div2.append(div3, div4, div5)
    div1.appendChild(div2)
    return div1;
}


function createSudokotable(){
    var div1= createDomElement('div', 'body', 'sudoku', '', '', '');
    var div2= createDomElement('div', 'card game', '', '', '', '');
    var table= createDomElement('table', 'puzzle-design', 'puzzle-grid', '', '', '');

    for (let i = 0; i < 9; i++) {
        var tr= createDomElement('tr', '', '', '', '', '');

        for (let j = 0; j < 9; j++) {
            var td= createDomElement('td', '', '', '', '', '');
            var input= createDomElement('input', '', '', 'onchange', 'checkInput(this)', '');
            input.type = 'text';
            input.maxLength = 1;
            input.disabled = true;
            td.appendChild(input)
            tr.append(td);
        }
        table.append(tr);
    }
    div2.appendChild(table);
    var div3 = createGamePanel();
    div1.append(div2, div3);
    return div1;
}

function createGamePanel(){
    var div1 = createDomElement('div', 'card status game-panel', '', '', '', '');
    var div2 = createDomElement('div', '', 'game-number', '', '', 'Game #0');
    var ulTag = createDomElement('ul', 'game-status', '', '', '', '');

    var li1 = createDomElement('li', '', '', '', '', '');
    var div3 = createDomElement('div', 'vertical-adjust', '', '', '', '');
    var span1 = createDomElement('span', 'material-icons', '', '', '', 'timer');
    var span2 = createDomElement('span', '', 'timer-label', '', '', 'Time');
    div3.append(span1, span2);
    var div4 = createDomElement('div', 'timer', 'timer', '', '', '--:--');
    li1.append(div3, div4)

    var li2 = createDomElement('li', '', '', '', '', '');
    var div5 = createDomElement('div', 'vertical-adjust', '', '', '', '');
    var span3 = createDomElement('span', 'material-icons', '', '', '', 'flash_on');
    var span4 = createDomElement('span', '', 'game-difficulty-label', '', '', 'Difficulty');
    div5.append(span3, span4);
    var div6 = createDomElement('div', 'gameDifficulty', 'game-difficulty', '', '', '-');
    li2.append(div5, div6)

    var li3 = createDomElement('li', '', '', '', '', '');
    var div7 = createDomElement('div', 'vertical-adjust', '', '', '', '');
    var span5 = createDomElement('span', 'material-icons', '', '', '', 'games');
    var span6 = createDomElement('span', '', 'game-status-label', '', '', 'Status');
    div7.append(span5, span6);
    var div8 = createDomElement('div', 'gameStatus blink-soft', 'game-run-status', '', '', 'Not Started');
    li3.append(div7, div8)


    var li4 = createDomElement('li', '', '', '', '', '');
    var div9 = createDomElement('div', 'hint', 'game-hint', 'onclick', 'hintButtonClick()', 'Hint');
    var div10 = createDomElement('div', 'submit', 'game-submit', 'onclick', 'checkButtonClick()', 'Submit');
    var div11 = createDomElement('div', 'reset', 'game-reset', 'onclick', 'restartButtonClick()', 'Reset');
    var div12 = createDomElement('div', 'submit', 'game-new', 'onclick', 'showDialogClick("dialog")', 'New Game');
    var break1 = document.createElement('br');
    var break2 = document.createElement('br');

    li4.append(div9, break1, div10, break2, div11, div12)
    ulTag.append(li1, li2, li3, li4)
    div1.append(div2, ulTag);
    return div1;
}

function createFooter(){
    var div1 = createDomElement('div', 'footer vertical-adjust fixed-bottom', '', '', '', '');
    var p = document.createElement('p');
    var span1 = createDomElement('span', '', '', '', '', 'Designed and Developed with ');
    var span2 = createDomElement('span', 'material-icons', '', '', '', 'favorite');
    var span3 = createDomElement('span', '', '', '', '', ' by Prashant Gupta (');
    var anchor = createDomElement('a', '', '', 'href', 'https://github.com/codyprashant/GUVI-JS-Hackathon1', '@codyPrashant');
    var span4 = createDomElement('span', '', '', '', '', ')');
    p.append(span1, span2, span3, anchor, span4);
    div1.appendChild(p);
    return div1;
}
var board = document.createElement('div');
board.setAttribute('class', 'board')
var navBar = createNavbar();
var hamMenu = createHamMenu();
var dialogBox = createDialogBox();
var ruleBox = createRulesBox();
var leaderBox = createLeaderboardBox();
var congoBox = createCongratsBox();
var sudokuTable = createSudokotable();
var footer = createFooter();

document.body.append(board,navBar, hamMenu,  dialogBox, ruleBox, leaderBox, congoBox,sudokuTable, footer)