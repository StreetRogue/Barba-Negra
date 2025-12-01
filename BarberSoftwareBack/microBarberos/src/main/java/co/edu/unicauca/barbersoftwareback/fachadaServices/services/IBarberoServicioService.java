package co.edu.unicauca.barbersoftwareback.fachadaServices.services;

import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.BarberoServicioDTOPeticion;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.BarberoServicioDTORespuesta;

import java.util.List;

public interface IBarberoServicioService {

    BarberoServicioDTORespuesta assignBarberoToServicio(BarberoServicioDTOPeticion dto);

    List<BarberoServicioDTORespuesta> listBarberosByServicio(Integer servicioId);

    List<BarberoServicioDTORespuesta> listServiciosByBarbero(Integer barberoId);

    // Cambié el argumento para borrar usando la pareja (Barbero + Servicio) que es más seguro
    boolean desasignarServicio(Integer barberoId, Integer servicioId);
}