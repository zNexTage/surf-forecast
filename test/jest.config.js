/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { resolve } = require('path');
const root = resolve(__dirname, '..');
const rootConfig = require(`${root}/jest.config.js`);

module.exports = {...rootConfig, ...{
  rootDir: root,
  displayName: "end2end-tests",
  setupFilesAfterEnv: ["<rootDir>/test/jest-setup.ts"], //Roda antes dos testes serem iniciados
  testMatch: ["<rootDir>/test/**/*.test.ts"], //Só será aplicado testes para os arquivos dentro da pasta test.ts
}}