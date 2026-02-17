# Multi-stage Dockerfile for Spring Boot Backend

# ---- Build Stage ----
FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# ---- Production Stage ----
FROM eclipse-temurin:17-jre-alpine   # ← CHANGED THIS LINE
WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl          # ← Alpine uses apk, not apt-get

# Create a non-root user
RUN addgroup --system --gid 1001 appuser && \
    adduser --system --uid 1001 --gid 1001 appuser

# Copy the jar from build stage
COPY --from=build /app/target/Freelancing_Service-0.0.1-SNAPSHOT.jar app.jar

# Create upload directory
RUN mkdir -p /app/uploads && \
    chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]