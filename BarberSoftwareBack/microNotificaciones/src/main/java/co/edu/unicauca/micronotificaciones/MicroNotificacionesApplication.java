package co.edu.unicauca.micronotificaciones;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MicroNotificacionesApplication {

    public static void main(String[] args) {
        SpringApplication.run(MicroNotificacionesApplication.class, args);
    }

}
