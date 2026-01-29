package com.supermarket.backend.model;

import lombok.*;
import java.math.BigDecimal;

@Data @AllArgsConstructor @NoArgsConstructor
public class DashboardStats {
    private long totalProducts;
    private long lowStockCount;
    private BigDecimal totalRevenue;
    private BigDecimal totalProfit;
    private long todaySalesCount;
}