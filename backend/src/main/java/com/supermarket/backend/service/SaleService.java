package com.supermarket.backend.service;

import com.supermarket.backend.model.*;
import com.supermarket.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SaleService {
    private final ProductRepository productRepository;
    private final SaleRepository saleRepository;

    @Transactional
    public Sale processSale(Sale sale) {
        BigDecimal totalProfit = BigDecimal.ZERO;

        // Explicitly link items and calculate profit
        for (SaleItem item : sale.getItems()) {
            Product product = productRepository.findByName(item.getProductName());
            if (product == null) throw new RuntimeException("Product not found: " + item.getProductName());

            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            productRepository.save(product);

            BigDecimal profitPerItem = product.getSellingPrice().subtract(product.getPurchasePrice());
            totalProfit = totalProfit.add(profitPerItem.multiply(BigDecimal.valueOf(item.getQuantity())));

            // CRITICAL: Linking back to the parent sale
            item.setSale(sale);
        }

        sale.setTotalProfit(totalProfit);
        sale.setTimestamp(LocalDateTime.now());
        return saleRepository.save(sale);
    }
}