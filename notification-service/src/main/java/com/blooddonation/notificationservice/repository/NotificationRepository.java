package com.blooddonation.notificationservice.repository;

import com.blooddonation.notificationservice.model.Notification;
import com.blooddonation.notificationservice.model.NotificationType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    List<Notification> findByRecipientId(String recipientId);

    List<Notification> findByType(NotificationType type);
}
