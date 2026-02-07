package com.supermarket.backend.controller;

import com.supermarket.backend.model.Product;
import com.supermarket.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;

    @GetMapping
    public List<Product> getAll() {
        return productRepository.findAll();
    }

    @PostMapping
    public Product add(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @GetMapping("/barcode/{code}")
    public Product getByBarcode(@PathVariable String code) {
        return productRepository
                .findByBarcode(code)
                .orElseThrow(() -> new RuntimeException("Product not found with barcode: " + code));
    }


    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        productRepository.deleteById(id);
    }
}