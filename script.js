function formatCPF(cpf) {
  return cpf.replace(/\D/g, '')
             .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatTelefone(tel) {
  const nums = tel.replace(/\D/g, '');
  if (nums.length === 11) {
    return `(${nums.slice(0,2)}) ${nums.slice(2,7)}-${nums.slice(7)}`;
  }
  return tel;
}

function formatFrete(valor) {
  return valor.includes('R$') ? valor : `R$ ${valor}`;
}

function gerarTexto() {
  const get = id => document.getElementById(id).value;

  const origemDestino = `${get("cidadeOrigem").toUpperCase()}/${get("ufOrigem").toUpperCase()} X ${get("cidadeDestino").toUpperCase()}/${get("ufDestino").toUpperCase()}`; 
  const coleta = `${get("dataColeta")} – ${get("horaColeta")}`;
  const entrega = `${get("dataEntrega")} – ${get("horaEntrega")}`;
  const frete = formatFrete(get("frete"));
  const telefoneMoto = formatTelefone(get("telefoneMoto"));
  
  // Lógica para Telefone Responsável: verifica se há conteúdo útil.
  const telefoneRespValor = get("telefoneResp").trim();
  const telefoneResp = telefoneRespValor ? ` // ${formatTelefone(telefoneRespValor)} (RESP)` : "";
  
  const pix = `${get("tipoPix")}: ${get("chavePix")}`;
  const cadastro = `OPENTECH: ${get("opentech")} / BRK: ${get("brk")}`;

  const texto = `
${origemDestino}

COLETA: ${coleta}
ENTREGA: ${entrega}

FRETE: ${frete}
MOTORISTA: ${get("motorista")}
CPF: ${formatCPF(get("cpf"))}
TELEFONE: ${telefoneMoto} (MOTO)${telefoneResp}
PAGAMENTO: 80/20 - SALDO APÓS A CHEGADA DOS COMPROVANTES NA TRANSKING (PAGAMENTO TODA SEGUNDA-FEIRA)
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
