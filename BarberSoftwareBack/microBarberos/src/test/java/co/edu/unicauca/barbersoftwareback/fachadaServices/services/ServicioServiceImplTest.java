package co.edu.unicauca.barbersoftwareback.fachadaServices.services;

import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models.CategoriaEntity;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models.ServicioEntity;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.repositories.CategoriaRepository;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.repositories.ServicioRepository;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.CategoriaDTOPeticion;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.CategoriaDTORespuesta;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.ServicioDTOPeticion;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.ServicioDTORespuesta;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ServicioServiceImplTest {

    // ➡ Dependencias Mockeadas
    @Mock
    private ServicioRepository servicioRepository;
    @Mock
    private CategoriaRepository categoriaRepository;
    @Mock
    private ModelMapper modelMapper;

    // ➡ Instancia del Servicio a Probar con Mocks inyectados
    @InjectMocks
    private ServicioServiceImpl servicioService;

    // ➡ Datos de Prueba (Stubs)
    private ServicioEntity servicioEntity1;
    private ServicioDTORespuesta servicioDTORespuesta1;
    private CategoriaEntity categoriaEntity;
    private CategoriaDTORespuesta categoriaDTORespuesta;
    private final LocalDateTime now = LocalDateTime.now();

    @BeforeEach
    void setUp() {
        // Inicialización de CategoriaEntity
        categoriaEntity = new CategoriaEntity(1, "Cortes");

        // Inicialización de ServicioEntity (Modelo de la DB)
        servicioEntity1 = new ServicioEntity(
                1, "Corte Clásico", "Descripción 1", BigDecimal.valueOf(10000),
                30, now, "Base64Imagen", "Activo", categoriaEntity
        );

        // DTO de Categoria de Respuesta
        categoriaDTORespuesta = new CategoriaDTORespuesta(1, "Cortes");

        // DTO de Servicio de Respuesta
        servicioDTORespuesta1 = new ServicioDTORespuesta(
                1, "Corte Clásico", "Descripción 1", BigDecimal.valueOf(10000),
                30, now, "Base64Imagen", "Activo", categoriaDTORespuesta
        );
    }

    // ---

    // ## 🔍 Pruebas de Lectura (Read Operations)

    @Test
    void findAll_debeRetornarListaDeServicios() {
        // ARRANGE
        List<ServicioEntity> entities = Arrays.asList(servicioEntity1);
        when(servicioRepository.findAll()).thenReturn(entities);
        when(modelMapper.map(eq(servicioEntity1), eq(ServicioDTORespuesta.class))).thenReturn(servicioDTORespuesta1);

        // ACT
        List<ServicioDTORespuesta> resultados = servicioService.findAll();

        // ASSERT
        assertFalse(resultados.isEmpty());
        assertEquals(1, resultados.size());
        assertEquals("Corte Clásico", resultados.get(0).getNombre());
        verify(servicioRepository, times(1)).findAll();
    }

    @Test
    void findById_debeRetornarServicio_cuandoExiste() {
        // ARRANGE
        when(servicioRepository.findById(1)).thenReturn(Optional.of(servicioEntity1));
        when(modelMapper.map(eq(servicioEntity1), eq(ServicioDTORespuesta.class))).thenReturn(servicioDTORespuesta1);

        // ACT
        ServicioDTORespuesta resultado = servicioService.findById(1);

        // ASSERT
        assertNotNull(resultado);
        assertEquals(1, resultado.getId());
        assertEquals("Cortes", resultado.getCategoria().getNombre());
        verify(servicioRepository, times(1)).findById(1);
    }

    @Test
    void findById_debeLanzarExcepcion_cuandoNoExiste() {
        // ARRANGE
        when(servicioRepository.findById(99)).thenReturn(Optional.empty());

        // ACT & ASSERT
        RuntimeException excepcion = assertThrows(RuntimeException.class, () -> {
            servicioService.findById(99);
        });
        assertEquals("NOT_FOUND", excepcion.getMessage());
        verify(servicioRepository, times(1)).findById(99);
    }

    // ---

    //  ## 💾 Pruebas de Creación (Save Operation)

    @Test
    void save_debeGuardarServicio_conDatosValidos() {
        // ARRANGE
        ServicioDTOPeticion peticion = new ServicioDTOPeticion(
                "Nuevo Corte", "Desc Nueva", BigDecimal.valueOf(15000), 45,
                null, null, new CategoriaDTOPeticion(1)
        );

        // Entidades simuladas para el ModelMapper y el Repositorio
        ServicioEntity entityMapped = new ServicioEntity(); // Lo que modelMapper produce antes de setear fecha y estado
        ServicioEntity entitySaved = new ServicioEntity(2, peticion.getNombre(), peticion.getDescripcion(), peticion.getPrecio(), peticion.getDuracionMinutos(), now, null, "Activo", categoriaEntity);
        ServicioDTORespuesta respuestaEsperada = new ServicioDTORespuesta(2, peticion.getNombre(), peticion.getDescripcion(), peticion.getPrecio(), peticion.getDuracionMinutos(), now, null, "Activo", categoriaDTORespuesta);

        // Comportamiento del Mock
        when(servicioRepository.existsByNombre(peticion.getNombre())).thenReturn(false);
        when(categoriaRepository.findById(1)).thenReturn(Optional.of(categoriaEntity));
        when(modelMapper.map(eq(peticion), eq(ServicioEntity.class))).thenReturn(entityMapped);
        // Cuando save es llamado con cualquier ServicioEntity, devuelve la versión "guardada"
        when(servicioRepository.save(any(ServicioEntity.class))).thenReturn(entitySaved);
        when(modelMapper.map(eq(entitySaved), eq(ServicioDTORespuesta.class))).thenReturn(respuestaEsperada);

        // ACT
        ServicioDTORespuesta resultado = servicioService.save(peticion);

        // ASSERT
        assertNotNull(resultado);
        assertEquals("Nuevo Corte", resultado.getNombre());
        // Verificamos interacciones críticas
        verify(servicioRepository, times(1)).existsByNombre("Nuevo Corte");
        verify(categoriaRepository, times(1)).findById(1);
        verify(servicioRepository, times(1)).save(any(ServicioEntity.class));
    }

    @Test
    void save_debeLanzarExcepcion_cuandoNombreDuplicado() {
        // ARRANGE
        ServicioDTOPeticion peticion = new ServicioDTOPeticion(
                "Corte Clásico", "Desc", BigDecimal.TEN, 10, null, null, new CategoriaDTOPeticion(1)
        );

        when(servicioRepository.existsByNombre("Corte Clásico")).thenReturn(true);

        // ACT & ASSERT
        RuntimeException excepcion = assertThrows(RuntimeException.class, () -> {
            servicioService.save(peticion);
        });

        assertEquals("CONFLICT", excepcion.getMessage());
        verify(servicioRepository, times(1)).existsByNombre("Corte Clásico");
        verify(servicioRepository, never()).save(any(ServicioEntity.class));
    }

    @Test
    void save_debeLanzarExcepcion_cuandoFaltanDatosObligatorios() {
        // ARRANGE (Nombre nulo)
        ServicioDTOPeticion peticion = new ServicioDTOPeticion(
                null, "Desc", BigDecimal.TEN, 10, null, null, new CategoriaDTOPeticion(1)
        );

        // ACT & ASSERT
        RuntimeException excepcion = assertThrows(RuntimeException.class, () -> {
            servicioService.save(peticion);
        });
        assertEquals("BAD_REQUEST", excepcion.getMessage());

        // ARRANGE (Precio <= 0)
        peticion.setNombre("Nombre Válido");
        peticion.setPrecio(BigDecimal.ZERO);

        // ACT & ASSERT
        excepcion = assertThrows(RuntimeException.class, () -> {
            servicioService.save(peticion);
        });
        assertEquals("BAD_REQUEST", excepcion.getMessage());

        // Aseguramos que nunca intentó guardar
        verify(servicioRepository, never()).save(any(ServicioEntity.class));
    }

    // ---

    //  ## ✏ Pruebas de Actualización (Update Operation)

    @Test
    void update_debeActualizarNombreYGuardar() {
        // ARRANGE
        Integer id = 1;
        String nuevoNombre = "Corte Moderno";
        ServicioDTOPeticion dto = new ServicioDTOPeticion();
        dto.setNombre(nuevoNombre);

        ServicioEntity entityActualizada = new ServicioEntity(1, nuevoNombre, "Descripción 1", BigDecimal.valueOf(10000), 30, now, "Base64Imagen", "Activo", categoriaEntity);

        when(servicioRepository.findById(id)).thenReturn(Optional.of(servicioEntity1));
        when(servicioRepository.existsByNombre(nuevoNombre)).thenReturn(false);
        when(servicioRepository.save(any(ServicioEntity.class))).thenReturn(entityActualizada);
        when(modelMapper.map(eq(entityActualizada), eq(ServicioDTORespuesta.class))).thenReturn(servicioDTORespuesta1); // Asumimos mapeo correcto

        // ACT
        servicioService.update(id, dto);

        // ASSERT
        // Verifica que se buscó el original, se comprobó el conflicto, y se guardó
        verify(servicioRepository, times(1)).findById(id);
        verify(servicioRepository, times(1)).existsByNombre(nuevoNombre);
        verify(servicioRepository, times(1)).save(any(ServicioEntity.class));
    }

    @Test
    void update_debeLanzarExcepcion_cuandoIntentaActualizarANombreDuplicado() {
        // ARRANGE
        Integer id = 1;
        String nombreDuplicado = "Otro Corte Existente";
        ServicioDTOPeticion dto = new ServicioDTOPeticion();
        dto.setNombre(nombreDuplicado);

        when(servicioRepository.findById(id)).thenReturn(Optional.of(servicioEntity1)); // El nombre original es "Corte Clásico"
        when(servicioRepository.existsByNombre(nombreDuplicado)).thenReturn(true);

        // ACT & ASSERT
        RuntimeException excepcion = assertThrows(RuntimeException.class, () -> {
            servicioService.update(id, dto);
        });

        assertEquals("CONFLICT", excepcion.getMessage());
        verify(servicioRepository, times(1)).existsByNombre(nombreDuplicado);
        verify(servicioRepository, never()).save(any(ServicioEntity.class));
    }

    //---

    //  ## 🗑 Pruebas de Eliminación (Delete Operation)

    @Test
    void delete_debeEliminarServicio_cuandoExiste() {
        // ARRANGE
        Integer id = 1;
        when(servicioRepository.existsById(id)).thenReturn(true);
        doNothing().when(servicioRepository).deleteById(id);

        // ACT
        boolean resultado = servicioService.delete(id);

        // ASSERT
        assertTrue(resultado);
        verify(servicioRepository, times(1)).existsById(id);
        verify(servicioRepository, times(1)).deleteById(id);
    }
}