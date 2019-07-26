 /*
 * jQuery Simple Shopping Cart v0.1
 * Basis shopping cart using javascript/Jquery.
 *
 * Authour : Sirisha
 */


/* '(function(){})();' this function is used, to make all variables of the plugin Private */


(function ($, window, document, undefined) {

    /* Default Options */
    var defaults = {
        cart: [],
        addtoCartClass: '.sc-add-to-cart',
        cartProductListClass: '.cart-products-list',
        totalCartCountClass: '.total-cart-count',
        totalCartCostClass: '.total-cart-cost',
        showcartID : '#show-cart',
        itemCountClass : '.item-count'
    };
    /*function submitcart(){
      $(this.options.totalCartCountClass).html("Your Cart has 666666666666" + mi._totalCartCount() + " items");
    }*/

    function Item(name, count) {
        this.name = name;
        this.count = count;
    }
    /*Constructor function*/
    function simpleCart(domEle, options) {

        /* Merge user settings with default, recursively */
        this.options = $.extend(true, {}, defaults, options);
        //Cart array
        this.cart = [];
        //Dom Element
        this.cart_ele = $(domEle);
        //Initial init function
        this.init();
    }
  /*  function closeWin() {
      window.close();
    }*/


    /*plugin functions */
    $.extend(simpleCart.prototype, {
        init: function () {
            this._setupCart();
            this._setEvents();
            this._loadCart();
            this._updateCartDetails();
        },
        _setupCart: function () {
            this.cart_ele.addClass("cart-grid panel panel-defaults");
            this.cart_ele.append("<div class='panel-heading cart-heading'><div class='total-cart-count'>Your Cart has 0 items</div><div class='spacer'></div></div>")
            this.cart_ele.append("<div class='panel-body cart-body'><div class='cart-products-list' id='show-cart'><!-- Dynamic Code from Script comes here--></div></div>")

            this.cart_ele.append("<script> function goback(){ sessionStorage.setItem('cart','full'); window.history.go(-1); } </script>");
            this.cart_ele.append("<div class='cart-summary-container'>\n\
                                <div class='cart-offer'></div>\n\
                                        <div class='cart-total-amount'>\n\
                                            <div>Total</div>\n\
                                            <div class='spacer'></div>\n\
                                            </div>\n\
                                            <div class='cart-checkout'>\n\
                                                <button type='submit' class='btn btn-primary' onclick= goback() > Submit</button>\n\
                                            </div>\n\
                                 </div>");

        },


        _addProductstoCart: function () {
        },
        _updateCartDetails: function () {
            var mi = this;
            $(this.options.cartProductListClass).html(mi._displayCart());
            $(this.options.totalCartCountClass).html("Your Cart has" + mi._totalCartCount() + " items");
          //  $(this.options.totalCartCostClass).html(mi._totalCartCost());
        },
        _setCartbuttons: function () {
            //  window.close();
        },

        _setEvents: function () {
            var mi = this;
            $(this.options.addtoCartClass).on("click", function (e) {
                e.preventDefault();
                var name = $(this).attr("data-name");
                mi._addItemToCart(name, 1);
                mi._updateCartDetails();
            });

            $(this.options.showcartID).on("change", this.options.itemCountClass, function (e) {

                var ci = this;
                e.preventDefault();
                var count = $(this).val();
                var name = $(this).attr("data-name");
                mi._removeItemfromCart(name, count);
                mi._updateCartDetails();
    } );

        },
        /* Helper Functions */
        _addItemToCart: function (name, count) {
            for (var i in this.cart) {
                if (this.cart[i].name === name) {
                    this.cart[i].count++;

                    this._saveCart();
                    return;
                }
            }
            var item = new Item(name, count);
            this.cart.push(item);
            this._saveCart();
        },
        _removeItemfromCart: function (name, count) {
            for (var i in this.cart) {
                if (this.cart[i].name === name) {

                    this.cart[i].count = count;

                    if (count == 0) {
                        this.cart.splice(i, 1);
                    }
                    break;
                }
            }
            this._saveCart();
        },
        _clearCart: function () {
            this.cart = [];
            this._saveCart();
        },
        _totalCartCount: function () {
            return this.cart.length;
        },
        _displayCart: function () {
            var cartArray = this._listCart();
            console.log(cartArray);
            var output = "";
            if (cartArray.length <= 0) {
                output = "<h4>Your cart is empty</h4>";
            }
            for (var i in cartArray) {
                output += "<div class = 'cart-each-product'>\n\
                       <div class='name'>" + cartArray[i].name + "</div>\n\
                       <div class='quantityContainer'>\n\
                            <input type='number' class='quantity form-control item-count' data-name='" + cartArray[i].name  + "' min='0' value=" + cartArray[i].count + " name='number'>\n\
                       </div>\n\</div>";
            }
            return output;
        },
        /*_totalCartCost: function () {
            var totalCost = 0;
            for (var i in this.cart) {
                totalCost += this.cart[i].price;
            }
            return totalCost;
        },*/
        _listCart: function () {
            var cartCopy = [];
            for (var i in this.cart) {
                var item = this.cart[i];
                var itemCopy = {};
                for (var p in item) {
                    itemCopy[p] = item[p];
                }
                cartCopy.push(itemCopy);
            }
            return cartCopy;
        },
        _calGST: function () {
            var GSTPercent = 18;
            var totalcost = this.totalCartCost();
            var calGST = Number((totalcost * GSTPercent) / 100);
            return calGST;
        },
        _saveCart: function () {
            sessionStorage.setItem("shoppingCart", JSON.stringify(this.cart));
        },
        _loadCart: function () {
            this.cart = JSON.parse(sessionStorage.getItem("shoppingCart"));
            if (this.cart === null) {
                this.cart = [];
            }
        }
    });
    /* Defining the Structure of the plugin 'simpleCart'*/
    $.fn.simpleCart = function (options) {
        return this.each(function () {
            $.data(this, "simpleCart", new simpleCart(this));
            console.log($(this, "simpleCart"));
        } );
    }

    ;})(jQuery, window, document);
