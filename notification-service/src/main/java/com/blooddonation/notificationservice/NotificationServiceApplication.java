package com.blooddonation.notificationservice;

import com.blooddonation.notificationservice.model.Notification;
import com.blooddonation.notificationservice.model.NotificationStatus;
import com.blooddonation.notificationservice.model.NotificationType;
import com.blooddonation.notificationservice.repository.NotificationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class NotificationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(NotificationServiceApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedNotifications(NotificationRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                Notification n1 = new Notification(null, "Registered O- Donors in Colombo", NotificationType.ALERT, "Critical O- Blood Shortage Alert", "Urgent request for 3 units O- at National Hospital Colombo.");
                n1.setStatus(NotificationStatus.SENT);
                Notification n2 = new Notification(null, "National Hospital Colombo", NotificationType.EMAIL, "Donor Match Found", "Donor Sahan Jayawardena matched for Request REQ-501.");
                n2.setStatus(NotificationStatus.SENT);
                Notification n3 = new Notification(null, "System Admin", NotificationType.EMAIL, "Inventory Stock Updated", "Added 10 units of O+ blood to General Hospital Hub.");
                n3.setStatus(NotificationStatus.SENT);
                repository.saveAll(List.of(n1, n2, n3));
            }
        };
    }
}
