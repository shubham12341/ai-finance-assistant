package com.finance.core.kafka;

import com.finance.core.dto.TransactionEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionProducer {
    private static final String TOPIC = "transaction-events";

    private final KafkaTemplate<String, TransactionEvent> kafkaTemplate;

    public void publishTransaction(TransactionEvent event){
        log.info("Publishing transaction event to Kafka: {}",
                event.getTransactionId());
        kafkaTemplate.send(TOPIC, event.getUserId(), event);
        log.info("Transaction event published successfully");
    }

}
