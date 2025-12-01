# Imagen base ligera con Java 17 para Spring Boot
FROM eclipse-temurin:17-jdk-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Variable que apunta al .jar generado por Maven
ARG JAR_FILE=target/*.jar

# Copiamos el .jar del proyecto al contenedor
COPY ${JAR_FILE} app.jar

# Exponemos el puerto de tu API Gateway
ENV PORT=8080
EXPOSE 8080

# Comando para iniciar Spring Boot dentro del contenedor
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
