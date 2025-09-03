package com.test.resource;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

@QuarkusTest
class TestResourceTest {
    /*@Test
    void testHelloEndpoint() {
        given()
          .when().get("/api/v1/test")
          .then()
             .statusCode(200)
             .body(is("Hello from Quarkus REST"));
    }
*/
	
	@Test
    public void testApiV1TestEndpoint() {
		given()
	      .contentType("text/plain")
	      .queryParam("parametro1", "hola")
	      .queryParam("parametro2", "mundo")
	      .queryParam("parametro3", "desde")
	      .queryParam("parametro4", "quarkus")
	      .queryParam("parametro5", "pruebas")
	      .when().post("/api/v1/test")
	      .then()
	         .statusCode(200)
	         .body(is("hola-mundo-desde-quarkus-pruebas"));
    }
}