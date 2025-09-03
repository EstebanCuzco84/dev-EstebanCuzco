package com.test.resource;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/api/v2/move")
@RegisterRestClient(configKey = "pokeapi")
public interface PokeApiClient {

	@GET
    @Produces(MediaType.APPLICATION_JSON)
    String getMover();
}
