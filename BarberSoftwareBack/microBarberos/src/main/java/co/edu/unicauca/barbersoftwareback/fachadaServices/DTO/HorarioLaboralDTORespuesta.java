package co.edu.unicauca.barbersoftwareback.fachadaServices.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HorarioLaboralDTORespuesta {

    private Integer id;

    private Integer idBarbero;
    private String nombreBarbero;

    private Integer diaSemana;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaInicio;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaFin;

    private Boolean esDiaLibre;
}