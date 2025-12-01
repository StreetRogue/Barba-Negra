package co.edu.unicauca.barbersoftwareback.fachadaServices.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HorarioLaboralDTOPeticion {

    private Integer idBarbero;

    private Integer diaSemana;

    //JsonFormat: Ayuda a Angular
    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaInicio;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaFin;

    private Boolean esDiaLibre;
}