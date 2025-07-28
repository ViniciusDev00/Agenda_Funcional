package com.atvfront.demo.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "compromissos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompromissoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String descricao;

    @Column(nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate data;

    @Column(nullable = false)
    @JsonFormat(pattern = "HH:mm:ss") // Formato com segundos
    private LocalTime hora;

    // Muitos compromissos pertencem a uma categoria
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    @JsonIgnoreProperties("compromissos") // Evita recursão infinita
    private CategoriaModel categoria;
}