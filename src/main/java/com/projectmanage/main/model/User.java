package com.projectmanage.main.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    private String name;
    
    private String picture;

    private String role;
    
    private String username;
    
    private String password;
    
    @Column(unique = true)
    private String providerId;
    
    @Enumerated(EnumType.STRING)
    private Provider provider;
    
    public enum Provider {
        EMAIL, GOOGLE
    }
}
