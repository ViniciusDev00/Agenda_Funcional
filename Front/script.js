// Variáveis globais
let compromissos = [];
let editando = false;
let indiceEditando = null;

// Quando a página carregar
document.addEventListener("DOMContentLoaded", function () {
  // Carregar compromissos salvos
  carregarCompromissos();

  // Configurar o formulário
  document
    .getElementById("agenda-form")
    .addEventListener("submit", salvarCompromisso);

  // Configurar botão cancelar
  document.getElementById("cancelar").addEventListener("click", cancelarEdicao);
});

// Função para carregar compromissos do localStorage
function carregarCompromissos() {
  const salvos = localStorage.getItem("compromissos");
  if (salvos) {
    compromissos = JSON.parse(salvos);
  }
  mostrarCompromissos();
}

// Função para salvar compromissos no localStorage
function salvarNaMemoria() {
  localStorage.setItem("compromissos", JSON.stringify(compromissos));
}

// Função para salvar um novo compromisso ou editar existente
function salvarCompromisso(event) {
  event.preventDefault();

  // Pegar valores do formulário
  const titulo = document.getElementById("titulo").value;
  const data = document.getElementById("data").value;
  const hora = document.getElementById("hora").value;
  const descricao = document.getElementById("descricao").value;

  if (editando) {
    // Editar compromisso existente
    compromissos[indiceEditando] = { titulo, data, hora, descricao };
    alert("Compromisso atualizado com sucesso!");
  } else {
    // Adicionar novo compromisso
    compromissos.push({ titulo, data, hora, descricao });
    alert("Compromisso adicionado com sucesso!");
  }

  // Salvar e atualizar
  salvarNaMemoria();
  mostrarCompromissos();
  limparFormulario();
}

// Função para mostrar todos os compromissos na tela
function mostrarCompromissos(filtroData = null) {
  const lista = document.getElementById("lista-compromissos");
  lista.innerHTML = "";

  // Filtrar se necessário
  const compromissosParaMostrar = filtroData
    ? compromissos.filter((c) => c.data === filtroData)
    : compromissos;

  // Adicionar cada compromisso à lista
  compromissosParaMostrar.forEach((compromisso, index) => {
    const div = document.createElement("div");
    div.className = "compromisso";
    div.innerHTML = `
      <h3>${compromisso.titulo}</h3>
      <div class="data">${compromisso.data} às ${compromisso.hora}</div>
      <div class="descricao">${compromisso.descricao || "Sem descrição"}</div>
      <div class="acoes">
        <button class="editar" onclick="editarCompromisso(${index})">Editar</button>
        <button class="excluir" onclick="excluirCompromisso(${index})">Excluir</button>
      </div>
    `;
    lista.appendChild(div);
  });
}

// Função para editar um compromisso
function editarCompromisso(index) {
  const compromisso = compromissos[index];

  // Preencher formulário
  document.getElementById("titulo").value = compromisso.titulo;
  document.getElementById("data").value = compromisso.data;
  document.getElementById("hora").value = compromisso.hora;
  document.getElementById("descricao").value = compromisso.descricao;
  document.getElementById("index-edicao").value = index;

  // Modo edição
  editando = true;
  indiceEditando = index;
  document.getElementById("cancelar").style.display = "inline-block";
}

// Função para excluir um compromisso
function excluirCompromisso(index) {
  if (confirm("Tem certeza que deseja excluir este compromisso?")) {
    compromissos.splice(index, 1);
    salvarNaMemoria();
    mostrarCompromissos();
    alert("Compromisso excluído!");
  }
}

// Função para cancelar edição
function cancelarEdicao() {
  limparFormulario();
  editando = false;
  indiceEditando = null;
  document.getElementById("cancelar").style.display = "none";
}

// Função para limpar o formulário
function limparFormulario() {
  document.getElementById("agenda-form").reset();
  document.getElementById("index-edicao").value = "";
}

// Função para filtrar por data
function filtrar() {
  const data = document.getElementById("filtro-data").value;
  if (data) {
    mostrarCompromissos(data);
  } else {
    alert("Selecione uma data para filtrar");
  }
}

// Função para limpar filtro
function limparFiltro() {
  document.getElementById("filtro-data").value = "";
  mostrarCompromissos();
}
