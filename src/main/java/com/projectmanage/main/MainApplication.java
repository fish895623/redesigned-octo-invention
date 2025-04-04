package com.projectmanage.main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public final class MainApplication {
  private MainApplication() {}

  public static void main(String[] args) {
    SpringApplication.run(MainApplication.class, args);
  }
}
