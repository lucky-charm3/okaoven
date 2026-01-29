package com.supermarket.backend.service;

import com.supermarket.backend.model.Product;
import com.supermarket.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public Product updateStock(Long id, Integer quantity) {
        Product p = productRepository.findById(id).orElseThrow();
        p.setStockQuantity(p.getStockQuantity() + quantity);
        return productRepository.save(p);
    }
}