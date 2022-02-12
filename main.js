var blocks = [];
var modal = document.getElementById("addDeleteModal");
var modalText = document.getElementsByClassName("modal-text")[0];
var modalContent = document.getElementsByClassName("modal-content")[0];
var modalSuccessColor = "LimeGreen";
var modalFailColor = "OrangeRed";
var blockActiveStatus = 1;

// Retrieve block list and block status from memory on startup
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
    chrome.storage.local.get(["blockActiveStatus"], function (result) {
        resBlockActiveStatus = result.blockActiveStatus;
        if (resBlockActiveStatus != undefined) {
            blockActiveStatus = resBlockActiveStatus;
            writeBlockStatusToHTML();
        } else {
            writeBlockStatusToHTML();
        }
    });
}



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


// Removes a site from blocked sites list, but only if it already exists in the list
function removeSite() {
    let curr = document.getElementById("popup-input").value;
    if (curr == "") {
        let errStr = "Please enter a website to remove";
        openModal(errStr, modalFailColor);
        return false;
    }
    if (checkDups()) {
        let index = blocks.indexOf(curr);
        blocks.splice(index,1);
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

// Fired when button is pressed to remove a website
document.getElementById("buttonRemove").addEventListener('click', function () {
    if(removeSite()) {
        let addStr = "Site removed from block list!";
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

// Fired when button to toggle blocking is pressed, toggles blocking on and off
document.getElementById("buttontoggle").addEventListener("click", function () {
    if (blockActiveStatus == 1) {
        let bool = 0;
        chrome.runtime.sendMessage({ blockActiveStatus: bool });
        chrome.storage.local.set({ "blockActiveStatus": bool }, function () {
            blockActiveStatus = bool;
            writeBlockStatusToHTML();
        });
        openModal("Blocking paused!", modalSuccessColor);
        
    } else if (blockActiveStatus == 0) {
        let bool = 1;
        chrome.runtime.sendMessage({ blockActiveStatus: bool });
        chrome.storage.local.set({ "blockActiveStatus": bool }, function () {
            blockActiveStatus = bool;
            writeBlockStatusToHTML(); 
        });
        openModal("Blocking enabled!", modalSuccessColor);
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

function writeBlockStatusToHTML() {
    let spanBlockStatus = document.getElementById("blockStatusSpan");
    if (blockActiveStatus == 0) {
        spanBlockStatus.style.color = "orangeRed";
        spanBlockStatus.innerHTML = "INACTIVE";
    } else if (blockActiveStatus == 1) {
        spanBlockStatus.style.color = "SeaGreen";
        spanBlockStatus.innerHTML = "ACTIVE";
    }
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