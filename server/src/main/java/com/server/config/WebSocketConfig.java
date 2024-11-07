package com.server.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic"); // 메시지를 보낼 수 있는 경로 설정
        config.setApplicationDestinationPrefixes("/app"); // 클라이언트가 메시지를 보낼 경로 설정
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // WebSocket 엔드포인트 설정
                .setAllowedOrigins("http://localhost:3000") // 프론트엔드의 주소와 동일하게 설정
                .withSockJS(); // SockJS를 지원하여 WebSocket 연결이 안될 때 fallback 사용
    }
}
