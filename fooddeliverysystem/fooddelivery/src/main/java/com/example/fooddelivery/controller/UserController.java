package com.example.fooddelivery.controller;

import com.example.fooddelivery.model.Menu;
import com.example.fooddelivery.model.Order;
import com.example.fooddelivery.payload.CheckoutRequest;
import com.example.fooddelivery.repository.MenuRepository;
import com.example.fooddelivery.repository.OrderRepository;
import com.example.fooddelivery.repository.CartItemRepository;
import com.example.fooddelivery.repository.UserRepository;
import com.example.fooddelivery.model.CartItem;
import com.example.fooddelivery.model.OrderItem;
import com.example.fooddelivery.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('USER') or hasRole('CUSTOMER')")
public class UserController {

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/food")
    public ResponseEntity<List<Menu>> getAllFood() {
        try {
            List<Menu> menus = menuRepository.findAll();
            return ResponseEntity.ok(menus);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/order")
    public ResponseEntity<Map<String, Object>> placeOrder(@RequestBody CheckoutRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<CartItem> cartItems = cartItemRepository.findByCustomerId(request.getCustomerId());
            
            if (cartItems.isEmpty()) {
                response.put("success", false);
                response.put("message", "Cart is empty");
                return ResponseEntity.badRequest().body(response);
            }

            double total = cartItems.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();

            Order order = new Order();
            order.setCustomerId(request.getCustomerId());
            order.setTotal(total);
            order.setStatus("PLACED");
            order.setCreatedAt(LocalDateTime.now());

            Order savedOrder = orderRepository.save(order);
            cartItemRepository.deleteByCustomerId(request.getCustomerId());

            response.put("success", true);
            response.put("order", savedOrder);
            response.put("message", "Order placed successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to place order: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/orders/{customerId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long customerId) {
        try {
            List<Order> orders = orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}