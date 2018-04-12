/**
 * @classdesc
 * This abstract class is used in the Observer
 * pattern to define a function update, used by
 * it's concrete class objects to display a
 * wishlist to a user.
 * @abstract
 */
interface Observer
{
    update();
    detach();
}

