'use strict';

const util = require('react-boilerplate-app-utils');
const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const SimpleProgressPlugin = require('webpack-simple-progress-plugin');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const chalk = require('chalk');
const scriptsPackagename = util.scriptsPackagename;
const paths = require(util.pathResolve('config/paths.js', scriptsPackagename));

//bebin-----------packageJson信息获取
const packageJson = util.getCwdPackageJson();
function getInfo(packageId) {
  return !!(
    (packageJson.dependencies && packageJson.dependencies[packageId]) ||
    (packageJson.devDependencies && packageJson.devDependencies[packageId])
  );
}
const useSass = getInfo('sass-loader') && getInfo('node-sass');
const useLess = getInfo('less') && getInfo('less-loader');
//end  -----------packageJson信息获取
const cwdPackageJsonConfig = util.getDefaultCwdPackageJsonConfig(
  scriptsPackagename
);
if (cwdPackageJsonConfig.dll) {
  //dll js 文件路径，这里只有一个dll，没设置多个。
  const dllPath = path.resolve(
    paths.appPublic,
    cwdPackageJsonConfig.basename || '',
    'dll.app.js'
  );
  if (!fs.existsSync(dllPath)) {
    console.log(
      chalk.red(
        `${dllPath} is not existed.\r\n${chalk.cyan(
          'Please run: npm run build-dll'
        )}`
      )
    );
    process.exit();
  }
}

const postcssLoaderConfig = {
  loader: 'postcss-loader',
  options: {
    sourceMap: true,
    ident: 'postcss',
    plugins: () => [
      autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          // React doesn't support IE8 anyway
          'not ie < 9',
        ],
      }),
    ],
  },
};

let entry = [
  'react-hot-loader/patch',
  //热替换入口文件
  'webpack-dev-server/client',
  // bundle the client for hot reloading
  // only- means to only hot reload for successful updates
  'webpack/hot/only-dev-server',
  require.resolve(util.pathResolve('config/polyfills.js', scriptsPackagename)),
  paths.appEntry,
];
const exclude = [
  function(pathString) {
    pathString = util.platformPathAdapter(pathString);
    if (~pathString.indexOf('webpack-dev-server/client')) {
      //webpack-dev-server/client中的严格模式中使用了const，需要转换成浏览器可运行的代码。
      return false;
    } else if (~pathString.indexOf('/node_modules/')) {
      return true;
    }
  },
  path.resolve(process.cwd(), 'config'),
  path.resolve(process.cwd(), 'bin'),
  path.resolve(process.cwd(), 'build'),
  /.cache/,
];
//webpack配置项
var config = {
  devtool: 'cheap-module-source-map',
  //隐藏终端的warning信息
  performance: {
    hints: false,
    maxEntrypointSize: 1100000,
    maxAssetSize: 505000,
  },
  entry: {
    app: entry,
  },
  output: {
    filename: 'bundle.[hash].js',
    //js打包输出目录
    path: paths.appBuild,
    //内存和打包静态文件输出目录，以index.html为准,使用绝对路径，最好以斜杠/结尾，要不有意想不到的bug
    publicPath: '/',
    //定义require.ensure文件名
    chunkFilename: '[name]-[id]-[chunkHash].chunk.js',
    libraryTarget: 'var',
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  module: {
    rules: [
      //匹配到rquire中以.css结尾的文件则直接使用指定loader
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', postcssLoaderConfig],
      },
      //字体等要经过file-loader提取到指定目录
      {
        //特别留意这里，如果有新的loader后缀名，都会优先经过这里
        //需要在这里过滤调，如.less，.scss
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.(ts|tsx)$/,
          /\.css$/,
          /\.less$/,
          /\.scss/,
          /\.json$/,
          /\.bmp$/,
          /\.gif$/,
          /\.jpe?g$/,
          /\.png$/,
          /\.svg$/,
          /\.webp$/,
        ],
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      //limit是base64转换最大限制，小于设置值，都会转为base64格式
      //name是在css中提取图片的命名方式
      //目前设置.bmp、.git、.jpe(g)、.png转换
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg/, /\.webp$/],
        //[path]是以publicPath为准
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash].[ext]',
        },
      },
      {
        //确保在babel转换前执行
        enforce: 'pre',
        test: /\.js[x]?$/,
        //之所以不用include是因为，如果单独是用react-boilerplate-app-scirpts，
        //修改了paths.src的路径，但是还是想检查其他的目录，这就会有问题。
        exclude,
        loader: 'eslint-loader',
      },
      {
        //匹配.js或.jsx后缀名的文件
        test: /\.js[x]?$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
        //之所以不用include是因为，如果单独是用react-boilerplate-app-scirpts，
        //修改了paths.src的路径，但是还是想检查其他的目录，这就会有问题。
        exclude,
      },
    ],
  },
  externals: {},
  resolve: {
    alias: {
      src: paths.src,
      'antd-form-component/lib': path.resolve(process.cwd(), 'src'),
      'antd-form-component': path.resolve(process.cwd(), 'src'),
    },
    //不可留空字符串
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.web.js', '.web.jsx'],
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      dllScirpts: cwdPackageJsonConfig.dll
        ? `<script type="text/javascript" src="${
            cwdPackageJsonConfig.basename
          }/dll.app.js"></script>`
        : '',
      inject: true,
      template: paths.appHtml,
    }),
    new webpack.DefinePlugin({
      'process.env.basename': JSON.stringify(cwdPackageJsonConfig.basename),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new webpack.HotModuleReplacementPlugin(),
    // prints more readable module names in the browser console on HMR updates
    new webpack.NamedModulesPlugin(),
    new SimpleProgressPlugin({
      progressOptions: {
        complete: chalk.bgGreen(' '),
        incomplete: chalk.bgWhite(' '),
        width: 20,
        total: 100,
        clear: true,
      },
    }),
    new CaseSensitivePathsPlugin(),
  ],
};
//如果设置了dll，添加DllReferencePlugin
if (cwdPackageJsonConfig.dll) {
  config.plugins.push(
    new webpack.DllReferencePlugin({
      manifest: require(path.resolve(paths.appPublic, 'app-manifest.json')),
      extensions: [
        '.js',
        '.jsx',
        '.ts',
        '.tsx',
        '.json',
        '.web.js',
        '.web.jsx',
      ],
    })
  );
}
//使用sass配置
if (useSass) {
  config.module.rules.push({
    test: /\.scss$/,
    use: [
      'style-loader',
      'css-loader',
      postcssLoaderConfig,
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
        },
      },
    ],
  });
}
//使用less配置
if (useLess) {
  config.module.rules.push({
    test: /\.less$/,
    use: [
      'style-loader',
      'css-loader',
      postcssLoaderConfig,
      {
        loader: 'less-loader',
        options: {
          sourceMap: true,
        },
      },
    ],
  });
}

module.exports = config;
