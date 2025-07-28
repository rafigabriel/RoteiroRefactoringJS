// main.js
const { readFileSync } = require("fs");
const ServicoCalculoFatura = require("./ServicoCalculoFatura");
const Repositorio = require("./Repositorio");

// Função auxiliar para formatar valores monetários
function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(valor / 100);
}

// Função principal para gerar a string da fatura
function gerarFaturaStr(fatura, calc) {
  let resultado = `Fatura ${fatura.cliente}\n`;

  for (let apre of fatura.apresentacoes) {
    const peca = calc.getPeca(apre);
    const total = calc.calcularTotalApresentacao(apre);
    resultado += `  ${peca.nome}: ${formatarMoeda(total)} (${
      apre.audiencia
    } assentos)\n`;
  }

  resultado += `Valor total: ${formatarMoeda(
    calc.calcularTotalFatura(fatura.apresentacoes)
  )}\n`;
  resultado += `Créditos acumulados: ${calc.calcularTotalCreditos(
    fatura.apresentacoes
  )} \n`;

  return resultado;
}

// Execução
const faturas = JSON.parse(readFileSync("./faturas.json"));
const repo = new Repositorio();
const calc = new ServicoCalculoFatura(repo);

const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);
