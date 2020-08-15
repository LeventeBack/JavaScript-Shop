$(document).ready(function(){
    const LOCAL_STORAGE_SHOP_ITEMS_KEYS = 'task.cart-items'
    let cartItems = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SHOP_ITEMS_KEYS)) || []
 
    $('.shop-item').on('click', '.add-cart-btn', function(){
        let productPrice = clearPrice($(this).siblings().text());
        let productName = $(this).parent().siblings('.item-title').text()
        let productImageSrc = $(this).parent().siblings('img')[0].src;
        if(isInCart(productName)){
            incrementQuantity(productName)
        } else {
            cartItems.push(createElementObject(productPrice,productName, productImageSrc, 1))
            render()
            save()
        }
    })  

    $('.cart-products').on('click','.cart-product .remove-cart-btn',function(){
        const removedItemName = $(this).parent().siblings('.cart-product-name').text()
        cartItems = cartItems.filter(item => item.name !== removedItemName)
        $(this).parent().parent().remove()
        if($('.cart-products').is(':empty')){
            $('.cart-products').text('Your cart is empty.')
        }
        save()
        updatePrice()
    })

    $('.cart-products').on('change','.cart-product input',function(){
        if($(this).val() < 1){
            $(this).val(1) 
        } else if(!Number.isInteger($(this).val())){
            $(this).val(function(i, oldValue) {
                return  Math.floor(oldValue)
            }) 
        }
        const itemNameToUpdate = $(this).parent().siblings('.cart-product-name').text() 
        const item = cartItems.find(item => item.name === itemNameToUpdate)
        item.quantity = $(this).val() 
        save()
        updatePrice()
    })

    function clearPrice(price){
        return parseFloat(price.replace('$', ''))
    }

    function crteateElements(price, product, imgSrc, quantity){
        if($('.price-total').text()==='$0'){
            $('.cart-products').empty()
        }
        //create container div
        let productDiv = $('<div></div>').addClass('cart-product')
        //create elements
        let img = $('<img>').attr('src', imgSrc)
        let nameDiv = $('<div></div>').addClass('cart-product-name').text(product)
        let priceDiv = $('<div></div>').addClass('cart-product-price').text('$' + price)
        //append elements
        productDiv.append(img, nameDiv, priceDiv)
        productDiv.append(`<div class="cart-product-quantity"><input type="number" value="${quantity}" min="1"><button class="remove-cart-btn">Remove</button></div>`)
        $('.cart-products').append(productDiv)
        updatePrice()
    }

    function isInCart(newProductName){
        let cartItems = document.getElementsByClassName('cart-product-name');
        for(let i=0; i<cartItems.length; i++){
            if(cartItems[i].innerText === newProductName){
                return true
            }
        }
        return false
    }

    function incrementQuantity(productName){
       $(".cart-product-name:contains("+productName+")").siblings('.cart-product-quantity').children('input').val( function(i, oldvalue){
            return ++oldvalue;
       }) 
       updatePrice()
    }
    function updatePrice(){
        let newPrice = 0;
        let cartQuantities = document.querySelectorAll('.cart-product-quantity input');
        let cartPrices = document.querySelectorAll('.cart-product-price');

        for(let i=0; i<cartQuantities.length; i++){
            newPrice += cartQuantities[i].value  * clearPrice(cartPrices[i].textContent)
        }
        
        newPrice = Math.floor(newPrice * 100) /100
        $('.price-total').text('$'+newPrice)  
    }

    function render(){
        $('.cart-products').text('')
        if(cartItems.length === 0) {
            $('.cart-products').text('Your cart is empty.')
            return
        }
        cartItems.forEach(item =>{
            crteateElements(item.price, item.name, item.img, item.quantity)
        })
    }

    function save(){
        localStorage.setItem(LOCAL_STORAGE_SHOP_ITEMS_KEYS, JSON.stringify(cartItems))
    }

    function createElementObject(price, name, imgSrc, quantity){
        return {name: name, price: price,  img: imgSrc, quantity: quantity}
    }

    render() 
})