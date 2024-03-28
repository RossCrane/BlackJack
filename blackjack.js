// Constants
const suits = ["Clubs", "Diamonds", "Hearts", "Spades"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

//Variables
let dealerSum = 0;
let dealerScore = 0;
let mySum = 0;
let dealerAceCount = 0;
let myAceCount = 0; 
let hidden;
let ddeck = [];
let canHit = true;

//Tooltips
$.fn.tooltip = function(){
    $(this).append('<span class=\"tooltip_text\"> </span>')
    $(this).hover(function() {
        $(this).children('.tooltip_text').css({"opacity":"1"});
        thisText = $(this).attr('title');
        $(this).removeAttr('title');
        $(this).children('.tooltip_text').text(thisText)
    }, function() {
        $(this).attr('title', thisText);
        $(this).children('.tooltip_text').text("");
        $(this).children('.tooltip_text').css({"opacity":"0"});
    })
}
$('.tooltip_hover').tooltip();

//Load when the page is loaded.
window.onload = function() {
    defineDeck();
    shuffleDeck();
    startGame();
/*     if (window.jQuery) {  
        // jQuery is loaded  
        alert("Yeah!");
    } else {
        // jQuery is not loaded
        alert("Doesn't Work");
    } */
}

//Function called when the New Game Button is pressed.
function newGame() {
    window.location.reload();
}

//Creates an array of all the possible cards in a standard deck besides the jokers.
function defineDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
          deck.push(value + "-" + suit);
        }
      }
/*     for (let i = 0; i < suits.length; i++) {
        for (let x = 0; x < values.length; x++) {
            deck.push(values[x] + "-" + suits[i]); 
        }
    } */
}

//Shuffles the deck at the start of a new game.
 function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let x = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[x];
        deck[x] = temp;
    }
} 

//Deals the dealer a hidden card and keeps dealing cards unless the sum is above 17.
//Deals two cards to the player to start.
function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    // console.log(hidden);
    // console.log(dealerSum);
    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }

    dealerScore = dealerSum - getValue(hidden);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        mySum += getValue(card);
        myAceCount += checkAce(card);
        document.getElementById("my-cards").append(cardImg);
    }

    //Allows the hit and stand button to be used and displays the current scores.
    $("#hit").on("click", hit);
    $("#stand").on("click", stand);
    $("#my-sum").text(reduceAce(mySum, myAceCount));
    $("#dealer-sum").text(reduceAce(dealerScore, dealerAceCount));
    //document.getElementById("hit").addEventListener("click", hit);
    //document.getElementById("stand").addEventListener("click", stand);
    //document.getElementById("my-sum").innerText = reduceAce(mySum, myAceCount);
    //document.getElementById("dealer-sum").innerText = reduceAce(dealerScore, dealerAceCount);

}

//Function for the hit button that can not be used if the sum is 21 or above.
function hit() {
    if (!canHit) {
        return;
    }
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    mySum += getValue(card);
    myAceCount += checkAce(card);
    document.getElementById("my-cards").append(cardImg);

    if (reduceAce(mySum, myAceCount) >= 21) { 
        canHit = false;
    }

    $("#my-sum").text(reduceAce(mySum, myAceCount));

}

//Concludes the game, shows the dealers score, sums up the total score and displays a message.
function stand() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    mySum = reduceAce(mySum, myAceCount);
    canHit = false;
    $("#hidden").attr("src", "./cards/" + hidden + ".png");

    let message = "";
    if (mySum > 21) {
        message = "Unfortunately, You Lost.";
    }
    else if (dealerSum > 21) {
        message = "Congratulations, You Won!";
    }
    else if (mySum == dealerSum) {
        message = "Tie!";
    }
    else if (mySum > dealerSum) {
        message = "Congratulations, You Won!";
    }
    else if (mySum < dealerSum) {
        message = "Unfortunately, You Lost.";
    }

    $("#dealer-sum").text(dealerSum);
    $("#my-sum").text(mySum);
    $("#results").text(message);
}


//Dealing the face cards.
function getValue(card) {
    let data = card.split("-"); 
    let value = data[0];

    //Face cards
    if (isNaN(value)) {
        return value === "A" ? 11 : 10;
      }
      return parseInt(value);
}

//Chack Ace
function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

//Handeling of the Ace.
function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}