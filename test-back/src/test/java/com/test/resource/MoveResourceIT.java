package com.test.resource;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.containsString;

@QuarkusTest
public class MoveResourceIT {

    @Test
    public void testApiV2MoveEndpoint() {
        given()          
          .when().get("/api/v2/move")
          .then()
             .statusCode(200)
             // Validamos que la respuesta JSON de pokeapi contenga el nombre "tackle"
             .body(containsString("move"));
    }
}