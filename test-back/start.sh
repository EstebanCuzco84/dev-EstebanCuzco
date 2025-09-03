#!/bin/bash
APP_PROPIEDAD=${1:-application.properties}
echo "Iniciando QUARKUS...: $APP_PROPIEDAD"
./mvnw quarkus:dev -Dquarkus.config.location=$APP_PROPIEDAD