package com.atvfront.demo.service;

import com.atvfront.demo.model.CategoriaModel;
import com.atvfront.demo.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<CategoriaModel> listarTodas() {
        return categoriaRepository.findAll();
    }

    public Optional<CategoriaModel> buscarPorId(Long id) {
        return categoriaRepository.findById(id);
    }

    public CategoriaModel salvar(CategoriaModel categoria) {
        return categoriaRepository.save(categoria);
    }

    public void deletar(Long id) {
        categoriaRepository.deleteById(id);
    }

    public boolean existePorId(Long id) {
        return categoriaRepository.existsById(id);
    }
}