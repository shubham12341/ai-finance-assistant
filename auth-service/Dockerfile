FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy parent pom first
COPY pom.xml /app/parent-pom.xml

# Copy service files
COPY auth-service/pom.xml .
COPY auth-service/src ./src

# Install parent pom
RUN mvn install -f /app/parent-pom.xml -N -DskipTests

# Build service
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-Duser.timezone=UTC", "-jar", "app.jar"]