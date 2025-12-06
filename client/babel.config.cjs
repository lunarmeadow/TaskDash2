module.exports = {
  presets: [
    // Transpile modern JS for the current Node version running Jest
    ['@babel/preset-env', { targets: { node: 'current' } }],
    // Transpile JSX
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
};
