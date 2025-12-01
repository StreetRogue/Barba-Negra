package co.edu.unicauca.microreservas.fachadaServices.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalTime;

@Data
@NoArgsConstructor
public class HorarioExternoDTO {
    private Integer id;
    private Integer idBarbero;
    private Integer diaSemana; // 1 a 7

    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaInicio;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaFin;

    private Boolean esDiaLibre;

}