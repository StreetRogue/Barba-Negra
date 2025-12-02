package co.edu.unicauca.barbersoftwareback.fachadaServices.services;

import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models.CategoriaEntity;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.repositories.CategoriaRepository;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.CategoriaDTORespuesta;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.lang.reflect.Type;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;

@ExtendWith(MockitoExtension.class)
class CategoriaServiceImplTest {

    // ➡ Dependencias Mockeadas
    @Mock
    private CategoriaRepository servicioAccesoBaseDatos;
    @Mock
    private ModelMapper modelMapper;

    // ➡ Instancia del Servicio a Probar
    @InjectMocks
    private CategoriaServiceImpl categoriaService;

    // ➡ Datos de Prueba (Stubs)
    private CategoriaEntity categoriaEntity1;
    private CategoriaEntity categoriaEntity2;
    private CategoriaDTORespuesta categoriaDTORespuesta1;
    private CategoriaDTORespuesta categoriaDTORespuesta2;
    private List<CategoriaEntity> entityList;
    private List<CategoriaDTORespuesta> dtoList;

    @BeforeEach
    void setUp() {
        // Inicialización de Entidades
        categoriaEntity1 = new CategoriaEntity(1, "Cortes");
        categoriaEntity2 = new CategoriaEntity(2, "Tintes");
        entityList = Arrays.asList(categoriaEntity1, categoriaEntity2);

        // Inicialización de DTOs
        categoriaDTORespuesta1 = new CategoriaDTORespuesta(1, "Cortes");
        categoriaDTORespuesta2 = new CategoriaDTORespuesta(2, "Tintes");
        dtoList = Arrays.asList(categoriaDTORespuesta1, categoriaDTORespuesta2);
    }

    //---

    //## 🔍 Prueba: findAll() - Escenario Exitoso

    @Test
    void findAll_debeRetornarListaDeCategorias_cuandoExistenDatos() {
        // ARRANGE

        // 1. Simular la respuesta del repositorio (lista con datos)
        when(servicioAccesoBaseDatos.findAll()).thenReturn(entityList);

        // 2. Simular el mapeo del ModelMapper (de Entity List a DTO List)
        // Necesitamos capturar el TypeToken que se usa en el servicio
        Type listType = new TypeToken<List<CategoriaDTORespuesta>>() {}.getType();

        // Configurar el mock para que cuando se mapee la lista, devuelva la lista de DTOs
        when(modelMapper.map(eq(entityList), eq(listType))).thenReturn(dtoList);

        // ACT
        List<CategoriaDTORespuesta> resultados = categoriaService.findAll();

        // ASSERT
        assertNotNull(resultados, "La lista no debería ser nula");
        assertEquals(2, resultados.size(), "Debe retornar 2 elementos");
        assertEquals("Cortes", resultados.get(0).getNombre());

        // Verificar que el repositorio fue llamado una sola vez
        verify(servicioAccesoBaseDatos, times(1)).findAll();
        // Verificar que el mapeador fue llamado una sola vez con los argumentos correctos
        verify(modelMapper, times(1)).map(eq(entityList), eq(listType));
    }

    // ---

    //## 🚫 Prueba: findAll() - Escenario Lista Vacía

    @Test
    void findAll_debeLanzarExcepcion_cuandoListaEstaVacia() {
        // ARRANGE

        // Simular la respuesta del repositorio (lista vacía)
        when(servicioAccesoBaseDatos.findAll()).thenReturn(Collections.emptyList());

        // ACT & ASSERT

        // Verificar que se lanza la RuntimeException con el mensaje "NOT_FOUND"
        RuntimeException excepcion = assertThrows(RuntimeException.class, () -> {
            categoriaService.findAll();
        });

        assertEquals("NOT_FOUND", excepcion.getMessage());

        // Verificar que el repositorio fue llamado una sola vez
        verify(servicioAccesoBaseDatos, times(1)).findAll();
        // Verificar que el mapeador NUNCA fue llamado, ya que la excepción se lanza antes
        verify(modelMapper, times(0)).map(any(), any());
    }
}