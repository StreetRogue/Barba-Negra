package co.edu.unicauca.microUsuarios.exceptions;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String msg) { super(msg); }
}