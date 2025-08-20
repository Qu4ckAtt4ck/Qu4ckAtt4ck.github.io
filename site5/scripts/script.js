$(document).ready(function () {
  var cash = 1000;
  var bank = 0;
  var wager = 0;

  var deck, playerHand, dealerHand;
  var gameInProgress = false;

  function createDeck() {
    var suits = ['♠', '♥', '♦', '♣'];
    var values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    var d = [];
    for (var s = 0; s < suits.length; s++) {
      for (var v = 0; v < values.length; v++) {
        d.push({ suit: suits[s], value: values[v] });
      }
    }
    return d;
  }

  function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  function cardValue(card) {
    if (card.value === 'A') return 11;
    if (['K', 'Q', 'J'].indexOf(card.value) !== -1) return 10;
    return parseInt(card.value);
  }

  function handValue(hand) {
    var sum = 0;
    var aces = 0;
    for (var i = 0; i < hand.length; i++) {
      sum += cardValue(hand[i]);
      if (hand[i].value === 'A') aces++;
    }
    while (sum > 21 && aces > 0) {
      sum -= 10;
      aces--;
    }
    return sum;
  }

  function displayHand(container, hand, hideFirstCard) {
    container.empty();
    for (var i = 0; i < hand.length; i++) {
      var cardDiv = $('<div class="card"></div>');
      if (i === 0 && hideFirstCard) {
        cardDiv.text('🂠');
      } else {
        cardDiv.text(hand[i].value + hand[i].suit);
      }
      container.append(cardDiv);
    }
  }

  function updateCashBank() {
    $('#cash span').text(cash);
    $('#bank span').text(bank);
  }

  function showAlert(message) {
    var alertBox = $('#alert');
    alertBox.find('span').text(message);
    alertBox.removeClass('hide');
    setTimeout(() => alertBox.addClass('hide'), 3000);
  }

  $('#deal').click(function () {
    wager = parseInt($('#wager').val());
    if (isNaN(wager) || wager <= 0) {
      showAlert('Please enter a valid wager.');
      return;
    }
    if (wager > cash) {
      showAlert('You do not have enough cash.');
      return;
    }

    cash -= wager;
    updateCashBank();

    deck = createDeck();
    shuffle(deck);

    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];

    displayHand($('#phand'), playerHand, false);
    displayHand($('#dhand'), dealerHand, true);

    $('#deal').attr('disabled', true);
    $('#hit, #stand').attr('disabled', false);
    $('#double, #split, #insurance').attr('disabled', true);
    $('#wager').attr('disabled', true);

    gameInProgress = true;

    if (handValue(playerHand) === 21) {
      stand();
    }
  });

  $('#hit').click(function () {
    if (!gameInProgress) return;
    playerHand.push(deck.pop());
    displayHand($('#phand'), playerHand, false);

    var val = handValue(playerHand);
    if (val > 21) {
      showAlert('Bust! You lose.');
      endRound(false);
    }
  });

  $('#stand').click(function () {
    if (!gameInProgress) return;
    stand();
  });

  function stand() {
    displayHand($('#dhand'), dealerHand, false);

    while (handValue(dealerHand) < 17) {
      dealerHand.push(deck.pop());
      displayHand($('#dhand'), dealerHand, false);
    }

    var playerVal = handValue(playerHand);
    var dealerVal = handValue(dealerHand);

    if (dealerVal > 21 || playerVal > dealerVal) {
      showAlert('You win!');
      bank += wager * 2;
    } else if (playerVal < dealerVal) {
      showAlert('You lose.');
    } else {
      showAlert('Push. Your wager is returned.');
      bank += wager;
    }
    endRound(true);
  }

  function endRound(wasStand) {
    gameInProgress = false;
    updateCashBank();

    $('#deal').attr('disabled', false);
    $('#hit, #stand, #double, #split, #insurance').attr('disabled', true);
    $('#wager').attr('disabled', false);

    if (cash <= 0) {
      $('#myModal').modal('show');
    }
  }

  $('#cancel').click(function (e) {
    e.preventDefault();
    $('#myModal').modal('hide');
  });

  $('#newGame').click(function (e) {
    e.preventDefault();
    cash = 1000;
    bank = 0;
    updateCashBank();
    $('#myModal').modal('hide');
  });

  updateCashBank();
});
