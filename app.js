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

document.addEventListener('DOMContentLoaded', function() {
    var googleButton = document.getElementById("googleButton");
    console.log("wtf..");
    if(googleButton) {
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
function createItem(url, name = "", note = "", price = 0) {
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
        wishlistRef.child(newItemRef.key).set(true);
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
function findUser(string) {
    users = database.ref("/users");
    var matches = new Array();

    users.once("value").then(function(userList){
        userList.forEach(function(user){
            var username = user.child("username").val();
            if (username.includes(string))
            {
                matches.push(user.toJSON());
            }
        })
       });
    return matches;
}

/**
 * Given a userID, returns an Array of objects
 * @param userID
 * @returns {any[]}
 */
function wishlistItems (userID) {
    if (database.ref("user/" + userID) == undefined) {return new Array;}

    var wishlistRef = database.ref("users/" + userID + "/wishlist");
    var items = new Array;

    wishlistRef.once("value").then(function(wishlist){
        wishlist.forEach(function(itemID) { // snapshot is the wishlist
            var key = itemID.key; //singular itemID
            var itemRef = database.ref("items/" + key);
            itemRef.once("value").then(function(item){
               items.push(item.toJSON());
            });
        });
    });
    return items;
}
