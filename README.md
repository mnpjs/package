# my-new-package

[![npm version](https://badge.fury.io/js/my-new-package.svg)](https://www.npmjs.com/package/my-new-package)

`my-new-package` is {{ description }}

```sh
yarn add my-new-package
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`async myNewPackage(config: Config): string`](#async-mynewpackageconfig-config-string)
  * [`Config`](#type-config)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/0.svg?sanitize=true">
</a></p>

## API

The package is available by importing its default function:

```js
import myNewPackage from 'my-new-package'
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/1.svg?sanitize=true">
</a></p>

## <code>async <ins>myNewPackage</ins>(</code><sub><br/>&nbsp;&nbsp;`config: Config,`<br/></sub><code>): <i>string</i></code>
Description of the method.

 - <kbd><strong>config*</strong></kbd> <em><code><a href="#type-config" title="Options for the program.">Config</a></code></em>: The config.

__<a name="type-config">`Config`</a>__: Options for the program.


|   Name    |       Type       |    Description    | Default |
| --------- | ---------------- | ----------------- | ------- |
| shouldRun | <em>boolean</em> | A boolean option. | `true`  |
| text      | <em>string</em>  | A text to return. | -       |

```js
import myNewPackage from 'my-new-package'

(async () => {
  const res = await myNewPackage({
    text: 'example',
  })
  console.log(res)
})()
```
```
my-new-package called with example
example
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/2.svg?sanitize=true">
</a></p>

## Copyright

(c) [{{ trademark }}][1] {{ year }}

[1]: {{ website }}

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/-1.svg?sanitize=true">
</a></p>