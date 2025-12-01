# ============================
# 1️⃣ Etapa de construcción
# ============================
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copiar pom.xml primero (mejor caching)
COPY pom.xml .

# Descargar dependencias
RUN mvn -B dependency:go-offline

# Copiar el código fuente
COPY src ./src

# Compilar el proyecto
RUN mvn -B package -DskipTests


# ============================
# 2️⃣ Etapa final (más liviana)
# ============================
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copiar el .jar construido desde el builder
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
