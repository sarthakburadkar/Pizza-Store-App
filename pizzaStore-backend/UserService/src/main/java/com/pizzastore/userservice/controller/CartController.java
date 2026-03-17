package com.pizzastore.userservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pizzastore.userservice.entity.Cart;
import com.pizzastore.userservice.services.CartService;

@RestController
@RequestMapping("/user/cart")
public class CartController {
	@Autowired
	CartService cartService;
	
	//ADD item to cart
    
    @PostMapping
    public ResponseEntity<Cart> addToCart(@RequestBody Cart cart) {
        Cart saved = cartService.addCartItem(cart);
        return ResponseEntity.ok(saved);
    }

    // GET all cart items for a user
 
    @GetMapping("/{userId}")
    public ResponseEntity<List<Cart>> getCart(@PathVariable int userId) {
        List<Cart> cartItems = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cartItems);
    }

    // UPDATE quantity of a specific cart item
    
    @PutMapping("/{cartId}")
    public ResponseEntity<Cart> updateQuantity(
            @PathVariable int cartId,
            @RequestBody Cart cartRequest) {
        Cart updated = cartService.updateCartItemQuantity(
            cartId, 
            cartRequest.getQuantity()
        );
        return ResponseEntity.ok(updated);
    }

    // REMOVE a single item from cart
   
    @DeleteMapping("/{cartId}")
    public ResponseEntity<String> removeFromCart(@PathVariable int cartId) {
        cartService.removeCartItem(cartId);
        return ResponseEntity.ok("Item removed from cart");
    }

    //  CLEAR entire cart for a user
    
    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<String> clearCart(@PathVariable int userId) {
        cartService.clearCartByUserId(userId);
        return ResponseEntity.ok("Cart cleared");
    }

}
