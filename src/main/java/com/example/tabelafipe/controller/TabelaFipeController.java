package com.example.tabelafipe.controller;

import com.example.tabelafipe.model.Dados;
import com.example.tabelafipe.model.Modelos;
import com.example.tabelafipe.model.Veiculo;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@CrossOrigin(origins = "*") // Permitir todas as origens, ajuste conforme necessário
public class TabelaFipeController {

    private final RestTemplate restTemplate;
    private final String BASE_URL = "https://parallelum.com.br/fipe/api/v1/carros";

    public TabelaFipeController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping("/marcas")
    public List<Dados> getMarcas() {
        try {
            String url = BASE_URL + "/marcas";
            return List.of(restTemplate.getForObject(url, Dados[].class));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao buscar marcas", e);
        }
    }

    @GetMapping("/modelos/{marcaId}")
    public Modelos getModelos(@PathVariable String marcaId) {
        String url = BASE_URL + "/marcas/" + marcaId + "/modelos";
        return restTemplate.getForObject(url, Modelos.class);
    }

    @GetMapping("/veiculos/{marcaId}/{modeloId}/{ano}")
    public Veiculo getVeiculo(
            @PathVariable String marcaId,
            @PathVariable String modeloId,
            @PathVariable String ano) {
        String url = BASE_URL + "/marcas/" + marcaId + "/modelos/" + modeloId + "/anos/" + ano;
        return restTemplate.getForObject(url, Veiculo.class);
    }
}
