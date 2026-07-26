FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app

COPY pom.xml /app/parent-pom.xml
COPY ai-chat-service/pom.xml .
COPY ai-chat-service/src ./src

RUN mvn install -f /app/parent-pom.xml -N -DskipTests
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-Duser.timezone=UTC", "-jar", "app.jar"]