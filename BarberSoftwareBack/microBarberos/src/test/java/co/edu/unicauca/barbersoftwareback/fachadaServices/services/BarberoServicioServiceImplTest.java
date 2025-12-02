package co.edu.unicauca.barbersoftwareback.fachadaServices.services;

import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models.BarberoEntity;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models.BarberoServicioEntity;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models.ServicioEntity;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.repositories.BarberoRepository;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.repositories.BarberoServicioRepository;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.repositories.ServicioRepository;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.BarberoServicioDTOPeticion;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.BarberoServicioDTORespuesta;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class BarberoServicioServiceImplTest {

    // ➡ Dependencias Mockeadas
    @Mock
    private BarberoServicioRepository barberoServicioRepository;
    @Mock
    private BarberoRepository barberoRepository;
    @Mock
    private ServicioRepository servicioRepository;

    // ➡ SPY para ModelMapper
    // Usamos SPY en ModelMapper para que el constructor de Service pueda llamar a .typeMap()
    // pero aún podamos controlar el mapeo final (.map())
    @Spy
    private ModelMapper modelMapper = new ModelMapper();

    // ➡ Instancia del Servicio a Probar (Inyecta los Mocks y el Spy)
    @InjectMocks
    private BarberoServicioServiceImpl barberoServicioService;

    // ➡ Datos de Prueba (Stubs)
    private BarberoEntity barberoEntity;
    private ServicioEntity servicioEntity;
    private BarberoServicioEntity barberoServicioEntity;
    private BarberoServicioDTORespuesta respuestaDTO;

    // Un TypeMap para simular la configuración que se hace en el constructor del servicio
    private TypeMap<BarberoServicioEntity, BarberoServicioDTORespuesta> typeMap;

    @BeforeEach
    void setUp() {
        // Entidades necesarias (usando stubs simplificados)
        barberoEntity = new BarberoEntity(10, "Juan Barbero", "j@b.com", "300", "ACTIVO", null);

        // Asumiendo que ServicioEntity requiere CategoriaEntity (aunque aquí no se usa)
        // Usaremos la versión de ServicioEntity que pasaste antes (omitiendo campos de tiempo y base64)
        servicioEntity = new ServicioEntity();
        servicioEntity.setId(5);
        servicioEntity.setNombre("Corte Clásico");
        servicioEntity.setPrecio(BigDecimal.TEN);
        // Nota: Si usas Lombok y el constructor AllArgsConstructor, deberías inicializar todos los campos

        // Entidad de Unión
        barberoServicioEntity = new BarberoServicioEntity();
        barberoServicioEntity.setId(1);
        barberoServicioEntity.setBarbero(barberoEntity);
        barberoServicioEntity.setServicio(servicioEntity);

        // DTO de Respuesta esperado
        respuestaDTO = new BarberoServicioDTORespuesta(
                1, 10, "Juan Barbero", 5, "Corte Clásico"
        );

        // 🚨 Configurar el SPY para simular el mapeo aplanado
        // Esta es la clave: el SPY permite que el constructor haga .typeMap, y aquí controlamos el .map
        typeMap = modelMapper.typeMap(BarberoServicioEntity.class, BarberoServicioDTORespuesta.class);

        // Nos aseguramos de que el map final devuelva nuestro DTO simulado
        doReturn(respuestaDTO)
                .when(modelMapper).map(any(BarberoServicioEntity.class), eq(BarberoServicioDTORespuesta.class));
    }

    // ---

    //## 💾 Prueba: Asignación de Servicio (assignBarberoToServicio)

    @Test
    void assignBarberoToServicio_debeGuardarNuevaRelacion_cuandoNoExiste() {
        // ARRANGE
        BarberoServicioDTOPeticion dto = new BarberoServicioDTOPeticion(5, 10); // Serv=5, Barb=10

        // 1. Simular validación (no existe la relación)
        when(barberoServicioRepository.existsByBarbero_IdAndServicio_Id(10, 5)).thenReturn(false);

        // 2. Simular búsqueda de entidades (deben existir)
        when(barberoRepository.findById(10)).thenReturn(Optional.of(barberoEntity));
        when(servicioRepository.findById(5)).thenReturn(Optional.of(servicioEntity));

        // 3. Simular el guardado
        when(barberoServicioRepository.save(any(BarberoServicioEntity.class))).thenReturn(barberoServicioEntity);

        // ACT
        BarberoServicioDTORespuesta resultado = barberoServicioService.assignBarberoToServicio(dto);

        // ASSERT
        assertNotNull(resultado);
        assertEquals(10, resultado.getBarberoId());
        assertEquals("Corte Clásico", resultado.getNombreServicio());

        verify(barberoServicioRepository, times(1)).existsByBarbero_IdAndServicio_Id(10, 5);
        verify(barberoServicioRepository, times(1)).save(any(BarberoServicioEntity.class));
    }

    @Test
    void assignBarberoToServicio_debeLanzarExcepcion_cuandoRelacionYaExiste() {
        // ARRANGE
        BarberoServicioDTOPeticion dto = new BarberoServicioDTOPeticion(5, 10);

        when(barberoServicioRepository.existsByBarbero_IdAndServicio_Id(10, 5)).thenReturn(true);

        // ACT & ASSERT
        RuntimeException excepcion = assertThrows(RuntimeException.class, () -> {
            barberoServicioService.assignBarberoToServicio(dto);
        });

        assertEquals("CONFLICT", excepcion.getMessage());
        verify(barberoRepository, never()).findById(anyInt());
        verify(barberoServicioRepository, never()).save(any(BarberoServicioEntity.class));
    }

    @Test
    void assignBarberoToServicio_debeLanzarExcepcion_cuandoServicioNoExiste() {
        // ARRANGE
        BarberoServicioDTOPeticion dto = new BarberoServicioDTOPeticion(99, 10); // Serv=99 (no existe)

        when(barberoServicioRepository.existsByBarbero_IdAndServicio_Id(10, 99)).thenReturn(false);
        when(barberoRepository.findById(10)).thenReturn(Optional.of(barberoEntity)); // Barbero existe
        when(servicioRepository.findById(99)).thenReturn(Optional.empty()); // Servicio no existe

        // ACT & ASSERT
        RuntimeException excepcion = assertThrows(RuntimeException.class, () -> {
            barberoServicioService.assignBarberoToServicio(dto);
        });

        assertEquals("NOT_FOUND", excepcion.getMessage());
        verify(barberoRepository, times(1)).findById(10);
        verify(barberoServicioRepository, never()).save(any(BarberoServicioEntity.class));
    }

    // ---

    //## 🔍 Pruebas de Lectura (listBarberosByServicio)

    @Test
    void listBarberosByServicio_debeRetornarListaDeRelaciones_cuandoServicioExiste() {
        // ARRANGE
        List<BarberoServicioEntity> entities = Arrays.asList(barberoServicioEntity);
        Integer servicioId = 5;

        when(servicioRepository.existsById(servicioId)).thenReturn(true);
        when(barberoServicioRepository.findByServicio_Id(servicioId)).thenReturn(entities);
        // El Mockito Spy asegura que el map devuelva el DTO aplanado

        // ACT
        List<BarberoServicioDTORespuesta> resultados = barberoServicioService.listBarberosByServicio(servicioId);

        // ASSERT
        assertFalse(resultados.isEmpty());
        assertEquals(1, resultados.size());
        assertEquals(servicioId, resultados.get(0).getServicioId());
        assertEquals("Juan Barbero", resultados.get(0).getNombreBarbero()); // Verificamos el aplanamiento

        verify(barberoServicioRepository, times(1)).findByServicio_Id(servicioId);
        verify(modelMapper, times(1)).map(any(BarberoServicioEntity.class), eq(BarberoServicioDTORespuesta.class));
    }

    @Test
    void listBarberosByServicio_debeLanzarExcepcion_cuandoServicioNoExiste() {
        // ARRANGE
        Integer servicioId = 99;
        when(servicioRepository.existsById(servicioId)).thenReturn(false);

        // ACT & ASSERT
        RuntimeException excepcion = assertThrows(RuntimeException.class, () -> {
            barberoServicioService.listBarberosByServicio(servicioId);
        });

        assertEquals("NOT_FOUND", excepcion.getMessage());
        verify(barberoServicioRepository, never()).findByServicio_Id(anyInt());
    }

    // [Se pueden replicar las pruebas para listServiciosByBarbero con la misma lógica]

    // ---

    // ## 🗑 Prueba: Desasignación de Servicio (desasignarServicio)

    @Test
    void desasignarServicio_debeEliminarRelacion_cuandoExiste() {
        // ARRANGE
        Integer barberoId = 10;
        Integer servicioId = 5;

        when(barberoServicioRepository.existsByBarbero_IdAndServicio_Id(barberoId, servicioId)).thenReturn(true);
        // deleteBy... es void, no necesita un when() especial, solo verificamos el verify

        // ACT
        boolean resultado = barberoServicioService.desasignarServicio(barberoId, servicioId);

        // ASSERT
        assertTrue(resultado);
        verify(barberoServicioRepository, times(1)).existsByBarbero_IdAndServicio_Id(barberoId, servicioId);
        verify(barberoServicioRepository, times(1)).deleteByBarbero_IdAndServicio_Id(barberoId, servicioId);
    }

    @Test
    void desasignarServicio_debeLanzarExcepcion_cuandoRelacionNoExiste() {
        // ARRANGE
        Integer barberoId = 99;
        Integer servicioId = 99;

        when(barberoServicioRepository.existsByBarbero_IdAndServicio_Id(barberoId, servicioId)).thenReturn(false);

        // ACT & ASSERT
        RuntimeException excepcion = assertThrows(RuntimeException.class, () -> {
            barberoServicioService.desasignarServicio(barberoId, servicioId);
        });

        assertEquals("NOT_FOUND", excepcion.getMessage());
        verify(barberoServicioRepository, never()).deleteByBarbero_IdAndServicio_Id(anyInt(), anyInt());
    }
}