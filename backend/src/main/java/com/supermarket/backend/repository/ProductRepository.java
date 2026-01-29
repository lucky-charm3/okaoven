package com.supermarket.backend.repository;

import com.supermarket.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Change this to return Product directly, OR keep Optional and fix the service.
    // To fix your error immediately, let's use the direct Product return:
    Product findByBarcode(String barcode);
    Product findByName(String name);
}