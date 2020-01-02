// Adds a new site to be blocked from user input, but only if it has not been added already
function addSite(){
    var curr = document.getElementById("site-input").value;
    chrome.storage.local.get(["sites"], function(result) {
        blocks = result.sites;
    });
    if(checkDups() != true){
        blocks.push(curr);
        alert(curr + " added!");
        chrome.storage.local.set({"sites":blocks},function(){
            chrome.runtime.sendMessage({data:blocks});
        });

    }
}