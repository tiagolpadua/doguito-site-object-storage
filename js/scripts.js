// const BASE_PATH = 'http://132.226.118.209:3000/clientes'
const BASE_PATH = 'http://???:3000/clientes'

let clienteService = {};

clienteService.listaClientes = () => {
    return fetch(`${BASE_PATH}`)
        .then(resposta => {
            if (resposta.ok) {
                return resposta.json()
            }
            throw new Error('Não foi possível listar os clientes')
        })
}

clienteService.criaCliente = (nome, email) => {
    return fetch(`${BASE_PATH}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome: nome,
            email: email
        })
    })
        .then(resposta => {
            if (resposta.ok) {
                return resposta.body
            }
            throw new Error('Não foi possível criar um cliente')
        })
}

clienteService.removeCliente = (id) => {
    return fetch(`${BASE_PATH}/${id}`, {
        method: 'DELETE'
    })
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error('Não foi possível deletar um cliente')
            }
        })
}

clienteService.detalhaCliente = (id) => {
    return fetch(`${BASE_PATH}/${id}`)
        .then(resposta => {
            if (resposta.ok) {
                return resposta.json()
            }

            throw new Error('Não foi possível detalhar um cliente')
        })
}

clienteService.atualizaCliente = (id, nome, email) => {
    return fetch(`${BASE_PATH}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            nome: nome,
            email: email
        })
    })
        .then(resposta => {
            if (resposta.ok) {
                return resposta.json()
            }
            throw new Error('Não foi possível detalhar um cliente')
        })
}

const criaNovaLinha = (nome, email, id) => {
    const linhaNovoCliente = document.createElement('tr')
    const conteudo = `
      <td class="td" data-td>${nome}</td>
                  <td>${email}</td>
                  <td>
                      <ul class="tabela__botoes-controle">
                          <li><a href="../telas/edita_cliente.html?id=${id}" class="botao-simples botao-simples--editar">Editar</a></li>
                          <li><button class="botao-simples botao-simples--excluir" type="button">Excluir</button></li>
                      </ul>
                  </td> 
                  `
    linhaNovoCliente.innerHTML = conteudo
    linhaNovoCliente.dataset.id = id
    return linhaNovoCliente
}


const tabela = document.querySelector('[data-tabela]')

tabela.addEventListener('click', async (evento) => {
    let ehBotaoDeDeleta = evento.target.className === 'botao-simples botao-simples--excluir'
    if (ehBotaoDeDeleta) {
        try {
            const linhaCliente = evento.target.closest('[data-id]')
            let id = linhaCliente.dataset.id
            await clienteService.removeCliente(id)
            linhaCliente.remove()
        }
        catch (erro) {
            console.log(erro)
            window.location.href = "../telas/erro.html"
        }
    }
})


const render = async () => {
    try {
        const listaClientes = await clienteService.listaClientes()
        listaClientes.forEach(elemento => {
            tabela.appendChild(criaNovaLinha(elemento.nome, elemento.email, elemento.id))
        })
    }
    catch (erro) {
        window.alert(erro);
    }

}

render()