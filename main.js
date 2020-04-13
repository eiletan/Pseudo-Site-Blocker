var blocks = [];


// Retrieve block list from memory on startup
chrome.storage.local.get(["sites"],function(result){
        blocks = result.sites;
        if(!(Array.isArray(blocks))){
            blocks = [];
        }
        chrome.runtime.sendMessage({data:blocks});
});

// Adds a new site to be blocked from user input, but only if it has not been added already
function addSite(){
    let curr = document.getElementById("site-input").value;
    // alert("length before adding is: " +blocks.length);
    if(checkDups() != true){
        blocks.push(curr);
        alert(curr + " added!");
        chrome.storage.local.set({"sites":blocks},function(){
        });
        chrome.runtime.sendMessage({data:blocks});
    }
}

// Fired when button is pressed to add a website
document.getElementById("site-form").addEventListener('submit',function(){
    addSite();
});

// Fired when button is clicked to view blocked sites. Only works on the second try for some reason
document.getElementById("button").addEventListener("click",function(){
   let str = "Your blocked websites are: ";
   for(let i = 0; i < blocks.length; i++){
       str = str + blocks[i] + ", ";
   }
   document.write(str);
   let back = document.createElement("BUTTON");
   back.innerHTML = "Click to go back";
    document.body.appendChild(back);

    back.addEventListener("click",function(){
        location.reload();
    });
});


// Fired when button to clear list is pressed, clears list
document.getElementById("buttonc").addEventListener("click",function(){
   clearList();
});



// Function that checks the array of block sites for duplicates, returns true if there is a duplicate
function checkDups(){
    let curr = document.getElementById("site-input").value;
    for(let i = 0; i < blocks.length; i++){
        if(blocks[i].indexOf(curr) != -1){
            alert("Website already in your block list");
            return true;
        }
    }
    return false;
}

// Clears block list
function clearList(){
    blocks = [];
    chrome.storage.local.set({"sites":blocks},function(){
        alert("cleared");
    });
    chrome.runtime.sendMessage({data:blocks});
}
