/**
 * @jest-environment node
 */

import * as path from 'path';
import * as fs from 'fs';
import * as hljsStyles from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import * as prismStyles from 'react-syntax-highlighter/dist/cjs/styles/prism';

describe.skip('this is not a test', () => {
  it('will get information on the class names from the builtin stylesheets', () => {
    class StyleKeyCount {
      map = new Map<string, number>();
      addStyleKey(styleKey: string) {
        if (this.map.has(styleKey)) {
          const count = this.map.get(styleKey)! + 1;
          this.map.set(styleKey, count);
        } else {
          this.map.set(styleKey, 1);
        }
      }
      getSortedEntries() {
        return Array.from(this.map).sort((a, b) => {
          return a[1] - b[1];
        });
      }
    }

    function writeKeys(hljs: boolean) {
      const styleKeyCount = new StyleKeyCount();
      const stylePath = path.join(
        __dirname,
        '..',
        'node_modules/react-syntax-highlighter/dist/cjs/styles',
        hljs ? 'hljs' : 'prism'
      );
      const files = fs.readdirSync(stylePath);
      files.forEach((f) => {
        if (f !== 'index.js') {
          const fullPath = path.join(stylePath, f);
          const style = require(fullPath);
          Object.getOwnPropertyNames(style.default).forEach((key) =>
            styleKeyCount.addStyleKey(key)
          );
        }
      });
      let output = '';
      styleKeyCount.getSortedEntries().forEach((entry) => {
        output += entry[0] + ' : ' + entry[1] + '\n';
      });
      console.log(output);
    }
    writeKeys(false);
  });
});
