package com.supermarket.backend.controller;

import com.supermarket.backend.model.DashboardStats;
import com.supermarket.backend.repository.ProductRepository;
import com.supermarket.backend.repository.SaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final ProductRepository productRepository;
    private final SaleRepository saleRepository;

    @GetMapping("/stats")
    public DashboardStats getStats() {
        long totalProducts = productRepository.count();

        // Count products where stock < 10
        long lowStock = productRepository.findAll().stream()
                .filter(p -> p.getStockQuantity() != null && p.getStockQuantity() < 10)
                .count();

        List<com.supermarket.backend.model.Sale> allSales = saleRepository.findAll();

        BigDecimal revenue = allSales.stream()
                .map(s -> s.getTotalAmount() != null ? s.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal profit = allSales.stream()
                .map(s -> s.getTotalProfit() != null ? s.getTotalProfit() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate how many sales happened today
        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.MIN);
        long todaySales = allSales.stream()
                .filter(s -> s.getTimestamp() != null && s.getTimestamp().isAfter(startOfDay))
                .count();

        return new DashboardStats(totalProducts, lowStock, revenue, profit, todaySales);
    }
}