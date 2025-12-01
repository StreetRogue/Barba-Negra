package co.edu.unicauca.barbersoftwareback.fachadaServices.services;

import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.ServicioDTOPeticion;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.ServicioDTORespuesta;

import java.util.List;

public interface IServicioService {
    public List<ServicioDTORespuesta> findAll();
    public ServicioDTORespuesta findById(Integer id);
    public ServicioDTORespuesta save(ServicioDTOPeticion servicio);
    public ServicioDTORespuesta update(Integer id,ServicioDTOPeticion servicio);
    public boolean delete(Integer id);
    public List<ServicioDTORespuesta> findByCategoria(Integer idCategoria);
    public List<ServicioDTORespuesta> findAllClient();
    public List<ServicioDTORespuesta> findByCategoriaClient(Integer idCategoria);
    public ServicioDTORespuesta findByNombre(String nombre);
}
