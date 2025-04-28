# backend/Dockerfile

# Start from a base Java image
FROM openjdk:21-jdk-slim

# Set working directory
WORKDIR /app

# Copy the Maven build output .jar file (make sure to run 'mvn clean package' first)
COPY target/dev-0.0.1-SNAPSHOT.jar app.jar

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]