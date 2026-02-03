package com.supermarket.backend.repository;

import com.supermarket.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Tunatumia Optional hapa kwa ajili ya usalama
    Optional<Product> findByBarcode(String barcode);

    // Tunatumia Optional hapa pia
    Optional<Product> findByName(String name);

    long countByStockQuantityLessThan(int threshold);
}