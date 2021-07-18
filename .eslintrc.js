module.exports = {
  root: true,
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    'arrow-parens': 0,
    'no-invalid-this': 0,
    'no-trailing-spaces': [2, { skipBlankLines: true }],
    'comma-dangle': 0,
    'max-len': [2, 125, 4, { ignoreComments: true }],
    'new-cap': 0,
    'no-console': ['error', { allow: ['warn', 'error', 'info', 'debug'] }],
    'no-process-env': ['error'],
    'object-curly-spacing': ['error', 'always'],
    'require-jsdoc': [
      'error',
      {
        require: {
          FunctionDeclaration: false,
          MethodDefinition: false,
          ClassDeclaration: false,
        },
      },
    ],
    'no-var': 0,
    'space-before-function-paren': 0,
    'padded-blocks': 0,
    'valid-jsdoc': 0,
    'no-case-declarations': 0,
    'quote-props': 0,
  },
};
