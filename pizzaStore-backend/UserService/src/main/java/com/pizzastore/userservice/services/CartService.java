package com.pizzastore.userservice.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pizzastore.userservice.entity.Cart;
import com.pizzastore.userservice.entity.MenuItem;
import com.pizzastore.userservice.repository.CartRepository;
import com.pizzastore.userservice.repository.MenuItemRepository;

@Service
public class CartService {
	@Autowired
    private CartRepository cartRepository;
	@Autowired
	private MenuItemRepository menuItemRepository;

	public Cart addCartItem(Cart cart) {
	    // Fetch full menu item from DB before saving
	    MenuItem menuItem = menuItemRepository.findById(cart.getMenuItem().getId())
	            .orElseThrow(() -> new RuntimeException("Menu item not found!"));
	    
	    cart.setMenuItem(menuItem);
	    cart.setPrice(menuItem.getPrice());
	    return cartRepository.save(cart);
	}

    // Get all items for a user
    public List<Cart> getCartByUserId(int userId) {
        return cartRepository.findByUserId(userId);
    }

    // Remove an item from cart
    public void removeCartItem(int cartId) {
        cartRepository.deleteById(cartId);
    }

    // Clear all items for a user
    public void clearCartByUserId(int userId) {
        List<Cart> cartItems = cartRepository.findByUserId(userId);
        cartRepository.deleteAll(cartItems);
    }
 // Update quantity of an existing cart item
    public Cart updateCartItemQuantity(int cartId, int newQuantity) {
        Cart cart = cartRepository.findById(cartId)
            .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + cartId));
        cart.setQuantity(newQuantity);
        return cartRepository.save(cart);
    }
}
