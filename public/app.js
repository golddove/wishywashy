

var database = firebase.database();

/**
 * Adds a new User to the Database. Assigns a
 * userID determined by the length of the current
 * user list.
 * @param name
 * @param email
 * @param password
 */
function createUserData(name, email, password)
{
    database.ref("users/").set({
        name: name,
        email: email,
        password: password
        userID: database.ref("users/").length
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
    database.ref("items/").set({
        requester: userID,
        url: url,
        name: name,
        price: price,
        note: note,
        priority: priority,
        gifter: -1
    })
}