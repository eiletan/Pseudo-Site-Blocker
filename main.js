var blocks = [];


// Retrieve block list from memory on startup
window.onload = function () {
    chrome.storage.local.get(["sites"], function (result) {
        blocks = result.sites;
        if (!(Array.isArray(blocks))) {
            blocks = [];
        }
        chrome.runtime.sendMessage({ data: blocks });
        if (document.getElementsByClassName("blockedSites")[0].style.display != "none") {
            writeBlockedSitesToHTML();
        }
    });
    
}


// Fired when background.js makes a request for HTML element
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.getCurrentHTMLDom == "true") {
        let entireHtmlElement = document.getElementsByTagName("html")[0];
        sendResponse({ entireHTMLElement: entireHtmlElement });
    }
});

// Adds a new site to be blocked from user input, but only if it has not been added already
function addSite() {
    let curr = document.getElementById("site-input").value;
    // alert("length before adding is: " +blocks.length);
    if (checkDups() != true) {
        blocks.push(curr);
        alert(curr + " added!");
        chrome.storage.local.set({ "sites": blocks }, function () {
        });
        chrome.runtime.sendMessage({ data: blocks });
    }
}

// Fired when button is pressed to add a website
document.getElementById("site-form").addEventListener('submit', function () {
    addSite();
    if (document.getElementsByClassName("blockedSites")[0].style.display != "none") {
        writeBlockedSitesToHTML();
    }
});

// Fired when button is clicked to view blocked sites
document.getElementById("button").addEventListener("click", function () {
    writeBlockedSitesToHTML();
    let blocklistEl = document.getElementsByClassName("blockedSites")[0];
    blocklistEl.style.display = "block";
});


// Fired when button to close blocked sites list is pressed, removes it from view
document.getElementById("blockedSitesBackButton").addEventListener("click", function () {
    let blocklistEl = document.getElementsByClassName("blockedSites")[0];
    blocklistEl.style.display = "none";
});


// Fired when button to clear list is pressed, clears list
document.getElementById("buttonc").addEventListener("click", function () {
    clearList();
    if (document.getElementsByClassName("blockedSites")[0].style.display == "block") {
        writeBlockedSitesToHTML();
    }
});


function writeBlockedSitesToHTML() {
    let str = "";
    for (let i = 0; i < blocks.length; i++) {
        if (i == 0) {
            str = str + blocks[i];
        } else if (i == blocks.length - 1) {
            str = str + ", " + blocks[i] + ".";
        } else {
            str = str + "," + blocks[i];
        }
    }
    let spanEl = document.getElementById("blockedSitesSpan");
    spanEl.innerHTML = str;
}


// Function that checks the array of block sites for duplicates, returns true if there is a duplicate
function checkDups() {
    let curr = document.getElementById("site-input").value;
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].indexOf(curr) != -1) {
            alert("Website already in your block list");
            return true;
        }
    }
    return false;
}

// Clears block list
function clearList() {
    blocks = [];
    chrome.storage.local.set({ "sites": blocks }, function () {
        alert("cleared");
    });
    chrome.runtime.sendMessage({ data: blocks });
}
