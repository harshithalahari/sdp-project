package com.example.fooddelivery.repository;

import com.example.fooddelivery.model.Address;
import com.example.fooddelivery.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUser(User user);
    List<Address> findByUserAndDefaultAddressTrue(User user);
}