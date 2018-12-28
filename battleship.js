var model = {
	boardSize: 7, // Num of blocks
	numShips: 3, // num of ships
	shipLength: 3, // total length of ships
	shipsSunk: 0,	// track ships sunk

	// create an array of objects where we place 3 ships in 3 locations and hits will be empty string initially

	ships: [
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] }
	],


	fire: function(guess){
		for (var i = 0; i < this.numShips; i++) { // loop through number of ships
			var ship = this.ships[i]; // get ships index
			var index = ship.locations.indexOf(guess); // get guess index in locations array
		

			// here's an improvement! Check to see if the ship
			// has already been hit, message the user, and return true.
			if (ship.hits[index] === "hit") { // if ship's hits index is hit
				view.displayMessage("Oops, you already hit that location!");
				return true;
			} else if (index >= 0) { 
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");

				if (this.isSunk(ship)) {
					view.displayMessage("You sank my battleship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed.");
		return false;
	},
	isSunk: function(ship){
		for(var i = 0; i < this.shipLength; i++){
			if(ship.hits[i] !== 'hit'){
				return false;
			}
		}
		return true;
	},

	generateShiplocations: function(){
		var locations;
		for(var i = 0; i < this.numShips; i++){ // find each ship we want to generate locations for
			do{
				locations = this.generateShip(); // generate a new set of locations
			}while(this.collision(locations)) ; //check to see if these locations overlap. if yes generate new ships
			this.ships[i].locations = locations; // once we have locations that work, we assign the locations to ships locations array
		
		}

	},

	generateShip: function(){
		var direction = Math.floor(Math.random() * 2);

		var row, col;

		if(direction === 1){	
			row = Math.floor(Math.random() * this.boardSize);
			
			col = Math.floor(Math.random() * this.boardSize - this.shipLength + 1);
			
		}else{
			
			row = Math.floor(Math.random() * this.boardSize - this.shipLength + 1);
			col = Math.floor(Math.random() * this.boardSize);

		}

		var newShipLocations = [];
		for(var i = 0; i < this.shipLength; i++){
			if(direction === 1){
				newShipLocations.push(row + '' + (col + i));

			}else{
				newShipLocations.push((row + i) + '' + col)
			}
		}
		return newShipLocations;
	},

	collision: function(locations){
		for(var i = 0; i < this.numShips; i++){
			var ship = model.ships[i];
			for(var j = 0; j < locations.length; j++){// check to see if the new ship's location array are in exisiting ships location
				if(ship.locations.indexOf(locations[j]) >= 0){ // to check if te location already exists, if yes return true
					return true;
				}
			}
		}
		return false;
	}

};	
	
function parseGuess(guess){
	var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

	if(guess === null || guess.length !== 2){
		alert('Oops, please enter a letter and number on the board');
	}else{
		firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);

		if(isNaN(row) || isNaN(column)){
			alert("Oops, that isn't on the board");
		}else if(row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize){
			alert("Oops, that's off the board");
		}else{
			return row + column;
		}
	}
	return null;
} 
var view = {
	displayMessage: function(msg){
		var messageArea = document.getElementById('messageArea');
		messageArea.innerHTML = msg;
	},
	displayHit: function(location){
		var cell = document.getElementById(location);
		cell.setAttribute('class', 'hit');


	}, 
	displayMiss: function(location){
		var cell = document.getElementById(location);
		cell.setAttribute('class', 'miss');

	}
}

var controller = {
	guessess: 0, 
	processGuess: function(guess){
		var location = parseGuess(guess);
		if(location){
			this.guessess++;
			var hit = model.fire(location);
			if(hit && model.shipsSunk === model.numShips){
				view.displayMessage('you sank all my battleships in ' + this.guessess + " guessess");
			}
		}
	}
}



function handleKeyPress(e){
	var fireButton = document.getElementById('fireButton');
	if(e.keyCode === 13){
		fireButton.click();
		return false;
	}
}

function handleFireButton(){
	var guessInput = document.getElementById('guessInput');
	var guess = guessInput.value;
	controller.processGuess(guess);
	guessInput.value = "";
}
window.onload = init;
function init(){
	var fireButton = document.getElementById('fireButton');
	fireButton.onclick = handleFireButton;
	var guessInput = document.getElementById('guessInput');
	guessInput.onkeypress = handleKeyPress;

	model.generateShiplocations();

}









