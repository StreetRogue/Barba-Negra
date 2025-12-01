package co.edu.unicauca.microUsuarios.repositories;

import co.edu.unicauca.microUsuarios.modelos.Role;
import co.edu.unicauca.microUsuarios.modelos.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(Role role);


}

