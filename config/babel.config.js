const createConfig = ({ modules, isDev }) => {
  const plugins = [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-export-default-from'
  ];
  const extraPlugins = [
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-transform-object-assign',
    ['@babel/plugin-proposal-nullish-coalescing-operator', { loose: true }]
  ];

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules,
          useBuiltIns: 'usage',
          targets: '> 0.25%, not dead'
        }
      ],
      [
        '@babel/preset-react',
        {
          development: isDev
        }
      ]
    ],
    plugins: plugins.concat(extraPlugins)
  };
};

const modules =
  process.env.BABEL_ENV === 'commonjs' || process.env.NODE_ENV === 'test' ? 'commonjs' : false;
const isDev = process.env.NODE_ENV === 'development';

module.exports = createConfig({ modules, isDev });
