const { formatarMoeda } = require("./Util");

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

module.exports = gerarFaturaStr;
