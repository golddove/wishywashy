var config = {
    apiKey: "AIzaSyDM-VKsL42qVJB0C5wIqbPyamp2MMuKn2I",
    authDomain: "wishywashy-cs321.firebaseapp.com",
    databaseURL: "https://wishywashy-cs321.firebaseio.com",
    projectId: "wishywashy-cs321",
    storageBucket: "wishywashy-cs321.appspot.com",
    messagingSenderId: "114079785486"
};
firebase.initializeApp(config)

var database = firebase.database();
var provider = new firebase.auth.GoogleAuthProvider();
var firebaseAuthUid = null;
var pageLoaded = false;

document.addEventListener('DOMContentLoaded', function() {
    if (pageLoaded) {
        return;
    } else {
        pageLoaded = true;
    }
    chrome.storage.sync.get(['firebase-auth-uid'], function(result){
        console.log(result);
        var popupContainer = document.getElementById("popupContainer");
        var uid = result["firebase-auth-uid"];
        if(uid) {
            var addButton = document.createElement("button");
            addButton.innerText = "Wish this Page!";
            popupContainer.appendChild(addButton);
            addButton.addEventListener("click", function() {
                var newItemForm = document.createElement("form");
                var nameInput = document.createElement("input");
                nameInput.setAttribute("type", "text");
                nameInput.setAttribute("placeholder", "Item Name");
                var noteInput = document.createElement("input");
                noteInput.setAttribute("type", "text");
                noteInput.setAttribute("placeholder", "Notes (optional)");
                var priceInput = document.createElement("input");
                priceInput.setAttribute("type", "number");
                priceInput.setAttribute("placeholder", "$0.00");
                priceInput.setAttribute("step", "0.01");
                priceInput.setAttribute("min", "0");
                var submitInput = document.createElement("input");
                submitInput.setAttribute("type", "submit");
                submitInput.style.display = "none";
                newItemForm.appendChild(nameInput);
                newItemForm.appendChild(priceInput);
                newItemForm.appendChild(noteInput);
                newItemForm.appendChild(submitInput);
                addButton.replaceWith(newItemForm);
                searchBar.remove();
                newItemForm.addEventListener("submit", function(e) {
                    e.preventDefault();
                    chrome.tabs.query({
                        active : true,
                        currentWindow : true,
                    }, function([tab]) {
                        console.log(tab);
                        createItem(tab.url, nameInput.value, noteInput.value, priceInput.value, function() {
                            newItemForm.replaceWith(searchBar);
                        });
                    });
                });
            });

            var allUsersList = [];
            var allUsersContainer = document.createElement("div");
            allUsers(function(userID, user) {
                var userContainer = document.createElement("div");
                userContainer.style.display = "none";
                nameLabel = document.createElement("label");
                nameLabel.innerText = user.name;
                nameLabel.style.display = "block";
                unameLabel = document.createElement("label");
                unameLabel.innerText = user.username;
                unameLabel.style.display = "block";
                userContainer.appendChild(nameLabel);
                userContainer.appendChild(unameLabel);
                var otherPopupContainer = undefined;
                userContainer.addEventListener("click", function() {
                    if (otherPopupContainer) {
                        popupContainer.replaceWith(otherPopupContainer);
                        return;
                    }
                    otherPopupContainer = document.createElement("div");
                    var otherWishlistContainer = document.createElement("div");
                    var backButton = document.createElement("button");
                    backButton.innerText = "< Back";
                    backButton.addEventListener("click", function() {
                        otherPopupContainer.replaceWith(popupContainer);
                    })
                    otherPopupContainer.appendChild(backButton);
                    otherPopupContainer.appendChild(otherWishlistContainer);
                    var otherWishlist = [];

                    wishlistItems(userID, function(itemID, item) {
                        console.log("adding item");
                        var itemContainer = document.createElement("div");
                        var nameLabel = document.createElement("label");
                        nameLabel.innerText = item['name'];
                        var priceLabel = document.createElement("label");
                        priceLabel.innerText = " $" + item['price'];
                        priceLabel.style['font-style'] = 'italic';
                        var link = document.createElement("a");
                        link.addEventListener("click", function() {
                            var wishlistItem = otherWishlist.find(function(wItem) {
                                return wItem.id == itemID;
                            });
                            chrome.tabs.create({
                                url : wishlistItem.url,
                            });
                        });
                        link.style.display = "block";
                        link.appendChild(nameLabel);
                        link.appendChild(priceLabel);
                        var noteLabel = document.createElement("label");
                        noteLabel.innerText = item["note"];
                        itemContainer.appendChild(link);
                        itemContainer.appendChild(noteLabel);
                        otherWishlistContainer.appendChild(itemContainer);
                        otherWishlist.push({
                            id : itemID,
                            nameLabel,
                            priceLabel,
                            url : item["url"],
                            noteLabel,
                            itemContainer,
                        });
                    }, function(itemID) {
                        var wishlistItem = otherWishlist.find(function(wItem) {
                            return wItem.id == itemID;
                        });
                        wishlistItem.itemContainer.remove();
                        wishlist.splice(otherWishlist.indexOf(wishlistItem),1);
                    }, function(itemID, item) {
                        var wishlistItem = wishlist.find(function(wItem) {
                            return wItem.id == itemID;
                        });
                        wishlistItem.priceLabel.innerText = " $" + item['price'];
                        wishlistItem.nameLabel.innerText = item['name'];
                        wishlistItem.noteLabel.innerText = item['note'];
                        wishlistItem.url = item['url'];
                    });
                    popupContainer.replaceWith(otherPopupContainer);
                });
                allUsersContainer.appendChild(userContainer);
                allUsersList.push({
                    user,
                    nameLabel,
                    unameLabel,
                    userContainer,
                });
            });
            var searchBar = document.createElement("input");
            searchBar.setAttribute("type", "text");
            searchBar.setAttribute("placeholder", "Find your friends...");
            searchBar.addEventListener("input", function() {
                allUsersList.forEach(function(aUser) {
                    if (searchBar.value === "") {
                        wishlistContainer.style.display = "block";
                    } else {
                        wishlistContainer.style.display = "none";
                    }
                    if (searchBar.value !== "" && aUser.user.username.includes(searchBar.value)) {
                        aUser.userContainer.style.display = "block";
                    } else {
                        aUser.userContainer.style.display = "none";
                    }
                })
            });
            popupContainer.appendChild(searchBar);
            popupContainer.appendChild(allUsersContainer);

            var wishlistContainer = document.createElement("div");
            popupContainer.appendChild(wishlistContainer);
            var wishlist = [];

            wishlistItems(uid, function(itemID, item) {
                console.log("adding item");
                var itemContainer = document.createElement("div");
                var nameLabel = document.createElement("label");
                nameLabel.innerText = item['name'];
                var priceLabel = document.createElement("label");
                priceLabel.innerText = " $" + item['price'];
                priceLabel.style['font-style'] = 'italic';
                var link = document.createElement("a");
                link.addEventListener("click", function() {
                    var wishlistItem = wishlist.find(function(wItem) {
                        return wItem.id == itemID;
                    });
                    chrome.tabs.create({
                        url : wishlistItem.url,
                    });
                });
                link.style.display = "block";
                link.appendChild(nameLabel);
                link.appendChild(priceLabel);
                var noteLabel = document.createElement("label");
                noteLabel.innerText = item["note"];
                itemContainer.appendChild(link);
                itemContainer.appendChild(noteLabel);
                wishlistContainer.appendChild(itemContainer);
                wishlist.push({
                    id : itemID,
                    nameLabel,
                    priceLabel,
                    url : item["url"],
                    noteLabel,
                    itemContainer,
                });
            }, function(itemID) {
                var wishlistItem = wishlist.find(function(wItem) {
                    return wItem.id == itemID;
                });
                wishlistItem.itemContainer.remove();
                wishlist.splice(wishlist.indexOf(wishlistItem),1);
            }, function(itemID, item) {
                var wishlistItem = wishlist.find(function(wItem) {
                    return wItem.id == itemID;
                });
                wishlistItem.priceLabel.innerText = " $" + item['price'];
                wishlistItem.nameLabel.innerText = item['name'];
                wishlistItem.noteLabel.innerText = item['note'];
                wishlistItem.url = item['url'];
            });
        }
        else {
            var googleButton = document.createElement("button");
            googleButton.innerText = "Login with Google";
            popupContainer.appendChild(googleButton);
            console.log("found button");
            googleButton.addEventListener("click", createUser);

            // Testing wishlistItems method
            // console.log(wishlistItems(1));
            // console.log(wishlistItems("FcemVZGPbyTqlnfaBJW5009NbiJ3"));
            // console.log(wishlistItems(0));
            // console.log(wishlistItems(2));

            // Testing findUser method
            console.log(findUser("hello"));
            console.log(findUser("ddo"));
            console.log(findUser("@gmail"));
            console.log(findUser("n"));
            console.log(findUser(""));
        }
    });
});



/**
 * Adds a new User to the Database. Assigns a
 * userID determined by the length of the current
 * user list.
 * @param name
 * @param email
 * @param password
 */
function createUser() {
    chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
        firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(null, token)).then(function(user) {
            //firebase.auth().signInWithPopup(provider).then(function(result) {
            // The signed-in user info.
            console.log("firebased up yo");
            chrome.storage.sync.set({"firebase-auth-uid": user.uid});
            var userRef = database.ref("/users/"+user.uid);
            userRef.once('value').then(function(snapshot) {
                console.log();
                if(!snapshot.exists()) {
                    userRef.set({
                        name : user.displayName,
                        reservations : false,
                        username : user.email,
                        wishlist : false,
                    });
                }
            });
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            console.log(error.message);
        });

    });


}

/**
 * Adds an item to the database. It must have at least
 * a userID and url parameter, it contains defaults for
 * the rest. The gifter is initialized to -1.
 * @param url
 * @param name
 * @param note
 * @param price
 */
function createItem(url, name = "", note = "", price = 0, callback = () => {}) {
    chrome.storage.sync.get(['firebase-auth-uid'], function(result){
        var uid = result['firebase-auth-uid'];
        var wishlistRef = database.ref("users/" + uid + "/wishlist");
        var itemsRef = database.ref("items/");
        var newItemRef = itemsRef.push({
            gifter : false,
            name : name,
            note : note,
            price : price,
            requester : uid,
            url : url,
        });
        wishlistRef.child(newItemRef.key).set(true).then(function() {
            callback();
        });
    });
}

/**
 * Takes an existing item, locates it by ID, and
 * reassigns its values. It doesn't change the requester
 * or the itemID. The requester userID is unnecessary.
 * @param itemID
 * @param url
 * @param name
 * @param note
 * @param price
 */
function editItem(itemID, url = undefined, name = undefined, note = undefined, price = undefined) {
    var updates = {};
    if(url) {
        updates.url = url;
    }
    if(name) {
        updates.name = name;
    }
    if(note) {
        updates.note = note;
    }
    if(price) {
        updates.price = price;
    }
    var itemRef = database.ref("items/" + itemID);
    itemRef.update(updates);
}

/**
 * Deletes an Item by ID.
 * @param itemID
 */
function deleteItem(itemID) {
    var itemRef = database.ref("items/" + itemID.toString())
    var gifterID = itemRef.getAttribute("gifter");
    database.ref("users/" + gifterID + "/reservations").remove(itemID);
    itemRef.remove();
}

/**
 * Reserves an Item by assign the reserver ID to the giftor attribute of the Item.
 * @param UserID ID of the user trying to reserve.
 * @param itemID ID of item to be reserved.
 */
function reserve(itemID) {
    chrome.storage.sync.get(['firebase-auth-uid'], function(result){
        var uid = result['firebase-auth-uid'];
        var ReservRef = database.ref("users/" + uid + "/reservations");
        ReservRef.setAttribute(itemID, true);
        var itemRef = database.ref("items/" + itemID).setAttribute("gifter", uid);
    });
}

/**
 * Given a string, creates an array of all
 * users whose username contains the given string.
 * @param string Search string
 */
function allUsers(callbackEach = () => {}) {
    users = database.ref("/users");
    var matches = new Array();

    users.once("value").then(function(userList){
        userList.forEach(function(user){
            // var username = user.child("username").val();
            // if (username.includes(string))
            // {
            callbackEach(user.key, user.toJSON());
            // }
        })
    });
    // toJSONreturn matches;
}

/**
 * Given a userID, returns an Array of objects
 * @param userID
 * @returns {any[]}
 */
function wishlistItems (userID, callbackAdded = () => {}, callbackRemoved = () => {}, callbackChanged = () => {}) {
    var wishlistRef = database.ref("users/" + userID + "/wishlist");
    var items = new Array;
    var i = 0;

    wishlistRef.on("child_added", function(itemSnap){
        var itemID = itemSnap.key; //singular itemID
        var itemRef = database.ref("items/" + itemID);
        itemRef.once("value").then(function(item) {
            callbackAdded(itemID, item.toJSON());
        });
    });

    wishlistRef.on("child_removed", function(itemSnap){
        callbackRemoved(itemSnap.key);
    });

    wishlistRef.on("child_changed", function(itemSnap){
        var itemID = itemSnap.key; //singular itemID
        var itemRef = database.ref("items/" + itemID);
        itemRef.once("value").then(function(item) {
            callbackChanged(itemID, item.toJSON());
        });
    });
}
