package com.test.resource;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/v1/test")
public class TestResource {
 
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response test(@QueryParam("parametro1") String parametro1,
			@QueryParam("parametro2") String parametro2,
			@QueryParam("parametro3") String parametro3,
			@QueryParam("parametro4") String parametro4,
			@QueryParam("parametro5") String parametro5) {
		
		System.out.print("parametro1: "+parametro1);
		System.out.print("parametro2: "+parametro2);
		System.out.print("parametro3: "+parametro3);
		System.out.print("parametro4: "+parametro4);
		System.out.print("parametro5: "+parametro5);
		
		if (validaParametro(parametro1) || 
		    validaParametro(parametro2) || 
		    validaParametro(parametro3) || 
		    validaParametro(parametro4) || 
		    validaParametro(parametro5)) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Todos los parámetros deben ser no nulos, no vacíos y sin caracteres peligrosos.")
                    .build();
        }
		
		String result = String.join("-", parametro1, parametro2, parametro3, parametro4, parametro5);
        return Response.ok(result).build();
		
	}
	
	private boolean validaParametro(String valor) {
        if (valor == null || valor.trim().isEmpty()) {
            return true;
        }

        String lower = valor.toLowerCase();
        return lower.contains("select") || lower.contains("insert") ||
               lower.contains("delete") || lower.contains("update") ||
               lower.contains("drop")   || lower.contains(";");
    }

}
