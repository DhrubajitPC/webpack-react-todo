# Demystifying Webpack - breaking down a React-Typescript project configuration

###### Topics

- introduction

- entry

- output

- resolvers

- loaders

- plugins

- dev and prod build

The Javascript ecosystem has become so huge nowadays that when developers come on board, they have to learn and master a lot tools other than the core language itself. It can be quite overwhelming resulting in _javascript fatigue_. One of these tools that is ubiquitous but difficult to wrap one's head around is webpack. I am writing this post with the hope to simplify the learning process for everyone.

Webpack is a bundler that bundles our javascript files to be served over the network. But why do we need a bundler. Why not just use script tags like the old days?

```html
<body>
  <!--
        some block of code
    -->
  <script src="lib.js"></script>
  <script src="index.js"></script>
</body>
```

The problem is that in our projects nowadays, we may have a lot of javascript files (maybe even a hundred) across different folders which may depend on each other and it becomes very difficult to manage all of them.

Modern browsers now support esmodules and we may rely on them to handle the dependency problems, but there is still a lot of features that are missing. Webpack allows us to manage this dependency and much more in a nice way. It also provides us the capacity to add tons of customization suited to our needs.

For this post, I will build a very basic todo application using React and Typescript and bundle it using webpack. In the process, I will walk you through the different parts of webpack and how we can come up with a webpack config that we can use in production. You can find the source code here.

Let's get started.

---

Create a folder and within it run the following commands

```bash
npm init -y
npm i --save-dev webpack webpack-cli webpack-dev-server typescript ts-loader html-webpack-plugin @types/react @types/react-dom
npm i --save react react-dom
```

We need `webpack` to create the bundle. The `webpack-cli` is a tool that allows us to run webpack using the cli and the `webpack-dev-server` will be our server that will serve our application. We will need `typescript` to transpile our typescript code and we will need `ts-loader` to let webpack know how to bundle typescript files. We install `react` and `react-dom` because we need them to create a react application and we also install `@types/react` and `@types/react-dom` to support type inferencing in our react app. The `html-webpack-plugin` is a webpack plugin that uses the webpack engine to generate html files for us.

With our installation complete, we can add the code from the repo. Our folder structure looks like this.

```
node_modules
src
|--components
|--|--App.tsx
|--|--InputTodo.tsx
|--|--styles.css
|--|--TodoItem.tsx
|--|--TodoList.tsx
|--|--types.ts
|--index.tsx
index.html
package-lock.json
package.json
tsconfig.json
webpack.config.json
```

With these files in, we can test out our config. From the terminal run `npm start`. It will spin up a server. Open our simple todo react app in the browser by going to `http://localhost:8080`.

The `webpack.config.js` file looks quite intimidating. So let's understand what's going on.

###### Entry:

This gives webpack the starting file from which to build the dependency graph. It is possible to have multiple entry points.

```js
module.exports = {
  entry: {
    pageOne: "./src/pageOne/index.js",
    pageTwo: "./src/pageTwo/index.js",
    pageThree: "./src/pageThree/index.js",
  },
};
```

In the above example, this creates 3 separate dependency graphs. Sometimes, this is useful for reducing the assets that are fetched over the network when we are using optimization techniques like chunking.

###### Output:

This is the folder in which all webpack files are bundled into.

```js
{
  output: "dist";
}
```

###### Resolvers:

Resolvers in webpack allow us to import files without including the file extension. For example it is possible to

```js
import "./index";
```

instead of:

```js
import "./index.js";
```

It also supports non relative relative paths usage in import statement using the `alias` key.

###### Devtool

The devtool property allows us to include the source map of our code so that we can inspect our code in the browser.

```js
//webpack.config.js

...
devtool: "source-map",
...
```

Without this, we wouldn't be able to see our code in the browser devtools. Webpack offers different [options]([https://webpack.js.org/configuration/devtool/#root](https://webpack.js.org/configuration/devtool/#root) and suggestions to use. I usually leave this in production mode as well because it helps with debugging and the source map is not loaded by browsers until the devtools are opened so there is no additional overhead for general users.

###### Loaders:

In any application, we need to work with different kinds of files. For example, loading images or different fonts or special files like jsx. Javascript cannot read this files directly. Webpack loaders help load them to our so that we can just import all these files and use them in our code directly. Let's look at our code,

```json
module: {

  rules: [
    {
      test: /\.ts(x?)$/,
      exclude: /node_modules/,
      include: [path.resolve("src")],
      loader: "ts-loader",
      options: {
        transpileOnly: true,
        compilerOptions: {
          module: "es2015",
        },
      },
    },
    {
      test: /\.css$/i,
      use: ["style-loader", "css-loader"],
    },
  ],
},
```

We are using three different loaders here. All our loaders go under the `module`property under `rules` section. The `rules` section is a set of rules that gets applied to every file before webpack builds the dependency graph. As to what the rule does, it depends on the loader that's assigned to the rule. We have two different rules. Webpack knows which rules to apply by checking in with the `test` property. All our .ts files are applied the first rule. The `ts-loader` converts all our typescript files into javascript that webpack can understand. Every loader can have its own set of custom configuration so I urge you to look into the documentation for them.

So what are loaders? They are basic functions that take in a file and output a javascript string. Let's write a very basic loader. We are going to read a `.txt` file and the content will be used as a header for our app instead of `Simple Todo`. It's a lazy contrived example so I apologize for it. Anyways, first we update our webpack config.

```json
resolve: {
 extensions: [".ts", ".tsx", ".js", ".txt"], // we need to resolve our txt files as well
},

module: {
  rules: [
    // ....
    {
      test: /\.txt$/i,
      loader: path.resolve(__dirname, "customLoader.js")
    }
  ]
}
```

We add the .txt extension to our reolvers and add a new rule set which converts our txt files into javascript code. We point to our custom loader in the loader property.

```js
// customLoader.js
module.exports = function (source) {
  return `module.exports = '${source}'`;
};
```

Our custom loader is just a function that gets the content of our source file and returns a javascript module (in strings). And that's all we need to write a loader. Time to test it. Add in a new file `src/components/header.txt`

```textile
Awesome Todo Header
```

Change our app code:

```tsx
// src/components/App.tsx
import Header from "./header.txt"; // note the '.txt' extension here. We need this because of typescript module resolution

// other block of code

<div className="main-container">
  <h2>{Header}</h2>
  <InputTodo onAddTodo={handleNewTodo} />
  <TodoList
    todos={todos}
    updateTodos={(newTodos: Todo[]) => setTodos(newTodos)}
  />
</div>;
```

Because we are using typescript, we need to tell how to resolve a text file. We need to define the text file as a module for typescript to compile.

```ts
// src/components/header.d.ts
declare module "*.txt" {
  const _: string;

  export default _;
}
```

We are done. We can see that webpack uses our custom loader to read from the `header.txt` file inject the data into our react component.

Now let us take a look at how we parse our css files. We are using two different loaders here. We compose them using the `use` property. Loaders are applied from right to left. In this case, the `css-loader` is applied before the `style-loader`. One way to remember is by looking at it as just function compositions `style-loader(css-loader(content))`. The css-loader transforms our css to in-memory javascript and the style-loader injects that code into our source.

###### Plugins:

Plugins allow for more fine grained control. Plugins allow us to `hook` into the webpack compilation process and run our own code to modify or add features as needed. A plugin can be used multiple times in the configuration so every plugin needs a `new` instance of itself declared during the initialization phase.

For our example we are using the `html-webpack-plugin`. This plugin generates an html file and injects our genereated bundle into it.

```json
plugins: [
 new HTMLWebpackPlugin({
   template: "./index.html",
   inject: true,
   filename: "./index.html",
   minify: {
     minifyCSS: true,
     minifyJS: true,
     removeComments: true,
     useShortDoctype: true,
     collapseWhitespace: true,
     collapseInlineTagWhitespace: true,
   },
 }),
],
```

We are currently generating our css as inline styles. This means that if our webpage loads with static content, it needs to finish parsing the js before it can add the styles. Let's separate it out using the `mini-css-extract-plugin`.

```bash
npm install --save-dev mini-css-extract-plugin
```

The package uses webpack loaders and plugin system together to generate our static css files. Add these into our `webpack.config.js`.

```json
/// block of code
 module: {
    rules: [
      // ...
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"], // Note, we removed "style-loader"

      },
     // ...
    ],
    plugins: [
      new MiniCssExtractPlugin({

        filename: "[name].css",

        chunkFilename: "[id].css",

      }),

      new HTMLWebpackPlugin({...}),
    ],
  },
```

Now let's build our application and look into the `dist` folder. We can see that there is a separated generated file with our css code and we can see that this file is also injected into our generated html file.

Take note that we removed our `style-loader` from our loaders since we are not injecting the css into our source code anymore.

Let us create a trivial plugin.

```js
// customPlugin.js
class CustomPlugin {
  apply(compiler) {
    compiler.hooks.run.tap("CustomPlugin", (compilation) => {
      console.log("message from custom plugin");
    });
  }
}

module.exports = CustomPlugin;
```

Then let's add this to our config

```json
// webpack.config.js
const CustomPlugin = require('./customPlugin')
...
plugins = [
    ...,
    new CustomPlugin()
]
...
```

Now when we run `npm run build` we can see our message. Here, our custom plugin hooks into the `run` lifecycle of our webpack compiler. Here, we get access to the compilation object on which we can run our custom operations. There are a lot of different hooks that we tap into to do a lot of things. In fact, most of webpack internally depends on its own plugin system. It is non trivial to explore the webpack plugin api, but the basic idea we concern ourselves with is just that plugins are functions or classes that hooks onto the webpack compilation lifecycle. If you are interested on writing your own plugins, please take a look [here]([https://webpack.js.org/contribute/writing-a-plugin/#creating-a-plugin](https://webpack.js.org/contribute/writing-a-plugin/#creating-a-plugin) at the official webpack guide. It's very well written.

###### Production Config

Now that we have looked into the basics of how webpack works, let's look into how we may end up configuring webpack for our applications. It is often a good idea to have separate config files for our development and production environments. The webpack-cli tool takes in argument called config that takes the path to the config file. We can update our package.json to create two separate scripts now.

```json
// package.json
 "scripts": {
    "start": "webpack-dev-server --mode development --config webpack.dev.config.js",
    "build:prod": "webpack --mode production --config webpack.prod.js",
    "build:dev": "webpack --mode development --config webpack.dev.js"
  },
```

We need to have the two files we are passing into the config

```bash
cp webpack.config.js webpack.prod.js
cp webpack.config.js webpack.dev.js
```

Now we can have a different config for prod and for dev environments. However, there is a lot of repitition between the two config. Webpack offers us a tool `webpack-merge` that allows us to combine separate webpack configs together. Let us rename our original config and install the package

```bash
mv webpack.config.js webpack.base.js
npm i --save-dev webpack-merge
```

We are going to make the following changes

```js
// webpack.base.js
// removing our css loader and plugin from the base file as they will be different in prod and dev environment
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CustomPlugin = require("./customPlugin");

const config = {
  entry: path.join(__dirname, "src/index.tsx"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".css", ".txt"],
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        include: [path.resolve("src")],
        loader: "ts-loader",
        options: {
          transpileOnly: false,
          compilerOptions: {
            module: "es2015",
          },
        },
      },
      {
        test: /\.(txt)$/i,
        loader: path.resolve(__dirname, "customLoader.js"),
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: "./index.html",
      inject: true,
      filename: "./index.html",
      minify: {
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        useShortDoctype: true,
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
      },
    }),
    new CustomPlugin(),
  ],
};

module.exports = config;
```

```js
// webpack.dev.js
const webpackMerge = require("webpack-merge");
const baseConfig = require("./webpack.base");

const config = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};

module.exports = webpackMerge(baseConfig, config);
```

```js
// webpack.prod.js
const webpackMerge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const baseConfig = require("./webpack.base");
const config = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
};

module.exports = webpackMerge(baseConfig, config);
```

We have split up our configs now. We use the style loader to inject inline styles during dev mode and use the mini-css-extract-plugin to create css files in production. With two different configs we can now optimize for our prod build. When we are optimizing with webpack, we usually care about 3 things, `code splitting`, `tree shaking` and `small bundle size`.

###### Code Splitting

Browsers will cache static resources like images, css and js bundles to speed up page load without fetching those files a second time from the server. This often results in bugs where we ask users to clear the cache. We can prevent this by using `[contenthash]` in our bundle output file names. Webpack will automatically replace `[contenthash]` with the hash of the content of the file. So whenever we deploy, the browser will fetch the new js. But if we make only minor changes to our codebase, our single generated bundle will be different and the entire bundle will be downloaded again removing some of the advantages of caching.

The workaround would be to split our javascript bundle into many small bundles so that only the changed bundles gets reloaded. For that we use the `SplitChunksPlugin` that ships with webpack. This plugin is not configured in the `plugin` section of the config like all other plugins, but it has its own key called `optimization`.

###### Tree Shaking

Tree shaking means removing code that is not used in our codebase. For example, say we import a library like `lodash` in our code and we only use a few utility functions from the library. Without tree shaking, the entire library will be loaded and bundled with our code. This increases our bundle size unnecessarily which results in a slower download of our js bundles by our clients. Webpack does tree shaking by default if we are using esmodule syntax so always try to use that.

```tsx
// these won't tree shake
var reactRedux = require("react-redux");
var connect = reactRedux.connect;
import reacRedux from "react-redux";
var connect = reactRedux.connect;

// the correct way
import { connect } from "react-redux";
```

###### Small Bundle Size

The smaller the bundle size, the faster our clients can download our code over the network. When we run webpack in production code, it already uses the `TerserPlugin` by default to minimize our code. This means that, our original code gets replaced to a much more compact form. Take a look at the generated bundles to see what the output looks like.

With the theory out of the way, let's update our `webpack.prod.js` files.

```js
// webpack.prod.js
const webpackMerge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");
const baseConfig = require("./webpack.base");

const config = {
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: "[id].[contenthash].css",
    }),
    new CleanWebpackPlugin(), // A webpack plugin to remove/clean our dist folder
  ],
  // add this optimization block to enable code splitting

  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};

module.exports = webpackMerge(baseConfig, config);
```

With this we have a decent webpack configuration for production. This can be made better and there are a lot of plugins that can be of value to us. I urge you to explore more on your own.

###### Hot Module Replacement (HMR)

Hot Module Replacement is an extremely useful and powerful feature of webpack. It allows us to update our code and see the changes reflected without having the need for a full refresh. However, setting it up differs across different frameworks. Refer to the [docs](https://webpack.js.org/guides/hot-module-replacement/) for more info. For react, you would need to integrate [`react-hot-loader`](https://github.com/gaearon/react-hot-loade) plugin.

Since our application is build with typescript, we will need to set up `babel` as well for our 'hmr' to work. `Babel` is a transpiler that transpiles javascript/typescript code. Since we will now use babel to transpile our typescript code, we can remove `ts-loader` .

```bash
npm uninstall ts-loader
```

Even though babel does the transpiling, it does not do the typechecking. For that we would need another plugin `fork-ts-checker-webpack-plugin`. Let's add our dependencies

```bash
npm i --save-dev @babel/core @babel/preset-end @babel/preset-react @babel/preset-typescript @babel-loader fork-ts-checker-webpack-plugin

npm i --save react-hot-loader @hot-loader/react-dom
```

with our dependencies in, let's update our webpack config

```js
// webpack.base.js
const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CustomPlugin = require("./customPlugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin"); // add this plugin

const config = {
  entry: path.join(__dirname, "src/index.tsx"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".css", ".txt"],
    alias: {
      "react-dom": "@hot-loader/react-dom", // add a global alias to use @hot-loader/react-dom instead of react-dom
    },
  },
  module: {
    rules: [
      {
        test: /\.(j|t)s(x)?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", //use babel

          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: [
              [
                "@babel/preset-env",
                { targets: { browsers: "last 2 versions" } }, // or whatever your project requires
              ],
              "@babel/preset-typescript",
              "@babel/preset-react",
            ],
            plugins: ["react-hot-loader/babel"],
          },
        },
      },
      {
        test: /\.(txt)$/i,
        loader: path.resolve(__dirname, "customLoader.js"),
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(), // typechecks ts files

    new HTMLWebpackPlugin({
      template: "./index.html",
      inject: true,
      filename: "./index.html",
      minify: {
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        useShortDoctype: true,
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
      },
    }),
    new CustomPlugin(),
  ],
};

module.exports = config;
```

Now we need to update our `App.tsx`

```tsx
// src/components/App.tsx

...
import { hot } from "react-hot-loader/root";

...
...
export default hot(App);
```

That's all we need to do. Now try making any change to the site and see it reflected in the browser without needing to refresh.

---

And that's it! There were quite a lot of different things to look at but I hope this post eases your learning curve towards your journey to master webpack. :)
