// ==UserScript==
// @name         vakantieveilingen buy
// @namespace    http://vakantieveilingen.nl/
// @version      1.3.1
// @updateURL    https://github.com/kemalizing/tamper-scripts/raw/master/vv.user.js
// @description  try to take over the world!
// @author       You
// @include      *vakantieveilingen.nl*
// @grant       GM.setValue
// @grant       GM.getValue
// ==/UserScript==

var maxBid = 0;
var maxBidKey = location.pathname+"_maxBid";

var winners = ""
var winnersKey = location.pathname+"_winners";

var minWinner = null;
var minWinnerKey = location.pathname+"_minWinner";

var vv_maxBid;
var tid;

function mycode() {
    var bid = document.getElementById('jsActiveBidInput');
    var refresh = document.getElementsByClassName('i-refresh-white')[0];
    var button = document.getElementById('jsActiveBidButton');
    var minBid = document.getElementsByClassName('fastBidValue')[0];
    var timer = document.getElementsByClassName('timer-countdown-label')[0];

    if(button){
        document.getElementById("vv_note").style.visibility = "visible";
    } else {
        document.getElementById("vv_note").style.visibility = "hidden";
    }
    if(bid && timer){
        //console.log("maxBid:"+maxBid+" minBid:"+minBid.textContent+(minBid.textContent<=maxBid));
        //setCookie(location, minBid, 1);

        if(timer.textContent == "01" ){
            if(minBid.textContent<=maxBid){
                bid.value = minBid.textContent;
                button.click();
                abortTimer();
            }
        }
    }
    if(refresh) {
        (async () => {

            winners = await GM.getValue(winnersKey, winners);
            var winnerArr = winners.split(", ");
            if(winnerArr.length>15){
                winnerArr = winnerArr.slice(winnerArr.length-15, winnerArr.length);
            }
            var currentWinner = parseInt(document.getElementById("jsMainLotCurrentBid").textContent);
            winnerArr.push(currentWinner);
            winners = winnerArr.join(", ");
            GM.setValue(winnersKey, winners);
            if(!minWinner || currentWinner<minWinner){
                minWinner = currentWinner;
                GM.setValue(minWinnerKey, minWinner);
            }
        })();
        location.reload();
        abortTimer();
    }
}

function abortTimer() {
  clearInterval(tid);
}

function setMaxBid() {
    var newMax = parseInt(vv_maxBid.value);
    if(newMax){
        maxBid = newMax;
        GM.setValue(maxBidKey, maxBid).then();
    }
}

(async () => {
    'use strict';

    maxBid = await GM.getValue(maxBidKey, maxBid);
    winners = await GM.getValue(winnersKey, winners);
    minWinner = await GM.getValue(minWinnerKey, minWinner);

    var newHTML = document.createElement ('h1');
    newHTML.innerHTML = '<h1 id="vv_note" style="color:red;position:fixed;top:150px;right:100px;z-index:1111"> <strong>WILL BUY UP UNTIL € <input id="vv_maxBid" size=1 value="'+maxBid+'"/> </strong>'+
        '<br><small>minWinner: '+minWinner+' <br>winners: '+winners+'</small></h1>';
    document.body.appendChild (newHTML);
    vv_maxBid = document.getElementById('vv_maxBid');
    vv_maxBid.addEventListener ("input", setMaxBid , false);

    tid = setInterval(mycode, 500);
    // Your code here...
})();
