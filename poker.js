function number_to_english(number){
    var _list = ['zero', 'ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'j', 'q', 'k'];
    return _list[number]
}

function number_to_emoji(number){
    var _list = ['zero', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    return _list[number]
}

function number_to_value(number){
    var _list = [0, [1, 11], [2], [3], [4], [5], [6], [7], [8], [9], [10], [10], [10], [10]]
    return _list[number];
}

function arraysEqual(a, b) {

    if (a === b) 
        return true;
    if (a == null || b == null) 
        return false;
    if (a.length !== b.length) 
        return false;
  
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) 
            return false;
    }
    return true;
  }

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

class Poker {
    constructor(suit, number, isCovered) {
        // card number
        this.suit = suit;
        this.number = number;

        // card image
        this.coverimg = 'cover.jpg';
        this.img = number_to_english(number) + ' of ' + suit + '.jpg';

        // card display status
        this.isCovered = isCovered;

        // card value
        this.valueList = number_to_value(number);

    }

    get score(){
        if(!this.isCovered)
            return this.valueList;
        else
            return [0];
    }

    get emoji(){
        if(this.suit == "spade"){
            return '♠️' + number_to_emoji(this.number);
        }
        else if(this.suit == "heart"){
            return '<span class="red">♥' + number_to_emoji(this.number) + '</span>';
        }
        else if(this.suit == 'diamond'){
            return '<span class="red">&#9830;' + number_to_emoji(this.number) + '</span>';
        }
        else{
            return '♣️' + number_to_emoji(this.number);
        }
        
    }

    get actualScore(){
        return this.valueList;
    }

    get img_source(){
        if(this.isCovered)
            return '<div><img class="poker animate" src="./cards/' + this.coverimg + '"></div>';
        else
            return '<div><img class="poker animate" src="./cards/' + this.img + '"></div>';
        
    };

    get img_source_no_animate(){
        if(this.isCovered)
            return '<div><img class="poker" src="./cards/' + this.coverimg + '"></div>';
        else
            return '<div><img class="poker" src="./cards/' + this.img + '"></div>';
        
    };

    set isCover(cover) {
        this.isCovered = cover;

    };
}



class Player {
    constructor(id, name,chips = Infinity) {

        // identifier
        this.id = id;
        this.name = name;

        // card list
        this.cardList = [];
        this.splitList = [];

        // chips
        this.chips = chips;
        this.coins = 0;

        // element
        this.element = new Element('#' + id);
        this.element_temp = new Element('#temp');
        this.scoreElement = new Element('#'+id+'-score');
        this.scoreTEMPElement = new Element('#temp-score');

        this.scoreTEMPElement.visible = 'hidden';
        this.element_temp.visible = 'hidden';
        this.scoreElement.visible = 'hidden';
        this.element.visible = 'hidden';

    }

    get coin(){
        return this.coins;
    }

    set coin(value){
        this.coins += value;
    }

    set doubleCoin(value){
        this.coins *= value;
    }

    set reset_coin(value = 0){
        this.coins = value;
    }

    get chip(){
        return this.chips;
    }

    set chip(value){
        this.chips = this.chips + value;
    }

    get canSplit(){
        return this.cardList.length == 2 && arraysEqual(this.cardList[0].valueList, this.cardList[1].valueList);
    }

    get splitCard(){
        this.element_temp.visible = 'visible';
        this.scoreTEMPElement.visible = 'visible';
        this.appendSplitCard = this.cardList.shift();
        var _txt = this.splitList[0].img_source_no_animate.replace('class="poker"', 'class="poker '+this.id+'"');
        this.element.HTML = this.element.HTML.replace(_txt, "");
        return this.cardList[0].number;
    }

    unCoverCard(){
        var _txt = this.cardList[1].img_source_no_animate.replace('class="poker"', 'class="poker ' + this.id + '"');
        this.cardList[1].isCover = false;
        this.element.HTML = this.element.HTML.replace(_txt, this.cardList[1].img_source_no_animate.replace('class="poker"', 'class="poker ' + this.id + '"'));
    }

    set appendCard(poker){

        this.element.visible = 'visible';
        this.scoreElement.visible = 'visible';

        this.cardList.push(poker);
        var _txt = poker.img_source.replace('class="poker animate"', 'class="poker animate ' + this.id + '"');
        this.element.appendHTML = _txt;

        setTimeout(function(){
            var _element = new Element('.animate');
            if(_element.element.length != 0)
                _element.element.classList.remove('animate');
        },250);
        
    }

    set appendSplitCard(poker){

        this.splitList.push(poker);
        this.element_temp.appendHTML = poker.img_source.replace('class="poker animate"', 'class="poker animate temp"');

        setTimeout(function(){
            var _element = new Element('.animate');
            _element.element.classList.remove('animate');
        },600);
        
    }

    reset(){
        this.cardList = [];
        this.splitList = [];
        this.element.HTML = "";
        this.element_temp.HTML = "";
        this.element.visible = 'hidden';
        this.element_temp.visible = 'hidden';
        this.scoreElement.visible = 'hidden';
        this.scoreTEMPElement.visible = 'hidden';
    }

    set score(value){
        this.scoreElement.HTML = '點數 <span>'+ value+'</span>';
    }

    set tempScore(value){
        this.scoreTEMPElement.HTML = '點數 <span>'+ value+'</span>';
    }
}


class tableTooler{

    constructor(){
        this.counter = 0;
        this.element = new Element('.table-area');
        this.field = new Element('.table-field');
    }

    clearEvent(){
        this.field.HTML = "";
    }

    eventOccur(player, description){
        this.field.appendHTML = '<tr><td>'+ player.name +'</td><td>' + description + '</td></tr>';
        this.element.element.scrollTop = this.element.element.scrollHeight
    }
}



