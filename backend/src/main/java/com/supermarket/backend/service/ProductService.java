package com.supermarket.backend.service;

import com.supermarket.backend.model.Product;
import com.supermarket.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

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
        // HAPA PIA: Tunatumia .orElseThrow() ili kupata Product badala ya Optional
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bidhaa yenye ID " + id + " haipo."));

        p.setStockQuantity(p.getStockQuantity() + quantity);
        return productRepository.save(p);
    }
}