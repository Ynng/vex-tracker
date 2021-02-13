module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true
  },
  plugins:[
    "prettier"
  ],
  extends: [
    "eslint:recommended",
    "prettier"
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    "prettier/prettier": 2 // Means error
  }
}
