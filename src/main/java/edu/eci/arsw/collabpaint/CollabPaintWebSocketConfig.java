package edu.eci.arsw.collabpaint;

import java.util.logging.Logger;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;

@Configuration
@EnableWebSocketMessageBroker
public class CollabPaintWebSocketConfig extends AbstractWebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableStompBrokerRelay("/topic/").setRelayHost("192.168.56.102").setRelayPort(61613);
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
    	registry.addEndpoint("/stompendpoint").setAllowedOrigins("*").withSockJS();        
    }
    
}