package com.atvfront.demo.controller;

import com.atvfront.demo.model.CompromissoModel;
import com.atvfront.demo.service.CompromissoService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/compromissos")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CompromissoController {

    @Autowired
    private CompromissoService compromissoService;

    @GetMapping
    public List<CompromissoModel> listarTodosCompromissos() {
        return compromissoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompromissoModel> buscarCompromissoPorId(@PathVariable Long id) {
        return compromissoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> criarCompromisso(@RequestBody CompromissoModel compromisso) {
        try {
            CompromissoModel novoCompromisso = compromissoService.salvar(compromisso);
            return new ResponseEntity<>(novoCompromisso, HttpStatus.CREATED);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarCompromisso(@PathVariable Long id, @RequestBody CompromissoModel compromissoDetalhes) {
        try {
            CompromissoModel compromissoAtualizado = compromissoService.atualizar(id, compromissoDetalhes);
            return ResponseEntity.ok(compromissoAtualizado);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarCompromisso(@PathVariable Long id) {
        try {
            compromissoService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}