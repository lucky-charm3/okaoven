package com.supermarket.backend.controller;

import com.supermarket.backend.model.DashboardStats;
import com.supermarket.backend.repository.ProductRepository;
import com.supermarket.backend.repository.SaleRepository;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final ProductRepository productRepository;
    private final SaleRepository saleRepository;

    public DashboardController(ProductRepository productRepository, SaleRepository saleRepository) {
        this.productRepository = productRepository;
        this.saleRepository = saleRepository;
    }

    @GetMapping("/stats")
    public DashboardStats getStats() {
        long totalProducts = productRepository.count();

        long lowStock = productRepository.countByStockQuantityLessThan(10);

        BigDecimal revenue = saleRepository.getTotalRevenue();
        BigDecimal profit = saleRepository.getTotalProfit();

        long todaySales = saleRepository.countTodaySales();

        return new DashboardStats(
                totalProducts,
                lowStock,
                revenue != null ? revenue : BigDecimal.ZERO,
                profit != null ? profit : BigDecimal.ZERO,
                todaySales
        );
    }
}