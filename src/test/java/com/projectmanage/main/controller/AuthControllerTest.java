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
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
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
import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectmanage.main.dto.CustomUserDetails;
import com.projectmanage.main.jwt.JWTUtil;
import com.projectmanage.main.model.RefreshToken;
import com.projectmanage.main.model.User;
import com.projectmanage.main.model.dto.TokenRefreshRequest;
import com.projectmanage.main.model.dto.UserDTO;
import com.projectmanage.main.service.RefreshTokenService;
import com.projectmanage.main.service.UserService;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

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
  private String testAccessToken;

  @BeforeEach
  void setUp() {
    testUser = new User();
    testUser.setEmail("test@example.com");
    testUser.setName("Test User");
    testUser.setPassword("password");
    testUser.setRole("ROLE_USER");
    testUser.setUsername("test@example.com");

    testUserDTO = new UserDTO();
    testUserDTO.setEmail("test@example.com");
    testUserDTO.setName("Test User");
    testUserDTO.setPassword("password");

    testRefreshToken = new RefreshToken();
    testRefreshToken.setUser(testUser);
    testRefreshToken.setToken("refresh-token");
    testRefreshToken.setExpiryDate(java.time.Instant.now().plusMillis(600000));

    testUserDetails = new CustomUserDetails(testUser);
    testAccessToken = "test-access-token";

    // Set up default authentication
    when(userService.loadUserByUsername("test@example.com")).thenReturn(testUserDetails);
    when(jwtUtil.createJwt(anyString(), anyString(), any(Long.class))).thenReturn(testAccessToken);
  }

  @Test
    void testLoginReturnsAuthenticationResponse() throws Exception {
        when(userService.authenticateUser(anyString(), anyString())).thenReturn(testUser);
        when(refreshTokenService.createRefreshToken(anyString())).thenReturn(testRefreshToken);

        mockMvc.perform(post("/api/auth/login").with(SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        Map.of("email", "test@example.com", "password", "password"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value(testAccessToken))
                .andExpect(jsonPath("$.refreshToken").value(testRefreshToken.getToken()))
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.authenticated").value(true))
                .andExpect(jsonPath("$.name").value(testUser.getName()))
                .andExpect(jsonPath("$.email").value(testUser.getEmail()))
                .andExpect(cookie().exists("Authorization"))
                .andExpect(cookie().httpOnly("Authorization", true));
    }

  @Test
    void testRegisterReturnsCreatedUser() throws Exception {
        when(userService.registerUser(any(UserDTO.class))).thenReturn(testUser);
        when(refreshTokenService.createRefreshToken(anyString())).thenReturn(testRefreshToken);

        mockMvc.perform(post("/api/auth/register").with(SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUserDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").value(testAccessToken))
                .andExpect(jsonPath("$.refreshToken").value(testRefreshToken.getToken()))
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.authenticated").value(true))
                .andExpect(jsonPath("$.name").value(testUser.getName()))
                .andExpect(jsonPath("$.email").value(testUser.getEmail()))
                .andExpect(cookie().exists("Authorization"))
                .andExpect(cookie().httpOnly("Authorization", true));
    }

  @Test
  void testRefreshTokenReturnsNewAccessToken() throws Exception {
    // Mock refresh token service behavior
    RefreshToken mockRefreshToken = new RefreshToken();
    mockRefreshToken.setToken("refresh-token");
    mockRefreshToken.setUser(testUser);

    when(refreshTokenService.findByToken("refresh-token"))
        .thenReturn(Optional.of(mockRefreshToken));
    when(refreshTokenService.verifyExpiration(mockRefreshToken)).thenReturn(mockRefreshToken);
    when(jwtUtil.createJwt(anyString(), anyString(), anyLong())).thenReturn("new-access-token");

    // Create request body
    TokenRefreshRequest refreshRequest = new TokenRefreshRequest();
    refreshRequest.setRefreshToken("refresh-token");

    mockMvc
        .perform(post("/api/auth/refresh").with(SecurityMockMvcRequestPostProcessors.csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(refreshRequest)))
        .andExpect(status().isOk()).andExpect(jsonPath("$.accessToken").value("new-access-token"))
        .andExpect(jsonPath("$.refreshToken").value("refresh-token"))
        .andExpect(jsonPath("$.tokenType").value("Bearer"));
  }

  @Test
  @WithMockUser(username = "test@example.com", roles = "USER")
  void testGetAuthStatusWithAuthenticatedUserReturnsUserDetails() throws Exception {
    SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
        testUserDetails, null, testUserDetails.getAuthorities()));

    mockMvc.perform(get("/api/auth/status").with(SecurityMockMvcRequestPostProcessors.csrf()))
        .andExpect(status().isOk()).andExpect(jsonPath("$.authenticated").value(true))
        .andExpect(jsonPath("$.email").value(testUser.getEmail()))
        .andExpect(jsonPath("$.name").value(testUser.getName()));
  }

  @Test
  void testGetAuthStatusWithUnauthenticatedUserReturnsUnauthorized() throws Exception {
    mockMvc.perform(get("/api/auth/status")).andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.authenticated").value(false));
  }

  @Test
  @WithMockUser(username = "test@example.com", roles = "USER")
  void testGetUserWithAuthenticatedUserReturnsUserDetails() throws Exception {
    SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
        testUserDetails, null, testUserDetails.getAuthorities()));

    mockMvc.perform(get("/api/auth/user").with(SecurityMockMvcRequestPostProcessors.csrf()))
        .andExpect(status().isOk()).andExpect(jsonPath("$.authenticated").value(true))
        .andExpect(jsonPath("$.email").value(testUser.getEmail()))
        .andExpect(jsonPath("$.name").value(testUser.getName()));
  }

  @Test
  void testGetUserWithUnauthenticatedUserReturnsUnauthenticated() throws Exception {
    mockMvc.perform(get("/api/auth/user")).andExpect(status().isOk())
        .andExpect(jsonPath("$.authenticated").value(false));
  }
}
