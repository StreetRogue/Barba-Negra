package co.edu.unicauca.micronotificaciones.config;



import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    /**
     * Define el MessageConverter para usar JSON.
     * Usamos JsonMessageConverter para reemplazar el deprecated Jackson2JsonMessageConverter.
     */

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }


}