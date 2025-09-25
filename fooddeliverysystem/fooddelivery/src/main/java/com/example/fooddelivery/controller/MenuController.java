package com.example.fooddelivery.controller;

import com.example.fooddelivery.model.Menu;
import com.example.fooddelivery.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/menus")
@CrossOrigin(origins = "*")
public class MenuController {

    @Autowired
    private MenuRepository menuRepository;

    @GetMapping
    public ResponseEntity<List<Menu>> getAllMenus() {
        try {
            List<Menu> menus = menuRepository.findAll();
            return ResponseEntity.ok(menus);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> addMenu(@RequestBody Menu menu) {
        Map<String, Object> response = new HashMap<>();
        try {
            Menu savedMenu = menuRepository.save(menu);
            response.put("success", true);
            response.put("menu", savedMenu);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> updateMenu(@PathVariable Long id, @RequestBody Menu menu) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<Menu> existingMenu = menuRepository.findById(id);
            if (existingMenu.isPresent()) {
                Menu menuToUpdate = existingMenu.get();
                menuToUpdate.setName(menu.getName());
                menuToUpdate.setDescription(menu.getDescription());
                menuToUpdate.setPrice(menu.getPrice());
                menuToUpdate.setCategory(menu.getCategory());
                Menu updatedMenu = menuRepository.save(menuToUpdate);
                response.put("success", true);
                response.put("menu", updatedMenu);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Menu not found");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> deleteMenu(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (menuRepository.existsById(id)) {
                menuRepository.deleteById(id);
                response.put("success", true);
                response.put("message", "Menu deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Menu not found");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}