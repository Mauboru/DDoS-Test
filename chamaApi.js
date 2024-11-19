const btnEditarUsuario = document.getElementById('btnEditarUsuario');
const corpoTabelaPersonagens = document.getElementById('corpoTabelaPersonagens');
const botaoChamarAPI = document.getElementById('botaoChamarAPI');

botaoChamarAPI.addEventListener('click', () => {
    buscarDadosEPreencherTabela();
});

const botaoDDOS = document.getElementById('botaoDDOS');

botaoDDOS.addEventListener('click', () => {
    inserirMuitosUsuarios();
});

document.addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('btn-delete')) {
        const idUsuario = event.target.dataset.id;
        deletarUsuario(idUsuario);
    }
});

function inserirMuitosUsuarios() {
    const numeroDeUsuarios = 100;

    for (let i = 0; i < numeroDeUsuarios; i++) {
        const nome = `Usuario${i}`;
        const email = `usuario${i}@exemplo.com`;
        const disciplina = `Disciplina${i}`;
        const senha = 'senha123';

        cadastrarUsuario(nome, email, disciplina, senha);
    }
}

document.querySelector('#btnCadastrarUsuario').addEventListener('click', function () {
    const nome = document.querySelector('#nome').value;
    const email = document.querySelector('#email').value;
    const disciplina = document.querySelector('#disciplina').value;
    const senha = document.querySelector('#senha').value;

    cadastrarUsuario(nome, email, disciplina, senha);
});

function buscarDadosEPreencherTabela() {
    axios.get('http://infopguaifpr.com.br:3052/listarTodosUsuarios')
        .then(response => {
            console.log(response.data.usuarios)

            const usuarios = response.data.usuarios;

            preencherTabela(usuarios);
        })
        .catch(error => {
            console.error('Error fetching character data:', error);
        });
}

function cadastrarUsuario(nome, email, disciplina, senha) {
    console.log('Dados capturados para cadastro:');
    console.log('Nome:', nome);
    console.log('Email:', email);
    console.log('Disciplina:', disciplina);
    console.log('Senha:', senha);

    const novoUsuario = {
        nome: nome,
        email: email,
        disciplina: disciplina,
        senha: senha
    };

    axios.post('http://infopguaifpr.com.br:3052/cadastrarUsuario', novoUsuario, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log('Usuário cadastrado com sucesso:', response.data);
            $('#cadastrarUsuario').modal('hide');

            buscarDadosEPreencherTabela()
        })
        .catch(error => {
            // alert('Erro ao cadastrar usuário:', error)
        });
}

function deletarUsuario(idUsuario) {
    axios.delete(`http://infopguaifpr.com.br:3052/deletarUsuario/${idUsuario}`)
        .then(response => {
            console.log('Usuario excluido com suceso')
            alert('Usuario excluido com sucesso')
            buscarDadosEPreencherTabela()
        })
        .catch(error => {
            console.error('Erro ao deletar:', error);
        });
}

function preencherTabela(usuarios) {
    usuarios.forEach(usuario => {
        const linha = document.createElement('tr');
        const idCelula = document.createElement('td');

        idCelula.textContent = usuario.id;
        linha.appendChild(idCelula);

        const nomeCelula = document.createElement('td');
        nomeCelula.textContent = usuario.nome;
        linha.appendChild(nomeCelula);

        const emailCelula = document.createElement('td');
        emailCelula.textContent = usuario.email;
        linha.appendChild(emailCelula);

        const disciplinaCelula = document.createElement('td');
        disciplinaCelula.textContent = usuario.disciplina;
        linha.appendChild(disciplinaCelula);

        const acoesCelula = document.createElement('td');
        const editarBotao = document.createElement('a');

        editarBotao.href = '#';
        editarBotao.className = 'btn btn-primary btn-edit';
        editarBotao.textContent = 'Editar';
        editarBotao.dataset.id = usuario.id;
        editarBotao.dataset.toggle = 'modal';
        editarBotao.dataset.target = '#editarUsuario';

        editarBotao.addEventListener('click', function () {
            const idUsuario = editarBotao.dataset.id;
            abrirModalEdicao(idUsuario);
        });

        acoesCelula.appendChild(editarBotao);

        const excluirBotao = document.createElement('a');
        excluirBotao.href = '#';
        excluirBotao.className = 'btn btn-danger btn-delete';
        excluirBotao.textContent = 'Excluir';
        excluirBotao.dataset.id = usuario.id;
        acoesCelula.appendChild(excluirBotao);

        linha.appendChild(acoesCelula);

        corpoTabelaPersonagens.appendChild(linha);
    });
}

function abrirModalEdicao(idUsuario) {
    const modalEditar = document.getElementById('editarUsuario');
    modalEditar.style.display = 'block';

    console.log('ID do usuário:', idUsuario);

    axios.get(`http://infopguaifpr.com.br:3052/pegarUsuarioPeloId/${idUsuario}`)
        .then(response => {
            const usuario = response.data.usuario;
            const iddoUsuario = response.data.usuario.id;
            
            console.log('ID do usuário:', iddoUsuario);
            console.log('Dados do usuário:', usuario);

            const nomeInput = document.querySelector('#nomeInput');
            const emailInput = document.querySelector('#emailInput');
            const disciplinaInput = document.querySelector('#disciplinaInput');

            if (usuario) {
                nomeInput.value = usuario.nome;
                emailInput.value = usuario.email;
                disciplinaInput.value = usuario.disciplina;
            }
        })
        .catch(error => {
            console.error('Erro ao obter dados do usuário:', error);
        });
}

function atualizarUsuario(idUsuario, nome, email, disciplina) {
    const usuarioAtualizado = {
        nome: nome,
        email: email,
        disciplina: disciplina
    };

    axios.put(`http://infopguaifpr.com.br:3052/atualizarUsuario/${idUsuario}`, usuarioAtualizado)
        .then(response => {
            console.log('Usuário atualizado com sucesso:', response.data);

            $('#editarUsuario').modal('hide');
            buscarDadosEPreencherTabela();
        })
        .catch(error => {
            console.error('Erro ao atualizar usuário:', error);
        });
}

btnEditarUsuario.addEventListener('click', function () {
    const nome = document.querySelector('#nomeInput').value;
    const email = document.querySelector('#emailInput').value;
    const disciplina = document.querySelector('#disciplinaInput').value;

    atualizarUsuario(iddoUsuario, nome, email, disciplina);
});