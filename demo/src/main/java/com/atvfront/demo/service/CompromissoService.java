package com.atvfront.demo.service;

import com.atvfront.demo.model.CategoriaModel;
import com.atvfront.demo.model.CompromissoModel;
import com.atvfront.demo.repository.CategoriaRepository;
import com.atvfront.demo.repository.CompromissoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.Optional;

@Service
public class CompromissoService {

    @Autowired
    private CompromissoRepository compromissoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<CompromissoModel> listarTodos() {
        return compromissoRepository.findAll();
    }

    public Optional<CompromissoModel> buscarPorId(Long id) {
        return compromissoRepository.findById(id);
    }

    @Transactional
    public CompromissoModel salvar(CompromissoModel compromisso) {
        // Valida se a categoria informada existe
        Long categoriaId = compromisso.getCategoria().getId();
        CategoriaModel categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new EntityNotFoundException("Categoria com ID " + categoriaId + " não encontrada."));

        compromisso.setCategoria(categoria);
        return compromissoRepository.save(compromisso);
    }

    @Transactional
    public CompromissoModel atualizar(Long id, CompromissoModel compromissoDetalhes) {
        CompromissoModel compromissoExistente = compromissoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Compromisso com ID " + id + " não encontrado."));

        Long categoriaId = compromissoDetalhes.getCategoria().getId();
        CategoriaModel categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new EntityNotFoundException("Categoria com ID " + categoriaId + " não encontrada."));

        compromissoExistente.setDescricao(compromissoDetalhes.getDescricao());
        compromissoExistente.setData(compromissoDetalhes.getData());
        compromissoExistente.setHora(compromissoDetalhes.getHora());
        compromissoExistente.setCategoria(categoria);

        return compromissoRepository.save(compromissoExistente);
    }

    public void deletar(Long id) {
        if (!compromissoRepository.existsById(id)) {
            throw new EntityNotFoundException("Compromisso com ID " + id + " não encontrado.");
        }
        compromissoRepository.deleteById(id);
    }

    public boolean existePorId(Long id) {
        return compromissoRepository.existsById(id);
    }
}