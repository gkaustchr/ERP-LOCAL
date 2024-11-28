let EXTRACT = []
let CONFIG = {}
const NUMBASE = 10001
let itemToUpdate = {}
let itemToUpdateClient = {}

const TYPE_MOVIMENTS = [
    {
        id: 0,
        name: 'Capital social integralizado',
        description: 'Aporte recebido pelos sócios para o início das atividades da empresa.',
        classe: 'PL',
        category: 'Patrimônio Líquido',
        type: true
    },
    {
        id: 1,
        name: 'Venda de produto(s)',
        description: 'Recebimento de dinheiro proveniente da venda de produtos físicos ou digitais.',
        classe: 'Receita',
        category: 'Ativo',
        type: true
    },
    {
        id: 2,
        name: 'Prestação de serviço(s)',
        description: 'Recebimento de dinheiro pela prestação de serviços.',
        classe: 'Receita',
        category: 'Ativo',
        type: true
    },
    {
        id: 3,
        name: 'Aporte',
        description: 'Inserção de capital próprio ou de terceiros na empresa.',
        classe: 'PL',
        category: 'Patrimônio Líquido',
        type: true
    },
    {
        id: 4,
        name: 'Pró-labore',
        description: 'Remuneração paga aos sócios da empresa.',
        classe: 'Custo',
        category: 'Despesa',
        type: false
    },
    {
        id: 5,
        name: 'Salário(s)',
        description: 'Pagamentos feitos aos funcionários da empresa.',
        classe: 'Custo',
        category: 'Despesa',
        type: false
    },
    {
        id: 6,
        name: 'Imobilizado',
        description: 'Compra de bens duráveis, como máquinas, equipamentos, e imóveis.',
        classe: 'Ativo',
        category: 'Ativo Não Circulante',
        type: false
    },
    {
        id: 7,
        name: 'Compra de material para uso',
        description: 'Compra de materiais de consumo para operação diária, como papelaria ou limpeza.',
        classe: 'Despesa',
        category: 'Despesa Operacional',
        type: false
    },
    {
        id: 8,
        name: 'Transporte (Uber/99/ônibus/etc)',
        description: 'Despesas com transporte de funcionários ou para fins operacionais.',
        classe: 'Despesa',
        category: 'Despesa Operacional',
        type: false
    },
    {
        id: 9,
        name: 'Alimentação',
        description: 'Despesas com refeições para colaboradores ou em eventos corporativos.',
        classe: 'Despesa',
        category: 'Despesa Operacional',
        type: false
    },
    {
        id: 10,
        name: 'Rendimento Renda Fixa (rendimento diário)',
        description: 'Recebimento de juros ou rendimentos de aplicações financeiras em renda fixa.',
        classe: 'Caixa',
        category: 'Receita Financeira',
        type: true
    },
    {
        id: 11,
        name: 'Rendimento derivados de investimentos',
        description: 'Recebimento de rendimentos oriundos de investimentos em ações, fundos ou outras aplicações.',
        classe: 'Investimento',
        category: 'Ativo',
        type: true
    },
    {
        id: 12,
        name: 'Impostos e Taxas',
        description: 'Pagamento de tributos municipais, estaduais ou federais, e taxas bancárias.',
        classe: 'Custo',
        category: 'Passivo',
        type: false
    },
    {
        id: 13,
        name: 'Manutenção de Equipamentos',
        description: 'Despesas com reparos e manutenção de máquinas e equipamentos.',
        classe: 'Despesa',
        category: 'Despesa Operacional',
        type: false
    },
    {
        id: 14,
        name: 'Aluguel',
        description: 'Despesas com o aluguel de imóveis utilizados pela empresa.',
        classe: 'Despesa',
        category: 'Despesa Operacional',
        type: false
    },
    {
        id: 15,
        name: 'Contas de Energia Elétrica e Água',
        description: 'Pagamentos de contas de serviços públicos utilizados na empresa.',
        classe: 'Despesa',
        category: 'Despesa Operacional',
        type: false
    },
    {
        id: 16,
        name: 'Vendas com Cartão de Crédito/Débito',
        description: 'Recebimento de vendas realizadas através de cartões de crédito ou débito.',
        classe: 'Receita',
        category: 'Ativo',
        type: true
    },
    {
        id: 17,
        name: 'Distribuição de Lucros',
        description: 'Distribuição de lucros aos sócios ou acionistas.',
        classe: 'PL',
        category: 'Patrimônio Líquido',
        type: false
    },
    {
        id: 18,
        name: 'Dívidas Bancárias',
        description: 'Pagamentos relacionados a empréstimos ou financiamentos bancários.',
        classe: 'Passivo',
        category: 'Passivo Não Circulante',
        type: false
    },
    {
        id: 19,
        name: 'Marketing e Publicidade',
        description: 'Despesas com campanhas de marketing e publicidade.',
        classe: 'Despesa',
        category: 'Despesa Operacional',
        type: false
    },
    {
        id: 20,
        name: 'Seguro Empresarial',
        description: 'Pagamento de seguros para proteção de bens da empresa.',
        classe: 'Despesa',
        category: 'Despesa Operacional',
        type: false
    },
    {
        id: 21,
        name: 'Pagamento do Cartão de crédito',
        description: 'Pagamento do cartão de crédito da empresa.',
        classe: 'Despesa',
        category: 'Despesa Operacional',
        type: false
    },
];

let CLIENTS = [
    {
        id: 0,
        name: 'Desconhecido',
        description: 'Sem cliente / fornecedor especifico'
    }
]

function updateTextField(id, text) {
    try {
        const element = document.getElementById(id);
        if (element) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT' || element.tagName === 'COLOR') {
                element.value = text;  // Atualiza o valor, se for input ou textarea
            } else {
                element.innerText = text;  // Caso contrário, atualiza o texto
            }
        } else {
            console.error(`Elemento com id "${id}" não encontrado.`);
        }
    } catch (error) {
        console.error(error);
    }
}

function fieldOnFocus(id) {
    try {
        const element = document.getElementById(id);
        if (element)
            element.focus()
    } catch (error) {
        console.error(error);
    }
}

function loadData() {
    try {
        EXTRACT = JSON.parse(localStorage.getItem('moviments')) || [];
        const config = JSON.parse(localStorage.getItem('config'));
        const clients = JSON.parse(localStorage.getItem('clients'));
        if (clients?.length > 0)
            CLIENTS = clients

        if (!config || !config.name) {
            if (!window.location.pathname.includes('config.html'))
                window.location.href = './config.html'; // Redireciona para configurar os dados
            else
                populateFormConfig()
        } else {
            updateRootProperty('--primary-color', config?.color)
            updateRootProperty('--bg-color-opacity', `${config?.color}20`)
            isLoaded = true
            document.querySelector('.loader').style.display = "none"
            document.querySelector('.desactive')?.classList?.remove('desactive')
            document.title = `${config?.name} - ${document?.title}`;
            if (window.location.pathname.includes('config.html'))
                populateFormConfig()
            else {
                if (window.location.pathname.includes('index.html')) {
                    updateTextField("enterprise-name", config?.name)
                    updatedashHome()

                }
                CONFIG = config
            }
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

function updatedashHome() {
    try {
        // Obtém os totais de entrada e saída
        const inflows = totalInflows();
        const outflows = totalOutflows();
        const total = inflows + outflows;

        // Verifica se o total é zero para evitar divisão por zero
        if (total === 0) {
            console.error('Não há movimentações para exibir.');
            return;
        }

        // Calcula a largura das barras em porcentagem
        const inflowWidth = (inflows / total) * 100;
        const outflowWidth = (outflows / total) * 100;

        // Limpa o conteúdo anterior do elemento de relatório
        const element = document.getElementById('report');
        element.innerHTML = '';

        // Cria a barra positiva (entrada)
        const positivo = document.createElement('div');
        positivo.classList.add('positivo');
        positivo.style.display = 'inline-block';
        positivo.style.backgroundColor = '#41886570'; // Cor verde para entrada
        positivo.style.height = '20px'; // Altura da barra
        positivo.style.width = `${inflowWidth}%`; // Largura proporcional
        positivo.innerHTML = `<span>${inflowWidth.toFixed(2)}% </span>`

        // Cria a barra negativa (saída)
        const negativo = document.createElement('div');
        negativo.classList.add('negativo');
        negativo.style.display = 'inline-block';
        negativo.style.backgroundColor = '#88414e70'; // Cor vermelha para saída
        negativo.style.height = '20px'; // Altura da barra
        negativo.style.width = `${outflowWidth}%`; // Largura proporcional
        negativo.innerHTML = `<span>${outflowWidth.toFixed(2)}% </span>`

        // Adiciona as barras no elemento de relatório
        element.appendChild(positivo);
        element.appendChild(negativo);

    } catch (error) {
        console.error('Erro ao atualizar o dashboard:', error);
    }
}

function setLocalStorage(name, value) {
    localStorage.setItem(name, JSON.stringify(value))
}

function getLocalStorage(name) {
    return JSON.parse(localStorage.getItem(name))
}

function updateRootProperty(name, value) {
    document.documentElement.style.setProperty(name, value);
}

// Função para criar e baixar um arquivo JSON com três arrays
function createAndDownloadJSON() {
    try {

        // Estrutura JSON com os arrays
        const jsonData = {
            moviments: EXTRACT,
            who: CLIENTS,
            config: CONFIG
        };

        // Converter para string JSON formatada
        const jsonString = JSON.stringify(jsonData, null, 4);

        // Criar um blob a partir do conteúdo JSON
        const blob = new Blob([jsonString], { type: "application/json" });

        // Criar um link para download
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = "gerenciador.json"; // Nome do arquivo para download

        // Adicionar o link ao documento e simular o clique para baixar
        document.body.appendChild(downloadLink);
        downloadLink.click();

        // Remover o link após o download
        document.body.removeChild(downloadLink);
    } catch (error) {
        console.error("Erro ao criar o arquivo JSON:", error);
    }
}

// Função para abrir o seletor de arquivo ao clicar no botão
function selectFile() {
    try {
        if(!confirm('Deseja realmente substituir os dados'))
            return
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = readJSONAndStoreInLocalStorage; // Chama a função de leitura quando o arquivo for selecionado
        input.click(); // Simula o clique no input de arquivo
        
    } catch (error) {
        console.log(error)
    }
}

// Função para ler o arquivo JSON e inserir cada array no localStorage
function readJSONAndStoreInLocalStorage(event) {
    const file = event.target.files[0]; // Obtém o arquivo selecionado
    if (!file) return;

    const reader = new FileReader(); // Cria um leitor de arquivo
    reader.onload = function (e) {
        try {
            // Faz a leitura e converte o conteúdo do arquivo para objeto JSON
            const jsonData = JSON.parse(e.target.result);

            // Insere cada array no localStorage com chaves específicas
            localStorage.setItem('moviments', JSON.stringify(jsonData.moviments));
            localStorage.setItem('clients', JSON.stringify(jsonData.who));
            localStorage.setItem('config', JSON.stringify(jsonData.config));

            alert("Dados atualizados com sucesso!");
            location.reload()
        } catch (error) {
            console.error("Erro ao ler o arquivo JSON:", error);
            alert("Erro ao processar o arquivo JSON.");
        }
    };

    reader.readAsText(file); // Lê o arquivo como texto
}

// Função para formatar um número como moeda brasileira
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Relatório

function goToPageRelatorio() {
    location.href = './relatorio.html'
}

function loadRelatorio() {
    try {
        // QNT
        let count = document.querySelectorAll('.flex-row')[0]

        let div1 = document.createElement('div')
        let h51 = document.createElement('h5')
        let p = document.createElement('p')

        h51.innerText = countInflows()
        p.innerText = 'Entradas'

        div1.appendChild(h51)
        div1.appendChild(p)

        let div2 = document.createElement('div')
        let h52 = document.createElement('h5')
        let p2 = document.createElement('p')

        h52.innerText = countOutflows()
        p2.innerText = 'Saídas'

        div2.appendChild(h52)
        div2.appendChild(p2)

        count.appendChild(div1)
        count.appendChild(div2)

        // Saldo
        count = document.querySelectorAll('.flex-row')[1]

        div1 = document.createElement('div')
        h51 = document.createElement('h5')
        p = document.createElement('p')

        h51.innerText = `${formatCurrency(totalInflows())}`
        p.innerText = 'Entradas'

        div1.appendChild(h51)
        div1.appendChild(p)

        div2 = document.createElement('div')
        h52 = document.createElement('h5')
        p2 = document.createElement('p')

        h52.innerText = `-${formatCurrency(totalOutflows())}`
        p2.innerText = 'Saídas'

        div2.appendChild(h52)
        div2.appendChild(p2)

        count.appendChild(div1)
        count.appendChild(div2)

        // Resultado
        count = document.querySelectorAll('.flex-row')[2]

        div1 = document.createElement('div')
        h51 = document.createElement('h5')
        p = document.createElement('p')

        h51.innerText = `${formatCurrency(totalBalance())}`
        p.innerText = 'Saldo'

        div1.appendChild(h51)
        div1.appendChild(p)

        count.appendChild(div1)

        // MOVIEMTAÇÃO
        count = document.getElementById('moviments-content')
        let ul = document.createElement('ul')

        generateReport().forEach((item) => {
            const li = document.createElement('li')
            p = document.createElement('p')
            p.innerText = item?.name
            li.appendChild(p)
            p1 = document.createElement('p')
            p1.innerText = `Balanço: ${formatCurrency(item?.balance)}`
            li.appendChild(p1)
            p2 = document.createElement('p')
            p2.innerText = `Lançamentos: ${item?.count}`
            li.appendChild(p2)
            p3 = document.createElement('p')
            p3.innerText = `Entradas: ${formatCurrency(item?.totalInflow)}`
            li.appendChild(p3)
            p4 = document.createElement('p')
            p4.innerText = `Saídas: -${formatCurrency(item?.totalOutflow)}`
            li.appendChild(p4)
            p5 = document.createElement('p')
            p5.innerText = `Categoria: ${item?.category} - Classe: ${item?.classe}`
            li.appendChild(p5)
            li.setAttribute('title', item?.description)
            ul.appendChild(li)
        })
        count.appendChild(ul)

        // CLIENTS
        count = document.getElementById('who-content')
        ul = document.createElement('ul')
        balanceByWho().forEach((item) => {
            const li = document.createElement('li')
            p = document.createElement('p')
            p.innerText = item?.name
            li.appendChild(p)
            p1 = document.createElement('p')
            p1.innerText = `Balanço: ${formatCurrency(item?.total)}`
            li.appendChild(p1)
            p2 = document.createElement('p')
            p2.innerText = `Lançamentos: ${item?.count}`
            li.appendChild(p2)
            ul.appendChild(li)
        })
        count.appendChild(ul)

        // CATEGORY
        count = document.getElementById('category-content')
        ul = document.createElement('ul')
        balanceByCategory().forEach((item) => {
            const li = document.createElement('li')
            p = document.createElement('p')
            p.innerText = item?.category
            li.appendChild(p)
            p1 = document.createElement('p')
            p1.innerText = `Balanço: ${formatCurrency(item?.total)}`
            li.appendChild(p1)
            p2 = document.createElement('p')
            p2.innerText = `Lançamentos: ${item?.count}`
            li.appendChild(p2)
            ul.appendChild(li)
        })
        count.appendChild(ul)

        console.log(balanceByCategory())
    } catch (error) {
        console.log(error)
    }
}

// 1. Contar quantos registros são de saída de dinheiro (type: false)
function countOutflows() {
    return EXTRACT.filter(item => item.type === false).length;
}

// 2. Contar quantos registros são de entrada de dinheiro (type: true)
function countInflows() {
    return EXTRACT.filter(item => item.type === true).length;
}

// 3. Calcular o saldo total de entradas
function totalInflows() {
    return EXTRACT.filter(item => item.type === true).reduce((sum, item) => sum + item.value, 0);
}

// 4. Calcular o saldo total de saídas
function totalOutflows() {
    return EXTRACT.filter(item => item.type === false).reduce((sum, item) => sum + item.value, 0);
}

// 5. Calcular o saldo total (entradas - saídas)
function totalBalance() {
    return totalInflows() - totalOutflows();
}

// Função para calcular a quantidade e o saldo por 'who'
function balanceByWho() {
    // Reduz o array EXTRACT em um objeto com a soma e a contagem para cada 'who'
    const result = EXTRACT.reduce((acc, item) => {
        if (!acc[item.who]) {
            acc[item.who] = { count: 0, total: 0 };
        }
        acc[item.who].count++;
        acc[item.who].total += item.type ? item.value : -item.value; // Adiciona ou subtrai valor dependendo do tipo
        return acc;
    }, {});

    // Converte o resultado em um array, filtra os que têm total diferente de zero e ordena do maior para o menor saldo
    const filteredAndSorted = Object.entries(result)
        .filter(([_, data]) => data.total !== 0) // Filtra 'who' com saldo diferente de zero
        .sort((a, b) => Math.abs(b.total) - Math.abs(a.total)) // Ordena do maior para o menor saldo
        .map(([who, data]) => {
            // Busca o nome do cliente com base no 'who'
            const client = CLIENTS.find(client => client.id === parseInt(who));

            return {
                who: parseInt(who),
                name: client ? client.name : 'Cliente não encontrado', // Adiciona o nome do cliente
                count: data.count,
                total: data.total.toFixed(2)
            };
        });
    return filteredAndSorted;
}

function balanceByCategory() {
    // Mapeia os ids de movimentação para suas respectivas categorias
    const categoryMap = TYPE_MOVIMENTS.reduce((acc, moviment) => {
        acc[moviment.id] = moviment.category;
        return acc;
    }, {});

    // Reduz o array EXTRACT agrupando os valores por categoria
    const result = EXTRACT.reduce((acc, item) => {
        const category = categoryMap[item.moviment] || 'Outros'; // Verifica a categoria associada ao movimento

        if (!acc[category]) {
            acc[category] = { count: 0, total: 0 };
        }

        acc[category].count++; // Incrementa o contador de transações
        acc[category].total += Math.abs(item.value); // Soma o valor absoluto para evitar sinal negativo
        return acc;
    }, {});

    // Converte o objeto result em um array, ordena pelo total do maior para o menor e retorna
    const filteredAndSorted = Object.entries(result)
        .sort(([, a], [, b]) => b.total - a.total) // Ordena pelo total do maior para o menor
        .map(([category, data]) => ({
            category: category,
            count: data.count,
            total: data.total.toFixed(2)
        }));

    return filteredAndSorted;
}

// Função para cruzar os dados de EXTRACT com TYPE_MOVIMENTS
function generateReport() {
    const report = TYPE_MOVIMENTS.map(moviment => {
        // Filtrar as transações correspondentes ao ID de movimentação
        const transactions = EXTRACT.filter(item => item.moviment === moviment.id);

        // Calcular o total de entradas e saídas
        const totalInflow = transactions.filter(item => item.type === true).reduce((sum, item) => sum + item.value, 0);
        const totalOutflow = transactions.filter(item => item.type === false).reduce((sum, item) => sum + item.value, 0);
        const balance = totalInflow - totalOutflow;

        // Retornar o relatório detalhado apenas se a movimentação tiver saldo ou valor movimentado
        if (balance !== 0 || totalInflow !== 0 || totalOutflow !== 0) {
            return {
                movimentId: moviment.id,
                name: moviment.name,
                description: moviment.description,
                classe: moviment.classe,
                category: moviment.category,
                totalInflow: totalInflow,
                totalOutflow: totalOutflow,
                balance: balance,
                count: transactions.length
            };
        } else {
            return null; // Ignorar movimentações com saldo zerado
        }
    })
        .filter(item => item !== null) // Remove itens nulos
        .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance)); // Ordena do maior para o menor saldo

    return report;
}

// CONFIGS
function registerConfig(event) {
    try {
        event.preventDefault(); // Previne o comportamento padrão de envio do formulário

        const form = event.target; // Acessa o formulário que disparou o evento

        // Exemplo de como acessar diretamente o valor de um campo específico
        const name = form.querySelector("#textfield-name").value;
        const type = form.querySelector("#select-type").value;
        const color = form.querySelector("#textfield-color").value;

        const config = { name, type, color }

        CONFIG = config

        updateRootProperty('--primary-color', color)
        updateRootProperty('--bg-color-opacity', `${color}20`)
        setLocalStorage('config', config)
    } catch (error) {
        console.error(error); // Caso ocorra um erro, exibe no console
    }
}

function populateFormConfig() {
    fieldOnFocus('textfield-name')
    const config = getLocalStorage('config')
    updateTextField("textfield-name", config?.name)
    updateTextField("select-type", config?.type)
    updateTextField("textfield-color", config?.color)
}

// MOVIMENTS 
function registerMoviment(event) {
    try {
        event.preventDefault(); // Previne o comportamento padrão de envio do formulário
        const form = event.target; // Acessa o formulário que disparou o evento

        // Exemplo de como acessar diretamente o valor de um campo específico
        const moviment = Number(form.querySelector("#select-typel").value);
        const who = Number(form.querySelector("#select-who").value);
        const date = new Date(form.querySelector("#textfield-date").value);
        const value = Number(form.querySelector("#textfield-value").value);
        const description = form.querySelector("#textfield-description").value;
        const obs = form.querySelector("#textfield-obs").value;
        const timestamp = new Date()
        const type_moviment = TYPE_MOVIMENTS.find((item) => item?.id === moviment);
        const moviments = { id: (EXTRACT?.length || 0) + NUMBASE, moviment, who, date: date.toISOString().split('T')[0], value, description, obs, timestamp, type: type_moviment?.type }
        console.log(moviments)

        if (itemToUpdate?.id) {
            const index = EXTRACT.findIndex((item) => item.id === itemToUpdate?.id)
            moviments['id'] = itemToUpdate?.id
            console.log(index)
            EXTRACT[index] = moviments
        } else {
            EXTRACT.push(moviments)
        }
        setLocalStorage('moviments', EXTRACT)
        updateListMoviments()
        itemToUpdate = {}
        form.reset()
    } catch (error) {
        console.error(error); // Caso ocorra um erro, exibe no console
    }
}

function clearSearchMoviment() {
    itemToUpdate = {}
}

function populateMovimentForm() {
    try {
        const select = document.getElementById('select-typel');

        TYPE_MOVIMENTS.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id; // O valor da opção será o ID
            option.textContent = item.name; // O texto visível será o nome
            option.setAttribute('data-description', item.description); // Texto de suporte
            select.appendChild(option);
        });

        const selectClient = document.getElementById('select-who');

        CLIENTS.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id; // O valor da opção será o ID
            option.textContent = item.name; // O texto visível será o nome
            selectClient.appendChild(option);
        });


        updateListMoviments()
    } catch (error) {
        console.log(error)
    }
}

function deleteMoviment() {
    try {
        if (!itemToUpdate?.id)
            return
        if (!confirm('Deseja realmente deletar esse lançamento?'))
            return
        if (itemToUpdate?.id) {
            const index = EXTRACT.findIndex((item) => item.id === itemToUpdate?.id)
            if (index !== -1) {
                EXTRACT.splice(index, 1);  // Remove o item no índice encontrado
            }
            setLocalStorage('moviments', EXTRACT)
        }
        clearSearchMoviment()
        updateListMoviments()
        document.getElementById('movimentForm').reset()
    } catch (error) {
        console.log(error)
    }
}

function updateListMoviments() {
    try {
        const div = document.getElementById('list-content');
        const ul = document.createElement('ul');

        EXTRACT?.sort((a, b) => b.date.localeCompare(a.date)).forEach((item) => {
            const li = document.createElement('li');

            // Título com a descrição do movimento
            const h6 = document.createElement('p');
            h6.innerText = item.description;

            // Valor da movimentação (corrigido)
            const p = document.createElement('p');
            p.innerText = `R$ ${item.value.toFixed(2)}`;  // Corrigido para usar 'item.value' ao invés de 'item.description'

            // Data da movimentação
            const date = document.createElement('p');
            date.innerText = `${item.date}`;

            // Tipo de movimentação (se é Receita, Custo, etc.)
            const moviment = document.createElement('p');
            moviment.innerText = `${returnSearchValue(TYPE_MOVIMENTS, item.moviment).name}`;

            // Quem fez a movimentação
            const com = document.createElement('p');
            com.innerText = `Com: ${returnSearchValue(CLIENTS, item.who).name}`;

            // Observações
            const obs = document.createElement('p');
            obs.innerText = `Obs: ${item.obs}`;

            // Definindo a borda com base no tipo de movimentação (verde para Receita, vermelho para Custo)
            li.style.backgroundColor = `${item.type ? '#41886570' : '#88414e70'}`;

            // Adicionando os elementos ao <li>
            li.appendChild(moviment);
            li.appendChild(h6);
            li.appendChild(com);
            li.appendChild(p);
            li.appendChild(date);
            li.appendChild(obs);
            li.addEventListener('click', updateMoviment.bind(null, item));
            // Adicionando o <li> à lista
            ul.appendChild(li);
        });

        // Adicionando a lista à div
        div.innerHTML = '';  // Limpa qualquer conteúdo anterior
        div.appendChild(ul);
    } catch (error) {
        console.log(error);
    }
}

function updateMoviment(moviment) {
    try {
        document.getElementById('select-typel').value = moviment?.moviment
        document.getElementById('select-who').value = moviment?.who
        document.getElementById('textfield-value').value = moviment?.value
        document.getElementById('textfield-date').value = moviment?.date
        document.getElementById('textfield-description').value = moviment?.description
        document.getElementById('textfield-obs').value = moviment?.obs
        itemToUpdate = moviment
    } catch (error) {
        console.log(error)
    }
}


// CLIENTS

function registerClient(event) {
    try {
        event.preventDefault(); // Previne o comportamento padrão de envio do formulário
        const form = event.target; // Acessa o formulário que disparou o evento

        // Exemplo de como acessar diretamente o valor de um campo específico
        const name = form.querySelector("#textfield-name").value;
        const description = form.querySelector("#textfield-description").value;
        const clients = { id: (CLIENTS?.length || 1) + 1, name, description }
        console.log(clients)

        if (itemToUpdateClient?.id) {
            const index = CLIENTS.findIndex((item) => item.id === itemToUpdateClient?.id)
            clients['id'] = itemToUpdateClient?.id
            console.log(index)
            CLIENTS[index] = clients
        } else {
            CLIENTS.push(clients)
        }
        setLocalStorage('clients', CLIENTS)
        itemToUpdateClient = {}
        updateListClients()
        form.reset()
    } catch (error) {
        console.error(error); // Caso ocorra um erro, exibe no console
    }
}

function clearSearchClient() {
    itemToUpdateClient = {}
}

function deleteClient() {
    try {
        if (!itemToUpdateClient?.id || itemToUpdateClient?.id == 0)
            return
        if (!confirm('Deseja realmente deletar esse nome?'))
            return
        if (itemToUpdateClient?.id) {
            const index = CLIENTS.findIndex((item) => item.id === itemToUpdateClient?.id)
            if (index !== -1) {
                CLIENTS.splice(index, 1);  // Remove o item no índice encontrado
            }
            setLocalStorage('clients', CLIENTS)
        }
        clearSearchClient()
        updateListClients()
        document.getElementById('clientForm').reset()
    } catch (error) {
        console.log(error)
    }
}

function updateListClients() {
    try {
        const div = document.getElementById('list-content');
        const ul = document.createElement('ul');

        CLIENTS?.forEach((item) => {
            const li = document.createElement('li');

            // Título com a descrição do movimento
            const name = document.createElement('p');
            name.innerText = item.name;

            // Data da movimentação
            const description = document.createElement('p');
            description.innerText = `${item.description}`;

            // Adicionando os elementos ao <li>
            li.appendChild(name);
            li.appendChild(description);
            li.addEventListener('click', updateClient.bind(null, item));
            // Adicionando o <li> à lista
            ul.appendChild(li);
        });

        // Adicionando a lista à div
        div.innerHTML = '';  // Limpa qualquer conteúdo anterior
        div.appendChild(ul);
    } catch (error) {
        console.log(error);
    }
}

function updateClient(client) {
    try {
        document.getElementById('textfield-name').value = client?.name
        document.getElementById('textfield-description').value = client?.description
        itemToUpdateClient = client
    } catch (error) {
        console.log(error)
    }
}

function returnSearchValue(array, id) {
    try {
        return array.find((item) => item?.id === id);
    } catch (error) {
        console.log(error)
    }
}

document.addEventListener('DOMContentLoaded', loadData)