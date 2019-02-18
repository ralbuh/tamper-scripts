// ==UserScript==
// @name         vakantieveilingen buy
// @namespace    http://vakantieveilingen.nl/
// @version      1.1.2
// @updateURL    https://github.com/kemalizing/tamper-scripts/raw/master/vv.user.js
// @description  try to take over the world!
// @author       You
// @include      *vakantieveilingen.nl*
// @grant       GM.setValue
// @grant       GM.getValue
// ==/UserScript==

var maxBid = 5;
var tid;
// var tid = setInterval(mycode, 500);
function mycode() {
//             GM.setValue("foo", "bar");
            var bid = document.getElementById('jsActiveBidInput');
            var refresh = document.getElementsByClassName('i-refresh-white')[0];
            var button = document.getElementById('jsActiveBidButton');
            var minBid = document.getElementsByClassName('fastBidValue')[0];
            var timer = document.getElementsByClassName('timer-countdown-label')[0];

    if(bid && timer){
        console.log("maxBid:"+maxBid+" minBid:"+minBid.textContent+(minBid.textContent<=maxBid));

        setCookie(location, minBid, 1);

        if(timer.textContent == "01" ){
            if(minBid.textContent<=maxBid){
                bid.value = minBid.textContent;
                button.click();
                abortTimer();
            }
        }
    }
    if(refresh) {
        location.reload();
    }
}

function abortTimer() { // to be called when you want to stop the timer
  clearInterval(tid);
}

function setMaxBid() {
    var vv_maxBid = document.getElementById('vv_maxBid');
    console.log("vv_maxBid:"+vv_maxBid.value);
    var newMax = parseInt(vv_maxBid.value);
    if(newMax){
        maxBid = newMax;
        GM.setValue("maxBid", maxBid).then();
    }
}

(async () => {
    'use strict';

    maxBid = await GM.getValue("maxBid", maxBid);

    var newHTML = document.createElement ('h1');
    newHTML.innerHTML = '<h1 style="color:red;position:fixed;top:150px;right:100px;z-index:1111"> <strong>WILL BUY UP UNTIL € <input id="vv_maxBid" size=1 value="'+maxBid+'"/> </strong></h1>';
    document.body.appendChild (newHTML);
    var vv_maxBid = document.getElementById('vv_maxBid');
    vv_maxBid.addEventListener ("input", setMaxBid , false);

    tid = setInterval(mycode, 500);
    // Your code here...
})();
