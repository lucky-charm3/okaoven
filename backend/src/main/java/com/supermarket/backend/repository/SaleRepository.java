package com.supermarket.backend.repository;

import com.supermarket.backend.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    @Query("SELECT COALESCE(SUM(s.totalAmount), 0) FROM Sale s")
    BigDecimal getTotalRevenue();

    @Query("SELECT COALESCE(SUM(s.totalProfit), 0) FROM Sale s")
    BigDecimal getTotalProfit();

    @Query("SELECT COUNT(s) FROM Sale s WHERE s.timestamp >= CURRENT_DATE")
    long countTodaySales();

    List<Sale> findAllByOrderByTimestampDesc();
}