package co.edu.unicauca.microreservas.fachadaServices.services;

import java.math.BigDecimal;

public interface IPasarelaPagoService {

    String procesarPago(BigDecimal monto, String tokenPago);
}