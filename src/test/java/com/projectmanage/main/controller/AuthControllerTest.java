package com.projectmanage.main.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectmanage.main.dto.CustomUserDetails;
import com.projectmanage.main.jwt.JWTUtil;
import com.projectmanage.main.model.RefreshToken;
import com.projectmanage.main.model.User;
import com.projectmanage.main.model.dto.TokenRefreshRequest;
import com.projectmanage.main.model.dto.UserDTO;
import com.projectmanage.main.service.RefreshTokenService;
import com.projectmanage.main.service.UserService;

/**
 * Tests for the AuthController class.
 * 
 * This class tests authentication-related endpoints including: - User login - User registration -
 * Token refresh - Authentication status checking
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

  private static final String TEST_EMAIL = "test@example.com";
  private static final String TEST_PASSWORD = "password";
  private static final String TEST_NAME = "Test User";
  private static final String TEST_ACCESS_TOKEN = "test-access-token";
  private static final String TEST_REFRESH_TOKEN = "refresh-token";

  @Autowired
  private MockMvc mockMvc;
  @Autowired
  private ObjectMapper objectMapper;
  @Mock
  private UserService userService;
  @Mock
  private JWTUtil jwtUtil;
  @Mock
  private RefreshTokenService refreshTokenService;

  private User testUser;
  private UserDTO testUserDTO;
  private RefreshToken testRefreshToken;
  private CustomUserDetails testUserDetails;

  @BeforeEach
  void setUp() {
    // Initialize test user
    testUser = createTestUser();

    // Initialize user DTO for registration tests
    testUserDTO = createTestUserDTO();

    // Initialize refresh token
    testRefreshToken = createTestRefreshToken();

    // Initialize user details for authentication
    testUserDetails = new CustomUserDetails(testUser);

    // Set up common mock behaviors
    setupMockBehaviors();
  }

  private User createTestUser() {
    User user = new User();
    user.setEmail(TEST_EMAIL);
    user.setName(TEST_NAME);
    user.setPassword(TEST_PASSWORD);
    user.setRole("ROLE_USER");
    user.setUsername(TEST_EMAIL);
    return user;
  }

  private UserDTO createTestUserDTO() {
    UserDTO dto = new UserDTO();
    dto.setEmail(TEST_EMAIL);
    dto.setName(TEST_NAME);
    dto.setPassword(TEST_PASSWORD);
    return dto;
  }

  private RefreshToken createTestRefreshToken() {
    RefreshToken token = new RefreshToken();
    token.setUser(testUser);
    token.setToken(TEST_REFRESH_TOKEN);
    token.setExpiryDate(Instant.now().plusMillis(600000));
    return token;
  }

  private void setupMockBehaviors() {
    when(userService.loadUserByUsername(TEST_EMAIL)).thenReturn(testUserDetails);
    when(jwtUtil.createJwt(anyString(), anyString(), any(Long.class)))
        .thenReturn(TEST_ACCESS_TOKEN);
  }

  @Nested
  @DisplayName("Login Tests")
  class LoginTests {

    @Test
    @DisplayName("Successful login returns authentication response with tokens")
    void successfulLoginReturnsAuthenticationResponse() throws Exception {
      // Arrange
      when(userService.authenticateUser(anyString(), anyString())).thenReturn(testUser);
      when(refreshTokenService.createRefreshToken(anyString())).thenReturn(testRefreshToken);

      Map<String, String> loginRequest = Map.of("email", TEST_EMAIL, "password", TEST_PASSWORD);

      // Act & Assert
      performPostRequest("/api/auth/login", loginRequest).andExpect(status().isOk())
          .andExpect(jsonPath("$.accessToken").value(TEST_ACCESS_TOKEN))
          .andExpect(jsonPath("$.refreshToken").value(testRefreshToken.getToken()))
          .andExpect(jsonPath("$.tokenType").value("Bearer"))
          .andExpect(jsonPath("$.authenticated").value(true))
          .andExpect(jsonPath("$.name").value(testUser.getName()))
          .andExpect(jsonPath("$.email").value(testUser.getEmail()))
          .andExpect(cookie().exists("Authorization"))
          .andExpect(cookie().httpOnly("Authorization", true));
    }
  }

  @Nested
  @DisplayName("Registration Tests")
  class RegistrationTests {

    @Test
    @DisplayName("Successful registration returns created user with tokens")
    void successfulRegistrationReturnsCreatedUser() throws Exception {
      // Arrange
      when(userService.registerUser(any(UserDTO.class))).thenReturn(testUser);
      when(refreshTokenService.createRefreshToken(anyString())).thenReturn(testRefreshToken);

      // Act & Assert
      performPostRequest("/api/auth/register", testUserDTO).andExpect(status().isCreated())
          .andExpect(jsonPath("$.accessToken").value(TEST_ACCESS_TOKEN))
          .andExpect(jsonPath("$.refreshToken").value(testRefreshToken.getToken()))
          .andExpect(jsonPath("$.tokenType").value("Bearer"))
          .andExpect(jsonPath("$.authenticated").value(true))
          .andExpect(jsonPath("$.name").value(testUser.getName()))
          .andExpect(jsonPath("$.email").value(testUser.getEmail()))
          .andExpect(cookie().exists("Authorization"))
          .andExpect(cookie().httpOnly("Authorization", true));
    }
  }

  @Nested
  @DisplayName("Token Refresh Tests")
  class TokenRefreshTests {

    @Test
    @DisplayName("Valid refresh token returns new access token")
    void validRefreshTokenReturnsNewAccessToken() throws Exception {
      // Arrange
      when(refreshTokenService.findByToken(TEST_REFRESH_TOKEN))
          .thenReturn(Optional.of(testRefreshToken));
      when(refreshTokenService.verifyExpiration(testRefreshToken)).thenReturn(testRefreshToken);
      when(jwtUtil.createJwt(anyString(), anyString(), anyLong())).thenReturn("new-access-token");

      TokenRefreshRequest refreshRequest = new TokenRefreshRequest();
      refreshRequest.setRefreshToken(TEST_REFRESH_TOKEN);

      // Act & Assert
      performPostRequest("/api/auth/refresh", refreshRequest).andExpect(status().isOk())
          .andExpect(jsonPath("$.accessToken").value("new-access-token"))
          .andExpect(jsonPath("$.refreshToken").value(TEST_REFRESH_TOKEN))
          .andExpect(jsonPath("$.tokenType").value("Bearer"));
    }
  }

  @Nested
  @DisplayName("Authentication Status Tests")
  class AuthStatusTests {

    @Test
    @WithMockUser(username = TEST_EMAIL, roles = "USER")
    @DisplayName("Auth status with authenticated user returns user details")
    void authStatusWithAuthenticatedUserReturnsUserDetails() throws Exception {
      // Arrange
      SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
          testUserDetails, null, testUserDetails.getAuthorities()));

      // Act & Assert
      mockMvc.perform(get("/api/auth/status").with(SecurityMockMvcRequestPostProcessors.csrf()))
          .andExpect(status().isOk()).andExpect(jsonPath("$.authenticated").value(true))
          .andExpect(jsonPath("$.email").value(testUser.getEmail()))
          .andExpect(jsonPath("$.name").value(testUser.getName()));
    }

    @Test
    @DisplayName("Auth status with unauthenticated user returns unauthorized")
    void authStatusWithUnauthenticatedUserReturnsUnauthorized() throws Exception {
      // Act & Assert
      mockMvc.perform(get("/api/auth/status")).andExpect(status().isUnauthorized())
          .andExpect(jsonPath("$.authenticated").value(false));
    }
  }

  @Nested
  @DisplayName("User Info Tests")
  class UserInfoTests {

    @Test
    @WithMockUser(username = TEST_EMAIL, roles = "USER")
    @DisplayName("Get user info with authenticated user returns user details")
    void getUserInfoWithAuthenticatedUserReturnsUserDetails() throws Exception {
      // Arrange
      SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
          testUserDetails, null, testUserDetails.getAuthorities()));

      // Act & Assert
      mockMvc.perform(get("/api/auth/user").with(SecurityMockMvcRequestPostProcessors.csrf()))
          .andExpect(status().isOk()).andExpect(jsonPath("$.authenticated").value(true))
          .andExpect(jsonPath("$.email").value(testUser.getEmail()))
          .andExpect(jsonPath("$.name").value(testUser.getName()));
    }

    @Test
    @DisplayName("Get user info with unauthenticated user returns unauthenticated")
    void getUserInfoWithUnauthenticatedUserReturnsUnauthenticated() throws Exception {
      // Act & Assert
      mockMvc.perform(get("/api/auth/user")).andExpect(status().isOk())
          .andExpect(jsonPath("$.authenticated").value(false));
    }
  }

  /**
   * Helper method to perform a POST request with the given request body
   */
  private ResultActions performPostRequest(String url, Object requestBody) throws Exception {
    return mockMvc.perform(post(url).with(SecurityMockMvcRequestPostProcessors.csrf())
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(requestBody)));
  }
}
