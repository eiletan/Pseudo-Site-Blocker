// Tab ID of newly created tab
var tabid;

// List of blocked sites, received from the user interface/main.js
var locallist = [];


// Array containing tab id of currently blocked tabs
var blockedTabId = [];

var btab;

// Interval for spamming popup messages
var int;



// Fired when user inputs new site to be blocked, updates the list
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    locallist = request.data;
    if (request.data.length == 0) {
        for (let i = 0; i < blockedTabId.length; i++) {
            unblockTab(blockedTabId[i]);
        }
        blockTabId = [];
    }
});




//When tab url is changed, blocks current tab if it is in the block list
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.status === "complete" && tab.url !== "chrome://newtab/") {
        unleashTheRoomba(tab.url, tabId);
    }
});



chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    if (blockedTabId.length != 0) {
        if (blockedTabId.includes(tabId)) {
            let ind = blockedTabId.indexOf(tabId);
            if (ind > -1) {
                blockedTabId.splice(ind, 1);
              }
        }
    }
});



// Fired when user switches tabs. This tab that the user switches to will then be checked if it is blocked or not, and blocks if it is.
chrome.tabs.onActivated.addListener((activeInfo) => {
    getActiveTabURL(activeInfo).then((taburl) => {
        unleashTheRoomba(taburl, activeInfo.tabId);
    }).catch((err) => {
        console.log(err);
    });
});


// Returns true if url matches any url in the block list
function checkBlock(url) {
    for (let i = 0; i < locallist.length; i++) {
        if (url.indexOf(locallist[i]) != -1) {
            return true;
        }
    }
    return false;
}

// Generates a random number to delay popups by
function generateNum() {
    return Math.floor((Math.random() * 6) + 3);
}




function unleashTheRoomba(url, tabId) {
    if (checkBlock(url)) {
        console.log("UNLEASH");
        blockedTabId.push(tabId);
        blockTab(tabId);
    }

}

function getActiveTabURL(activeInfo) {
    let atid = activeInfo.tabId;
    return new Promise((resolve, reject) => {
        chrome.tabs.get(atid, (tab) => {
            resolve(tab.url);
        });
    });
}

// "Blocks" tab by changing opacity and disabling click events
function blockTab(tabId) {
    chrome.tabs.executeScript(tabId,{
        code: "document.getElementsByTagName('html')[0].style.opacity=0.3; document.getElementsByTagName('html')[0].style.pointerEvents='none';"
      });
}


// "Unblocks" tab by restoring opacity and reenabling click events
function unblockTab(tabId) {
    chrome.tabs.executeScript(tabId,{
        code: "document.getElementsByTagName('html')[0].style.opacity=1; document.getElementsByTagName('html')[0].style.pointerEvents='auto';"
      });
}