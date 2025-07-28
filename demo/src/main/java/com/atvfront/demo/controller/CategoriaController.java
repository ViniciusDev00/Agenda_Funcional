package com.atvfront.demo.controller;

import com.atvfront.demo.model.CategoriaModel;
import com.atvfront.demo.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping
    public List<CategoriaModel> listarTodasCategorias() {
        return categoriaService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaModel> buscarCategoriaPorId(@PathVariable Long id) {
        return categoriaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CategoriaModel> criarCategoria(@RequestBody CategoriaModel categoria) {
        // Remove a lista de compromissos para evitar problemas de desserialização
        categoria.setCompromissos(null);
        CategoriaModel novaCategoria = categoriaService.salvar(categoria);
        return new ResponseEntity<>(novaCategoria, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaModel> atualizarCategoria(@PathVariable Long id, @RequestBody CategoriaModel categoriaDetalhes) {
        return categoriaService.buscarPorId(id)
                .map(categoriaExistente -> {
                    categoriaExistente.setNome(categoriaDetalhes.getNome());
                    CategoriaModel categoriaAtualizada = categoriaService.salvar(categoriaExistente);
                    return ResponseEntity.ok(categoriaAtualizada);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCategoria(@PathVariable Long id) {
        if (!categoriaService.existePorId(id)) {
            return ResponseEntity.notFound().build();
        }
        categoriaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}