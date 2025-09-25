package com.example.fooddelivery.controller;

import com.example.fooddelivery.model.Address;
import com.example.fooddelivery.model.User;
import com.example.fooddelivery.payload.AddressRequest;
import com.example.fooddelivery.repository.AddressRepository;
import com.example.fooddelivery.repository.UserRepository;
import com.example.fooddelivery.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin(origins = "*")
public class AddressController {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<?> getAddresses(@RequestHeader("Authorization") String token) {
        try {
            String phone = jwtUtil.extractPhone(token.replace("Bearer ", ""));
            Optional<User> userOptional = userRepository.findByPhone(phone);

            if (userOptional.isPresent()) {
                List<Address> addresses = addressRepository.findByUser(userOptional.get());
                return ResponseEntity.ok(addresses);
            }
            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid token");
        }
    }

    @PostMapping
    public ResponseEntity<?> addAddress(
            @RequestHeader("Authorization") String token,
            @RequestBody AddressRequest request) {

        try {
            String phone = jwtUtil.extractPhone(token.replace("Bearer ", ""));
            Optional<User> userOptional = userRepository.findByPhone(phone);

            if (userOptional.isPresent()) {
                Address address = new Address();
                address.setAddressLine1(request.getAddressLine1());
                address.setAddressLine2(request.getAddressLine2());
                address.setCity(request.getCity());
                address.setState(request.getState());
                address.setPincode(request.getPincode());
                address.setLandmark(request.getLandmark());
                address.setAddressType(request.getAddressType());
                address.setDefaultAddress(request.isDefaultAddress());
                address.setUser(userOptional.get());

                Address savedAddress = addressRepository.save(address);
                return ResponseEntity.ok(savedAddress);
            }
            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error adding address");
        }
    }
}