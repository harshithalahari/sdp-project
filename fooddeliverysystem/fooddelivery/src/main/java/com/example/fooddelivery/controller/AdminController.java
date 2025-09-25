package com.example.fooddelivery.controller;

import com.example.fooddelivery.model.Menu;
import com.example.fooddelivery.model.Order;
import com.example.fooddelivery.repository.MenuRepository;
import com.example.fooddelivery.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/food")
    public ResponseEntity<Map<String, Object>> addFood(@RequestBody Menu menu) {
        Map<String, Object> response = new HashMap<>();
        try {
            Menu savedMenu = menuRepository.save(menu);
            response.put("success", true);
            response.put("menu", savedMenu);
            response.put("message", "Food item added successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to add food item: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/food/{id}")
    public ResponseEntity<Map<String, Object>> updateFood(@PathVariable Long id, @RequestBody Menu menu) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<Menu> existingMenu = menuRepository.findById(id);
            if (existingMenu.isEmpty()) {
                response.put("success", false);
                response.put("message", "Food item not found");
                return ResponseEntity.badRequest().body(response);
            }

            Menu menuToUpdate = existingMenu.get();
            menuToUpdate.setName(menu.getName());
            menuToUpdate.setDescription(menu.getDescription());
            menuToUpdate.setPrice(menu.getPrice());
            menuToUpdate.setCategory(menu.getCategory());

            Menu updatedMenu = menuRepository.save(menuToUpdate);
            response.put("success", true);
            response.put("menu", updatedMenu);
            response.put("message", "Food item updated successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to update food item: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/food/{id}")
    public ResponseEntity<Map<String, Object>> deleteFood(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (!menuRepository.existsById(id)) {
                response.put("success", false);
                response.put("message", "Food item not found");
                return ResponseEntity.badRequest().body(response);
            }

            menuRepository.deleteById(id);
            response.put("success", true);
            response.put("message", "Food item deleted successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to delete food item: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        try {
            List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/orders/{id}")
    public ResponseEntity<Map<String, Object>> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<Order> orderOpt = orderRepository.findById(id);
            if (orderOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "Order not found");
                return ResponseEntity.badRequest().body(response);
            }

            Order order = orderOpt.get();
            order.setStatus(request.get("status"));
            Order updatedOrder = orderRepository.save(order);

            response.put("success", true);
            response.put("order", updatedOrder);
            response.put("message", "Order status updated successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to update order status: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}