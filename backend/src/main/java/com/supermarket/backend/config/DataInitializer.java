package com.supermarket.backend.config;

import com.supermarket.backend.model.*;
import com.supermarket.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final SaleRepository saleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, ProductRepository productRepository,
                           SaleRepository saleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.saleRepository = saleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            System.out.println("🌱 SEEDING PRODUCTION DATA...");

            // 1. Seed Users
            User admin = new User(null, "admin", passwordEncoder.encode("password123"), "System Admin", "admin@okaoven.com", "0711", Role.MANAGER);
            User cashier = new User(null, "cashier1", passwordEncoder.encode("password123"), "Jane Sarah", "jane@okaoven.com", "0722", Role.CASHIER);
            User stock = new User(null, "stock1", passwordEncoder.encode("password123"), "Bakari Juma", "bakari@okaoven.com", "0733", Role.INVENTOROR);
            userRepository.saveAll(List.of(admin, cashier, stock));

            // 2. Seed Products
            Product p1 = new Product(null, "Fresh Milk 1L", "6001", new BigDecimal("1.50"), new BigDecimal("2.50"), 50, "Dairy");
            Product p2 = new Product(null, "White Bread", "6002", new BigDecimal("0.80"), new BigDecimal("1.20"), 30, "Bakery");
            Product p3 = new Product(null, "Chocolate Cake", "6003", new BigDecimal("5.00"), new BigDecimal("12.00"), 10, "Pastry");
            productRepository.saveAll(List.of(p1, p2, p3));

            // 3. Seed Sample Sale
            Sale sale = new Sale(null, new BigDecimal("14.50"), new BigDecimal("8.00"), LocalDateTime.now(), null);
            SaleItem item = new SaleItem(null, "Chocolate Cake", 1, new BigDecimal("12.00"), sale);
            sale.setItems(List.of(item));
            saleRepository.save(sale);

            System.out.println("✅ SEEDING COMPLETE. Login with 'password123'");
        }
    }
}