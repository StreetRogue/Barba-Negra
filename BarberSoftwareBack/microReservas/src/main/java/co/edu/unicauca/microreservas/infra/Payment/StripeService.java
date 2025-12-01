package co.edu.unicauca.microreservas.infra.Payment;

import co.edu.unicauca.microreservas.fachadaServices.services.IPasarelaPagoService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class StripeService implements IPasarelaPagoService {

    @Value("${stripe.api.key}")
    private String secretKey;

    @Value("${stripe.currency}")
    private String currency;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    @Override
    public String procesarPago(BigDecimal monto, String tokenPago) {
        try {
            // Convertir a centavos de forma segura
            long montoEnCentavos = monto.multiply(new BigDecimal("100")).longValueExact();

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(montoEnCentavos)
                    .setCurrency(this.currency) // Ahora sí reconocerá la variable
                    .setPaymentMethod(tokenPago)
                    .setConfirm(true)
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .setAllowRedirects(PaymentIntentCreateParams.AutomaticPaymentMethods.AllowRedirects.NEVER)
                                    .build()
                    )
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);
            return paymentIntent.getId();

        } catch (StripeException e) {
            throw new RuntimeException("ERROR_PAGO_STRIPE: " + e.getUserMessage());
        } catch (ArithmeticException e) {
            throw new RuntimeException("ERROR_ARITMETICO: El monto tiene decimales no válidos para la moneda.");
        }
    }
}