const { readFileSync } = require("fs");

// -------------------- Funções Auxiliares (fora de gerarFaturaStr) --------------------

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(valor / 100);
}

function getPeca(pecas, apresentacao) {
  return pecas[apresentacao.id];
}

function calcularCredito(pecas, apresentacao) {
  let creditos = 0;
  creditos += Math.max(apresentacao.audiencia - 30, 0);
  if (getPeca(pecas, apresentacao).tipo === "comedia") {
    creditos += Math.floor(apresentacao.audiencia / 5);
  }
  return creditos;
}

function calcularTotalCreditos(pecas, apresentacoes) {
  let totalCreditos = 0;
  for (let apre of apresentacoes) {
    totalCreditos += calcularCredito(pecas, apre);
  }
  return totalCreditos;
}

function calcularTotalApresentacao(pecas, apresentacao) {
  let total = 0;
  const peca = getPeca(pecas, apresentacao);

  switch (peca.tipo) {
    case "tragedia":
      total = 40000;
      if (apresentacao.audiencia > 30) {
        total += 1000 * (apresentacao.audiencia - 30);
      }
      break;
    case "comedia":
      total = 30000;
      if (apresentacao.audiencia > 20) {
        total += 10000 + 500 * (apresentacao.audiencia - 20);
      }
      total += 300 * apresentacao.audiencia;
      break;
    default:
      throw new Error(`Peça desconhecida: ${peca.tipo}`);
  }

  return total;
}

function calcularTotalFatura(pecas, apresentacoes) {
  let total = 0;
  for (let apre of apresentacoes) {
    total += calcularTotalApresentacao(pecas, apre);
  }
  return total;
}

function gerarFaturaHTML(fatura, pecas) {
  let resultado = `<html>\n`;
  resultado += `<p> Fatura ${fatura.cliente} </p>\n`;
  resultado += `<ul>\n`;

  for (let apre of fatura.apresentacoes) {
    const peca = getPeca(pecas, apre);
    const total = calcularTotalApresentacao(pecas, apre);
    resultado += `<li>  ${peca.nome}: ${formatarMoeda(total)} (${
      apre.audiencia
    } assentos) </li>\n`;
  }

  resultado += `</ul>\n`;
  resultado += `<p> Valor total: ${formatarMoeda(
    calcularTotalFatura(pecas, fatura.apresentacoes)
  )} </p>\n`;
  resultado += `<p> Créditos acumulados: ${calcularTotalCreditos(
    pecas,
    fatura.apresentacoes
  )} </p>\n`;
  resultado += `</html>`;

  return resultado;
}


// -------------------- Função Principal --------------------

function gerarFaturaStr(fatura, pecas) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;

  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${getPeca(pecas, apre).nome}: ${formatarMoeda(
      calcularTotalApresentacao(pecas, apre)
    )} (${apre.audiencia} assentos)\n`;
  }

  faturaStr += `Valor total: ${formatarMoeda(
    calcularTotalFatura(pecas, fatura.apresentacoes)
  )}\n`;
  faturaStr += `Créditos acumulados: ${calcularTotalCreditos(
    pecas,
    fatura.apresentacoes
  )} \n`;

  return faturaStr;
}

// -------------------- Execução de Teste --------------------

const fatura = JSON.parse(readFileSync("./faturas.json"));
const pecas = JSON.parse(readFileSync("./pecas.json"));

console.log(gerarFaturaStr(fatura, pecas));
console.log("\n--- Fatura HTML ---\n");
console.log(gerarFaturaHTML(fatura, pecas));
