package co.edu.unicauca.microUsuarios.services.exceptions;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String msg) { super(msg); }
}