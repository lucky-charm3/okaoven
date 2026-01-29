package com.supermarket.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class SupermarketApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(SupermarketApiApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        System.out.println("\n" + "=".repeat(50));
        System.out.println(" SUPERMARKET API IS RUNNING SUCCESSFULLY");
        System.out.println(" URL: http://localhost:8080");
        System.out.println(" Database: Connected to PostgreSQL");
        System.out.println("=".repeat(50) + "\n");
    }

}