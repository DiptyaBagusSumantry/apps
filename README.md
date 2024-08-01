# Toba.AI Frontend

## Project Setup
### Install dependencies
```shell
npm install --dev --legacy-peer-deps
```
Argument `--force`, or `--legacy-peer-deps` is used to fix the upstream dependency conflict, or retry to accept an incorrect (and potentially broken) dependency resolution.

### Create .env.local file
You can just copy from [.env.local.example](./.env.local.example)

### Compiles and hot-reloads for development
For deployment, Mock library can't be used, you can find in [main.js](./src/main.js) file
```js
// mock
// import './fake-db/index.js'
```
then compile using 'npm'
```shell
npm run serve
```

If you want compile with production mode use this command
```shell
npm run serve:prod
```

### Run your tests before commit
```shell
npm run test
```

### Lints and fixes files before commit
```shell
npm run lint
```

### Run webpack-bundle-analyzer
You can set the configuration for webpack-bundle-analyzer in the [vue.config.js](./vue.config.js) file, for more configuration see https://github.com/webpack-contrib/webpack-bundle-analyzer

  #### Development
  When you run the project with development mode, you should set `openAnalyzer: true` at webpackBundleAnalyzer plugin option in [vue.config.js](./vue.config.js) file first, then the webpack-bundle-analyzer will automatically run with the ```localhost``` address and port ```8888```.

  #### Production
  To see how big the resulting bundle is after building production mode, you should run the project with [production mode (locally)](#if-you-want-compile-with-production-mode-use-this-command). Then you can see the result by open `report.html` file in [dist](./dist) directory.

## Coding Style
Secara umum styling yang berkaitan dengan prinsip ES6 akan dioptimalkan oleh *pre-commit* yang diinisiasi oleh backend. Kemudian lebih lanjut terkait prinsip *clean code* adalah penggunaan nama untuk setiap variabel, fungsi, class dan lain-lain mengikuti pola template (Vuexy) yang digunakan dan tentunya akan memudahkan pengembang lainnya ketika memperlajari kode anda. Secara umum aturannya dijabarkan dalam poin-poin berikut:
  - keseluruhan nama menggunakan bahasa inggris
  - untuk nama fungsi dan variabel menggunakan *camel-case* (perbedaan dengan jenis lainnya dapat dipelajari melalui artikel [berikut](https://betterprogramming.pub/string-case-styles-camel-pascal-snake-and-kebab-case-981407998841))
  - untuk class dan komponen menggunakan *pascal-case*
  - untuk modul (biasanya dalam format .js) menggunakan *camel-case*
  - untuk nama fungsi yang melakukan pengembalian nilai, diawali dengan kata kerja
  - penamaan *parent-child* dalam class maupun modul (termasuk komponen) harus berkesusaian, biasanya di-*root* yang sama, nama *child* lebih panjang dari *parent*
  - penamaan antar komponen, modul, dan file/class style (scss) harus sesuai dan unik


## [Tracking](https://github.com/Widya-Analytic/widyaanalytic-store/tree/develop/frontend#tracking)
