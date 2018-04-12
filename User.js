/**
 * User class representing a user of the system.
 */
class User
{
    constructor(accountInfo)
    {
        this.accountInfo = accountInfo;
        this.wishlist = new Wishlist(this);
    }

    view(wishlist)
    {
        if (!(wishlist === Wishlist))
        {
            throw new Error("invalid input")
        }
        else
        {
            if (wishlist == this.wishlist)
            {
                return new RequesterView(wishlist);
            }
            else return new GiftorView(wishlist);
        }
    }
}