const { readFileSync } = require("fs");
const ServicoCalculoFatura = require("./ServicoCalculoFatura");

// -------------------- Funções Auxiliares (fora de gerarFaturaStr) --------------------

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(valor / 100);
}


//function gerarFaturaHTML(fatura, pecas) {
//  let resultado = `<html>\n`;
//  resultado += `<p> Fatura ${fatura.cliente} </p>\n`;
//  resultado += `<ul>\n`;
//
//  for (let apre of fatura.apresentacoes) {
//    const peca = getPeca(pecas, apre);
//    const total = calcularTotalApresentacao(pecas, apre);
//    resultado += `<li>  ${peca.nome}: ${formatarMoeda(total)} (${
//      apre.audiencia
//    } assentos) </li>\n`;
//  }
//
//  resultado += `</ul>\n`;
//  resultado += `<p> Valor total: ${formatarMoeda(
//    calcularTotalFatura(pecas, fatura.apresentacoes)
//  )} </p>\n`;
//  resultado += `<p> Créditos acumulados: ${calcularTotalCreditos(
//    pecas,
//    fatura.apresentacoes
//  )} </p>\n`;
//  resultado += `</html>`;
//
//  return resultado;
//}


// -------------------- Função Principal --------------------

function gerarFaturaStr(fatura, pecas, calc) {
  let resultado = `Fatura ${fatura.cliente}\n`;

  for (let apre of fatura.apresentacoes) {
    const peca = calc.getPeca(pecas, apre);
    const total = calc.calcularTotalApresentacao(pecas, apre);
    resultado += `  ${peca.nome}: ${formatarMoeda(total)} (${
      apre.audiencia
    } assentos)\n`;
  }

  resultado += `Valor total: ${formatarMoeda(
    calc.calcularTotalFatura(pecas, fatura.apresentacoes)
  )}\n`;
  resultado += `Créditos acumulados: ${calc.calcularTotalCreditos(
    pecas,
    fatura.apresentacoes
  )} \n`;

  return resultado;
}

// -------------------- Execução de Teste --------------------

const calc = new ServicoCalculoFatura();

const fatura = JSON.parse(readFileSync("./faturas.json"));
const pecas = JSON.parse(readFileSync("./pecas.json"));

console.log(gerarFaturaStr(fatura, pecas, calc));

