package com.test.resource;

import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.logging.Logger;

import io.quarkus.scheduler.Scheduled;
import jakarta.inject.Inject;

public class TareaProgramada {
	
	private static final Logger LOG = Logger.getLogger(TareaProgramada.class);
	
	@Inject
	@RestClient
	PokeApiClient poke;

	@Scheduled(cron = "{pokeapi.cron}")
    void fetchMovesPeriodically() {
        try {
            String response = poke.getMover();
            LOG.info("Tarea programada → por tiempo establecidog en properties: " + response);
        } catch (Exception e) {
            LOG.error("Error al obtener tarea programda", e);
        }
    }
}
