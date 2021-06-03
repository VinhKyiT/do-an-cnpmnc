let wishlists = document.querySelectorAll('.add-wishlist');

//let products = await Product.find()

for (let i = 0; i < wishlists.length; i++) {
    wishlists[i].addEventListener('click', () => {
        wishlistNumbers();
    })
}

function onLoadWishlistNumbers() {
    let productNumbers = localStorage.getItem('wishlistNumbers');

    if(productNumbers){
        document.querySelector('.wishlist-item-count').textContent = productNumbers;
    }
}

function wishlistNumbers() {
    let productNumbers = localStorage.getItem('wishlistNumbers');

    productNumbers = parseInt(productNumbers);

    console.log(productNumbers);

    if (productNumbers) {
        localStorage.setItem('wishlistNumbers', productNumbers + 1);
        document.querySelector('.wishlist-item-count').textContent = productNumbers + 1;
    }else {
        localStorage.setItem('wishlistNumbers', 1);
        document.querySelector('.wishlist-item-count').textContent = 1;
    }
}

onLoadWishlistNumbers();