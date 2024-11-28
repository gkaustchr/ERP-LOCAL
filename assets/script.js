const NUMBASE = 10001;
let AGENDA = [];
let CONFIG = {};
let itemToUpdate = {};
let itemToUpdateClient = {};
let itemToUpdateAgenda = {};

let CLIENTS = [{ id: 0, name: 'Desconhecido', description: 'Sem cliente / fornecedor especifico' }];
const TYPE_MOVIMENTS = [
    { id: 0, name: 'Capital social integralizado', description: 'Aporte recebido pelos sócios para o início das atividades da empresa.', classe: 'PL', category: 'Patrimônio Líquido', type: true },
    { id: 1, name: 'Venda de produto(s)', description: 'Recebimento de dinheiro proveniente da venda de produtos físicos ou digitais.', classe: 'Receita', category: 'Ativo', type: true },
    { id: 2, name: 'Prestação de serviço(s)', description: 'Recebimento de dinheiro pela prestação de serviços.', classe: 'Receita', category: 'Ativo', type: true },
    { id: 3, name: 'Aporte', description: 'Inserção de capital próprio ou de terceiros na empresa.', classe: 'PL', category: 'Patrimônio Líquido', type: true },
    { id: 4, name: 'Pró-labore', description: 'Remuneração paga aos sócios da empresa.', classe: 'Custo', category: 'Despesa', type: false },
    { id: 5, name: 'Salário(s)', description: 'Pagamentos feitos aos funcionários da empresa.', classe: 'Custo', category: 'Despesa', type: false },
    { id: 6, name: 'Imobilizado', description: 'Compra de bens duráveis, como máquinas, equipamentos, e imóveis.', classe: 'Ativo', category: 'Ativo Não Circulante', type: false },
    { id: 7, name: 'Compra de material para uso', description: 'Compra de materiais de consumo para operação diária, como papelaria ou limpeza.', classe: 'Despesa', category: 'Despesa Operacional', type: false },
    { id: 8, name: 'Transporte (Uber/99/ônibus/etc)', description: 'Despesas com transporte de funcionários ou para fins operacionais.', classe: 'Despesa', category: 'Despesa Operacional', type: false },
    { id: 9, name: 'Alimentação', description: 'Despesas com refeições para colaboradores ou em eventos corporativos.', classe: 'Despesa', category: 'Despesa Operacional', type: false },
    { id: 10, name: 'Rendimento Renda Fixa (rendimento diário)', description: 'Recebimento de juros ou rendimentos de aplicações financeiras em renda fixa.', classe: 'Caixa', category: 'Receita Financeira', type: true },
    { id: 11, name: 'Rendimento derivados de investimentos', description: 'Recebimento de rendimentos oriundos de investimentos em ações, fundos ou outras aplicações.', classe: 'Investimento', category: 'Ativo', type: true },
    { id: 12, name: 'Impostos e Taxas', description: 'Pagamento de tributos municipais, estaduais ou federais, e taxas bancárias.', classe: 'Custo', category: 'Passivo', type: false },
    { id: 13, name: 'Manutenção de Equipamentos', description: 'Despesas com reparos e manutenção de máquinas e equipamentos.', classe: 'Despesa', category: 'Despesa Operacional', type: false },
    { id: 14, name: 'Aluguel', description: 'Despesas com o aluguel de imóveis utilizados pela empresa.', classe: 'Despesa', category: 'Despesa Operacional', type: false },
    { id: 15, name: 'Contas de Energia Elétrica e Água', description: 'Pagamentos de contas de serviços públicos utilizados na empresa.', classe: 'Despesa', category: 'Despesa Operacional', type: false },
    { id: 16, name: 'Vendas com Cartão de Crédito/Débito', description: 'Recebimento de vendas realizadas através de cartões de crédito ou débito.', classe: 'Receita', category: 'Ativo', type: true },
    { id: 17, name: 'Distribuição de Lucros', description: 'Distribuição de lucros aos sócios ou acionistas.', classe: 'PL', category: 'Patrimônio Líquido', type: false },
    { id: 18, name: 'Dívidas Bancárias', description: 'Pagamentos relacionados a empréstimos ou financiamentos bancários.', classe: 'Passivo', category: 'Passivo Não Circulante', type: false },
    { id: 19, name: 'Marketing e Publicidade', description: 'Despesas com campanhas de marketing e publicidade.', classe: 'Despesa', category: 'Despesa Operacional', type: false },
    { id: 20, name: 'Seguro Empresarial', description: 'Pagamento de seguros para proteção de bens da empresa.', classe: 'Despesa', category: 'Despesa Operacional', type: false },
    { id: 21, name: 'Pagamento do Cartão de crédito', description: 'Pagamento do cartão de crédito da empresa.', classe: 'Despesa', category: 'Despesa Operacional', type: false },
];

function updateElement(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT' || element.tagName === 'COLOR' ? element.value = text : element.innerText = text;
    } else {
        console.error(`Elemento com id "${id}" não encontrado.`);
    }
}

function focusElement(id) {
    const element = document.getElementById(id);
    element && element.focus();
}


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

function loadFromLocalStorage() {
    try {
        EXTRACT = JSON.parse(localStorage.getItem('moviments')) || [];
        CLIENTS = JSON.parse(localStorage.getItem('clients')) || CLIENTS;
        CONFIG = JSON.parse(localStorage.getItem('config')) || {};
        AGENDA = JSON.parse(localStorage.getItem('agenda')) || [];

        if (!CONFIG || !CONFIG.name) {
            if (!window.location.pathname.includes('config.html'))
                window.location.href = './config.html'; // Redireciona para configurar os dados
            else
                populateFormConfig()
        } else {
            updateRootProperty('--primary-color', CONFIG?.color)
            updateRootProperty('--bg-color-opacity', `${CONFIG?.color}20`)
            isLoaded = true
            document.title = `${CONFIG?.name} - ${document?.title}`;
            if (window.location.pathname.includes('config.html'))
                populateFormConfig()
            else {
                document.querySelector('.desactive')?.classList?.remove('desactive')
                document.querySelector('.loader').style.display = "none"
                if (window.location.pathname.includes('index.html')) {
                    updateTextField("enterprise-name", CONFIG?.name)
                    updatedashHome()

                }
            }
        }
    } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
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

function createProgressBar(color, width, percentage) {
    const bar = document.createElement('div');
    bar.classList.add(width > 0 ? 'positivo' : 'negativo');
    bar.style.display = 'inline-block';
    bar.style.backgroundColor = color;
    bar.style.height = '20px';
    bar.style.width = `${width}%`;
    bar.innerHTML = `<span>${percentage}% </span>`;
    return bar;
}

function saveToLocalStorage(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
}

function getFromLocalStorage(name) {
    return JSON.parse(localStorage.getItem(name));
}

function updateRootProperty(name, value) {
    document.documentElement.style.setProperty(name, value);
}

function createAndDownloadJSON() {
    const jsonData = { moviments: EXTRACT, who: CLIENTS, config: CONFIG, agenda: AGENDA };
    const jsonString = JSON.stringify(jsonData, null, 4);
    const blob = new Blob([jsonString], { type: "application/json" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "gerenciador.json";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function selectFile() {
    if (!confirm('Deseja realmente substituir os dados')) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = readJSONAndStoreInLocalStorage;
    input.click();
}

function readJSONAndStoreInLocalStorage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const jsonData = JSON.parse(e.target.result);
            localStorage.setItem('moviments', JSON.stringify(jsonData.moviments));
            localStorage.setItem('clients', JSON.stringify(jsonData.who));
            localStorage.setItem('config', JSON.stringify(jsonData.config));
            localStorage.setItem('agenda', JSON.stringify(jsonData.agenda));
            alert("Dados atualizados com sucesso!");
            location.reload();
        } catch (error) {
            console.error("Erro ao ler o arquivo JSON:", error);
            alert("Erro ao processar o arquivo JSON.");
        }
    };
    reader.readAsText(file);
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function goToPageRelatorio() {
    location.href = './relatorio.html';
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

function countOutflows() {
    return EXTRACT.filter(item => !item.type).length;
}

function countInflows() {
    return EXTRACT.filter(item => item.type).length;
}

function totalInflows() {
    return EXTRACT.filter(item => item.type).reduce((sum, item) => sum + item.value, 0);
}

function totalOutflows() {
    return EXTRACT.filter(item => !item.type).reduce((sum, item) => sum + item.value, 0);
}

function totalBalance() {
    return totalInflows() - totalOutflows();
}

function balanceByWho() {
    const result = EXTRACT.reduce((acc, item) => {
        const whoId = item.who;
        acc[whoId] = acc[whoId] || { count: 0, total: 0 };
        acc[whoId].count++;
        acc[whoId].total += item.type ? item.value : -item.value;
        return acc;
    }, {});

    return Object.entries(result)
        .filter(([_, data]) => data.total !== 0)
        .sort((a, b) => Math.abs(b[1].total) - Math.abs(a[1].total))
        .map(([who, data]) => ({
            who: parseInt(who),
            name: CLIENTS.find(client => client.id === parseInt(who))?.name || 'Cliente não encontrado',
            count: data.count,
            total: data.total.toFixed(2)
        }));
}

function balanceByCategory() {
    const categoryMap = TYPE_MOVIMENTS.reduce((acc, moviment) => {
        acc[moviment.id] = moviment.category;
        return acc;
    }, {});

    const result = EXTRACT.reduce((acc, item) => {
        const category = categoryMap[item.moviment] || 'Outros';
        acc[category] = acc[category] || { count: 0, total: 0 };
        acc[category].count++;
        acc[category].total += Math.abs(item.value);
        return acc;
    }, {});

    return Object.entries(result)
        .sort(([, a], [, b]) => b.total - a.total)
        .map(([category, data]) => ({ category, count: data.count, total: data.total.toFixed(2) }));
}

function generateReport() {
    return TYPE_MOVIMENTS
        .map(moviment => {
            const transactions = EXTRACT.filter(item => item.moviment === moviment.id);
            const totalInflow = transactions.filter(item => item.type).reduce((sum, item) => sum + item.value, 0);
            const totalOutflow = transactions.filter(item => !item.type).reduce((sum, item) => sum + item.value, 0);
            const balance = totalInflow - totalOutflow;

            return balance !== 0 || totalInflow !== 0 || totalOutflow !== 0 ? {
                movimentId: moviment.id,
                name: moviment.name,
                description: moviment.description,
                classe: moviment.classe,
                category: moviment.category,
                totalInflow,
                totalOutflow,
                balance,
                count: transactions.length
            } : null;
        })
        .filter(item => item)
        .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));
}

function registerConfig(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector("#textfield-name").value;
    const type = form.querySelector("#select-type").value;
    const color = form.querySelector("#textfield-color").value;
    CONFIG = { name, type, color };
    updateRootProperty('--primary-color', color);
    updateRootProperty('--bg-color-opacity', `${color}20`);
    saveToLocalStorage('config', CONFIG);
}

function populateFormConfig() {
    focusElement('textfield-name');
    const config = getFromLocalStorage('config');
    updateElement("textfield-name", config?.name);
    updateElement("select-type", config?.type);
    updateElement("textfield-color", config?.color);
}

function registerMoviment(event) {
    event.preventDefault();
    const form = event.target;
    const moviment = Number(form.querySelector("#select-typel").value);
    const who = Number(form.querySelector("#select-who").value);
    const date = new Date(form.querySelector("#textfield-date").value);
    const value = Number(form.querySelector("#textfield-value").value);
    const description = form.querySelector("#textfield-description").value;
    const obs = form.querySelector("#textfield-obs").value;
    const timestamp = new Date();
    const type_moviment = TYPE_MOVIMENTS.find(item => item.id === moviment);
    const newMoviment = { id: itemToUpdate.id || (EXTRACT.length || 0) + NUMBASE, moviment, who, date: date.toISOString().split('T')[0], value, description, obs, timestamp, type: type_moviment.type };

    const index = itemToUpdate.id ? EXTRACT.findIndex(item => item.id === itemToUpdate.id) : -1;
    index === -1 ? EXTRACT.push(newMoviment) : EXTRACT[index] = newMoviment;

    saveToLocalStorage('moviments', EXTRACT);
    updateListMoviments();
    itemToUpdate = {};
    form.reset();
}

function clearSearchMoviment() {
    itemToUpdate = {};
}

function populateMovimentForm() {
    const select = document.getElementById('select-typel');
    TYPE_MOVIMENTS.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        option.setAttribute('data-description', item.description);
        select.appendChild(option);
    });

    const selectClient = document.getElementById('select-who');
    CLIENTS.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        selectClient.appendChild(option);
    });

    updateListMoviments();
}

function deleteMoviment() {
    if (!itemToUpdate.id) return;
    if (!confirm('Deseja realmente deletar esse lançamento?')) return;
    const index = EXTRACT.findIndex(item => item.id === itemToUpdate.id);
    if (index !== -1) {
        EXTRACT.splice(index, 1);
        saveToLocalStorage('moviments', EXTRACT);
    }
    clearSearchMoviment();
    updateListMoviments();
    document.getElementById('movimentForm').reset();
}

function updateListMoviments() {
    const div = document.getElementById('list-content');
    const ul = document.createElement('ul');

    EXTRACT.sort((a, b) => b.date.localeCompare(a.date)).forEach(item => {
        const li = document.createElement('li');
        const h6 = document.createElement('p');
        h6.innerText = item.description;
        const p = document.createElement('p');
        p.innerText = `R$ ${item.value.toFixed(2)}`;
        const date = document.createElement('p');
        date.innerText = item.date;
        const moviment = document.createElement('p');
        moviment.innerText = returnSearchValue(TYPE_MOVIMENTS, item.moviment).name;
        const com = document.createElement('p');
        com.innerText = `Com: ${returnSearchValue(CLIENTS, item.who).name}`;
        const obs = document.createElement('p');
        obs.innerText = `Obs: ${item.obs}`;
        li.style.backgroundColor = item.type ? '#41886570' : '#88414e70';
        li.appendChild(moviment);
        li.appendChild(h6);
        li.appendChild(com);
        li.appendChild(p);
        li.appendChild(date);
        li.appendChild(obs);
        li.addEventListener('click', () => updateMoviment(item));
        ul.appendChild(li);
    });

    div.innerHTML = '';
    div.appendChild(ul);
}

function updateMoviment(moviment) {
    updateElement('select-typel', moviment.moviment);
    updateElement('select-who', moviment.who);
    updateElement('textfield-value', moviment.value);
    updateElement('textfield-date', moviment.date);
    updateElement('textfield-description', moviment.description);
    updateElement('textfield-obs', moviment.obs);
    itemToUpdate = moviment;
}

// AGENDA
function registerAgenda(event) {
    event.preventDefault();
    let isFinded = false
    const form = event.target;
    const date = new Date(form.querySelector("#textfield-date").value);
    const who = Number(form.querySelector("#select-who").value);
    const obs = form.querySelector("#textfield-obs").value;
    const timestamp = new Date();
    const status = false
    const agend = { id: itemToUpdateAgenda.id || (AGENDA?.length || 0) + NUMBASE, who, date, obs, timestamp, status };

    if (date < (new Date() - 100000))
        return alert('Selecione uma data válida.')

    AGENDA?.forEach((item) => {
        if (item?.date == date)
            isFinded = true
    })

    if (isFinded)
        return alert('Data indisponível. Selecione outra data')

    const index = itemToUpdateAgenda.id ? AGENDA.findIndex(item => item.id === itemToUpdateAgenda.id) : -1;
    index === -1 ? AGENDA.push(agend) : AGENDA[index] = agend;

    saveToLocalStorage('agenda', AGENDA);
    updateListAgenda();
    itemToUpdateAgenda = {};
    form.reset();
}

function populateAgendaForm() {
    const selectClient = document.getElementById('select-who');
    CLIENTS.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        selectClient.appendChild(option);
    });

    updateListAgenda();
}

function updateListAgenda() {
    let div = document.getElementById('agenda-content');
    let ul = document.createElement('ul');

    AGENDA?.sort((a, b) => new Date(a.date) > new Date(b.date)).forEach(item => {
        if (!item.status) {
            const li = document.createElement('li');
            const h6 = document.createElement('p');
            h6.innerText = `${new Date(item.date).toISOString().split('T')[0]} - ${new Date(item.date).toISOString().split('T')[1].split('.')[0]}`;
            const p = document.createElement('p');
            p.innerText = item.date;
            const moviment = document.createElement('p');
            moviment.innerText = returnSearchValue(CLIENTS, item.who).name;
            const obs = document.createElement('p');
            obs.innerText = `Obs: ${item.obs}`;
            const button = document.createElement('button');
            button.innerText = `Realizar`;
            button.addEventListener('click', () => toggleAgenda(item))
            const button1 = document.createElement('button');
            button1.innerText = `Alterar`;
            button1.addEventListener('click', () => updateAgenda(item))
            // li.style.backgroundColor = item.type ? '#41886570' : '#88414e70';
            li.appendChild(h6);
            li.appendChild(moviment);
            li.appendChild(obs);
            li.appendChild(button);
            li.appendChild(button1);
            // li.addEventListener('click', () => updateAgenda(item));
            ul.appendChild(li);
        }
    });

    div.innerHTML = '';
    div.appendChild(ul);


    // REalizado
    div = document.getElementById('ready-content');
    ul = document.createElement('ul');

    AGENDA?.sort((a, b) => new Date(a.date) > new Date(b.date)).forEach(item => {
        if (item.status) {
            const li = document.createElement('li');
            const h6 = document.createElement('p');
            h6.innerText = `${new Date(item.date).toISOString().split('T')[0]} - ${new Date(item.date).toISOString().split('T')[1].split('.')[0]}`;
            const p = document.createElement('p');
            p.innerText = item.date;
            const moviment = document.createElement('p');
            moviment.innerText = returnSearchValue(CLIENTS, item.who).name;
            const obs = document.createElement('p');
            obs.innerText = `Obs: ${item.obs}`;
            const button = document.createElement('button');
            button.innerText = `Retornar`;
            button.addEventListener('click', () => toggleAgenda(item))
            const button1 = document.createElement('button');
            // li.style.backgroundColor = item.type ? '#41886570' : '#88414e70';
            li.appendChild(h6);
            li.appendChild(moviment);
            li.appendChild(obs);
            li.appendChild(button);
            ul.appendChild(li);
        }
    });

    div.innerHTML = '';
    div.appendChild(ul);
}

function toggleAgenda(itemToUpdateAgenda) {
    itemToUpdateAgenda['status'] = !itemToUpdateAgenda?.status
    const index = itemToUpdateAgenda.id ? AGENDA.findIndex(item => item.id === itemToUpdateAgenda.id) : -1;
    index === -1 ? '' : AGENDA[index] = itemToUpdateAgenda;

    saveToLocalStorage('agenda', AGENDA);
    updateListAgenda();
    itemToUpdateAgenda = {};
}

function updateAgenda(agenda) {
    updateElement('select-who', agenda.who);
    updateElement('textfield-date', new Date(agenda.date).toISOString().substring(0, 16));
    updateElement('textfield-obs', agenda.obs);
    itemToUpdateAgenda = agenda;
}

function clearSearchAgenda() {
    itemToUpdateAgenda = {};
}

function deleteAgenda() {
    if (!itemToUpdateAgenda.id) return;
    if (!confirm('Deseja realmente deletar esse lançamento?')) return;
    const index = AGENDA.findIndex(item => item.id === itemToUpdateAgenda.id);
    if (index !== -1) {
        AGENDA.splice(index, 1);
        saveToLocalStorage('agenda', AGENDA);
    }
    clearSearchAgenda();
    updateListAgenda();
    document.getElementById('agendaForm').reset();
}

// CLIENT

function registerClient(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector("#textfield-name").value;
    const description = form.querySelector("#textfield-description").value;
    const newClient = { id: itemToUpdateClient.id || (CLIENTS.length || 0) + 1, name, description };

    const index = itemToUpdateClient.id ? CLIENTS.findIndex(item => item.id === itemToUpdateClient.id) : -1;
    index === -1 ? CLIENTS.push(newClient) : CLIENTS[index] = newClient;

    saveToLocalStorage('clients', CLIENTS);
    updateListClients();
    itemToUpdateClient = {};
    form.reset();
}

function clearSearchClient() {
    itemToUpdateClient = {};
}

function deleteClient() {
    if (!itemToUpdateClient.id || itemToUpdateClient.id === 0) return;
    if (!confirm('Deseja realmente deletar esse nome?')) return;
    const index = CLIENTS.findIndex(item => item.id === itemToUpdateClient.id);
    if (index !== -1) {
        CLIENTS.splice(index, 1);
        saveToLocalStorage('clients', CLIENTS);
    }
    clearSearchClient();
    updateListClients();
    document.getElementById('clientForm').reset();
}

function updateListClients() {
    const div = document.getElementById('list-content');
    const ul = document.createElement('ul');
    CLIENTS.forEach(item => {
        const li = document.createElement('li');
        const name = document.createElement('p');
        name.innerText = item.name;
        const description = document.createElement('p');
        description.innerText = item.description;
        li.appendChild(name);
        li.appendChild(description);
        li.addEventListener('click', () => updateClient(item));
        ul.appendChild(li);
    });
    div.innerHTML = '';
    div.appendChild(ul);
}

function updateClient(client) {
    updateElement('textfield-name', client.name);
    updateElement('textfield-description', client.description);
    itemToUpdateClient = client;
}

function returnSearchValue(array, id) {
    return array.find(item => item.id === id);
}

document.addEventListener('DOMContentLoaded', loadFromLocalStorage);