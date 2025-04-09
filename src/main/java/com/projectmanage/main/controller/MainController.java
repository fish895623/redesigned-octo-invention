package com.projectmanage.main.controller;

import jakarta.annotation.security.PermitAll;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("")
public class MainController {

  @PermitAll
  @GetMapping({"/", "/{path:^(?!api|error)[^\\.]*}"})
  public String index() {
    return "forward:/index.html";
  }
}
