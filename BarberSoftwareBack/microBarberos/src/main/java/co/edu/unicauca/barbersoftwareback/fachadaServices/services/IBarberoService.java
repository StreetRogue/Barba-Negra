package co.edu.unicauca.barbersoftwareback.fachadaServices.services;

import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.BarberoDTOPeticion;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.BarberoDTORespuesta;

import java.util.List;

public interface IBarberoService {

    List<BarberoDTORespuesta> findAll();

    BarberoDTORespuesta findById(Integer id);

    BarberoDTORespuesta findByNombre(String nombre);

    List<BarberoDTORespuesta> findByEstado(String estado);

    BarberoDTORespuesta save(BarberoDTOPeticion barbero);

    BarberoDTORespuesta update(Integer id, BarberoDTOPeticion barbero);
}
