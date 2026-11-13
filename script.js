console.log("O script da VasCoffee foi carregado!");

const agora = new Date();
const hora = agora.getHours();
const minutos = agora.getMinutes();
const diaDaSemana = agora.getDay();
let nomeDia = diaDaSemana; // daqui até linha 26 byPedro


if (nomeDia === 1) {
    nomeDia = "segunda - feira";
} else if (nomeDia === 2) {
    nomeDia = "terca - feira";
} else if (nomeDia === 3) {
    nomeDia = "quarta - feira";
} else if (nomeDia === 4) {
    nomeDia = "quinta - feira";
} else if (nomeDia === 5) {
    nomeDia = "sexta - feira";
} else if (nomeDia === 6) {
    nomeDia = "sabado";
} else if (nomeDia === 0) {
    nomeDia = "domingo";
}

// até aqui byPedro

console.log("Agora são ", hora,":",minutos," Dia da semana:",nomeDia);

function saudacao(h) {
    if (h < 12) {
        return "Bom dia! ☀️";
    } else if (h < 18) {
        return "Boa tarde! 🌤️";
    } else {
        return "Boa noite! 🌙";
    }
}

document.querySelector('#saudacao').textContent = saudacao(hora);

function estaAberto(dia , h) {
    if (dia === 0) {
        return false;
    } else if (dia === 6) {
        return h >= 8 && h < 18;
    } else {
        return h >= 7 && h < 20
    }
}

const avisoStatus =document.querySelector('#status');

if (estaAberto(diaDaSemana, hora)) {
    avisoStatus.textContent = '🟢 Estamos abertos agora!';
    avisoStatus.classList.add('aberto-agora');
} else {
    avisoStatus.textContent = '🔴 Estamos fechados agora. Consulte nossos horarios!';
    avisoStatus.classList.add('fechado-agora');
}

// ---- Modo escuro -----
const botaoTema = document.querySelector('#botao-tema');

function atualizarIconeTema() {
    if(document.body.classList.contains('escuro')){
        botaoTema.textContent = '☀️';
    } else {
        botaoTema.textContent = '🌙';
    }
}

botaoTema.addEventListener('click', function (){
    document.body.classList.toggle('escuro');
    atualizarIconeTema();
    localStorage.setItem('vascoffee-tema', document.body.classList.contains('escuro'));
})

// ---- Menu do celular ----
const botaoMenu = document.querySelector('#botao-menu');
const menu = document.querySelector('#menu');

botaoMenu.addEventListener('click', function () {
    menu.classList.toggle('mostrar');
});

menu.addEventListener('click', function () {
    menu.classList.remove('mostrar');
});

const produtos = [
    {id: 1, nome: 'Expresso Gigante', categoria: 'bebida', preco: 6.5, emoji: '☕', descricao: 'Curto, encorpado e cheiroso' },
    {id: 2, nome: 'Capuccino Cruz de Malta', categoria: 'bebida', preco: 9.9, emoji: '🍵', descricao: 'Café, leite vaporizado e canela' },
    {id: 3, nome: 'Chocolate quente São Januário', categoria: 'bebida', preco: 11, emoji: '🍫', descricao: 'Cremoso, perfeito para dias frios' },
    {id: 4, nome: 'Suco de laranja', categoria: 'bebida', preco: 8, emoji: '🍊', descricao: 'Natural e geladinho' },
    {id: 5, nome: 'Bolo de cenoura', categoria: 'doce', preco: 8.5, emoji: '🍰', descricao: 'Com cobertura de chocolate' },
    {id: 6, nome: 'Cookie', categoria: 'doce', preco: 6, emoji: '🍪', descricao: 'Gotas de chocolate branco e preto, crocante' },
    {id: 7, nome: 'Pão de queijo', categoria: 'salgado', preco: 5, emoji: '🧀', descricao: 'Quentinho, saindo do forno' },
    {id: 8, nome: 'Misto quente', categoria: 'salgado', preco: 12, emoji: '🥪', descricao: 'Pão de forma, queijo e presunto' }
];

console.log('Produtos no cardapio: '+ produtos.length);

// ---- Cardápio: mostrar na página ----
const listaProdutos = document.querySelector('#lista-produtos');
const busca = document.querySelector('#busca');
const filtros = document.querySelectorAll('.filtro');
let categoriaAtual = 'todos';

function formatarPreco(valor) {
    return 'R$' + valor.toFixed(2).replace('.',',');
}

function mostrarProdutos(){
    const texto = busca.value.toLowerCase();
    let encontrados = 0;
    listaProdutos.innerHTML = '';

    produtos.forEach(function (produto) {
        const daCategoria = categoriaAtual === 'todos' || produto.categoria === categoriaAtual;
        const combinaBusca = produto.nome.toLowerCase().includes(texto);

        if (daCategoria && combinaBusca) {
            const card = document.createElement('article');
            card.className = 'card';
            card.innerHTML  = `
                <span class="emoji">${produto.emoji}</span>
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>
                <p class="preco">${formatarPreco(produto.preco)}</p>
                <button class="botao" data-id="${produto.id}">Adicionar</button>
                `;
            listaProdutos.appendChild(card);
            encontrados = encontrados + 1;
        }
    });

    if (encontrados === 0) {
        listaProdutos.innerHTML = '<p>Nenhum produto encontrado. 🙁</p>';
    }
}

mostrarProdutos();

// digitou na busca? Mostra de novo, já filtrado
busca.addEventListener('input', mostrarProdutos);

// Clicou em um filtro? Troca a categoria e marca o botão
filtros.forEach(function (botao) {
    botao.addEventListener('click', function () {
        filtros.forEach(function (outro) {
            outro.classList.remove('ativo');
        });
        botao.classList.add('ativo');
        categoriaAtual = botao.dataset.categoria;
        mostrarProdutos();
    });
});

// meu pedido salvo no navegador
const itensPedido = document.querySelector('#itens-pedido');
const totalPedido = document.querySelector('#total');

// lê o pedido salvo. Se ainda não existir, começa uma lista vazia.
let pedido = JSON.parse(localStorage.getItem('vascoffee-pedido')) || [];

function salvarPedido(){
    localStorage.setItem('vascoffee-pedido', JSON.stringify(pedido));
}

function mostrarPedido(){
    itensPedido.innerHTML = '';
    let total = 0;

    if (pedido.length === 0){
        itensPedido.innerHTML = '<li>Seu pedido está Vazio. Escolha algo no cardápio!</li>';
    }

    pedido.forEach(function (item, posicao) {
        const subtotal = item.preco * item.quantidade;
        total = total + subtotal;
        const li = document.createElement('li');
        li.innerHTML = `
        <span> ${item.quantidade}x ${item.nome}</span>
        <button class="remover" data-posicao="${posicao}" aria-label="Tirar um">-</button>
        `;
        itensPedido.appendChild(li);
    });

    totalPedido.textContent = formatarPreco(total);
}

mostrarPedido();

function adicionarAoPedido(id) {
    const produto = produtos.find(function (p) {
        return p.id === id;
    });
    const itemExistente = pedido.find(function (item) {
        return item.id === id;
    });

    if (itemExistente) {
        itemExistente.quantidade = itemExistente.quantidade + 1;
    } else {
        pedido.push({ id: produto.id, nome: produto.nome, preco: produto.preco, quantidade: 1})
    }

    salvarPedido();
    mostrarPedido();
}

//
listaProdutos.addEventListener('click', function (evento) {
    const id = evento.target.dataset.id;
    if (id) {
        adicionarAoPedido(Number(id));
    }
});

// botao "-" tira uma unidade e o item todo quando chega a zero
itensPedido.addEventListener('click', function (evento) {
    const posicao = evento.target.dataset.posicao;
    if(posicao !== undefined) {
        const item = pedido[posicao];
        item.quantidade = item.quantidade - 1;
        if (item.quantidade === 0) {
            pedido.splice(posicao, 1);
        }
        salvarPedido();
        mostrarPedido();
    }
});

// finalizar o pedido

const formEntrega = document.querySelector('#form-entrega');
const msgPedido = document.querySelector('#msg-pedido');

formEntrega.addEventListener('submit', function (evento) {
    evento.preventDefault(); // nao deixa a pagina recarregar

    if (pedido.length === 0) {
        msgPedido.textContent = 'Seu pedido está vazio. Escolha algo no cardápio!';
        return;
    }

    const endereco = document.querySelector('#endereco').value;
    const numero = document.querySelector('#numero').value;
    msgPedido.textContent = `✅ Pedido recebido! Total: ${totalPedido.textContent}. Vamos entregar em ${endereco}, n° ${numero}.`;
    
    pedido = [];
    salvarPedido();
    mostrarPedido();
    formEntrega.reset();
});

// lembra o tema escolhido na ultima visita
if (localStorage.getItem('vascoffee-tema') === 'true') {
    document.body.classList.add('escuro');
    atualizarIconeTema();
}

// ----- API 1: clima agora (Open-Meteo) -----

const LATITUDE = -18.91861;
const LONGITUDE = -48.27722;
const caixaClima = document.querySelector('#clima');

async function carregarClima() {
    const url = 'https://api.open-meteo.com/v1/forecast'
    + `?latitude=${LATITUDE}&longitude=${LONGITUDE}`
    + '&current=temperature_2m';

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();
        const temperatura = Math.round(dados.current.temperature_2m);

        let sugestao = '';
        if (temperatura < 20) {
            sugestao = 'Friozinho! Que tal um chocolate quente? 🍫';
        } else if (temperatura < 27) {
            sugestao = 'Clima perfeito para um cappuccino. ☕';
        } else {
            sugestao = 'Calorão! Um suco de laranja geladinho cai bem. 🍊';
        }

        caixaClima.textContent = `🌡️ Agora faz ${temperatura}°C por aqui. ${sugestao}`;
    } catch (erro) {
        caixaClima.textContent = 'Não foi possível consultar o clima agora.';
        console.log(erro);
    }
}

carregarClima();

// ----- API 2: endereço pelo CEP (ViaCEP) -----
const campoCep = document.querySelector('#cep');

async function buscarCep() {
    // Seleciona os elementos dentro da função para garantir que já existem
    const msg = document.querySelector('#msg-cep');
    const inputEndereco = document.querySelector('#endereco');
    const inputNumero = document.querySelector('#numero');

    if (!campoCep) return;

    const cep = campoCep.value.replace('-', '').trim();

    if (cep.length !== 8) {
        if (msg) msg.textContent = 'O CEP precisa ter 8 números.';
        return;
    }

    if (msg) msg.textContent = '⏳ Procurando o endereço...';

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await resposta.json();

        if (dados.erro) {
            if (msg) msg.textContent = 'CEP não encontrado. Confira os números.';
            return;
        }

        if (inputEndereco) {
            inputEndereco.value = `${dados.logradouro}, ${dados.bairro}, ${dados.localidade} - ${dados.uf}`;
        }
        
        if (msg) msg.textContent = '📍 Endereço encontrado! Agora digite o número.';
        
        if (inputNumero) {
            inputNumero.focus();
        }
    } catch (erro) {
        if (msg) msg.textContent = 'Não foi possível consultar o CEP. Verifique a internet.';
        console.log(erro);
    }
}

// Quando a pessoa digita o CEP
if (campoCep) {
    campoCep.addEventListener('input', buscarCep);
}
