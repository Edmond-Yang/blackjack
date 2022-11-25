function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }


class System {
    constructor() {

        // pokers
        this.pokers = [];
        this.poker = true;

        // mode
        this.cheat = false;
        this.split = 0;
        this.split_vs = 1;

        // table tool
        this.tool = new tableTooler();

        // player
        this.dealer = new Player('dealer', '莊家');
        this.player = new Player('player', '玩家', 1000);

        // button
        this.start_btn = new Element('#start-btn');

        this.run_check_btn = new Element('#check');
        this.run_cheat_btn = new Element('#cheat');

        this.game_hit_btn = new Element('#hit');
        this.game_stand_btn = new Element('#stand');
        this.game_split_btn = new Element('#split');
        this.game_double_btn = new Element('#double');
        this.game_surrender_btn = new Element('#surrender');
        
        this.end_again_btn = new Element('#again');
        this.end_next_btn = new Element('#next');

        // widget
        this.start_div = new Element('#start');
        
        this.run_div = new Element('#run');
        this.run_chips_p = new Element('#chips');
        this.run_danger_p = new Element('#danger');
        this.run_coins_form = new Element('#coins');

        this.game_div = new Element("#game");
        this.game_warning_p = new Element("#warning");

        this.end_div = new Element('#end');
        this.end_result_p = new Element('#end-result');
        this.end_detail_p = new Element('#end-detail');

        

        // Listener
        this.start_btn.addListener('click', function(evt){ 
            var [system] = evt.currentTarget.myParam;
            system.tool.eventOccur(system.player, '進入遊戲');
            system.run();
         });
        this.start_btn.addListenerParameter([this]);


        this.run_check_btn.addListener('click', function(evt){
            var [system] = evt.currentTarget.myParam;
            var value = new Element('#coin').value;

            system.cheat = false;

            if(value.length == 0){
                system.run_danger_p.visible = 'visible';
                system.run_danger_p.HTML = '輸入錯誤';
                return;
            }

            value = parseInt(value);

            if( isNaN(value) ){
                system.run_danger_p.visible = 'visible';
                system.run_danger_p.HTML = '輸入錯誤';
                return;
            }
            if(value <= 0){
                system.run_danger_p.visible = 'visible';
                system.run_danger_p.HTML = '請下注正確';
                return;
            }
            if(value > system.player.chip){
                system.run_danger_p.visible = 'visible';
                system.run_danger_p.HTML = '輸入超過自身籌碼';
                return;
            }
            
            system.player.coin = value;
            system.tool.eventOccur(system.player, '下注金額: ' + value);
            system.game();

        });
        this.run_check_btn.addListenerParameter([this]);

        this.run_cheat_btn.addListener('click',function(evt){
            var [system] = evt.currentTarget.myParam;
            var value = new Element('#coin').value;

            system.cheat = true;

            if(value.length == 0){
                system.run_danger_p.visible = 'visible';
                system.run_danger_p.HTML = '輸入錯誤';
                return;
            }

            value = parseInt(value);

            if( isNaN(value) ){
                system.run_danger_p.visible = 'visible';
                system.run_danger_p.HTML = '輸入錯誤';
                return;
            }
            if(value <= 0){
                system.run_danger_p.visible = 'visible';
                system.run_danger_p.HTML = '請下注正確';
                return;
            }
            if(value > system.player.chip){
                system.run_danger_p.visible = 'visible';
                system.run_danger_p.HTML = '輸入超過自身籌碼';
                return;
            }

            system.player.coin = value;
            system.tool.eventOccur(system.player, '下注金額: ' + value);
            system.tool.eventOccur(system.player, '進入作弊模式');
            system.pokers = [];
            system.poker = true;
            system.game();

        });
        this.run_cheat_btn.addListenerParameter([this]);


        this.game_hit_btn.addListener('click', function(evt){
            var [system] = evt.currentTarget.myParam;
            system.draw([system.player, false]);
            system.player.score = system.calculate_score(system.player);
            system.game_surrender_btn.disabled = true;
            system.game_double_btn.disabled = true;
            system.game_split_btn.disabled = true;

            if(system.split == 2){
                var _score = system.calculate_score(system.player, false, true);
            }
            else{
                var _score = system.calculate_score(system.player, false)
            }

            if(_score >= 21){

                system.game_warning_p.visible = 'visible';

                if(_score > 21)
                    system.game_warning_p.HTML = '點數已超過21點，自動停牌';
                else
                    system.game_warning_p.HTML = '點數已達21點，自動停牌';

                setTimeout(function(system){
                    system.game_warning_p.visible = 'hidden';
                }, 1000,system);
                
                if(system.split == 1){
                    system.split += 1;
                }
                else{
                    system.game_hit_btn.disabled = true;
                    system.game_stand_btn.disabled = true;
                    system.result();
                }
                
            }
        });
        this.game_hit_btn.addListenerParameter([this]);

        this.game_stand_btn.addListener('click', function(evt){
            var [system] = evt.currentTarget.myParam;

            system.tool.eventOccur(system.player, '完成抽牌');
            
            system.game_double_btn.disabled = true;
            system.game_split_btn.disabled = true;
            system.game_surrender_btn.disabled = true;

            if(system.split === 1){
                system.split += 1;
            }
            else{
                system.game_stand_btn.disabled = true;
                system.game_hit_btn.disabled = true;
                system.result();
            }
            
        });
        this.game_stand_btn.addListenerParameter([this]);

        this.game_double_btn.addListener('click', function(evt){
            var [system] = evt.currentTarget.myParam;
            system.tool.eventOccur(system.player, '雙倍下注');
            this.disabled = true;
            system.game_hit_btn.disabled = true;
            system.game_stand_btn.disabled = true;
            system.game_surrender_btn.disabled = true;
            system.game_split_btn.disabled = true;
            system.draw([system.player, false]);
            system.player.score = system.calculate_score(system.player);
            system.player.doubleCoin = 2;
            system.result();
        });
        this.game_double_btn.addListenerParameter([this]);

        this.game_surrender_btn.addListener('click', function(evt){
            var [system] = evt.currentTarget.myParam;
            system.tool.eventOccur(system.player, '投降');
            system.player.coin = -1 * Math.floor(system.player.coin*0.5);
            system.game_stand_btn.disabled = true;
            system.game_hit_btn.disabled = true;
            system.game_double_btn.disabled = true;
            system.game_surrender_btn.disabled = true;
            system.game_split_btn.disabled = true;
            system.result(true);
        })
        this.game_surrender_btn.addListenerParameter([this]);

        this.game_split_btn.addListener('click', function(evt){
            var [system] = evt.currentTarget.myParam;
            system.tool.eventOccur(system.player, '分牌加注');
            system.split = 1;
            system.split_vs = 1;

            system.game_split_btn.disabled = true;
            system.game_double_btn.disabled = true;
            system.game_surrender_btn.disabled = true;

            if(system.player.splitCard == 1){
                system.tool.eventOccur(system.player, '分牌的牌: ' + system.player.splitList[0].emoji + ', 只能抽一張');
                system.game_hit_btn.disabled = true;
                system.game_stand_btn.disabled = true;
                system.draw([system.player, false]);
                system.player.score = system.calculate_score(system.player, false);
                system.split = 2;
                system.draw([system.player, false]);
                system.player.tempScore = system.calculate_score(system.player, false, true);
                system.result();
                return;
            }

            system.tool.eventOccur(system.player, '分牌的牌: ' + system.player.splitList[0].emoji);
            system.player.score = system.calculate_score(system.player, false);
            system.player.tempScore = system.calculate_score(system.player, false, true);

            
        });
        this.game_split_btn.addListenerParameter([this]);


        this.end_again_btn.addListener('click',function(evt){
            var [system] = evt.currentTarget.myParam;
            system.initial();
            system.start();
        });
        this.end_again_btn.addListenerParameter([this]);

        this.end_next_btn.addListener('click',function(evt){
            var [system] = evt.currentTarget.myParam;
            system.reset();
            system.run();
        });
        this.end_next_btn.addListenerParameter([this]);

    }

    getPoker(num){

        var temp = [];
        var find = false
        var pokerFind = undefined;

        for(var poker of this.pokers){
            if(poker.valueList[0] === num && !find){
                pokerFind = poker;
                find = true;
                continue;
            }
            else if(poker.valueList.length == 2 && poker.valueList[1] === num && !find){
                pokerFind = poker;
                find = true;
                continue;
            }
            else{
                temp.push(poker);
            }

        }

        this.pokers = temp;
        return pokerFind;

    }

    cheatPop(player){

        if(this.split == 2 && player === this.player){
            var _score = this.calculate_score(player, false, true);
        }
        else{
            var _score = this.calculate_score(player, false);
        }
        
        

        if(player === this.dealer){

            if(_score <= 10){
                return this.getPoker(getRandomInt(10) + 1);
            }
            else{
                return this.getPoker(21 - this.calculate_score(player, false));
            }
        }
        else{

            if(_score <= 8){
                return this.getPoker(getRandomInt(7) + 2);
            }
            if(_score <= 14){
                return this.getPoker(getRandomInt(5) + 2);
            }
            else{
                return this.getPoker(getRandomInt(4) + 7);
            }
        }


    }

    get pop(){
        return this.pokers.pop();
    }

    set poker(needShuffle){
        for (var i = 0; i < 4; i++)
            for (var j of ['spade', 'heart', 'diamond', 'club'])
                for (var k = 1; k < 14; k++)
                    this.pokers.push(new Poker(j, k, true));

        if(needShuffle)
            this.pokers = shuffle(this.pokers);
    }

    calculate_score(person, bool = true, isSplit = false){

        if(isSplit){
            var _list = person.splitList;
        }
        else{
            var _list = person.cardList;
        }

        if(bool){
            
            var _array = this.calculate(_list, 0, 0, []).sort(
                function(a, b){
                    if(a>b) return -1;
                    if(a<b) return 1;
                    return 0;
            });
           
        }
        else{
            var _array = this.actualCalculate(_list, 0, 0, []).sort(
                function(a, b){
                    if(a>b) return -1;
                    if(a<b) return 1;
                    return 0;
            });
        }
        

        for(var x of _array)
            if(x <= 21)
                return x;

        return _array[_array.length-1];
    }

    calculate(cardList, index, score, tempList){

        if(index >= cardList.length){
            tempList.push(score);
            return tempList;
        }


        for(var value of cardList[index].score)
                tempList = this.calculate(cardList, index+1, score + value, tempList);
        
        return tempList;

    }

    actualCalculate(cardList, index, score, tempList){

        if(index >= cardList.length){
            tempList.push(score);
            return tempList;
        }

        for(var value of cardList[index].actualScore)
                tempList = this.actualCalculate(cardList, index+1, score + value, tempList);
        
        return tempList;

    }

    draw([player, isCover]){

        if(this.cheat){
            var poker = this.cheatPop(player);
        }
        else{
            var poker = this.pop;
        }

        this.tool.eventOccur(player, '抽到' + poker.emoji);

        if(player === this.dealer){
            poker.isCover = isCover;
            player.appendCard = poker;
            player.score = this.calculate_score(player);
        }
        else{

            poker.isCover = isCover;

            if(this.split == 2){
                player.appendSplitCard = poker;
                player.tempScore = this.calculate_score(player, false, true);
            }
            else{
                player.appendCard = poker;
                player.score = this.calculate_score(player, false);
            }

        }

    }

    timeDraw(bool){
        this.draw([this.dealer, bool]);
        this.dealer.score = this.calculate_score(this.dealer, false);
        this.dealer_draw(bool);
    }



    async dealer_draw(bool = false){

        if(this.cheat){
            if(this.calculate_score(this.dealer, false) != 21){
                setTimeout(function(system, bool){
                    system.timeDraw(bool);
                }, 200, this, bool);
            } 
        }
        else{
            if(this.calculate_score(this.dealer, false) < 17)
                setTimeout(function(system, bool){
                    system.timeDraw(bool);
                }, 200, this, bool);
        }

        this.dealer.score = this.calculate_score(this.dealer, false);
        
    }

    visible(value){

        if(value == 0)
            var _array = ['visible', 'hidden', 'hidden', 'hidden'];
        else if(value == 1)
            var _array = [ 'hidden', 'visible', 'hidden', 'hidden'];
        else if(value == 2)
            var _array = [ 'hidden', 'hidden', 'visible', 'hidden'];
        else   
            var _array = ['hidden', 'hidden', 'visible' , 'visible'];

        this.start_div.visible = _array[0];
        this.run_danger_p.visible = 'hidden';
        this.run_div.visible = _array[1];
        this.game_div.visible = _array[2];
        this.end_div.visible = _array[3];

        this.start_btn.disabled = value !== 0;

        this.run_check_btn.disabled = value !== 1;
        this.run_cheat_btn.disabled = value !== 1;

        this.game_hit_btn.disabled = value !== 2;
        this.game_stand_btn.disabled = value !== 2;
        this.game_split_btn.disabled = value !== 2;
        this.game_double_btn.disabled = value !== 2;
        this.game_surrender_btn.disabled = value !== 2;
        
        this.end_again_btn.disabled = value !== 3;
        this.end_next_btn.disabled = value !== 3;

    }

    initial(){

        // pokers
        this.pokers = [];
        this.poker = true;

        // mode
        this.cheat = false;
        this.split = 0;
        this.split_vs = 1;

        // table
        this.tool.clearEvent();

        // player
        this.player.reset();
        this.dealer.reset();

        this.dealer = new Player('dealer', '莊家');
        this.player = new Player('player', '玩家', 1000);

        this.end_again_btn.visible = 'hidden';
        this.end_next_btn.visible = 'hidden';
        this.end_next_btn.disabled = false;

    }

    reset(){

        if(this.pokers.length < 2*52){
            console.log(true);
            this.pokers = [];
            this.poker = true;
        }
            

        // mode
        this.split = 0;
        this.split_vs = 1;
        
        this.player.reset();
        this.dealer.reset();

        this.end_again_btn.visible = 'hidden';
        this.end_next_btn.visible = 'hidden';

    }

    end(bool){

        // compare win or lose
        this.visible(3);

        this.game_div.addClass='blur';
        this.run_danger_p.visible = 'hidden';

        if(this.split == 0){
            this.end_next_btn.visible = 'visible';
            this.end_again_btn.visible = 'visible';
            var score_player = this.calculate_score(this.player, false);
            var score_dealer = this.calculate_score(this.dealer, false);
        }
        else if(this.split == 2 && this.split_vs == 2){
            this.end_next_btn.visible = 'visible';
            this.end_again_btn.visible = 'visible';
            var score_player = this.calculate_score(this.player, false, true);
            var score_dealer = this.calculate_score(this.dealer, false);
        }
        else {
            this.end_next_btn.visible = 'hidden';
            this.end_again_btn.visible = 'hidden';
            var score_player = this.calculate_score(this.player, false);
            var score_dealer = this.calculate_score(this.dealer, false);
            
        }

        // 1 condition: tie

        if(bool){
            this.player.chip = -1 * this.player.coin;
            if(this.split == 2 && this.split_vs == 1){
                this.end_result_p.HTML = "1️⃣ 莊家勝利";
                this.tool.eventOccur(this.player, "第一副手牌輸了");
                this.tool.eventOccur(this.dealer, "贏了");
            }
            else if(this.split == 2 && this.split_vs == 2){
                this.end_result_p.HTML = "2️⃣ 莊家勝利";
                this.player.reset_coin = 0;
                this.tool.eventOccur(this.player, "第二副手牌輸了");
                this.tool.eventOccur(this.dealer, "贏了");
            }
            else{
                this.end_result_p.HTML = "莊家勝利";
                this.tool.eventOccur(this.player, "輸了");
                this.tool.eventOccur(this.dealer, "贏了");
                this.player.reset_coin = 0;
            }
                
        }

        else if(score_player > 21 && score_dealer > 21 || score_player === score_dealer){
            if(this.split == 2 && this.split_vs == 1){
                this.end_result_p.HTML = "1️⃣ 平手";
                this.tool.eventOccur(this.player, "第一副手牌平手");
                this.tool.eventOccur(this.dealer, "平手");
            }
            else if(this.split == 2 && this.split_vs == 2){
                this.end_result_p.HTML = "2️⃣ 平手";
                this.tool.eventOccur(this.player, "第二副手牌平手");
                this.tool.eventOccur(this.dealer, "平手");
                this.player.reset_coin = 0;
            }
            else{
                this.end_result_p.HTML = "平手";
                this.tool.eventOccur(this.player, "平手");
                this.tool.eventOccur(this.dealer, "平手");
                this.player.reset_coin = 0;
            }
                
        }

        // 2 condition: win
        else if((score_player > score_dealer && score_player <= 21 || score_dealer > 21) && !bool){
            this.player.chip = this.player.coin;
            if(this.split == 2 && this.split_vs == 1){
                this.end_result_p.HTML = "1️⃣ 玩家勝利";
                this.tool.eventOccur(this.player, "第一副手牌贏了");
                this.tool.eventOccur(this.dealer, "輸了");
            }
            else if(this.split == 2 && this.split_vs == 2){
                this.end_result_p.HTML = "2️⃣ 玩家勝利";
                this.tool.eventOccur(this.player, "第二副手牌贏了");
                this.tool.eventOccur(this.dealer, "輸了");
                this.player.reset_coin = 0;
            }
            else{
                this.end_result_p.HTML = "玩家勝利";
                this.tool.eventOccur(this.player, "贏了");
                this.tool.eventOccur(this.dealer, "輸了");
                this.player.reset_coin = 0;
            }
        }

        // 3 condition: lose
        else{
            this.player.chip = -1 * this.player.coin;
            if(this.split == 2 && this.split_vs == 1){
                this.end_result_p.HTML = "1️⃣ 莊家勝利";
                this.tool.eventOccur(this.player, "第一副手牌輸了");
                this.tool.eventOccur(this.dealer, "贏了");
            }
            else if(this.split == 2 && this.split_vs == 2){
                this.end_result_p.HTML = "2️⃣ 莊家勝利";
                this.tool.eventOccur(this.player, "第二副手牌輸了");
                this.tool.eventOccur(this.dealer, "贏了");
                this.player.reset_coin = 0;
            }
            else{
                this.end_result_p.HTML = "莊家勝利";
                this.tool.eventOccur(this.player, "輸了");
                this.tool.eventOccur(this.dealer, "贏了");
                this.player.reset_coin = 0;
            }
        }

        this.end_detail_p.HTML = this.player.chip;

        if(this.player.chip <= 0){
            this.end_next_btn.disabled = true;
        }

        if(this.split_vs == 1 && this.split == 2){
            this.split_vs ++;
            setTimeout(function(system, isSurrender){
                system.end(isSurrender);
            }, 2000, this, bool);
        }

        

    }

    async result(isSurrender = false){

        var _score = this.calculate_score(this.player, false, false);
        
        // dealer draw
        if(!isSurrender && _score <= 21 ){
                await this.dealer_draw(false);
        }
        else{
            if(this.split == 2){
                if(this.calculate_score(this.player, false, true) <= 21)
                    await this.dealer_draw(false);
            }
        }

        setTimeout(function(system){
            system.dealer.unCoverCard();
            system.dealer.score = system.calculate_score(system.dealer, false);
        }, 100, this);

        setTimeout(function(system, bool){
            system.end(bool);
        },2500, this, isSurrender);
            

    }

    game(){

        if(this.cheat){
            this.pokers = [];
            this.poker = true;
        }

        // initial
        this.visible(2);
        this.game_stand_btn.disabled = false;
        this.game_hit_btn.disabled = false;
        this.game_double_btn.disabled = true;
        this.game_surrender_btn.disabled = false;
        this.game_split_btn.disabled = true;

        this.game_stand_btn.visible = 'hidden';
        this.game_hit_btn.visible = 'hidden';
        this.game_double_btn.visible = 'hidden';
        this.game_surrender_btn.visible = 'hidden';
        this.game_split_btn.visible = 'hidden';
        this.game_warning_p.visible = 'hidden';

        
        setTimeout(function(system){
            system.draw([system.player, false]);
        }, 250, this);

        setTimeout(function(system){
            system.draw([system.dealer, false]);
        }, 500, this);

        setTimeout(function(system){
            system.draw([system.player, false]);
        }, 750, this);

        setTimeout(function(system){
            system.draw([system.dealer, true]);
        }, 1000, this);
        
        setTimeout(function(system){

            system.game_stand_btn.visible = 'visible';
            system.game_hit_btn.visible = 'visible';
            system.game_double_btn.visible = 'visible';
            system.game_surrender_btn.visible = 'visible';
            system.game_split_btn.visible = 'visible';

            if(system.player.canSplit){
                system.game_split_btn.disabled = false;
            }
    
            if(system.calculate_score(system.player) == 11){
                system.game_double_btn.disabled = false;
            }
    
            if(system.calculate_score(system.player) == 21){

                system.game_warning_p.visible = 'visible';
                system.game_warning_p.HTML = '點數已達21點，自動停牌';

                setTimeout(function(system){
                    system.game_warning_p.visible = 'hidden';
                }, 1000,system);
                
                system.game_hit_btn.disabled = true;
                system.game_stand_btn.disabled = true;
                system.game_surrender_btn.disabled = true;
                system.result();
            }

            if(system.calculate_score(system.player) > 21){

                system.game_warning_p.visible = 'visible';
                system.game_warning_p.HTML = '點數已超過21點，自動停牌';

                setTimeout(function(system){
                    system.game_warning_p.visible = 'hidden';
                }, 1000,system);

                system.game_hit_btn.disabled = true;
                system.game_stand_btn.disabled = true;
                system.game_surrender_btn.disabled = true;
                system.result();
            }

        }, 1500, this)

        

    }

    run(){
        // initial
        this.visible(1);
        this.game_div.removeClass = 'blur';

        this.game_stand_btn.visible = 'hidden';
        this.game_hit_btn.visible = 'hidden';
        this.game_double_btn.visible = 'hidden';
        this.game_surrender_btn.visible = 'hidden';
        this.game_split_btn.visible = 'hidden';

        // step 0: assign the chips
        this.run_chips_p.HTML = this.player.chip;

        var _num = 10;
        if(this.player.chip < _num)
            _num = this.player.chip;
        this.run_coins_form.HTML = '<input type="number" name="coins" id="coin" value="'+ _num +'" min="1" max="' + this.player.chip + '">';

    }

    start(){
        this.visible(0);
        this.game_stand_btn.visible = 'hidden';
        this.game_hit_btn.visible = 'hidden';
        this.game_double_btn.visible = 'hidden';
        this.game_surrender_btn.visible = 'hidden';
        this.game_split_btn.visible = 'hidden';
    }


}

window.onload = function(){
    var _system = new System();
    _system.start();
}
