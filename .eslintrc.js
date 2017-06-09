module.exports = {
  'extends': 'airbnb-base',
  'plugins': [
    'import'
  ],
  'parser': 'babel-eslint',
  'rules': {
    'comma-dangle': ['error', 'always-multiline'],
    'semi': ['error', 'never'],
  },
  'settings': {
    'import/core-modules': [
      'bluebird',
      'electron',
      'react',
      'react-redux',
      'redux-observers',
      'reselect',
      'react-bootstrap',
      'react-fontawesome',
      'path-extra',
      'fs-extra',
      'lodash',
      'cson',
      'react-dom',
      'redux',
      'semver',
      'prop-types',
    ],
  },
}
