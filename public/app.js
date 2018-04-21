

var database = firebase.database();

/**
 * Adds a new User to the Database. Assigns a
 * userID determined by the length of the current
 * user list.
 * @param name
 * @param email
 * @param password
 */
function createUser(name, email, password)
{
    database.ref("users/").set({
        name: name,
        email: email,
        password: password,
        userID: database.ref("users/").length,
        wishlist: new Element()
    });
}

/**
 * Adds an item to the database. It must have at least
 * a userID and url parameter, it contains defaults for
 * the rest. The gifter is initialized to -1.
 * @param userID
 * @param url
 * @param name
 * @param note
 * @param price
 * @param priority
 */
function createItem(userID, url, name = "", note = "", price = 0, priority = 1)
{
    var user = database.ref("users/" + userID.toString())
    var wlist;
    var itemID = database.ref("items/").length;

    database.ref("items/").set({
        requester: userID,
        url: url,
        name: name,
        price: price,
        note: note,
        priority: priority,
        gifter: -1,
        itemID: itemID
    });

    wlist = user.getAttribute("wishlist");
    wlist.setAttribute(wlist.length, itemID);
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
 * @param priority
 */
function editItem(itemID, url, name = "", note = "", price = 0, priority = 1)
{
    var item = database.ref("items/" + itemID.toString())
    item.setAttribute(url, url);
    item.setAttribute(name, name);
    item.setAttribute(price, price);
    item.setAttribute(note, note);
    item.setAttribute(priority, priority);
    item.setAttribute(gifter, -1);
}

/**
 * Deletes an Item by ID.
 * @param itemID
 */
function deleteItem(itemID)
{
    database.ref("items/" + itemID.toString()).remove();
}

/**
 * Reserves an Item by assign the reserver ID to the giftor attribute of the Item.
 * @param UserID ID of the user trying to reserve.
 * @param itemID ID of item to be reserved.
 */
function reserve(UserID, itemID)
{
    database.ref("items/" + UserID.toString()).setAttribute(gifter, UserID);
}

