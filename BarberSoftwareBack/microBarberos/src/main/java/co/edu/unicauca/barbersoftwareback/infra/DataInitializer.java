package co.edu.unicauca.barbersoftwareback.infra;

import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models.CategoriaEntity;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.repositories.CategoriaRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataInitializer {

    private final CategoriaRepository categoriaRepository;

    public DataInitializer(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @PostConstruct
    @Transactional
    public void initCategorias() {
        if (categoriaRepository.count() == 0) {
            categoriaRepository.save(new CategoriaEntity(null, "Marinero"));
            categoriaRepository.save(new CategoriaEntity(null, "Corsario"));
            categoriaRepository.save(new CategoriaEntity(null, "BarbaNegra"));

            System.out.println("✔ Categorías iniciales creadas");
        }
    }
}
