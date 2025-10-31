// Função para formatar o CPF
function formatCPF(cpf) {
    return cpf.replace(/\D/g, '')
              .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Função para formatar o Telefone para exibição (XX) 9XXXX-XXXX
function formatTelefone(tel) {
    const nums = tel.replace(/\D/g, '');
    if (nums.length === 11) {
        return `(${nums.slice(0,2)}) ${nums.slice(2,7)}-${nums.slice(7)}`;
    }
    return tel;
}

// Função para formatar o Frete
function formatFrete(valor) {
    return valor.includes('R$') ? valor : `R$ ${valor}`;
}

// Função para formatar data (DDMM ou DDMMYY) para DD/MM ou DD/MM/YY
function formatData(data) {
    const nums = data.replace(/\D/g, '');
    if (nums.length === 4) {
        return `${nums.slice(0, 2)}/${nums.slice(2, 4)}`;
    } else if (nums.length === 6) {
        return `${nums.slice(0, 2)}/${nums.slice(2, 4)}/${nums.slice(4, 6)}`;
    }
    return data;
}

// Função para formatar hora (HHMM) para HH:MM
function formatHora(hora) {
    const nums = hora.replace(/\D/g, '');
    if (nums.length === 4) {
        return `${nums.slice(0, 2)}:${nums.slice(2, 4)}`;
    }
    return hora;
}

// NOVO: Função auxiliar para preparar o número para o link do WhatsApp (55DDDNUMERO)
function formatarTelefoneParaLink(tel) {
    // Remove tudo que não for dígito.
    let nums = tel.replace(/\D/g, '');
    
    // Adiciona o código do país (55) se o número tiver 10 (apenas DDD + 8/9 dígitos) ou 11 (apenas DDD + 9 dígitos)
    if (nums.length === 11 || nums.length === 10) { 
        nums = "55" + nums;
    } 
    
    return nums;
}

// ** FUNÇÃO PRINCIPAL PARA GERAR O TEXTO **
function gerarTexto() {
    const get = id => document.getElementById(id).value;

    const origemDestino = `${get("cidadeOrigem").toUpperCase()} X ${get("cidadeDestino").toUpperCase()}`; 
    
    // Aplica as funções de formatação de data e hora
    const coleta = `${formatData(get("dataColeta"))} – ${formatHora(get("horaColeta"))}`;
    const entrega = `${formatData(get("dataEntrega"))} – ${formatHora(get("horaEntrega"))}`;
    
    const frete = formatFrete(get("frete"));
    const telefoneMoto = formatTelefone(get("telefoneMoto"));
    
    // Lógica para Telefone Responsável
    const telefoneRespValor = get("telefoneResp").trim();
    const telefoneResp = telefoneRespValor ? ` // ${formatTelefone(telefoneRespValor)} (RESP)` : "";
    
    const pix = `${get("tipoPix")}: ${get("chavePix")}`;
    const cadastro = `OPENTECH: ${get("opentech")} / BRK: ${get("brk")}`;
    
    const opcoesPagamento = get("opcoesPagamento");

    const texto = `
${origemDestino}

COLETA: ${coleta}
ENTREGA: ${entrega}

FRETE: ${frete}
MOTORISTA: ${get("motorista")}
CPF: ${formatCPF(get("cpf"))}
TELEFONE: ${telefoneMoto} (MOTO)${telefoneResp}
${opcoesPagamento}
PIX: ${pix}
PLACA: ${get("placa")}
CLIENTE ${get("cliente")}
RASTREADOR: ${get("rastreador")}
2° TECNOLOGIA?: ${get("tecnologia")}
TIPOLOGIA: ${get("tipologia")}
PESO: ${get("peso")}
STATUS: ${get("status")}
CADASTRO: ${cadastro}
OBS.: ${get("obs").trim() === '--' || get("obs").trim() === '' ? 'SEM OBSERVAÇÕES' : get("obs")}

DT: ${get("dt")}
CAPTAÇÃO: ${get("captacao")}
COTAÇÃO: ${get("cotacao")}
COLETA: ${get("coletaId")}

${get("regras")}
    `.trim();

    // Atualiza a área de resultado para que o enviarWhatsapp possa usar o texto
    document.getElementById("resultado").textContent = texto;
}

// ** NOVO: FUNÇÃO PARA ENVIAR WHATSAPP **
function enviarWhatsapp() {
    // Chama gerarTexto para garantir que o texto na área de resultado está atualizado
    gerarTexto(); 
    
    const textoGerado = document.getElementById("resultado").textContent;
    const telefoneMotoristaCampo = document.getElementById("telefoneMoto").value;

    if (!textoGerado) {
        alert("Gere o texto antes de enviar para o WhatsApp.");
        return;
    }
    
    if (!telefoneMotoristaCampo.replace(/\D/g, '')) {
        alert("O campo de Telefone do Motorista está vazio ou inválido. Não é possível enviar o WhatsApp.");
        return;
    }

    // Formata o telefone para o link (55DDDNUMERO)
    const telefoneLink = formatarTelefoneParaLink(telefoneMotoristaCampo);
    
    // Codifica o texto para URL (quebras de linha viram %0A)
    const textoFormatado = encodeURIComponent(textoGerado);
    
    // Cria o link do WhatsApp
    const linkWhatsapp = `https://wa.me/${telefoneLink}?text=${textoFormatado}`;
    
    // Abre em uma nova aba para o WhatsApp
    window.open(linkWhatsapp, '_blank');
}

function copiarTexto() {
    // ... (restante do código da função copiarTexto)
    const texto = document.getElementById("resultado").textContent;
    if (!texto) {
        alert("Gere o texto antes de copiar.");
        return;
    }
    navigator.clipboard.writeText(texto).then(() => {
        alert("Texto copiado com sucesso!");
    }).catch(() => {
        alert("Erro ao copiar o texto.");
    });
}

function novaCarga() {
    // ... (restante do código da função novaCarga)
    const campos = document.querySelectorAll("input, textarea, select");
    campos.forEach(campo => {
        switch (campo.id) {
            case "opcoesPagamento": 
                campo.value = "PAGAMENTO: 80/20 - SALDO APÓS A CHEGADA DOS COMPROVANTES NA TRANSKING (PAGAMENTO TODA SEGUNDA-FEIRA)";
                break;
            case "tipoPix":
                campo.value = "";
                break;
            case "tecnologia":
                campo.value = "NÃO";
                break;
            case "obs":
                campo.value = "";
                break;
            case "regras":
                campo.value = `*=> Proibido abandonar o veículo em local não autorizado pelo Monitoramento;
*=> Proibido parar em postos/locais não homologados pela Opentech;
-- Valor da diária…`;
                break;
            case "opentech":
            case "brk":
                campo.value = "0";
                break;
            default:
                campo.value = "";
        }
    });
    document.getElementById("resultado").textContent = "";
}
