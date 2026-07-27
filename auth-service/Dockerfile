FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", \
  "-Xmx300m", \
  "-Xms150m", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=70", \
  "-Duser.timezone=UTC", \
  "-jar", "app.jar"]