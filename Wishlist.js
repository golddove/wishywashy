/**
 * @classdesc
 * The wishlist has reference to its user,
 * has a collection of items, and has a state,
 * for use with the observer pattern. It
 * implements GetState and SetState for use
 * with the observer pattern as well.
 */
class Wishlist extends Subject
{
    constructor(user) {
        super();
        this.user = user;
        this.items = Array();
        this.state;

    }

    get state () {return state;}

    set state (mod) {this.state = mod;}
}