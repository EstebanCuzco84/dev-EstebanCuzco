package com.test.resource;

import org.eclipse.microprofile.faulttolerance.CircuitBreaker;
import org.eclipse.microprofile.faulttolerance.Fallback;
import org.eclipse.microprofile.faulttolerance.Retry;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;

@Path("/api/v2/move")
public class MoverRecurso {

	@Inject
    @RestClient
	PokeApiClient pokeApiClient;
	
	@GET
    @Produces(MediaType.APPLICATION_JSON)
    @Retry(maxRetries = 3, delay = 500) 
    @CircuitBreaker(requestVolumeThreshold = 4, failureRatio = 0.5, delay = 5000)
    @Fallback(fallbackMethod = "fallbackMoves")
	public String getMovimiento(@Context HttpHeaders headers) {
		
		System.out.println("Cabeceras entrantes: " + headers.getRequestHeaders());
		return pokeApiClient.getMover();
		
	}
	
	public String fallbackMoves(@Context HttpHeaders headers) {
        return "{ \"error\": \"No se puede obtener los movimientos de la PokeAPI... .\" }";
    }
}
