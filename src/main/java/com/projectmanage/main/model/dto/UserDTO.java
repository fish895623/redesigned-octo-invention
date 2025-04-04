package com.projectmanage.main.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data Transfer Object for User information Used for transferring user data across application
 * layers and in JWT authentication processes
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
public class UserDTO {

  private Long id;
  private String username;
  private String email;
  private String name;
  private String password;
  private String picture;
  private List<String> roles;

  // Additional fields for JWT authentication
  private String token;
  private boolean authenticated;

  /**
   * Returns whether the user has admin privileges
   *
   * @return true if user has admin role
   */
  public boolean isAdmin() {
    return roles != null && roles.contains("ROLE_ADMIN");
  }

  /**
   * Returns whether the user has the specified role
   *
   * @param role the role to check
   * @return true if user has the specified role
   */
  public boolean hasRole(String role) {
    return roles != null && roles.contains(role);
  }
}
