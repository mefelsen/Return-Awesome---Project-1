/**
 * Class that contains one player's data.
 * @param {number} num - The number of ships being placed in the game.
 * @param {string} pName - the name of the player.
 * @param {string} isBot - is the player a bot or not. 0 = no bot, 1-3 are bot difficulty
 * @prop {Config} config - a {@link Config} object.
 * @prop {number} numships - the number of Ships in Admiral.
 * @prop {Grid} board - a Grid to store the Admiral's game map, with dimensions given in config.
 * @prop {Ship[]} fleet - an array of Ships, initialized empty.
 * @prop {number} afloat - the number of ships that are still afloat.
 * @prop {string} name - the player's name.
 * @prop {Array<Array<number>>} alreadyGuessed
 * @prop {string} botDifficulty - variable used that is initialized to isBot. Used after construction
 */
class Admiral {
  constructor(num, pName, isBot) {
    this.config = new Config();
    this.numShips = num;
    this.board = new Grid(this.config.BOARD_SIZE);
    this.fleet = [];
    this.afloat = num;
    this.name = pName;
    this.alreadyGuessed = new Array(8);
    this.botDifficulty = isBot;
    this.aIcoord=""
    this.guessmode=true
    this.guessedarr=[]

    for(let i = 0; i <= this.config.BOARD_SIZE; i++){//Make this configurable, should be variable "size" found in Config.js
        this.alreadyGuessed[i] = new Array(8);
        for(let j = 0; j <= this.config.BOARD_SIZE; j++){
            this.alreadyGuessed[i][j] = 0;
        }
    }
    for (let x = 1; x <= num; x++) {
      let newShip = new Ship(x); //creates ship size x
      this.fleet.push(newShip); //adds the new ship to fleet array
    }
  }
  savecoord(coord)
  {
    this.aIcoord=coord
  }


  /**
   * Get the number of ships.
   * @return {number} the number of ships that the Admiral has.
   */
  getNumShips() {
    return this.numShips;
  }

  /**
   * Get the game board.
   * @return {Grid} return the Grid object in Admiral.
   */
  getBoard() {
    return this.board;
  }

  /**
   * Get the Admiral's fleet.
   * @return {Ship[]} return the array of Ships in Admiral.
   */
  getFleet() {
    return this.fleet;
  }

  /**
   * Get the Admiral's name.
   * @return {string} return the player's name.
   */
  getName() {
    return this.name;
  }

  /**
   * Handles an attempted hit on the board and ship.  Calls updateCell on this Admiral's board, and calls hitShip if the hit attempt is successful.
   * @param {string} coord : the coordinate to check.
   * @param {string} tableID : the identifier of the table to update.
   * @return {boolean} hitBoard : true if a ship was hit, false if it was a miss.
   */
  updateHit(coord, tableID) {
    let hitBoard = this.board.updateCell(coord, tableID);
    if(hitBoard) {
      this.hitShip(coord);
    }
    return hitBoard;
  }

  /**
   * Increments the hit counter in the appropriate Ship, and the afloat property in this Admiral, if necessary.  Assumes that a successful hit has already been validated.
   * @pre A hit has already been validated.
   * @param {string} coord : The coordinate of the Ship being hit.
   */
  hitShip(coord) {
    let tempIndex = this.findShipByCoord(coord);
    this.fleet[tempIndex].incNumHits();
    if(this.fleet[tempIndex].status == false) {

      this.afloat--;
    }
  }

  /**
   * Generate coordinates that will be occupied by a ship with the given size, orientation, and starting coordinate, and assign those coordinates to the appropriate Ship and the board.
   * @param {string} startCoord - the upper leftmost coordinate of the ship.
   * @param {number} size - the size of the ship.
   * @param {boolean} orientation - the orientation of the ship, true for horizontal, false for vertical.
   * @param {string} tableID - the ID of the table in which the Ship will be placed.
   */
  assignCoords(startCoord, size, orientation, tableID) {
    let coordsArr = new Array(size);
    let coordsDone = false;
    // parse startCoord
    let row = Number(startCoord.substring(0,1));
    let col = Number(startCoord.substring(2));
    let tempStr = "";

    // vertical
    if(orientation == false) {
      let i = 0;
      let j = row;
      while((j <= row + Number(size) - 1) && (i < size))
      {
        coordsArr[i] = tempStr.concat(j, ':', col);
        i++;
        j++;
      }
      coordsDone = true;
    }
    // horizontal
    else if(orientation == true) {
      let k = 0;
      let l = col;
      while((l <= col + Number(size) - 1) && (k < size))
      {
        coordsArr[k] = tempStr.concat(row, ':', l);
        k++;
        l++;
      }
      coordsDone = true;
    }
    else {
      console.log("ERROR: assignCoords received invalid orientation\n");
    }

    if(coordsDone === true) {
      // find the ship
      let shipIndex = this.findShipBySize(size);
      // give coords to Ship
      this.fleet[shipIndex].setCoords(coordsArr);
      // give coords AND TABLEID to grid
      this.board.populateGrid(coordsArr, tableID);
    }
  }

  /**
   * Find the Ship of the given size.
   * @param {number} size : the size of the ship you're searching for.
   * @return {number} the index of the correct ship.
   */
  findShipBySize(size) {
    let shipIndex;
    for(let index = 0; index < this.numShips; index++)
    {
      if(this.fleet[index].getSize() == size)
      {
        shipIndex = index;
      }
    }
    return shipIndex;
  }

  /**
   * Find the Ship that occupies a given coordinate.
   * @param {string} coord : The coordinate to search for.
   * @return {number} The index of the Ship in the fleet that has the given coordinate.
   */
  findShipByCoord(coord) {
    let foundIndex = -1;
    for(let shipIndex = 0; shipIndex < this.numShips; shipIndex++)
    {
      for(let coordIndex = 0; coordIndex < this.fleet[shipIndex].getSize(); coordIndex++)
      {
        if(this.fleet[shipIndex].getCoords()[coordIndex] == coord) {
          foundIndex = shipIndex;
        }
      }
    }
    if(foundIndex < 0) {
      console.log("ERROR: findShipByCoord could not find that coord in this Admiral!");
    }
    else {
      return foundIndex;
    }
  }

  /**
   * Refreshes both game maps at the start of the game.
   */
  refreshOnStart(){
    this.board.refreshTable("ship1", true);
    this.board.refreshTable("fire1", false);
  }

  /**
   * Refreshes the firing map.
   */
  refreshFireOnly() {
    this.board.refreshTable("fire1", false);
  }

   /** This method is the same as updateHit(), but coordinates are chosen via the bot and not through the user
    * Handles an attempted hit on the board and ship.  Calls updateCell on this Admiral's board, and calls hitShip if the hit attempt is successful.
    * @param {string} AIcoord : the coordinate to check.
    * @param {string} tableID : the identifier of the table to update.
    * @return {boolean} hitBoard : true if a ship was hit, false if it was a miss.
    */
   AIupdateHit(tableID, isBot) {
     let coord = "";
     if(isBot == "1") {
       coord = this.easyAttack();
     }
     else if(isBot == "2") {
      coord = this.easyAttack();
     }
    else if(isBot == "3") {
      //Hard Attack Here
    }
     return coord;
   }

   /**
    * The AI's easy version of attacking. Randomly picks a coordinate
    * @prop {Array<Array<number>>} alreadyGuessed
    * @return {string} guess : the randomly choosen coordinate to be returned to AIupdateHit and passed to updateCell()
    */
   returnVal(){
    let coord;
   for(var i=1; i <9; i++)
   {
     for(var j=1; j <9; j++)
     {
       coord = i.toString(10)+":"+j.toString(10);
       if(this.board.arr[i-1][j-1] == this.board.conf.oceanTypes.SHIP)
       return coord;
     }
   }
 }
   easyAttack() {
     let i = Math.floor((Math.random() * 8)+1);
     let j = Math.floor((Math.random() * 8)+1);
     let samespot = true;

     if(this.alreadyGuessed[i][j] != 1) {
          this.alreadyGuessed[i][j] = 1;
       }
     else{
       while(samespot)
       {
         i  = Math.floor((Math.random() * 8)+1);
         j = Math.floor((Math.random() * 8)+1);
         if(this.alreadyGuessed[i][j] == 1)
         {
           samespot = true;
         }
         else {
           samespot = false;
           this.alreadyGuessed[i][j] = 1;
         }
       }
     }

     let guess = i.toString(10) + ":" + j.toString(10);
     return guess;
   }
}