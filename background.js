var gold = [];



// Messages to popup when user visits a blocked website
var str1 = "Blocked website detected!";
var str2 = "Ding dong website still blocked";
var str3 = "A blocked website is a blocked website";
var str4 = "Circle, Rhombus, Rectangle, B L O C K ";
var str5 = "Blocked websites, you have.";
var str6 = "Go and be productive";
var str7 = "Do your work";
var str8 = "No seriously, go do it";
var str9 = "Procrastinate, you shall not";
var str10 = "Why are you still here? GO DO YOUR WORK";
var str11 = "Bruh";
var str12 = "A long time ago, in a galaxy far far away, SOMEONE IS PROCRASTINATING AND NOT DOING THEIR WORK";
var str13 = "Seriously, just go do your work.";
var str14 = "This site isn't going to unblock itself";
var str15 = "Whoop";
var str16 = "Dee";
var str17 = "Doo";
var str18 = "YEAHHHHHHHHH";
var str19 = "UWU";
var str20 = "OWO";
var str21 = "Oh you're still here?";
var str22 = ":|";
var str23 = "GOOOOOO DOOOO YOUR WORKKKK";
var str24 = ":I";
var str25 = ":V";
var str26 = "HaHaHaHa";
var str27 = "GO BE PRODUCTIVE";
var str28 = "JUST DO IT";
var str29 = "Aight Imma head out";

gold.push(str1);
gold.push(str2);
gold.push(str3);
gold.push(str4);
gold.push(str5);
gold.push(str6);
gold.push(str7);
gold.push(str8);
gold.push(str9);
gold.push(str10);
gold.push(str11);
gold.push(str12);
gold.push(str13);
gold.push(str14);
gold.push(str15);
gold.push(str16);
gold.push(str17);
gold.push(str18);
gold.push(str19);
gold.push(str20);
gold.push(str21);
gold.push(str22);
gold.push(str23);
gold.push(str24);
gold.push(str25);
gold.push(str26);
gold.push(str27);
gold.push(str28);
gold.push(str29);


// Tab ID of newly created tab
var tabid;

// List of blocked sites, received from the user interface/main.js
var locallist = [];




var btab;

// Interval for spamming popup messages
var int;



// Fired when user inputs new site to be blocked, updates the list
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        locallist = request.data;
        // console.log(locallist);
    });



//When tab url is changed, checks whether the changed tab is blocked, and spams popups if there is
chrome.tabs.onUpdated.addListener((tabId,changeInfo,tab) => {
    clearInterval(int);
    if(tab.status === "complete" && tab.url !== "chrome://newtab/") {
        unleashTheRoomba(tab.url);
    }
});

// Fired when user switches tabs. This tab that the user switches to will then be checked if it is blocked or not, and spams popups if it is
chrome.tabs.onActivated.addListener((activeInfo) => {
    clearInterval(int);
    getActiveTabURL(activeInfo).then((taburl) => {
        unleashTheRoomba(taburl);
    }).catch((err) => {
        console.log(err);
    });
});


// Returns true if url matches any url in the block list
function checkBlock(url){
    for(let i = 0; i < locallist.length; i++){
        if(url.indexOf(locallist[i]) != -1){
            return true;
        }
    }
    return false;
}

// Generates a random number to delay popups by
function generateNum(){
    return Math.floor((Math.random()*6)+3);
}


// Spams popup messages if blocked site exists in the window
function verifyTab(tabId,changeInfo,tab){
    clearInterval(int);
    if(tab.status === "complete"){
        // console.log("reached complete: updated code");
        // console.log("length of local after activation: " +locallist.length);
            chrome.tabs.query({currentWindow: true},function(tabs){
                for(let a = 0; a < tabs.length; a++){
                    let utostr = String(tabs[a].url);
                    if(checkBlock(utostr)){
                        unleashTheRoomba(utostr);
                        break;
                    }
                }
            });
        }
}


function unleashTheRoomba(url){
    clearInterval(int);
    if(checkBlock(url)){
        alert("BEEP");
        let interval = generateNum();
        let index = 0;
        int = setInterval(function(){
            if(index < gold.length){
                alert(gold[index]);
                index++;
            }else{
                clearInterval(int);
            }
        },interval*1000);
    }
    else{
        clearInterval(int);
    
    }
}

function getActiveTabURL(activeInfo) {
    let atid = activeInfo.tabId;
    return new Promise((resolve,reject) => {
        chrome.tabs.get(atid,(tab) => {
            resolve(tab.url);
        });
    });
}