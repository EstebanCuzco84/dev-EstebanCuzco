#!/bin/bash
set -e

echo "=================================================="
echo "  Ejecutando pruebas unitarias y de integración "
echo "=================================================="

mvn clean compile

# Ejecutar las pruebas unitarias
echo "Ejecutando pruebas unitarias..."
mvn test -Dtest=*Test

# Ejecutar pruebas de integración
echo "Ejecutando pruebas de integración..."
mvn verify -Dtest=*IT

echo "=================================================="
echo "Todas las pruebas pasaron correctamente"
echo "=================================================="