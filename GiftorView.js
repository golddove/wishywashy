/**
 * @classdesc
 * This class is a subclass of Observer, part of the Observer Pattern.
 * It is a representation of a wishlist from the perspective of a Giftor.
 * As a user, it is the interface for viewing a wishlist that is not your own.
 */
class GiftorView implements Observer, Giftor
{
    /**
     * @constructor
     * @param subject
     * This constructor is run by a child of Subject,
     * providing itself as an argument.
     */
    constructor(subject) {
        this.subject = subject;
        this.observerState;
        update();
    }

    /**
     * @implements Observer
     * This method is responsible for overwriting the
     * current observerState with the state of the subject.
     */
    update() { observerState = subject.GetState(); }

    /**
     * @implements Observer
     * This method removes this observer from the
     * subjects list of observers.
     */
    detach () {  this.subject.detach(this); }

    /**
     * @implements Giftor
     * This method alters the subject wishlist by marking an
     * item as reserved. The reserved state can be seen only by
     * GiftorView Objects.
     */
    reserve() {

    }

    /**
     * This function is reponsible for displaying
     * the current observerState. It is typically called
     * directly after an update() call.
     */
    display() {

    }
}