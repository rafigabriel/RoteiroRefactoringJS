// ServicoCalculoFatura.js
class ServicoCalculoFatura {
  constructor(repo) {
    this.repo = repo;
  }

  getPeca(apre) {
    return this.repo.getPeca(apre);
  }

  calcularCredito(apre) {
    let creditos = 0;
    const peca = this.getPeca(apre);

    creditos += Math.max(apre.audiencia - 30, 0);
    if (peca.tipo === "comedia") {
      creditos += Math.floor(apre.audiencia / 5);
    }
    return creditos;
  }

  calcularTotalCreditos(apresentacoes) {
    let totalCreditos = 0;
    for (let apre of apresentacoes) {
      totalCreditos += this.calcularCredito(apre);
    }
    return totalCreditos;
  }

  calcularTotalApresentacao(apre) {
    const peca = this.getPeca(apre);
    let total = 0;

    switch (peca.tipo) {
      case "tragedia":
        total = 40000;
        if (apre.audiencia > 30) {
          total += 1000 * (apre.audiencia - 30);
        }
        break;

      case "comedia":
        total = 30000;
        if (apre.audiencia > 20) {
          total += 10000 + 500 * (apre.audiencia - 20);
        }
        total += 300 * apre.audiencia;
        break;

      default:
        throw new Error(`Peça desconhecida: ${peca.tipo}`);
    }

    return total;
  }

  calcularTotalFatura(apresentacoes) {
    let total = 0;
    for (let apre of apresentacoes) {
      total += this.calcularTotalApresentacao(apre);
    }
    return total;
  }
}

module.exports = ServicoCalculoFatura;
