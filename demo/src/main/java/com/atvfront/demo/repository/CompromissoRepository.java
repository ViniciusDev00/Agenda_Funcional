package com.atvfront.demo.repository;

import com.atvfront.demo.model.CompromissoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompromissoRepository extends JpaRepository<CompromissoModel, Long> {
}