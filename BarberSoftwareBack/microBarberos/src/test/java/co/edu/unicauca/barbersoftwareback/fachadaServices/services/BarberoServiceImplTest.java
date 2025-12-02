package co.edu.unicauca.barbersoftwareback.fachadaServices.services;

import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models.BarberoEntity;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.repositories.BarberoRepository;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.BarberoDTOPeticion;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.BarberoDTORespuesta;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BarberoServiceImplTest {

    // ➡ Dependencias Mockeadas
    @Mock
    private BarberoRepository barberoRepository;
    @Mock
    private ModelMapper modelMapper;

    // ➡ Instancia del Servicio a Probar
    @InjectMocks
    private BarberoServiceImpl barberoService;

    // ➡ Datos de Prueba (Stubs)
    private BarberoEntity barberoEntityActivo;
    private BarberoDTORespuesta barberoDTORespuestaActivo;

    @BeforeEach
    void setUp() {
        // Barbero Entity (usando el constructor @AllArgsConstructor de BarberoEntity)
        barberoEntityActivo = new BarberoEntity(
                100, // id
                "Juan Perez", // nombre
                "juan@barber.com", // email
                "3001234567", // telefono
                "ACTIVO", // estado
                Collections.emptyList() // horarios (no necesarios para estas pruebas unitarias)
        );

        // Barbero DTO Respuesta
        barberoDTORespuestaActivo = new BarberoDTORespuesta(
                100,
                "Juan Perez",
                "juan@barber.com",
                "3001234567",
                "ACTIVO"
        );
    }

    //---

    // ## 🔍 Pruebas de Lectura (Read Operations)

    @Test
    void findAll_debeRetornarListaDeBarberos_cuandoExistenDatos() {
        // ARRANGE
        List<BarberoEntity> entities = Arrays.asList(barberoEntityActivo);
        when(barberoRepository.findAll()).thenReturn(entities);
        when(modelMapper.map(eq(barberoEntityActivo), eq(BarberoDTORespuesta.class)))
                .thenReturn(barberoDTORespuestaActivo);

        // ACT
        List<BarberoDTORespuesta> resultados = barberoService.findAll();

        // ASSERT
        assertFalse(resultados.isEmpty());
        assertEquals(1, resultados.size());
        assertEquals("Juan Perez", resultados.get(0).getNombre());
        verify(barberoRepository, times(1)).findAll();
    }

    @Test
    void findAll_debeLanzarExcepcion_cuandoListaEstaVacia() {
        // ARRANGE
        when(barberoRepository.findAll()).thenReturn(Collections.emptyList());

        // ACT & ASSERT
        RuntimeException excepcion = assertThrows(RuntimeException.class, () -> {
            barberoService.findAll();
        });
        assertEquals("NOT_FOUND", excepcion.getMessage());
    }

    @Test
    void findById_debeRetornarBarbero_cuandoExiste() {
        // ARRANGE
        when(barberoRepository.findById(100)).thenReturn(Optional.of(barberoEntityActivo));
        when(modelMapper.map(eq(barberoEntityActivo), eq(BarberoDTORespuesta.class)))
                .thenReturn(barberoDTORespuestaActivo);

        // ACT
        BarberoDTORespuesta resultado = barberoService.findById(100);

        // ASSERT
        assertNotNull(resultado);
        assertEquals(100, resultado.getId());
        verify(barberoRepository, times(1)).findById(100);
    }

    @Test
    void findById_debeLanzarExcepcion_cuandoNoExiste() {
        // ARRANGE
        when(barberoRepository.findById(999)).thenReturn(Optional.empty());

        // ACT & ASSERT
        RuntimeException excepcion = assertThrows(RuntimeException.class, () -> {
            barberoService.findById(999);
        });
        assertEquals("NOT_FOUND", excepcion.getMessage());
    }

    // [Se pueden replicar las pruebas findByNombre y findByEstado con la misma lógica]

    //---

    //## 💾 Pruebas de Creación (Save Operation)

    @Test
    void save_debeGuardarBarbero_conEstadoPorDefectoActivo() {
        // ARRANGE
        BarberoDTOPeticion peticion = new BarberoDTOPeticion(
                200, "Carlos Ruiz", "carlos@barber.com", "3109876543", null
        );

        BarberoEntity entityMapped = new BarberoEntity(); // Simula la entidad mapeada antes del seteo de estado
        BarberoEntity entitySaved = new BarberoEntity(200, peticion.getNombre(), peticion.getEmail(), peticion.getTelefono(), "Activo", null);
        BarberoDTORespuesta respuestaEsperada = new BarberoDTORespuesta(200, peticion.getNombre(), peticion.getEmail(), peticion.getTelefono(), "Activo");


        // 1. Simular validaciones (no existe por ID ni por Email)
        when(barberoRepository.existsById(200)).thenReturn(false);
        when(barberoRepository.existsByEmail("carlos@barber.com")).thenReturn(false);

        // 2. Simular mapeo y guardado
        when(modelMapper.map(eq(peticion), eq(BarberoEntity.class))).thenReturn(entityMapped);
        when(barberoRepository.save(any(BarberoEntity.class))).thenReturn(entitySaved);
        when(modelMapper.map(eq(entitySaved), eq(BarberoDTORespuesta.class))).thenReturn(respuestaEsperada);

        // ACT
        BarberoDTORespuesta resultado = barberoService.save(peticion);

        // ASSERT
        assertNotNull(resultado);
        assertEquals(200, resultado.getId());
        assertEquals("Activo", resultado.getEstado(), "El estado debe ser 'Activo' por defecto.");
        verify(barberoRepository, times(1)).save(any(BarberoEntity.class));
    }

    @Test
    void save_debeLanzarExcepcion_cuandoIdDuplicado() {
        // ARRANGE
        BarberoDTOPeticion peticion = new BarberoDTOPeticion(
                100, "Duplicado", "dup@barber.com", "3000000000", "ACTIVO"
        );
        when(barberoRepository.existsById(100)).thenReturn(true);

        // ACT & ASSERT
        RuntimeException excepcion = assertThrows(RuntimeException.class, () -> {
            barberoService.save(peticion);
        });
        assertEquals("CONFLICT", excepcion.getMessage());
        verify(barberoRepository, never()).save(any(BarberoEntity.class));
    }

    @Test
    void save_debeLanzarExcepcion_cuandoEmailDuplicado() {
        // ARRANGE
        BarberoDTOPeticion peticion = new BarberoDTOPeticion(
                300, "Duplicado", "juan@barber.com", "3000000000", "ACTIVO"
        );
        when(barberoRepository.existsById(300)).thenReturn(false);
        when(barberoRepository.existsByEmail("juan@barber.com")).thenReturn(true);

        // ACT & ASSERT
        RuntimeException excepcion = assertThrows(RuntimeException.class, () -> {
            barberoService.save(peticion);
        });
        assertEquals("CONFLICT", excepcion.getMessage());
        verify(barberoRepository, never()).save(any(BarberoEntity.class));
    }

    @Test
    void save_debeLanzarExcepcion_cuandoFaltanDatosObligatorios() {
        // ARRANGE (Falta Email)
        BarberoDTOPeticion peticion = new BarberoDTOPeticion(
                300, "Nombre", null, "3000000000", "ACTIVO"
        );

        // ACT & ASSERT
        RuntimeException excepcion = assertThrows(RuntimeException.class, () -> {
            barberoService.save(peticion);
        });
        assertEquals("BAD_REQUEST", excepcion.getMessage());
        verify(barberoRepository, never()).existsById(anyInt());
    }

    //---

    //## ✏ Pruebas de Actualización (Update Operation)

    @Test
    void update_debeActualizarEmail_siCambiaYNoEstaDuplicado() {
        // ARRANGE
        Integer id = 100;
        String nuevoEmail = "new@email.com";
        BarberoDTOPeticion dto = new BarberoDTOPeticion(id, "Juan Perez", nuevoEmail, "3001234567", "ACTIVO");

        // 1. Encontrar la entidad original
        when(barberoRepository.findById(id)).thenReturn(Optional.of(barberoEntityActivo));

        // 2. Simular que el nuevo email NO existe
        when(barberoRepository.existsByEmail(nuevoEmail)).thenReturn(false);

        // Entidad guardada
        BarberoEntity entityActualizada = new BarberoEntity(id, "Juan Perez", nuevoEmail, "3001234567", "ACTIVO", null);
        BarberoDTORespuesta respuestaEsperada = new BarberoDTORespuesta(id, "Juan Perez", nuevoEmail, "3001234567", "ACTIVO");

        when(barberoRepository.save(any(BarberoEntity.class))).thenReturn(entityActualizada);
        when(modelMapper.map(any(BarberoEntity.class), eq(BarberoDTORespuesta.class))).thenReturn(respuestaEsperada);

        // ACT
        BarberoDTORespuesta resultado = barberoService.update(id, dto);

        // ASSERT
        assertEquals(nuevoEmail, resultado.getEmail());
        verify(barberoRepository, times(1)).existsByEmail(nuevoEmail);
        verify(barberoRepository, times(1)).save(any(BarberoEntity.class));
    }

    @Test
    void update_debeLanzarExcepcion_cuandoNuevoEmailEstaDuplicado() {
        // ARRANGE
        Integer id = 100;
        String emailDuplicado = "otro@email.com";
        BarberoDTOPeticion dto = new BarberoDTOPeticion(id, "Juan Perez", emailDuplicado, "3001234567", "ACTIVO");

        when(barberoRepository.findById(id)).thenReturn(Optional.of(barberoEntityActivo));
        when(barberoRepository.existsByEmail(emailDuplicado)).thenReturn(true);

        // ACT & ASSERT
        RuntimeException excepcion = assertThrows(RuntimeException.class, () -> {
            barberoService.update(id, dto);
        });
        assertEquals("CONFLICT", excepcion.getMessage());
        verify(barberoRepository, never()).save(any(BarberoEntity.class));
    }

    @Test
    void update_debeLanzarExcepcion_cuandoIdEnDTONoCoincideConPathId() {
        // ARRANGE
        Integer pathId = 100;
        Integer dtoId = 999;
        BarberoDTOPeticion dto = new BarberoDTOPeticion(dtoId, "Juan", "j@b.com", "300", "ACTIVO");

        when(barberoRepository.findById(pathId)).thenReturn(Optional.of(barberoEntityActivo));

        // ACT & ASSERT
        RuntimeException excepcion = assertThrows(RuntimeException.class, () -> {
            barberoService.update(pathId, dto);
        });
        assertEquals("BAD_REQUEST", excepcion.getMessage());
        verify(barberoRepository, never()).save(any(BarberoEntity.class));
    }
}