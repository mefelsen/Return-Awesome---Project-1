let exec;
let tempExec;
let tempObj = {};
let placeholder;

let p1;
let p2;

let p1_specialshot_enable = true;
let p2_specialshot_enable = true;
let p1_sunk_ship = false;
let p2_sunk_ship = false;

/**
 * [Member of gui.js]
 * Hides instructions after users start setup.
 */
function removeInstructions()
{
  document.getElementById("instructions").style.display = "none";
}

/**
 * [Member of gui.js]
 * This function takes the names of the players or sets them to default names if none were input.
 */
function setPlayerNames() {
    p1 = document.getElementById("player1").value;
    p2 = document.getElementById("player2").value;
  if (!(document.getElementById("player1") && document.getElementById("player1").value))
  {
    p1 = document.getElementById("player1").placeholder;
  }
  if (!(document.getElementById("player2") && document.getElementById("player2").value))
  {
    p2 = document.getElementById("player2").placeholder;
  }
}
/**
 * [Member of gui.js]
 * This function asks the user how many ships they want to use and begins to place ships
 * @param {string} shipId - the id for the ship map from the setup.html.
 */
 function setShipCount(shipId) {
   //get input from user in pop up
   let numShips;
   if (shipId === "ship1")
   {
     numShips = prompt("Please enter number of ships between 1 and 5: ");

   //validate that number of ships is between 1 and 5/
   //prompt until you recieve a valid input

     while ( numShips > 5 ||numShips < 1 || numShips === null ||numShips % 1 != 0)
     {
     //check numShips%1!=0 because we only want an integer. integer%1 is always 0.
       numShips = prompt("Please enter number of ships between 1 and 5: ");
     }
     document.getElementById("shipNum").innerHTML = numShips;
   }
   else
   {
     //if now player2, don't ask for number of ships since it was already determined
     numShips = document.getElementById("shipNum").innerHTML;
   }


   //disable the text boxes and button
   document.getElementById("button1").disabled = true;
   document.getElementById("player1").disabled = true;
   document.getElementById("player2").disabled = true;
   document.getElementById("AI_difficulty").disabled = true;
   document.getElementById("AI_selector").disabled = true;

   document.getElementById("ships").innerHTML =
     "You have chosen " + numShips + " ships";

   //prompt for the orientation of the ship and check for valid input
   let direction;
   if((shipId === "ship1") || (shipId != "ship1" && document.getElementById("AI_selector").value != "bot"))
   {
     direction = prompt("Now please choose an orientation for this ship. Type 1 for horizontal or 2 for vertical");
     while (direction < 1 ||direction > 2 || direction % 1 != 0 ||direction === null)
     {
     direction = prompt("Type 1 for horizontal or 2 for vertical");
     }
   }
   else
   {
     direction = Math.floor(Math.random() * 2)+1;
   }
   //change/confirm the intput is a number
   direction = parseInt(direction, 10);
   direction = Number(direction);
   if (direction === 1)
   {
     //if it is horizontal
     let audio = new Audio('src/Sounds/' + numShips + '.ogg');
     audio.play();
     placeShip(numShips, true, shipId);
   }
   else
   {
     //if it is vertical
     let audio = new Audio('src/Sounds/' + numShips + '.ogg');
     audio.play();
     placeShip(numShips, false, shipId);
   }
 }

 /**
  * [Member of gui.js]
  * This function deals with the interface for placing ships. When the mouse hovers,
  * the cells that would be occupied by the ship change color depending on if a ship can be placed there.
  * Lets p1 place all their ships before hiding the map and prompting p2 to place their ships.
  * @param {int} size - the size of the ship being placed.
  * @param {boolean} horizontal - the orientation of the ship: true if the ship is horizontal, false if vertical.
  * @param {string} shipId - the html id for the ship map being used.
  */
 function placeShip(size, horizontal, shipId)
 {
   //recursive exit check
   if (size <= 0)
   {
     return 0;
   }
   //display the text and tables relevant to the player
   document.getElementById("ships").style.display = "block";
   document.getElementById("placement").style.display = "block";
   document.getElementById(shipId).style.display = "inline-block";
   if(shipId==="ship1")
   {
     document.getElementById("placement").innerHTML = p1 + ", place your 1x" + size + " ship!";
   }
   else if(shipId==="ship2")
   {
     if(document.getElementById("AI_selector").value == "bot")
     {
       document.getElementById("placement").innerHTML = "Bot placement is happening right now.";
     }
     else
     {
       document.getElementById("placement").innerHTML = p2 + ", place your 1x" + size + " ship!";
     }
   }

     let table = document.getElementById(shipId);

     //this if is for if player 1 or player 2 but not bot are picking placement for their ships
   //  if(shipId ==="ship1" || (shipId != "ship1" && document.getElementById("AI_selector").value != "bot"))
   //  {
   //if the table isn't empty, begin to show the user places they can place their ships
   if (table != null)
   {
     for (let i = 0; i < table.rows.length; i++)
     {
       for (let j = 0; j < table.rows[i].cells.length; j++)
       {
         table.rows[i].cells[j].style.cursor = "ptr";

         //adds color for potenial cell when mouse over a cell -- yellow = legal, red = illegal
         table.rows[i].cells[j].onmousemove = changeColor(size, horizontal, "yellow", shipId);

         //removes the red and yellow when you move the mouse to point somewhere else
         table.rows[i].cells[j].onmouseout = function()
         {
           if (horizontal)
           {
             if (j + size <= 8)  //if the potential ship did not go out of bounds
             {
               for (let count = 0; count < size; count++)
               {
                 if (table.rows[i].cells[j + count].innerHTML != "") //if there is no ship already there
                   table.rows[i].cells[j + count].style.backgroundColor = "lightblue"; //turn it back to water
                 else
                   table.rows[i].cells[j + count].style.backgroundColor = "grey";
               }
             }
             else
             {
               //change the color back to what it for the rest of the row that the ship was in
               let count = 0;
               while (count + j < 8)
               {
                 if (table.rows[i].cells[j + count].innerHTML != "") //if no ship already placed
                   table.rows[i].cells[j + count].style.backgroundColor = "lightblue"; //back to water
                 else
                   table.rows[i].cells[j + count].style.backgroundColor = "grey";
                 count++;
               }
             }
           }
           else //if the ship outline was vertical
           {
             if (i + size <= 8) //if the ship doesn't go off the board
             {
               for (let count = 0; count < size; count++)
               {
                 if (table.rows[i + count].cells[j].innerHTML != "") //if not an existing ship
                   table.rows[i + count].cells[j].style.backgroundColor ="lightblue"; //back to water
                 else
                   table.rows[i + count].cells[j].style.backgroundColor = "grey";
               }
             }
             else //if the ship goes off the bounds of the board
             {
               let count = 0;
               //avoids going out of bounds in table
               while (count + i < 8)
               {
                 if (table.rows[i + count].cells[j].innerHTML != "")
                   table.rows[i + count].cells[j].style.backgroundColor =  "lightblue";
                 else
                   table.rows[i + count].cells[j].style.backgroundColor = "grey";
                 count++;
               }
             }
           }
         };

         //if the user clicks to place the ship
         //need to copy, edit, and paste this for bot on click after player1 sets all of his ships.
         table.rows[i].cells[j].onclick = function()
         {
           let sizeNum = Number(size);

           //sending the coords and tableId for ship construction
           if (isLegal(table.rows[i].cells[j])) {
             let tempCoords = (i+1) + ":" + (j+1);
             buttonHandlerSetup(shipId, tempCoords, size, horizontal);

             if (horizontal)
             {
               if (j + sizeNum <= 8) {
                 for (let count = 0; count < sizeNum; count++) {
                   table.rows[i].cells[j + count].style.backgroundColor = "grey";
                   table.rows[i].cells[j + count].innerHTML = "";
                 }
               }
             }
             else
             {
               if (i + sizeNum <= 8) {
                 for (let count = 0; count < sizeNum; count++) {
                   table.rows[i + count].cells[j].style.backgroundColor = "grey";
                   table.rows[i + count].cells[j].innerHTML = "";
                 }
               }
             }
             if (sizeNum !== 1)
             {
               //while still placing ships, ask for a new orientation after each one is placed
               let audio = new Audio('src/Sounds/' + (size - 1) + '.ogg');
               audio.play();

               let horizontal;
               if((shipId === "ship1") || (shipId != "ship1" && document.getElementById("AI_selector").value != "bot"))
               {
                 horizontal = prompt("Now please choose an orientation for this ship. Type 1 for horizontal or 2 for vertical");
               }
               else
               {
                 horizontal = Math.floor(Math.random() * 2)+1;
               }
               //validate the input
               while (horizontal < 1 || horizontal > 2 || horizontal % 1 != 0 || horizontal === null )
               {
                 horizontal = prompt("Type 1 for horizontal or 2 for vertical");
               }
               horizontal = Number(horizontal);
               if (horizontal === 1)
               {
                 //call the placeship function for the next smallest ship
                 placeShip(sizeNum-1, true, shipId);
               }
               else
               {
                 //call the placeship function for the next smallest ship
                 placeShip(sizeNum -1, false, shipId);
               }
             }
             else
             {
               //hide the ship board
               document.getElementById(shipId).style.display = "none";
               if (shipId === "ship1")
               {
                 //player 1 just finished, hide their board and display player 2's
                 document.getElementById("test").style.display = "block";
                 document.getElementById("ships").style.display = "none";
                 document.getElementById("names").style.display = "none";
                 document.getElementById("placement").style.display = "none";
                 document.getElementById("button1").style.display = "none";
                 if(document.getElementById("AI_selector").value == "bot")
                 {
                   alert("You have placed all of your ships.")
                 }
                 else
                 {
                   alert("You have placed all of your ships. Please switch players now!");
                 }
                 exec.advancePlayerTurn();
               }
               else
               {
                 //player 1 and player 2 have no finished. Moving to start the game
                 document.getElementById("test").style.display = "none";
                 document.getElementById("ships").style.display = "none";
                 document.getElementById("names").style.display = "none";
                 document.getElementById("placement").style.display = "none";
                 alert("Press ok to start the game");
                 exec.advancePlayerTurn();
                 storeExecObj(tempObj);
               }
             }
           }
         }; //end of onclick function
       //}
       }
     }
   }

     //this else is for the bot random placement without clicks, not coded, so bot can't randomly place.
     /*else
     {
       let sizeNum = Number(size);
       i = Math.floor(Math.random()*8);
       j = Math.floor(Math.random()*8);
       let tempCoords = (i+1) + ":" + (j+1);
       if((i+sizeNum<9) || (j+sizeNum < 9) || (i>1) || (j>1))//is valid
       {
         buttonHandlerSetup(shipId, tempCoords, size, horizontal);
       }
     }*/
   //}
 }

/**
 * [Member of gui.js]
 * Checks if ship placement is legal.
 * @param cell - the HTML table cell to check.
 * @return {boolean} true if placement is legal, else false.
 */
function isLegal(cell) {
  return cell.style.backgroundColor === "yellow";
}

/**
 * [Member of gui.js]
 * This function will color cells of a table according to if the placement of the ship is legal.
 * @param {number} sizee - size of the ship.
 * @param {boolean} horizontal - orientation of the ship: true if the ship is horizontal, false if vertical.
 * @param {string} color - color for the cell.
 * @param {string} tableID - HTML ID for the table.
 */
function changeColor(sizee, horizontal, color, tableID) {
  let table = document.getElementById(tableID);
  let size = parseInt(sizee, 10);
  size = Number(size);
  if (table != null) {
    for (let i = 0; i < table.rows.length; i++) {
      for (let j = 0; j < table.rows[0].cells.length; j++) {
        table.rows[i].cells[j].style.cursor = "ptr";
        table.rows[i].cells[j].onmousemove =
          //size is a int of the ship length, horizontal is a bool (y/n)
          function() {
            let existingShip = false;
            if (horizontal) {
              if (j + size <= 8) {
                for (let count = 0; count < size; count++)
                {
                  if (table.rows[i].cells[j + count].innerHTML === "")
                    existingShip = true;
                }
                for (let count = 0; count < size; count++)
                {
                  if (existingShip)
                  {
                    //user can't place a ship ontop of another ship
                    table.rows[i].cells[j+count].style.backgroundColor = "red";
                  }
                  else
                  {
                    table.rows[i].cells[j+count].style.backgroundColor = "yellow";
                  }
                }
              } else {
                let count = 0;
                while (count + j < 8) {
                  if (table.rows[i].cells[j + count].innerHTML !== "")
                    table.rows[i].cells[j + count].style.backgroundColor = "red";
                  count++;
                }
              }
            }
            else //if vertical
            {
              if (i + size <= 8)
              {
                for (let count = 0; count < size; count++)
                {
                  if (table.rows[i+count].cells[j].innerHTML === "")
                    existingShip = true;
                }
                for (let count = 0; count < size; count++)
                {
                  if (existingShip)
                  {
                    //user can't place a ship ontop of another ship
                    table.rows[i+count].cells[j].style.backgroundColor = "red";
                  }
                  else
                  {
                    table.rows[i+count].cells[j].style.backgroundColor = "yellow";
                  }
                }
              } else {
                  let count = 0;
                  while (count + i < 8) {
                    if (table.rows[i + count].cells[j].innerHTML !== "");
                      table.rows[i + count].cells[j].style.backgroundColor = "red";
                    count++;
                  }
                }
            }
          }; //end of anonymous function
      }
    }
  }
} //end of changecolor


/**
 * [Member of gui.js]
 * Creates the {@link Executive} object and calls {@link makeTempObj}.  Launched when
 * submitting information in setup.html.
 */
function createExec(){
    //creating an exec object
    let tempAdmr1 = document.getElementById("player1").value;
    if(tempAdmr1 == "") {
      tempAdmr1 = document.getElementById("player1").placeholder;
    }

    let tempAdmr2 = document.getElementById("player2").value;
    if(tempAdmr2 == "") {
      tempAdmr2 = document.getElementById("player2").placeholder;
    }
    let newString = document.getElementById("ships").innerHTML;
    tempNumShips = newString.substring(16);
    tempNumShips= tempNumShips.substring(0,tempNumShips.indexOf(" "));

    exec = new Exec(tempAdmr1, tempAdmr2, tempNumShips, document.getElementById('AI_difficulty').value);
    makeTempObj(exec);
}

/**
 * [Member of gui.js]
 * Handles button clicks on the game maps, filters for just the firing map, calls
 * {@link Exec#updateTable} to update the firing map, and enables the "next turn" button.
 * @param {string} tableId - id of the table that triggered the onclick event.
 * @param {string} coords - coordinates for a specific cell in the table.
 */
function buttonHandler(tableId, coords){
    if(tableId == "fire1"){
        let hit = exec.updateTable(coords, tableId);
        document.getElementById("table1").classList.add("disabledButton");
        document.getElementById("turnButton").disabled = false;
        exec.checkSunk();
        if(exec.getPlayerTurn()===1)
        {
          document.getElementById("p1progress").style.display = "block";
          for (let i = 0; i< exec.admir2.numShips; i++)
          {
            if (exec.admir2.fleet[i].status === false)
            {
                for (let j = 0; j<exec.admir2.fleet[i].coords.length; j++)
                {
                  if (exec.admir2.fleet[i].coords[j] == coords && exec.admir2.afloat != 0) {

                    document.getElementById('shipSunk').play();
                    alert("Congrats! You sunk a ship!");
                  }
                }
            }
          }
        }
        else
        {
          document.getElementById("p2progress").style.display = "block";
          for (let i = 0; i< exec.admir1.numShips; i++)
          {
            if (exec.admir1.fleet[i].status === false)
            {
                for (let j = 0; j<exec.admir1.fleet[i].coords.length; j++)
                {
                  if (exec.admir1.fleet[i].coords[j] === coords && exec.admir1.afloat != 0) {
                    if(exec.getPlayerTurn() == 2 && exec.admir2.botDifficulty != "0")
                    {
                      document.getElementById('shipSunk').play();
                      alert("Bot sunk your ship!");
                    }
                    else
                    {
                      alert("Congrats! You sunk a ship!");
                    }
                  }
                }
            }
          }

        }
    }
    else{
        alert("You shouldn't fire on your own map!");
    }
    document.getElementById("specialshot").style = "display: inline; visibility: hidden;";
    document.getElementById("specialshot").disabled = "true";
    document.getElementById("specialshot_button").style = "display: inline; visibility: hidden;";
    document.getElementById("specialshot_button").disabled = "true";
    document.getElementById("specialshot_form1").style = "display: inline; visibility: hidden;";
    document.getElementById("specialshot_form1").disabled = "true";
    document.getElementById("specialshot_form2").style = "display: inline; visibility: hidden;";
    document.getElementById("specialshot_form2").disabled = "true";
}

/**
 * [Member of gui.js]
 * Handles button clicks on the setup page, passes the relevant data to the exec object,
 * calling {@link Exec#sendCoordsForPlacement}.
 * @param {string} tableId - id of the table that triggered the onclick event.
 * @param {string} coords - coordinates for a specific cell in the table.
 * @param {number} shipSize - size of the ship being placed.
 * @param {boolean} orientation - orientation of the ship, true for horizontal, false for vertical.
 */
function buttonHandlerSetup(tableId, coords, shipSize, orientation){
    exec.sendCoordsForPlacement(tableId,coords,shipSize,orientation);
    saveShip(coords, shipSize, orientation);
}

/**
 * [Member of gui.js]
 * Adds a {@link Ship}'s basic data to an existing temporary object for storage.
 * Also see {@link makeTempObj}.
 * @param {string} coords - the starting coordinate for the Ship being processed.
 * @param {number} shipSize - the size of the Ship.
 * @param {boolean} orientation - the orientation of the Ship, true for horizontal, false for vertical.
 */
function saveShip(coords, shipSize, orientation) {
  if(exec.m_playerTurn == 1) {
    tempObj.adm1Coords[shipSize - 1] = coords;
    tempObj.adm1Ori[shipSize - 1] = orientation;
  }
  else if(exec.m_playerTurn == 2) {
    tempObj.adm2Coords[shipSize - 1] = coords;
    tempObj.adm2Ori[shipSize - 1] = orientation;
  }
  else {
    console.log("ERROR: saveShip : player turn value is invalid, somehow!");
  }
}

/**
 * [Member of gui.js]
 * Stores the completed temporary object in the session storage after all ships are placed,
 * and navigates to the index page.
 * @param {Object} tempObj - object containing the necessary information to generate a new
 * {@link Exec} object with all members initialized.
 */
function storeExecObj(tempObj){
    sessionStorage.temp = JSON.stringify(tempObj);
    location.href = "./index.html";
}

/**
 * [Member of gui.js]
 * Retrieves the temporary object from session storage at the start of the game.
 * @return {Object} the temporary object from storage.
 */
function pullExecObj(){
    let fromStorage = JSON.parse(sessionStorage.temp);
    return(fromStorage);
}

/**
 * [Member of gui.js]
 * Initializes the game by retrieving game data from sessionStorage in index.html,
 * calling {@link reconstruct}, and calling {@link Exec#refreshMap}.
 */
function onLoadPull(){

    placeholder = pullExecObj();
    reconstruct(placeholder);
    exec.refreshMap();
}

/**
 * [Member of gui.js]
 * Creates a temporary object which will be saved in session storage
 * and assigns to it the basic data necessary to reconstruct an
 * {@link Exec} object with everything it contains.
 * Also see {@link saveShip} and {@link reconstruct}.
 * @param {Exec} exec - the Exec object created in setup.html.
 */
function makeTempObj(exec) {
  tempObj.adm1Name = exec.admir1.name;
  tempObj.adm2Name = exec.admir2.name;
  let num = Number(exec.m_shipCount);
  tempObj.numShips = num;
  tempObj.adm1Coords = new Array(num);
  tempObj.adm1Ori = new Array(num);
  tempObj.adm2Coords = new Array(num);
  tempObj.adm2Ori = new Array(num);
  tempObj.botDifficulty = document.getElementById('AI_difficulty').value;
}

/**
 * [Member of gui.js]
 * Constructs an {@link Exec} object in index.html and populates it with all
 * data from a temporary object.  Also see {@link makeTempObj} and {@link saveShip}.
 * @param {Object} obj - a temporary object pulled from session storage, which
 * contains the necessary data to create and populate the Exec object.
 */
function reconstruct(obj) {
  exec = new Exec(obj.adm1Name, obj.adm2Name, obj.numShips, obj.botDifficulty);
  for(let i = 0; i < obj.numShips; i++)
  {
    exec.admir1.assignCoords(obj.adm1Coords[i], (i + 1), obj.adm1Ori[i], "ship1");
  }

  for(let i = 0; i < obj.numShips; i++)
  {
    exec.admir2.assignCoords(obj.adm2Coords[i], (i + 1), obj.adm2Ori[i], "fire1");
  }
}

/**
 * [Member of gui.js]
 * Displays the in-game messages for each player on their turn.
 */
function updateMessages()
{
    exec.checkSunk();
    if (exec.getPlayerTurn() === 1)
    {
        document.getElementById("p1updates").style.display = "block";
        document.getElementById("p2updates").style.display = "none";
        document.getElementById("p1progress").style.display = "block";
        document.getElementById("p2progress").style.display = "none";
    }
    else
    {
        document.getElementById("p1updates").style.display = "none";
        document.getElementById("p2updates").style.display = "block";
        document.getElementById("p1progress").style.display = "none";
        document.getElementById("p2progress").style.display = "block";
    }
}

/**
 * [Member of gui.js]
 * Determines the state of the switch player button in index, hides/unhides table divs, updates
 * button text and refreshes player maps.
 */
function turnButton(){
    let temp = document.getElementById("turnButton");
    if(temp.value === "End Turn"){
        //hide table divs
        document.getElementById("gameInstructions").style.display = "none";
        document.getElementById("table1").style.display = "none";
        document.getElementById("table2").style.display = "none";
        document.getElementById("p1updates").style.display = "none";
        document.getElementById("p2updates").style.display = "none";
        document.getElementById("p1progress").style.display = "none";
        document.getElementById("p2progress").style.display = "none";
        //hide special shot elements
        document.getElementById("specialshot").style = "display: inline; visibility: hidden;";
        document.getElementById("specialshot").disabled = "true";
        document.getElementById("specialshot_button").style = "display: inline; visibility: hidden;";
        document.getElementById("specialshot_button").disabled = "true";
        document.getElementById("specialshot_form1").style = "display: inline; visibility: hidden;";
        document.getElementById("specialshot_form1").disabled = "true";
        document.getElementById("specialshot_form2").style = "display: inline; visibility: hidden;";
        document.getElementById("specialshot_form2").disabled = "true";
        //update home button text to next value
        if(exec.admir2.botDifficulty == "0")
        {
          temp.value = "Player Start";
        }
        else
        {
          temp.value = "Bot Start";
        }
        exec.advancePlayerTurn();
        //exec.advancePlayerTurn(); <-- for future use
        exec.refreshMap();
        exec.refreshFireMap();
    }
    else if(temp.value == "Bot Start")
    {//Test
      if (exec.admir2.botDifficulty == "1") {
        let coord = exec.admir2.AIupdateHit("fire1", exec.admir2.botDifficulty);
        buttonHandler("fire1", coord);

        if (document.getElementById("message").innerHTML != "has won the game!!!") {
          exec.advancePlayerTurn();
        }
        exec.refreshMap();
        exec.refreshFireMap();
        temp.value = "Player Start";
      }
      else if (exec.admir2.botDifficulty == "2") {
        //part planB
        // let i = Math.floor(Math.random() * 8) + 1;
        // let j = Math.floor(Math.random() * 8) + 1;
        // let guess = i.toString(10) + ":" + j.toString(10);
        let i
        let j
        var guess

        // let looped=exec.admir1.afloat
        // let ed=looped-1

        while(!exec.admir1.gethitstute())
        {
          var looped=exec.admir1.afloat
          var ed=looped-1
          i = Math.floor(Math.random() * 8) + 1;
          j = Math.floor(Math.random() * 8) + 1;
          guess = i.toString(10) + ":" + j.toString(10);
          buttonHandler("fire1", guess);
        }

        if(looped!=ed)
        {
          exec.admir1.savecoord(guess)
          rechit(exec.admir1.aIcoord)
        }else
        {
          //update
          exec.admir1.updatehitstute()
        }


        //planB
        // while(looped!=ed)
        // {
        //   i = Math.floor(Math.random() * 8) + 1;
        //   j = Math.floor(Math.random() * 8) + 1;
        //   guess = i.toString(10) + ":" + j.toString(10);
        //   buttonHandler("fire1", guess);
        //   looped=exec.admir1.afloat
        // }



        if(document.getElementById("message").innerHTML != "has won the game!!!")
        {
          exec.advancePlayerTurn();
        }
        exec.refreshMap();
        exec.refreshFireMap();
        temp.value = "Player Start";
      }
    }
    else{

        //show tables
        updateMessages();
        document.getElementById("gameInstructions").style.display = "block";
        document.getElementById("table1").style.display = "block";
        document.getElementById("table2").style.display = "block";
        //unlock the table

        document.getElementById("table1").classList.remove("disabledButton");
        //update button text
        temp.value = "End Turn";
        //disable button
        temp.disabled = true;

        if(p1_specialshot_enable && exec.getPlayerTurn() == 1) {
          document.getElementById("specialshot").style = "display: inline;";
          document.getElementById("specialshot").disabled = false;
          document.getElementById("specialshot_button").style = "display: inline;";
          document.getElementById("specialshot_button").disabled = false;
          document.getElementById("specialshot_form1").style = "display: inline;";
          document.getElementById("specialshot_form1").disabled = false;
          document.getElementById("specialshot_form2").style = "display: inline;";
          document.getElementById("specialshot_form2").disabled = false;
        }
        if(p2_specialshot_enable && exec.getPlayerTurn() == 2) {
          document.getElementById("specialshot").style = "display: inline;";
          document.getElementById("specialshot").disabled = false;
          document.getElementById("specialshot_button").style = "display: inline;";
          document.getElementById("specialshot_button").disabled = false;
          document.getElementById("specialshot_form1").style = "display: inline;";
          document.getElementById("specialshot_form1").disabled = false;
          document.getElementById("specialshot_form2").style = "display: inline;";
          document.getElementById("specialshot_form2").disabled = false;
        }
        if(!p1_specialshot_enable && exec.getPlayerTurn() == 1) {
          document.getElementById("specialshot").style = "display: inline; visibility: hidden;";
          document.getElementById("specialshot").disabled = "true";
          document.getElementById("specialshot_button").style = "display: inline; visibility: hidden;";
          document.getElementById("specialshot_button").disabled = "true";
          document.getElementById("specialshot_form1").style = "display: inline; visibility: hidden;";
          document.getElementById("specialshot_form1").disabled = "true";
          document.getElementById("specialshot_form2").style = "display: inline; visibility: hidden;";
          document.getElementById("specialshot_form2").disabled = "true";
        }
        if(!p2_specialshot_enable && exec.getPlayerTurn() == 2) {
          document.getElementById("specialshot").style = "display: inline; visibility: hidden;";
          document.getElementById("specialshot").disabled = "true";
          document.getElementById("specialshot_button").style = "display: inline; visibility: hidden;";
          document.getElementById("specialshot_button").disabled = "true";
          document.getElementById("specialshot_form1").style = "display: inline; visibility: hidden;";
          document.getElementById("specialshot_form1").disabled = "true";
          document.getElementById("specialshot_form2").style = "display: inline; visibility: hidden;";
          document.getElementById("specialshot_form2").disabled = "true";
        }
    }
}
function check(x)
{
  if(x>0&&x<9)
  {
    return true
  }
  else
  {
    return false
  }
}
function rechit(coord)
{
  let row=parseInt(coord.substr(0,1))
  let col=parseInt(coord.substr(2,1))
  //going up
  if(check(row-1))
  {
    let tothecoord= (row-1).toString(10)+":"+col.toString(10)
    //exec.admir1.updatehitstute()
    buttonHandler("fire1", tothecoord);
    if(exec.admir1.gethitstute())
    {
      exec.admir1.savecoord(tothecoord)
    }
  }
  if(check(row+1))
  {
    let tothecoord= (row+1).toString(10)+":"+col.toString(10)
    //exec.admir1.updatehitstute()
    buttonHandler("fire1", tothecoord);
    if(exec.admir1.gethitstute())
    {
      exec.admir1.savecoord(tothecoord)
    }

  }
  if(check(col-1))
  {
    let tothecoord= row.toString(10)+":"+(col-1).toString(10)
    //exec.admir1.updatehitstute()
    buttonHandler("fire1", tothecoord);
    if(exec.admir1.gethitstute())
    {
      exec.admir1.savecoord(tothecoord)
    }

  }
  if(check(col+1))
  {
    let tothecoord= row.toString(10)+":"+(col+1).toString(10)
    //exec.admir1.updatehitstute()
    buttonHandler("fire1", tothecoord);
    if(exec.admir1.gethitstute())
    {
      exec.admir1.savecoord(tothecoord)
    }

  }
}
/**
 * [Member of gui.js]
 * Changes GUI labels and select forms based on playing against another player or AI
 */
 function onChange()
{
  let value = document.getElementById("AI_selector").value
  if(value == "bot"){
    document.getElementById("player2_label").innerHTML = "Select Bot Difficulty: ";
    document.getElementById("AI_difficulty").disabled = false;
    document.getElementById("AI_difficulty").style.visibility = "visible";
    document.getElementById("player2").disabled = true;
    document.getElementById("player2").style.visibility = "hidden";
    document.getElementById("player2").value = "Bot";
  }
  else{
    document.getElementById("player2_label").innerHTML = "Enter name of player 2: ";
    document.getElementById("AI_difficulty").disabled = true;
    document.getElementById("AI_difficulty").value = "0";
    document.getElementById("AI_difficulty").style.visibility = "hidden";
    document.getElementById("player2").disabled = false;
    document.getElementById("player2").style.visibility = "visible";
    document.getElementById("player2").value = "";
  }
}

 /**
 * [Member of gui.js]
 * Called when Attack button is pressed. Attacks a 3x3 location
 */
function specialShot()
{
  let j = parseInt(document.getElementById("specialshot_coord_1").value);
  let i = parseInt(document.getElementById("specialshot_coord_2").value);
  if(i < 2 || i > 7 || j < 2 || j > 7) {
    alert("Select a valid location! Your special shot will go out of bounds");
  }
  else {
    specialbuttonHandler("fire1",i.toString() + ":" + j.toString());//middle
    specialbuttonHandler("fire1",i.toString() + ":" + (j-1).toString());//middle bottom
    specialbuttonHandler("fire1",i.toString() + ":" + (j+1).toString());//middle top
    specialbuttonHandler("fire1",(i-1).toString() + ":" + j.toString());//Left middle
    specialbuttonHandler("fire1",(i+1).toString() + ":" + j.toString());//Right middle
    specialbuttonHandler("fire1",(i-1).toString() + ":" + (j+1).toString());//Left top
    specialbuttonHandler("fire1",(i+1).toString() + ":" + (j+1).toString());//Right top
    specialbuttonHandler("fire1",(i-1).toString() + ":" + (j-1).toString());//Left bottom
    specialbuttonHandler("fire1",(i+1).toString() + ":" + (j-1).toString());//Right bottom

    //Disable all controls after shot is used
    document.getElementById("specialshot").style = "display: inline; visibility: hidden;";
    document.getElementById("specialshot").disabled = "true";
    document.getElementById("specialshot_button").style = "display: inline; visibility: hidden;";
    document.getElementById("specialshot_button").disabled = "true";
    document.getElementById("specialshot_form1").style = "display: inline; visibility: hidden;";
    document.getElementById("specialshot_form1").disabled = "true";
    document.getElementById("specialshot_form2").style = "display: inline; visibility: hidden;";
    document.getElementById("specialshot_form2").disabled = "true";

    if(exec.getPlayerTurn() == 1) {
      p1_specialshot_enable = false;
      if(p1_sunk_ship) {
        alert("Congrats! You sunk a ship");
      }
      exec.endGameChecker(1);
    }
    else {
      p2_specialshot_enable = false;
      if(p2_sunk_ship) {
        alert("Congrats! You sunk a ship");
      }
      exec.endGameChecker(2);
    }
  }
}

/**
 * [Member of gui.js]
 * A altered version of buttonhandler. Specifically for special shot.
 * Returns a bool is a ship was sunk or not after a special shot attack.
 * {@link Exec#updateTable} to update the firing map, and enables the "next turn" button.
 * @param {string} tableId - id of the table that triggered the onclick event.
 * @param {string} coords - coordinates for a specific cell in the table.
 */
function specialbuttonHandler(tableId, coords){
    if(tableId == "fire1"){
        let hit = exec.specialupdateTable(coords, tableId);
        document.getElementById("table1").classList.add("disabledButton");
        document.getElementById("turnButton").disabled = false;
        //exec.checkSunk();
        if(exec.getPlayerTurn()===1)
        {
          document.getElementById("p1progress").style.display = "block";
          for (let i = 0; i< exec.admir2.numShips; i++)
          {
            if (exec.admir2.fleet[i].status === false)
            {
                for (let j = 0; j<exec.admir2.fleet[i].coords.length; j++)
                {
                  if (exec.admir2.fleet[i].coords[j] == coords && exec.admir2.afloat != 0) {
                    p1_sunk_ship = true;
                  }
                }
            }
          }
        }
        else
        {
          document.getElementById("p2progress").style.display = "block";
          for (let i = 0; i< exec.admir1.numShips; i++)
          {
            if (exec.admir1.fleet[i].status === false)
            {
                for (let j = 0; j<exec.admir1.fleet[i].coords.length; j++)
                {
                  if (exec.admir1.fleet[i].coords[j] === coords && exec.admir1.afloat != 0) {
                    if(exec.getPlayerTurn() == 2 && exec.admir2.botDifficulty != "0")
                    {
                      alert("Bot sunk your ship!");
                    }
                    else
                    {
                      p2_sunk_ship = true;
                    }
                  }
                }
            }
          }

        }
    }
    else{
        alert("You shouldn't fire on your own map!");
    }
}
