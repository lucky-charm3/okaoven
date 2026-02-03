package com.supermarket.backend.config;

import com.supermarket.backend.model.*;
import com.supermarket.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final SaleRepository saleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           ProductRepository productRepository,
                           SaleRepository saleRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.saleRepository = saleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Step 1: Check if the database is empty before seeding
        if (userRepository.count() == 0) {
            System.out.println("🌱 SEEDING PRODUCTION GRADE DATA...");

            // --- SEED USERS ---
            // Password for all is 'password123'
            String encodedPass = passwordEncoder.encode("password123");

            User admin = new User(null, "admin", encodedPass, "System Manager", "manager@okaoven.com", "0711000111", Role.MANAGER);
            User cashier = new User(null, "cashier1", encodedPass, "Jane Sarah", "jane@okaoven.com", "0722000222", Role.CASHIER);
            User inventoror = new User(null, "stock1", encodedPass, "Bakari Juma", "bakari@okaoven.com", "0733000333", Role.INVENTOROR);

            userRepository.saveAll(List.of(admin, cashier, inventoror));

            // --- SEED PRODUCTS ---
            Product p1 = new Product(null, "Fresh Milk 1L", "600123", new BigDecimal("1500"), new BigDecimal("2500"), 50, "Dairy");
            Product p2 = new Product(null, "White Bread", "600124", new BigDecimal("800"), new BigDecimal("1200"), 30, "Bakery");
            Product p3 = new Product(null, "Chocolate Cake", "600125", new BigDecimal("15000"), new BigDecimal("25000"), 10, "Pastry");
            Product p4 = new Product(null, "Apple Juice", "600126", new BigDecimal("1200"), new BigDecimal("2000"), 25, "Beverages");
            Product p5 = new Product(null, "Wheat Flour 2kg", "600127", new BigDecimal("1800"), new BigDecimal("2800"), 40, "Dry Goods");

            productRepository.saveAll(List.of(p1, p2, p3, p4, p5));

            // --- SEED SALES (Historical & Today) ---

            // Sale 1: Today
            Sale s1 = new Sale();
            s1.setTotalAmount(new BigDecimal("5000")); // 2 Milk
            s1.setTotalProfit(new BigDecimal("2000"));
            s1.setTimestamp(LocalDateTime.now());

            SaleItem si1 = new SaleItem(null, "Fresh Milk 1L", 2, new BigDecimal("2500"), s1);
            s1.setItems(List.of(si1));

            // Sale 2: Today
            Sale s2 = new Sale();
            s2.setTotalAmount(new BigDecimal("26200")); // 1 Cake + 1 Bread
            s2.setTotalProfit(new BigDecimal("10400"));
            s2.setTimestamp(LocalDateTime.now());

            SaleItem si2 = new SaleItem(null, "Chocolate Cake", 1, new BigDecimal("25000"), s2);
            SaleItem si3 = new SaleItem(null, "White Bread", 1, new BigDecimal("1200"), s2);
            s2.setItems(List.of(si2, si3));

            // Sale 3: Earlier Today
            Sale s3 = new Sale();
            s3.setTotalAmount(new BigDecimal("5600")); // 2 Flour
            s3.setTotalProfit(new BigDecimal("2000"));
            s3.setTimestamp(LocalDateTime.now().minusHours(2));

            SaleItem si4 = new SaleItem(null, "Wheat Flour 2kg", 2, new BigDecimal("2800"), s3);
            s3.setItems(List.of(si4));

            saleRepository.saveAll(List.of(s1, s2, s3));

            System.out.println("✅ DATABASE BOOTSTRAP COMPLETE");
            System.out.println("   - 3 Users Created (admin, cashier1, stock1)");
            System.out.println("   - 5 Products Initialized");
            System.out.println("   - Today's Stats are now LIVE in the Dashboard");
        } else {
            System.out.println("ℹ️ DATABASE ALREADY CONTAINS DATA. SKIPPING SEEDING.");
        }
    }
}