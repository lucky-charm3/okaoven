package com.supermarket.backend.controller;

import com.supermarket.backend.model.Sale;
import com.supermarket.backend.repository.SaleRepository;
import com.supermarket.backend.service.SaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class SaleController {

    private final SaleService saleService;
    private final SaleRepository saleRepository;

    @PostMapping("/process")
    public Sale process(@RequestBody Sale sale) {
        return saleService.processSale(sale);
    }

    @GetMapping("/report")
    public Map<String, Object> getFullReport() {
        Map<String, Object> report = new HashMap<>();

        List<Sale> allSales = saleRepository.findAllByOrderByTimestampDesc();

        BigDecimal totalRevenue = allSales.stream()
                .map(Sale::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalProfit = allSales.stream()
                .map(Sale::getTotalProfit)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        report.put("sales", allSales);
        report.put("totalRevenue", totalRevenue);
        report.put("totalProfit", totalProfit);
        report.put("transactionCount", allSales.size());

        return report;
    }
}