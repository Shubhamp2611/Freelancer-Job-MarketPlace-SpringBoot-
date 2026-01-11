FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/freelance-marketplace-api.jar app.jar

# Tell Render to use port 10000
EXPOSE 10000

# Use the PORT env variable
CMD ["java", "-jar", "app.jar"]