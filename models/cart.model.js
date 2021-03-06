let cart = null;

module.exports = class Cart{
    static add(product){
        if (cart){ //cart is not null
            const index = cart.products.findIndex(p => {return p._id.equals( product._id)});

            console.log('Index:', index)
            if (index >= 0){ //exist in cart already
                var existingProduct = cart.products[index];
                existingProduct.quantity += 1;
                cart.totalPrice += product.priceSale;
            }else{
                product.quantity = 1;
                cart.products.push(product);
                cart.totalPrice += product.priceSale;
            }

        }else{
            cart = {products: [], totalPrice: 0};
            product.quantity = 1;
            cart.products.push(product);
            cart.totalPrice = product.priceSale;
        }
    }

    static getCart(){
        return cart;
    };

    static removeCart(){
        cart = null;
    }

    static removeCartById(id){
        var totalPrice = 0;
        var item = cart.products.filter((item) => {
            return item._id.equals(id)
        })
        
        var index = cart.products.indexOf(item[0]);
        cart.products.splice(index, 1)

        cart.products.forEach(item => {
            totalPrice += item.priceSale * item.quantity
        })

        cart.totalPrice = totalPrice
        
    }
};