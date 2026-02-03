package com.supermarket.backend.service;

import com.supermarket.backend.model.*;
import com.supermarket.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class SaleService {
    private final ProductRepository productRepository;
    private final SaleRepository saleRepository;

    public SaleService(ProductRepository productRepository, SaleRepository saleRepository) {
        this.productRepository = productRepository;
        this.saleRepository = saleRepository;
    }

    @Transactional
    public Sale processSale(Sale sale) {
        BigDecimal totalProfit = BigDecimal.ZERO;

        for (SaleItem item : sale.getItems()) {
            // HAPA NDIPO FIX ILIPO: Tunatumia .orElseThrow()
            Product product = productRepository.findByName(item.getProductName())
                    .orElseThrow(() -> new RuntimeException("Bidhaa haijapatikana: " + item.getProductName()));

            // Angalia kama stock inatosha
            if (product.getStockQuantity() < item.getQuantity()) {
                throw new RuntimeException("Stock haitoshi kwa bidhaa: " + product.getName());
            }

            // Punguza stock
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            productRepository.save(product);

            // Piga hesabu ya faida (Selling - Purchase) * Quantity
            BigDecimal profitPerItem = product.getSellingPrice().subtract(product.getPurchasePrice());
            totalProfit = totalProfit.add(profitPerItem.multiply(BigDecimal.valueOf(item.getQuantity())));

            // Unganisha item na sale
            item.setSale(sale);
        }

        sale.setTotalProfit(totalProfit);
        sale.setTimestamp(LocalDateTime.now());
        return saleRepository.save(sale);
    }
}