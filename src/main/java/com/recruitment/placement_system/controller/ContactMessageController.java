package com.recruitment.placement_system.controller;

import com.recruitment.placement_system.entity.ContactMessage;
import com.recruitment.placement_system.service.ContactMessageService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")

@CrossOrigin(origins = "*") // adjust later if needed
public class ContactMessageController {

    private final ContactMessageService service;

    public ContactMessageController(ContactMessageService service) {
        this.service = service;
    }


    @PostMapping
    public ContactMessage submitMessage(@RequestBody ContactMessage message) {
        System.out.println("Incoming message: " + message);
        return service.saveMessage(message);
    }

}