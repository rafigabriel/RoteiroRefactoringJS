const { readFileSync } = require("fs");

const Repositorio = require("./Repositorio");
const ServicoCalculoFatura = require("./ServicoCalculoFatura");
const gerarFaturaStr = require("./Apresentacao");

// main
const faturas = JSON.parse(readFileSync("./faturas.json"));
const calc = new ServicoCalculoFatura(new Repositorio());
const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);
