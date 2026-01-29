package com.supermarket.backend.repository;

import com.supermarket.backend.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    // Sorts sales so the newest ones appear at the top of your reports
    List<Sale> findAllByOrderByTimestampDesc();
}