// Função para formatar o CPF
function formatCPF(cpf) {
    return cpf.replace(/\D/g, '')
              .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Função para formatar o Telefone
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

// NOVO: Função para formatar data (DDMM ou DDMMYY) para DD/MM ou DD/MM/YY
function formatData(data) {
    const nums = data.replace(/\D/g, '');
    if (nums.length === 4) {
        return `${nums.slice(0, 2)}/${nums.slice(2, 4)}`;
    } else if (nums.length === 6) {
        return `${nums.slice(0, 2)}/${nums.slice(2, 4)}/${nums.slice(4, 6)}`;
    }
    return data; // Retorna o original se não tiver 4 ou 6 dígitos
}

// NOVO: Função para formatar hora (HHMM) para HH:MM
function formatHora(hora) {
    const nums = hora.replace(/\D/g, '');
    if (nums.length === 4) {
        return `${nums.slice(0, 2)}:${nums.slice(2, 4)}`;
    }
    return hora; // Retorna o original se não tiver 4 dígitos
}

function gerarTexto() {
    const get = id => document.getElementById(id).value;

    // REMOÇÃO DO CAMPO UF E AJUSTE DA VARIÁVEL
    const origemDestino = `${get("cidadeOrigem").toUpperCase()} X ${get("cidadeDestino").toUpperCase()}`; 
    
    // NOVO: APLICA AS FUNÇÕES DE FORMATAÇÃO DE DATA E HORA
    const coleta = `${formatData(get("dataColeta"))} – ${formatHora(get("horaColeta"))}`;
    const entrega = `${formatData(get("dataEntrega"))} – ${formatHora(get("horaEntrega"))}`;
    
    const frete = formatFrete(get("frete"));
    const telefoneMoto = formatTelefone(get("telefoneMoto"));
    
    // Lógica para Telefone Responsável: verifica se há conteúdo útil.
    const telefoneRespValor = get("telefoneResp").trim();
    const telefoneResp = telefoneRespValor ? ` // ${formatTelefone(telefoneRespValor)} (RESP)` : "";
    
    const pix = `${get("tipoPix")}: ${get("chavePix")}`;
    const cadastro = `OPENTECH: ${get("opentech")} / BRK: ${get("brk")}`;
    
    // NOVO: OBTÉM A OPÇÃO SELECIONADA PARA PAGAMENTO
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

    document.getElementById("resultado").textContent = texto;
}

function copiarTexto() {
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
    const campos = document.querySelectorAll("input, textarea, select");
    campos.forEach(campo => {
        switch (campo.id) {
            case "opcoesPagamento": // NOVO: Reseta para a opção padrão
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
