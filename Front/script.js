document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("agenda-form");
  const lista = document.getElementById("lista-compromissos");
  const cancelarBtn = document.getElementById("cancelar-edicao");

  function salvarLS(compromissos) {
    localStorage.setItem("agenda", JSON.stringify(compromissos));
  }

  function carregarLS() {
    return JSON.parse(localStorage.getItem("agenda") || "[]");
  }

  function popup(mensagem, cor = "#28a745") {
    const box = document.getElementById("popup");
    box.textContent = mensagem;
    box.style.backgroundColor = cor;
    box.classList.add("show");
    setTimeout(() => box.classList.remove("show"), 3000);
  }

  function renderizar(filtro = null) {
    const compromissos = carregarLS();
    lista.innerHTML = "";

    compromissos
      .filter((c) => !filtro || c.data === filtro)
      .sort(
        (a, b) =>
          new Date(`${a.data}T${a.hora}`) - new Date(`${b.data}T${b.hora}`)
      )
      .forEach((c, i) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${c.data} ${c.hora}</strong><br>
          <b>${c.titulo}</b><br>
          <p>${c.descricao || ""}</p>
          <div class="actions">
            <button class="edit" onclick="editar(${i})">Editar</button>
            <button class="delete" onclick="remover(${i})">Excluir</button>
          </div>
        `;
        lista.appendChild(li);
      });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const titulo = document.getElementById("titulo").value;
    const data = document.getElementById("data").value;
    const hora = document.getElementById("hora").value;
    const descricao = document.getElementById("descricao").value;
    const index = document.getElementById("index-edicao").value;
    const listaAtual = carregarLS();

    const compromisso = { titulo, data, hora, descricao };

    if (index) {
      listaAtual[index] = compromisso;
      popup("Compromisso editado com sucesso!", "#17a2b8");
      cancelarBtn.style.display = "none";
    } else {
      listaAtual.push(compromisso);
      popup("Compromisso adicionado!");
    }

    salvarLS(listaAtual);
    renderizar();
    form.reset();
    document.getElementById("index-edicao").value = "";
  });

  cancelarBtn.addEventListener("click", () => {
    form.reset();
    document.getElementById("index-edicao").value = "";
    cancelarBtn.style.display = "none";
  });

  window.editar = (i) => {
    const c = carregarLS()[i];
    document.getElementById("titulo").value = c.titulo;
    document.getElementById("data").value = c.data;
    document.getElementById("hora").value = c.hora;
    document.getElementById("descricao").value = c.descricao;
    document.getElementById("index-edicao").value = i;
    cancelarBtn.style.display = "inline-block";
  };

  window.remover = (i) => {
    const listaAtual = carregarLS();
    listaAtual.splice(i, 1);
    salvarLS(listaAtual);
    renderizar();
    popup("Compromisso excluído!", "#dc3545");
  };

  window.filtrarPorData = () => {
    const filtro = document.getElementById("filtro-data").value;
    renderizar(filtro);
    popup("Filtrando compromissos...", "#6f42c1");
  };

  window.limparFiltro = () => {
    document.getElementById("filtro-data").value = "";
    renderizar();
    popup("Filtro limpo!", "#6c757d");
  };

  renderizar();
});
