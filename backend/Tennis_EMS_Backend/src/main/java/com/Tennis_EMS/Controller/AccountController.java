package com.Tennis_EMS.Controller;

import com.Tennis_EMS.DTO.Account.CreateAccountRequestDTO;
import com.Tennis_EMS.DTO.Account.CreateAccountResponseDTO;
import com.Tennis_EMS.Service.AccountCreationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountCreationService accountCreationService;

    public AccountController(AccountCreationService accountCreationService) {
        this.accountCreationService = accountCreationService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CreateAccountResponseDTO createAccount(@RequestBody CreateAccountRequestDTO request, HttpSession session) {
        return accountCreationService.createAccount(request, session);
    }
}
