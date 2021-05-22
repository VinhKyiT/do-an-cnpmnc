let wishlist = null;

module.exports = class Wishlist{
    static add(product){
        if (wishlist){ //cart is not null
            const index = wishlist.products.findIndex(p => {return p._id.equals( product._id)});
            
            if (index >= 0){ //exist in cart already
                return;
            }else{
                wishlist.products.push(product);
            }

        }else{
            wishlist = {products: []};

            wishlist.products.push(product);
        }
    }

    static getWishlist(){
        return wishlist;    
    };
};