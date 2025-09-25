package com.example.fooddelivery.controller;

import com.example.fooddelivery.model.*;
import com.example.fooddelivery.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private MenuRepository menuRepository;

    @PostMapping("/place")
    public ResponseEntity<Map<String, Object>> placeOrder(@RequestBody Map<String, Long> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            Long customerId = request.get("customerId");
            List<CartItem> cartItems = cartItemRepository.findByCustomerId(customerId);
            
            if (cartItems.isEmpty()) {
                response.put("success", false);
                response.put("message", "Cart is empty");
                return ResponseEntity.badRequest().body(response);
            }

            // Calculate total
            double total = cartItems.stream()
                .mapToDouble(item -> item.getMenu().getPrice() * item.getQuantity())
                .sum();

            // Create order
            Order order = new Order();
            order.setCustomerId(customerId);
            order.setTotal(total);
            order.setStatus("PLACED");
            
            Order savedOrder = orderRepository.save(order);

            // Clear cart
            cartItemRepository.deleteAll(cartItems);

            response.put("success", true);
            response.put("orderId", savedOrder.getId());
            response.put("message", "Order placed successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to place order: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Order>> getCustomerOrders(@PathVariable Long customerId) {
        try {
            List<Order> orders = orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}