class CustomPlugin {
  apply(compiler) {
    compiler.hooks.run.tap("CustomPlugin", (compilation) => {
      console.log("message from custom plugin");
    });
  }
}

module.exports = CustomPlugin;
