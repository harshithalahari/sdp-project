package com.example.fooddelivery.repository;

import com.example.fooddelivery.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCustomerId(Long customerId);
    
    @Transactional
    void deleteByCustomerId(Long customerId);
    
    @Transactional
    void deleteByCustomerIdAndId(Long customerId, Long id);
    
    @Transactional
    void deleteByCustomerIdAndMenu_Id(Long customerId, Long menuId);
}