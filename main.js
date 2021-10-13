var blocks = [];
var modal = document.getElementById("addDeleteModal");
var modalText = document.getElementsByClassName("modal-text")[0];
var modalContent = document.getElementsByClassName("modal-content")[0];
var modalSuccessColor = "LimeGreen";
var modalFailColor = "OrangeRed";


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
    let curr = document.getElementById("popup-input").value;
    if (curr == "") {
        let errStr = "Please enter a website to block";
        openModal(errStr, modalFailColor);
        return false;
    }
    if (checkDups() != true) {
        blocks.push(curr);
        chrome.storage.local.set({ "sites": blocks }, function () {
        });
        chrome.runtime.sendMessage({ data: blocks });
        return true;
    }
    return false;
}

// Fired when button is pressed to add a website
document.getElementById("buttonAdd").addEventListener('click', function () {
    if(addSite()) {
        let addStr = "Site added to block list!";
        openModal(addStr,modalSuccessColor);
        if (document.getElementsByClassName("blockedSites")[0].style.display != "none") {
            writeBlockedSitesToHTML();
        }
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
    let clearStr = "Blocked sites cleared!";
    openModal(clearStr,modalSuccessColor);
    if (document.getElementsByClassName("blockedSites")[0].style.display != "none") {
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
    let curr = document.getElementById("popup-input").value;
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].indexOf(curr) != -1) {
            let errStr = "Website is already in block list";
            openModal(errStr, modalFailColor);
            return true;
        }
    }
    return false;
}

// Clears block list
function clearList() {
    blocks = [];
    chrome.storage.local.set({ "sites": blocks }, function () {
        // console.log("List cleared");
    });
    chrome.runtime.sendMessage({ data: blocks });
}

function openModal(modalMessage, modalColor) {
    modalText.innerHTML = modalMessage;
    if (modalContent.style.borderLeftColor != modalColor) {
        modalContent.style.borderLeftColor = modalColor;
    }
    modal.style.display = "block";
}

// Close modal when it is clicked
modal.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}