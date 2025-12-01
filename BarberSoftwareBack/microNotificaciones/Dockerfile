# ============================
# STAGE 1 — Build the JAR
# ============================
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src

RUN mvn -B package -DskipTests


# ============================
# STAGE 2 — Runtime
# ============================
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

EXPOSE 5003

COPY --from=build /app/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
