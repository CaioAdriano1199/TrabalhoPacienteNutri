// --- Referências aos modais ---
const modalcadastro = document.getElementById("modalcadastro");
const modaled = document.getElementById("modaledicao");
const modalEditarDieta = document.getElementById("modalEditarDieta");
const modalinfos = document.getElementById("modalinfos");
const consultaModal = document.getElementById('consultaModal');
const detalhesModal = document.getElementById('detalhesModal');

// --- Botões ---
const openBtn = document.getElementById("openModalBtn");
const closeBtnC = document.getElementById("closemcadastro");
const closeBtnE = document.getElementById("closemeditar");
const closeBtnInfo = document.getElementById("closeminfos");
const closebtInfoC = document.getElementById("closeDetalhes");

// --- Telas ---
const telainic = document.querySelector('.telainic');
const telapaciente = document.querySelector('.telapaciente');
const telaconsulta = document.querySelector('.telaconsulta');

// --- Dados ---
let pacientes = [];
let pacienteAtual = null;
let consultas = [];



// --- Funções de troca de tela ---
function mostrarInicio() {
    telainic.classList.remove('escondido');
    telapaciente.classList.add('escondido');
    telaconsulta.classList.add('escondido');
}

function mostrarPaciente() {
    telainic.classList.add('escondido');
    telapaciente.classList.remove('escondido');
    telaconsulta.classList.add('escondido');
}

function mostrarConsulta() {
    telainic.classList.add('escondido');
    telapaciente.classList.add('escondido');
    telaconsulta.classList.remove('escondido');
    preencherSelectPacientes();
}

// --- Modais ---
openBtn.onclick = () => { modalcadastro.style.display = "block"; };
closeBtnC.onclick = () => { modalcadastro.style.display = "none"; };        
closeBtnInfo.onclick = () => { modalinfos.style.display = "none"; };        
closeBtnE.onclick = () => { modaled.style.display = "none"; };
closeBtnE.onclick = () => { modaled.style.display = "none"; };
closebtInfoC.onclick = () => { detalhesModal.style.display = "none"; };
window.addEventListener("click", e => {
    [modalcadastro, modaled, modalinfos, modalEditarDieta, consultaModal, detalhesModal].forEach(m => {
        if (e.target == m) m.style.display = "none";
    });
});

// --- Modal Nova Consulta ---
function abrirmodlconsulta() {
    consultaModal.style.display = 'block';
}
function fecharModalNovaconsulta() {
    consultaModal.style.display = 'none';
}

// --- Preview foto ---
const fotoInput = document.getElementById("foto");
const preview = document.getElementById("preview");
fotoInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => { preview.src = reader.result; preview.style.display = "block"; };
        reader.readAsDataURL(file);
    } else preview.style.display = "none";
});

// --- Carregar pacientes ---
async function carregarPacientes() {
    try {
        const res = await fetch('pacientes.json');
        pacientes = await res.json();

        const tabela = document.querySelector('.telapaciente table');
        tabela.innerHTML = `<tr><th>Nome</th></tr>`;

        pacientes.forEach(p => {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.textContent = p.nome;
            cell.style.cursor = 'pointer';
            cell.onclick = () => abrirModalInfo(p);
            row.appendChild(cell);
            tabela.appendChild(row);
        });
    } catch (err) {
        console.error("Erro ao carregar pacientes:", err);
    }
}

// --- Preencher select de pacientes ---
function preencherSelectPacientes() {
    const select = document.getElementById('pacienteSelect');
    select.innerHTML = `<option value="">Selecione um paciente</option>`;
    pacientes.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.nome;
        select.appendChild(opt);
    });
    select.onchange = () => {
        const pacienteId = parseInt(select.value);
        pacienteAtual = pacientes.find(p => p.id === pacienteId);
        mostrarDieta(pacienteAtual);
        mostrarConsultasPaciente();
    };
}

// --- Mostrar dieta ---
function mostrarDieta(paciente) {
    if (!paciente || !paciente.dieta) return;
    const tabela = document.querySelector('.tabela-consulta');
    const dias = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
    const refeicoes = ['cafeManha', 'lanche', 'almoco', 'cafeTarde', 'janta', 'ceia'];

    refeicoes.forEach((ref, i) => {
        dias.forEach((dia, j) => {
            const row = tabela.rows[i + 1];
            row.cells[j + 1].textContent = paciente.dieta[dia] ? paciente.dieta[dia][ref] || '' : '';
        });
    });
}

// --- Modal Editar Dieta ---
function abrirModalEditarDieta() {
    if (!pacienteAtual) return;
    const dias = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
    const refeicoes = ['cafeManha', 'almoco', 'cafeTarde', 'janta', 'ceia'];
    const modalTable = modalEditarDieta.querySelector('table');

    refeicoes.forEach((ref, i) => {
        dias.forEach((dia, j) => {
            const row = modalTable.rows[j + 1];
            let colIndex = i + 1;
            row.cells[colIndex].querySelector('textarea').value = pacienteAtual.dieta[dia][ref] || '';
        });
    });

    modalEditarDieta.style.display = 'block';
}
function fecharModalEditarDieta() { modalEditarDieta.style.display = 'none'; }

// --- Modal Info Paciente ---
function abrirModalInfo(p) {
    pacienteAtual = p;
    document.getElementById('PnomeCliente').textContent = p.nome;
    document.getElementById('PemailCliente').textContent = p.email;
    document.getElementById('PfoneCliente').textContent = p.telefone;
    document.getElementById('PdatanCliente').textContent = p.dataNascimento;
    document.getElementById('ProtinaCliente').textContent = p.rotina;
    document.getElementById('PpaCliente').textContent = p.preferencias;
    document.getElementById('PhobbiesCliente').textContent = p.hobbies;
    modalinfos.style.display = 'block';
    document.querySelector('.botaoinfo .infocliente').onclick = () => abrirpacedit(p);
}

// --- Modal Editar Paciente ---
function abrirpacedit(p) {
    const form = modaled.querySelector('form');
    form.querySelectorAll('input')[0].value = p.nome;
    form.querySelectorAll('input')[1].value = p.email;
    form.querySelectorAll('input')[2].value = p.telefone;
    form.querySelectorAll('input')[3].value = p.dataNascimento;
    form.querySelectorAll('textarea')[0].value = p.rotina;
    form.querySelectorAll('textarea')[1].value = p.preferencias;
    form.querySelectorAll('textarea')[2].value = p.hobbies;
    modaled.style.display = 'block';
    modalinfos.style.display = 'none';
}

// --- Carregar consultas ---
async function carregarConsultas() {
    try {
        const res = await fetch('consultas.json');
        consultas = await res.json();
    } catch (err) {
        console.error("Erro ao carregar consultas:", err);
    }
}

// --- Mostrar consultas do paciente ---
function mostrarConsultasPaciente() {
    if (!pacienteAtual) return;
    const tabela = document.querySelector('.tabelaHconsulta table');
    tabela.innerHTML = `<tr><th>Consultas</th></tr>`;

    const pacConsultas = consultas.find(c => c.pacienteId === pacienteAtual.id);
    if (pacConsultas && pacConsultas.consultas.length) {
        pacConsultas.consultas.forEach(c => {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.textContent = c.data;
            cell.style.cursor = 'pointer';
            cell.onclick = () => abrirModalConsulta(c);
            row.appendChild(cell);
            tabela.appendChild(row);
        });
    }
}

// --- Modal Detalhes da Consulta ---
function abrirModalConsulta(consulta) {
    document.getElementById('detData').textContent = consulta.data;
    document.getElementById('detFeedback').textContent = consulta.feedback;
    document.getElementById('detPeso').textContent = consulta.peso;
    document.getElementById('detObs').textContent = consulta.observacoes;
    const img = document.getElementById('detFoto');
    if (consulta.foto) {
        img.src = consulta.foto;
        img.style.display = 'block';
    } else {
        img.style.display = 'none';
    }
    detalhesModal.style.display = 'block';
}

// --- Inicialização ---
window.onload = () => {
    carregarPacientes();
    carregarConsultas();
    mostrarInicio();
};
