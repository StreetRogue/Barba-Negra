# ============================
# STAGE 1 — Build the JAR
# ============================
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copiar pom.xml y preparar dependencias
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Copiar el código fuente
COPY src ./src

# Construir el proyecto
RUN mvn -B package -DskipTests


# ============================
# STAGE 2 — Runtime image
# ============================
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

EXPOSE 5000

# Copiar el jar generado
COPY --from=build /app/target/*.jar app.jar

# Ejecutar el microservicio
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
