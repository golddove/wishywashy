/**
 * @classdesc
 * This abstract class is used in the Observer pattern
 * to define a set of functions that allow Observers to
 * communicate with Wishlists. (Wishlists are concrete subjects)
 * @abstract
 */
class Subject
{
    /**  @constructor */
    constructor() {
        if (this.constructor === Subject) throw new TypeError('Abstract class Subject cannon be instantiated directly.');
        var observers = new Array();
    }

    /**
     * This method is responsible for notifying all of this subjects
     * observers that a change to the state has been made, and the
     * observer needs to update its observerState property via the
     * update method.
     */
    notify () {
        for (observer in observers) { observer.update(); }
    }

    /**
     * This method adds a pre-created observer object to this subject's list
     * of observers. The observers will call this method in their constructor.
     * @param observer
     */
    attach (observer) { observers.add(observer); }

    /**
     * This method removes an observer from the list of observers. The observer
     * @param observer
     */
    detach (observer) { observers.remove(observer); }

    /*
    Old Code:

    This version of attach assumed that only subject will create observers.
    the current implementation is that the observers will call attach and detach on
    their subject, providing themselves as an argument.
    attach (requestor) {
        if (requestor)
        {
            observers.add(new RequesterView(this));
        }
        else
        {
            observers.add(new GiftorView(this));
        }
    }
    */
}