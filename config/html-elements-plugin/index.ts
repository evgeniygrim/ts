// function HtmlElementsPlugin(locations) {
//   this.locations = locations;
// }

export class HtmlElementsPlugin {
  private locations: any;
  private RE_ENDS_WITH_BS = /\/$/;

  constructor(locations) {
    this.locations = locations;
  }

  createTag = (tagName, attrMap, publicPath) => {
    publicPath = publicPath || '';

    /**
     * Add trailing slash if we have a publicPath and it doesn't have one.
     */
    if (publicPath && !this.RE_ENDS_WITH_BS.test(publicPath)) {
      publicPath += '/';
    }

    const attributes = Object.getOwnPropertyNames(attrMap)
      .filter(function(name) { return name[0] !== '='; } )
      .map(function(name) {
        let value = attrMap[name];

        if (publicPath) {
          /**
           * Check if we have explicit instruction, use it if so (e.g: =herf: false)
           * if no instruction, use public path if it's href attribute.
           */
          const usePublicPath = attrMap.hasOwnProperty('=' + name) ? !!attrMap['=' + name] : name === 'href';

          if (usePublicPath) {
            /**
             * Remove a starting trailing slash if the value has one so we wont have //
             */
            value = publicPath + (value[0] === '/' ? value.substr(1) : value);
          }
        }

        return `${name}="${value}"`;
      });

    const closingTag = tagName === 'script' ? '</script>' : '';

    return `<${tagName} ${attributes.join(' ')}>${closingTag}`;
  }

  getHtmlElementString = (dataSource, publicPath) => {
    return Object.getOwnPropertyNames(dataSource)
      .map((name) => {
        if (Array.isArray(dataSource[name])) {
          return dataSource[name].map(function(attrs) { return this.createTag(name, attrs, publicPath); } );
        } else {
          return [ this.createTag(name, dataSource[name], publicPath) ];
        }
      })
      .reduce((arr, curr) => {
        return arr.concat(curr);
      }, [])
      .join('\n\t');
  }

  apply = (compiler) => {
    compiler.plugin('compilation', function(compilation) {
      compilation.options.htmlElements = compilation.options.htmlElements || {};

      compilation.plugin('html-webpack-plugin-before-html-generation', function(htmlPluginData, callback) {
        const locations = this.locations;

        if (locations) {
          const publicPath = htmlPluginData.assets.publicPath;

          Object.getOwnPropertyNames(locations).forEach(function(loc) {
            compilation.options.htmlElements[loc] = this.getHtmlElementString(locations[loc], publicPath);
          });
        }

        callback(null, htmlPluginData);
      });
    });
  };
}
