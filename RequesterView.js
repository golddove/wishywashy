/**
 * @classdesc
 * This class is a subclass of Observer, part of the Observer Pattern.
 * It is a representation of a wishlist from the perspective of a Requestor.
 * As a user, it is the interface for viewing your own wishlist.
 */
class RequesterView implements Observer, Requestor
{
    /**
     * @constructor
     * @param subject
     * This constructor is run by a child of Subject,
     * providing itself as an argument.
     */
    constructor(subject) {
        this.subject = subject;
        this.subject.attach(this);
        this.observerState;
        update();
    }

    /**
     * @implements Observer
     * This method is responsible for overwriting the
     * current observerState with the state of the subject.
     * It is typically called by the subject via the notify()
     * method.
     */
    function update() { observerState = subject.GetState(); }

    /**
     * @implements Observer
     * This method removes this observer from the
     * subjects list of observers.
     */
    detach () {  this.subject.detach(this); }

    /**
     * @implements Requestor
     * This method adds a newly created item into the wishlist
     * via the setState() method.
     */
    request(item) {
        //subject.setState(item); WIP
    }

    /**
     * @implements Requestor
     * This method deletes an item in the wishlist
     * via the setState() method.
     */
    remove(item) {
        //subject.setState(item); WIP
    }

    /**
     * @implements Requestor
     * This method edits an item in the wishlist
     * via the setState() method.
     */
    edit(item) {
        //subject.setState(item); WIP
    }


    /**
     * This method displays the current
     * observerState. It is typically called
     * directly after an update() call.
     */
    display() {

    }
}