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

  const origemDestino = `${get("cidadeOrigem").toUpperCase()} ${get("ufOrigem").toUpperCase()} X ${get("cidadeDestino").toUpperCase()} ${get("ufDestino").toUpperCase()}`;
  const coleta = `${get("dataColeta")} – ${get("horaColeta")}`;
  const entrega = `${get("dataEntrega")} – ${get("horaEntrega")}`;
  const frete = formatFrete(get("frete"));
  const telefoneMoto = formatTelefone(get("telefoneMoto"));
  const telefoneResp = formatTelefone(get("telefoneResp"));
  const pix = `${get("tipoPix")}: ${get("chavePix")}`;
  const cadastro = `OPENTECH: ${get("opentech")} / BRK: ${get("brk")}`;

  const texto = `
${origemDestino}

COLETA: ${coleta}
ENTREGA: ${entrega}

FRETE: ${frete}
MOTORISTA: ${get("motorista")}
CPF: ${formatCPF(get("cpf"))}
TELEFONE: ${telefoneMoto} (MOTO) // ${telefoneResp} (RESP)
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
OBS.: ${get("obs")}

DT: ${get("dt")}
CAPTAÇÃO: ${get("captacao")}
COTAÇÃO: ${get("cotacao")}
COLETA: ${get("coletaId")}

${get("regras")}
  `;
  document.getElementById("resultado").textContent = texto.trim();
}

function copiarTexto() {
  const resultado = document.getElementById("resultado").textContent;
  if (!resultado) {
    alert("Nenhum texto gerado para copiar.");
    return;
  }
  navigator.clipboard.writeText(resultado).then(() => {
    alert