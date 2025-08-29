module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat',     // Nova funcionalidade
      'fix',      // Correção de bug
      'docs',     // Documentação
      'style',    // Formatação, não afeta lógica
      'refactor', // Refatoração de código
      'test',     // Adicionar/modificar testes
      'chore',    // Manutenção, deps, build
      'perf',     // Melhoria de performance
      'ci',       // CI/CD
      'build',    // Build system, deps
      'revert'    // Reverter commit anterior
    ]],
    'type-case': [2, 'always', 'lowerCase'],
    'type-empty': [2, 'never'],
    'scope-empty': [0, 'never'], // Scope opcional
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always']
  }
};