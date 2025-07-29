// =================================
// CONFIGURAÇÃO
// =================================
const api = axios.create({
    baseURL: "http://localhost:8080/api"
});

// Elementos do DOM
const compromissoForm = document.getElementById("compromisso-form");
const listaCompromissos = document.getElementById("lista-compromissos");
const loadingOverlay = document.getElementById("loading-overlay");
const formCompromissoTitulo = document.getElementById("form-compromisso-titulo");
const btnCancelar = document.getElementById("btn-cancelar");

// =================================
// FUNÇÕES DE UTILIDADE
// =================================
const showLoading = (show) => loadingOverlay.classList.toggle('hidden', !show);
const showToast = (message, type = 'sucesso') => {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
};

// =================================
// FUNÇÕES DE RENDERIZAÇÃO
// =================================
const renderizarCompromissos = (compromissos) => {
    listaCompromissos.innerHTML = '';
    if (compromissos.length === 0) {
        listaCompromissos.innerHTML = '<p class="placeholder-text">Sua agenda está vazia.</p>';
        return;
    }
    compromissos.forEach(c => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'compromisso-item';
        itemDiv.innerHTML = `
            <h3>${c.descricao}</h3>
            <div class="compromisso-info">
                <span><i class="fas fa-calendar-day"></i> ${new Date(c.data + 'T00:00:00').toLocaleDateString()}</span>
                <span><i class="fas fa-clock"></i> ${c.hora.substring(0, 5)}</span>
            </div>
            <div class="compromisso-acoes">
                <button class="botao-editar" onclick="prepararEdicaoCompromisso(${c.id})"><i class="fas fa-pencil-alt"></i></button>
                <button class="botao-excluir" onclick="excluirCompromisso(${c.id})"><i class="fas fa-trash"></i></button>
            </div>
        `;
        listaCompromissos.appendChild(itemDiv);
    });
};

// =================================
// FUNÇÕES DE API
// =================================
const carregarDadosIniciais = async () => {
    showLoading(true);
    try {
        const response = await api.get('/compromissos');
        renderizarCompromissos(response.data);
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        showToast(`Falha ao carregar dados: ${error.message}`, "erro");
    } finally {
        showLoading(false);
    }
};

const salvarCompromisso = async (event) => {
    event.preventDefault();
    const id = document.getElementById('compromisso-id').value;
    const compromisso = {
        descricao: document.getElementById('descricao').value,
        data: document.getElementById('data').value,
        hora: document.getElementById('hora').value + ":00",
    };
    const isEditing = !!id;
    showLoading(true);
    try {
        if (isEditing) {
            await api.put(`/compromissos/${id}`, compromisso);
        } else {
            await api.post('/compromissos', compromisso);
        }
        showToast(`Compromisso ${isEditing ? 'atualizado' : 'salvo'} com sucesso!`);
        resetarFormularioCompromisso();
        await carregarDadosIniciais();
    } catch (error) {
        console.error("Erro ao salvar compromisso:", error);
        const errorMessage = error.response?.data || error.message;
        showToast(`Erro: ${errorMessage}`, "erro");
    } finally {
        showLoading(false);
    }
};

const prepararEdicaoCompromisso = async (id) => {
    showLoading(true);
    try {
        const response = await api.get(`/compromissos/${id}`);
        const c = response.data;
        document.getElementById('compromisso-id').value = c.id;
        document.getElementById('descricao').value = c.descricao;
        document.getElementById('data').value = c.data;
        document.getElementById('hora').value = c.hora.substring(0, 5);
        formCompromissoTitulo.textContent = "Editar Compromisso";
        btnCancelar.classList.remove('hidden');
        document.getElementById('compromisso-form-card').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error("Erro ao buscar compromisso para edição:", error);
        showToast("Falha ao carregar dados para edição.", "erro");
    } finally {
        showLoading(false);
    }
};

const excluirCompromisso = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este compromisso?")) return;
    showLoading(true);
    try {
        await api.delete(`/compromissos/${id}`);
        showToast("Compromisso excluído com sucesso!");
        await carregarDadosIniciais();
    } catch (error) {
        console.error("Erro ao excluir compromisso:", error);
        const errorMessage = error.response?.data || error.message;
        showToast(`Erro: ${errorMessage}`, "erro");
    } finally {
        showLoading(false);
    }
};

// =================================
// MANIPULADORES DE EVENTOS
// =================================
const resetarFormularioCompromisso = () => {
    compromissoForm.reset();
    document.getElementById('compromisso-id').value = '';
    formCompromissoTitulo.textContent = "Adicionar Compromisso";
    btnCancelar.classList.add('hidden');
};

compromissoForm.addEventListener('submit', salvarCompromisso);
btnCancelar.addEventListener('click', resetarFormularioCompromisso);

document.addEventListener('DOMContentLoaded', carregarDadosIniciais);
