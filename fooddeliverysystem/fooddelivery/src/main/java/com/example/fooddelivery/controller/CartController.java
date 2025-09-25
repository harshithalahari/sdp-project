package com.example.fooddelivery.controller;

import com.example.fooddelivery.model.CartItem;
import com.example.fooddelivery.model.Menu;
import com.example.fooddelivery.payload.AddToCartRequest;
import com.example.fooddelivery.repository.CartItemRepository;
import com.example.fooddelivery.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private MenuRepository menuRepository;

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addToCart(@RequestBody AddToCartRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<Menu> menuOpt = menuRepository.findById(request.getMenuId());
            if (menuOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "Menu item not found");
                return ResponseEntity.badRequest().body(response);
            }

            // Check if item already exists in cart
            List<CartItem> existingItems = cartItemRepository.findByCustomerId(request.getCustomerId());
            Optional<CartItem> existingItem = existingItems.stream()
                .filter(item -> item.getMenu().getId().equals(request.getMenuId()))
                .findFirst();

            if (existingItem.isPresent()) {
                // Update quantity
                CartItem item = existingItem.get();
                item.setQuantity(item.getQuantity() + request.getQuantity());
                cartItemRepository.save(item);
            } else {
                // Create new cart item
                CartItem cartItem = new CartItem();
                cartItem.setCustomerId(request.getCustomerId());
                cartItem.setMenu(menuOpt.get());
                cartItem.setQuantity(request.getQuantity());
                cartItemRepository.save(cartItem);
            }

            response.put("success", true);
            response.put("message", "Item added to cart successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to add item to cart: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long customerId) {
        try {
            List<CartItem> cartItems = cartItemRepository.findByCustomerId(customerId);
            return ResponseEntity.ok(cartItems);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<Map<String, Object>> updateQuantity(@PathVariable Long itemId, @RequestBody Map<String, Integer> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<CartItem> cartItemOpt = cartItemRepository.findById(itemId);
            if (cartItemOpt.isPresent()) {
                CartItem cartItem = cartItemOpt.get();
                cartItem.setQuantity(request.get("quantity"));
                cartItemRepository.save(cartItem);
                response.put("success", true);
                response.put("message", "Quantity updated successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Cart item not found");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to update quantity: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Map<String, Object>> removeFromCart(@PathVariable Long itemId) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (cartItemRepository.existsById(itemId)) {
                cartItemRepository.deleteById(itemId);
                response.put("success", true);
                response.put("message", "Item removed from cart");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Cart item not found");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to remove item: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}