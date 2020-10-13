# source-practice

源码学习实践

1. 首先 fork 一份源码库方便自己本地切分支打注释 log，提交记录
2. 构建出带 source-map 的源码，方便调试打断点，观察调用栈等熟悉源码执行流程

   ```
   webpack --watch --config build/webpack.dev.config.js --devtool source-map

   rollup -w -c scripts/config.js --sourcemap
   ```

3. 通过 package.json scripts 找配置找入口，分析目录结构，找到入口构造函数等
