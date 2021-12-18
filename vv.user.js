// ==UserScript==
// @name         vakantieveilingen buy
// @namespace    http://vakantieveilingen.nl/
// @version      1.4.0
// @updateURL    https://github.com/kemalizing/tamper-scripts/raw/master/vv.user.js
// @description  try to take over the world!
// @author       You
// @include      *vakantieveilingen.nl*
// @grant       GM.setValue
// @grant       GM.getValue
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==

var bidName = null;

var maxBid = 0;
var winners = ""
var winnersKey, maxBidKey, minWinnerKey;


var avgWinner = null;
var minWinner = null;

var vv_maxBid;
var tid;

function mycode() {

    var bid = document.getElementById('jsActiveBidInput');
    var button = document.getElementById('jsActiveBidButton');
    var minBid = document.getElementById('jsMainLotCurrentBid');
    var timer = document.getElementsByClassName('timer-countdown-label')[0];

    if(button){
        $("#vv_note").show();
    } else {
        $("#vv_note").hide();
    }


    if(bid && timer){
        var minBidInt = parseInt(minBid.textContent);
        bid.value = minBidInt+1;
        console.log("maxBid:"+maxBid+" minBid:"+minBid.textContent+" timer:"+timer.textContent+" button:"+button.innerText);
        //setCookie(location, minBid, 1);

        if(timer.textContent == "01" ){
            console.log("1 sec left");
            minBidInt = parseInt(minBid.textContent);
            if(maxBid>0 && minBidInt<maxBid){
                console.log("buying");
                bid.value = minBidInt+1;;
                button.click();
                abortTimer();
                console.log("bought!");
            } else {
                console.log("no bid. maxBid:"+maxBid+" minBid:"+minBidInt);
            }
        }
    }

    var refreshLinks = $("a[data-track-action='reopen auction']");
    var auctionClosing = document.getElementsByClassName('auction-closing')

    if(refreshLinks.length>0 || auctionClosing.length>0) {
        (async () => {

            winners = await GM.getValue(winnersKey, winners);
            var winnerArr = winners.split(", ");
            if(winnerArr.length>15){
                winnerArr = winnerArr.slice(winnerArr.length-15, winnerArr.length);
            }
            var currentWinner = minBidInt;
            if(minBid){
                currentWinner = parseInt(minBid.textContent);
            }
            winnerArr.push(currentWinner);
            winners = winnerArr.join(", ");
            console.log("updating winners "+winners+" currentWinner:"+currentWinner+ "winnersKey:"+winnersKey);
            GM.setValue(winnersKey, winners);
            if(currentWinner>0 && (!minWinner || currentWinner<minWinner)){
                minWinner = currentWinner;
                GM.setValue(minWinnerKey, minWinner);
            }
        })();
        location.reload();
        abortTimer();
    }
}

function average(elmt){
    var sum = 0;
    for( var i = 0; i < elmt.length; i++ ){
        sum += parseInt( elmt[i], 10 ); //don't forget to add the base
    }

    var avg = sum/elmt.length;
    return avg;
}

function abortTimer() {
  clearInterval(tid);
}

function setMaxBid() {
    var newMax = parseInt(vv_maxBid.value);
    if(!isNaN(newMax)){
        maxBid = newMax;
        GM.setValue(maxBidKey, maxBid).then();
    }
}

(async () => {
    'use strict';
    while(!bidName){
        bidName = document.getElementById("lotTitle").textContent.trim();
        console.log("XbidName:"+bidName);
    }

    winnersKey = bidName+"_winners";
    maxBidKey = bidName+"_maxBid";
    minWinnerKey = bidName+"_minWinner";

    maxBid = await GM.getValue(maxBidKey, maxBid);
    winners = await GM.getValue(winnersKey, winners);
    minWinner = await GM.getValue(minWinnerKey, minWinner);
    var winnerArr = winners.split(", ");
    avgWinner = average(winnerArr).toFixed();

    var newHTML = document.createElement ('h1');
    newHTML.innerHTML = '<h1 id="vv_note" style="color:red;position:fixed;top:150px;right:100px;z-index:1111"> <strong>WILL BUY UP UNTIL € <input id="vv_maxBid" size=1 value="'+maxBid+'"/> </strong>'+
        '<br><small>Min won price: '+minWinner+' Avg won price:'+avgWinner+'<br>latest won prices: '+winners+'</small></h1>';
    document.body.appendChild (newHTML);
    vv_maxBid = document.getElementById('vv_maxBid');
    vv_maxBid.addEventListener ("input", setMaxBid , false);

    tid = setInterval(mycode, 500);
    // Your code here...
})();
