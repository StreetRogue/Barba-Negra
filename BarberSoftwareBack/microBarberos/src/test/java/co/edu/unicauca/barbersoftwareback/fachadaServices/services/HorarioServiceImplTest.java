package co.edu.unicauca.barbersoftwareback.fachadaServices.services;

import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models.BarberoEntity;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models.HorarioLaboralEntity;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.repositories.BarberoRepository;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.repositories.HorarioLaboralRepository;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.HorarioLaboralDTOPeticion;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.HorarioLaboralDTORespuesta;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HorarioServiceImplTest {

    // ➡ Dependencias Mockeadas
    @Mock
    private HorarioLaboralRepository horarioRepository;
    @Mock
    private BarberoRepository barberoRepository;
    @Mock
    private ModelMapper mapper;

    // ➡ Instancia del Servicio a Probar
    @InjectMocks
    private HorarioServiceImpl horarioService;

    // ➡ Datos de Prueba (Stubs)
    private BarberoEntity barbero;
    private HorarioLaboralEntity horarioEntityLunes;
    private HorarioLaboralDTOPeticion peticionLunes;
    private HorarioLaboralDTORespuesta respuestaLunes;

    @BeforeEach
    void setUp() {
        // Barbero
        barbero = new BarberoEntity(10, "Juan El Barbero", "juan@b.com", "300", "ACTIVO", Collections.emptyList());

        // Horario Entity (Lunes: 8:00 a 17:00)
        horarioEntityLunes = new HorarioLaboralEntity(
                1, 1, LocalTime.of(8, 0), LocalTime.of(17, 0),
                false, barbero
        );

        // Horario DTO Petición (Lunes: 8:00 a 17:00)
        peticionLunes = new HorarioLaboralDTOPeticion(
                10, 1, LocalTime.of(8, 0), LocalTime.of(17, 0), false
        );

        // Horario DTO Respuesta (Simulación del resultado del mapeo)
        respuestaLunes = new HorarioLaboralDTORespuesta(
                1, 10, "Juan El Barbero", 1, LocalTime.of(8, 0),
                LocalTime.of(17, 0), false
        );
    }

    // ---

    //## 🔍 Pruebas de Búsqueda por Barbero (findByBarberoId)

    @Test
    void findByBarberoId_debeRetornarLista_cuandoBarberoExisteYTieneHorarios() {
        // ARRANGE
        List<HorarioLaboralEntity> listaEntidades = Arrays.asList(horarioEntityLunes);

        // 1. Simular que el Barbero existe
        when(barberoRepository.existsById(10)).thenReturn(true);
        // 2. Simular la búsqueda de horarios
        when(horarioRepository.findByBarbero_Id(10)).thenReturn(listaEntidades);
        // 3. Simular el mapeo (la lógica manual está en mapearRespuesta)
        when(mapper.map(any(HorarioLaboralEntity.class), eq(HorarioLaboralDTORespuesta.class))).thenReturn(respuestaLunes);


        // ACT
        List<HorarioLaboralDTORespuesta> resultados = horarioService.findByBarberoId(10);

        // ASSERT
        assertFalse(resultados.isEmpty());
        assertEquals(1, resultados.size());
        assertEquals(10, resultados.get(0).getIdBarbero());
        verify(horarioRepository, times(1)).findByBarbero_Id(10);
    }

    @Test
    void findByBarberoId_debeRetornarListaVacia_cuandoBarberoExisteYNoTieneHorarios() {
        // ARRANGE
        // 1. Simular que el Barbero existe
        when(barberoRepository.existsById(10)).thenReturn(true);
        // 2. Simular la búsqueda de horarios (lista vacía)
        when(horarioRepository.findByBarbero_Id(10)).thenReturn(Collections.emptyList());

        // ACT
        List<HorarioLaboralDTORespuesta> resultados = horarioService.findByBarberoId(10);

        // ASSERT
        assertTrue(resultados.isEmpty());
        verify(horarioRepository, times(1)).findByBarbero_Id(10);
        verify(mapper, never()).map(any(), any()); // No debe intentar mapear si está vacío
    }

    @Test
    void findByBarberoId_debeLanzarExcepcion_cuandoBarberoNoExiste() {
        // ARRANGE
        // Simular que el Barbero NO existe
        when(barberoRepository.existsById(99)).thenReturn(false);

        // ACT & ASSERT
        RuntimeException excepcion = assertThrows(RuntimeException.class, () -> {
            horarioService.findByBarberoId(99);
        });

        assertEquals("NOT_FOUND", excepcion.getMessage());
        verify(horarioRepository, never()).findByBarbero_Id(anyInt()); // No debe buscar horarios
    }

    // ---

    //## 💾 Pruebas de Creación de Horario (crearHorario)

    @Test
    void crearHorario_debeGuardarHorarios_cuandoDatosSonValidos() {
        // ARRANGE
        List<HorarioLaboralDTOPeticion> listaPeticiones = Arrays.asList(
                peticionLunes,
                new HorarioLaboralDTOPeticion(10, 2, LocalTime.of(8, 0), LocalTime.of(17, 0), false) // Martes
        );

        // Simular Entidades y Respuestas
        HorarioLaboralEntity entityGuardada1 = new HorarioLaboralEntity(2, 1, LocalTime.of(8, 0), LocalTime.of(17, 0), false, barbero);
        HorarioLaboralEntity entityGuardada2 = new HorarioLaboralEntity(3, 2, LocalTime.of(8, 0), LocalTime.of(17, 0), false, barbero);
        List<HorarioLaboralEntity> listaGuardada = Arrays.asList(entityGuardada1, entityGuardada2);

        // 1. Simular la búsqueda del Barbero (Obligatorio)
        when(barberoRepository.findById(10)).thenReturn(Optional.of(barbero));

        // 2. Simular el guardado masivo (saveAll)
        when(horarioRepository.saveAll(anyList())).thenReturn(listaGuardada);

        // 3. Simular el mapeo de las respuestas (dos veces)
        when(mapper.map(any(HorarioLaboralEntity.class), eq(HorarioLaboralDTORespuesta.class)))
                .thenReturn(respuestaLunes);

        // Nota: deleteByBarbero_Id y flush son métodos void (doNothing() es el default)

        // ACT
        List<HorarioLaboralDTORespuesta> resultados = horarioService.crearHorario(listaPeticiones);

        // ASSERT
        assertFalse(resultados.isEmpty());
        assertEquals(2, resultados.size());

        // Verificar interacciones críticas
        verify(horarioRepository, times(1)).deleteByBarbero_Id(10);
        verify(horarioRepository, times(1)).flush();
        verify(horarioRepository, times(1)).saveAll(anyList());
        // Se llama el mapeador 2 veces (una por cada elemento en la lista guardada)
        verify(mapper, times(2)).map(any(HorarioLaboralEntity.class), eq(HorarioLaboralDTORespuesta.class));
    }

    @Test
    void crearHorario_debeLanzarExcepcion_cuandoListaVaciaONula() {
        // ACT & ASSERT
        RuntimeException excepcionVacia = assertThrows(RuntimeException.class, () -> {
            horarioService.crearHorario(Collections.emptyList());
        });
        assertEquals("BAD_REQUEST", excepcionVacia.getMessage());

        RuntimeException excepcionNula = assertThrows(RuntimeException.class, () -> {
            horarioService.crearHorario(null);
        });
        assertEquals("BAD_REQUEST", excepcionNula.getMessage());

        verify(barberoRepository, never()).findById(anyInt());
    }

    @Test
    void crearHorario_debeLanzarExcepcion_cuandoBarberoNoExiste() {
        // ARRANGE
        List<HorarioLaboralDTOPeticion> listaPeticiones = Arrays.asList(peticionLunes);

        // Simular que el Barbero NO existe
        when(barberoRepository.findById(10)).thenReturn(Optional.empty());

        // ACT & ASSERT
        RuntimeException excepcion = assertThrows(RuntimeException.class, () -> {
            horarioService.crearHorario(listaPeticiones);
        });

        assertEquals("NOT_FOUND", excepcion.getMessage());
        verify(horarioRepository, never()).saveAll(anyList());
    }

    @Test
    void crearHorario_debeLanzarExcepcion_cuandoHoraFinEsAnteriorAHoraInicio() {
        // ARRANGE
        HorarioLaboralDTOPeticion peticionInvalida = new HorarioLaboralDTOPeticion(
                10, 1, LocalTime.of(18, 0), LocalTime.of(8, 0), false // 18:00 a 8:00 (Invalido)
        );
        List<HorarioLaboralDTOPeticion> listaPeticiones = Arrays.asList(peticionInvalida);

        // 1. Simular la búsqueda del Barbero
        when(barberoRepository.findById(10)).thenReturn(Optional.of(barbero));

        // ACT & ASSERT
        // La excepción se lanza dentro del bucle llamando a validarHoras
        RuntimeException excepcion = assertThrows(RuntimeException.class, () -> {
            horarioService.crearHorario(listaPeticiones);
        });

        assertEquals("BAD_REQUEST", excepcion.getMessage());
        verify(horarioRepository, never()).saveAll(anyList());
    }

    @Test
    void crearHorario_debeLanzarExcepcion_cuandoEsLaboralPeroFaltaHora() {
        // ARRANGE
        HorarioLaboralDTOPeticion peticionInvalida = new HorarioLaboralDTOPeticion(
                10, 1, LocalTime.of(8, 0), null, false // Es laboral, falta horaFin
        );
        List<HorarioLaboralDTOPeticion> listaPeticiones = Arrays.asList(peticionInvalida);

        when(barberoRepository.findById(10)).thenReturn(Optional.of(barbero));

        // ACT & ASSERT
        RuntimeException excepcion = assertThrows(RuntimeException.class, () -> {
            horarioService.crearHorario(listaPeticiones);
        });

        assertEquals("BAD_REQUEST", excepcion.getMessage());
        verify(horarioRepository, never()).saveAll(anyList());
    }


    // ---

    //## ✏ Pruebas de Actualización de Horario (update)

    @Test
    void update_debeActualizarHorario_conHorasValidas() {
        // ARRANGE
        Integer horarioId = 1;
        LocalTime nuevaHoraInicio = LocalTime.of(9, 0);
        HorarioLaboralDTOPeticion dto = new HorarioLaboralDTOPeticion(
                10, 1, nuevaHoraInicio, LocalTime.of(18, 0), false
        );

        HorarioLaboralEntity entityOriginal = new HorarioLaboralEntity(
                horarioId, 1, LocalTime.of(8, 0), LocalTime.of(17, 0), false, barbero
        );
        HorarioLaboralEntity entityActualizada = new HorarioLaboralEntity(
                horarioId, 1, nuevaHoraInicio, LocalTime.of(18, 0), false, barbero
        );

        // 1. Simular la búsqueda del horario
        when(horarioRepository.findById(horarioId)).thenReturn(Optional.of(entityOriginal));
        // 2. Simular el guardado
        when(horarioRepository.save(any(HorarioLaboralEntity.class))).thenReturn(entityActualizada);
        // 3. Simular el mapeo
        when(mapper.map(any(HorarioLaboralEntity.class), eq(HorarioLaboralDTORespuesta.class))).thenReturn(respuestaLunes); // Usamos el stub, ignorando los detalles internos

        // ACT
        horarioService.update(horarioId, dto);

        // ASSERT
        verify(horarioRepository, times(1)).findById(horarioId);
        verify(horarioRepository, times(1)).save(any(HorarioLaboralEntity.class));
    }

    @Test
    void update_debeLanzarExcepcion_cuandoHoraFinEsAnteriorAHoraInicio() {
        // ARRANGE
        Integer horarioId = 1;
        HorarioLaboralDTOPeticion dto = new HorarioLaboralDTOPeticion(
                10, 1, LocalTime.of(10, 0), LocalTime.of(9, 0), false
        );

        // Entidad original (debe ser encontrada para que la validación ocurra)
        when(horarioRepository.findById(horarioId)).thenReturn(Optional.of(horarioEntityLunes));

        // ACT & ASSERT
        RuntimeException excepcion = assertThrows(RuntimeException.class, () -> {
            horarioService.update(horarioId, dto);
        });

        assertEquals("BAD_REQUEST", excepcion.getMessage());
        verify(horarioRepository, never()).save(any(HorarioLaboralEntity.class));
    }

    @Test
    void update_debeLanzarExcepcion_cuandoHorarioNoExiste() {
        // ARRANGE
        Integer horarioId = 99;
        HorarioLaboralDTOPeticion dto = new HorarioLaboralDTOPeticion();

        when(horarioRepository.findById(horarioId)).thenReturn(Optional.empty());

        // ACT & ASSERT
        RuntimeException excepcion = assertThrows(RuntimeException.class, () -> {
            horarioService.update(horarioId, dto);
        });

        assertEquals("NOT_FOUND", excepcion.getMessage());
        verify(horarioRepository, never()).save(any(HorarioLaboralEntity.class));
    }
}