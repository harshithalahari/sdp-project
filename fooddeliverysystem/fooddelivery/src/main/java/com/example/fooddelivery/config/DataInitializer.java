package com.example.fooddelivery.config;

import com.example.fooddelivery.model.Menu;
import com.example.fooddelivery.model.User;
import com.example.fooddelivery.repository.MenuRepository;
import com.example.fooddelivery.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            // Create admin user if not exists
            if (!userRepository.existsByPhone("1234567890")) {
                User admin = new User();
                admin.setPhone("1234567890");
                admin.setName("Admin User");
                admin.setEmail("admin@fooddelivery.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ADMIN");
                admin.setProfileComplete(true);
                admin.setVerified(true);
                userRepository.save(admin);
            }

            // Create sample customer if not exists
            if (!userRepository.existsByPhone("9876543210")) {
                User customer = new User();
                customer.setPhone("9876543210");
                customer.setName("John Doe");
                customer.setEmail("john@example.com");
                customer.setPassword(passwordEncoder.encode("customer123"));
                customer.setRole("CUSTOMER");
                customer.setProfileComplete(true);
                customer.setVerified(true);
                userRepository.save(customer);
            }

            // Create sample menu items if not exists
            if (menuRepository.count() == 0) {
                Menu[] sampleMenus = {
                    createMenu("Margherita Pizza", "Classic pizza with tomato sauce, mozzarella, and basil", 12.99, "Main Course"),
                    createMenu("Chicken Burger", "Grilled chicken breast with lettuce, tomato, and mayo", 8.99, "Main Course"),
                    createMenu("Caesar Salad", "Fresh romaine lettuce with caesar dressing and croutons", 6.99, "Salads"),
                    createMenu("Chocolate Cake", "Rich chocolate cake with chocolate frosting", 4.99, "Desserts"),
                    createMenu("Coca Cola", "Refreshing soft drink", 1.99, "Beverages"),
                    createMenu("Pasta Carbonara", "Creamy pasta with bacon and parmesan cheese", 10.99, "Main Course")
                };

                for (Menu menu : sampleMenus) {
                    menuRepository.save(menu);
                }
            }
        } catch (Exception e) {
            System.err.println("Error initializing data: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private Menu createMenu(String name, String description, double price, String category) {
        Menu menu = new Menu();
        menu.setName(name);
        menu.setDescription(description);
        menu.setPrice(price);
        menu.setCategory(category);
        return menu;
    }
}