package co.edu.unicauca.microreservas.fachadaServices.mapper;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Mapper {
    @Bean
    public ModelMapper crearMapper() {
        ModelMapper objMapeador = new ModelMapper();
        return objMapeador;
    }
}
