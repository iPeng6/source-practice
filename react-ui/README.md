# 要点总结

参考 antd v4.x， 这版antd对 Form 做了重构，使用了 function 组件 和 hooks，不再需要原来大量的装饰函数包裹

1. Form FormItem 总得设计思想还是观察者模式，Form 有个全局的 store 模型，用来管理所有数据，然后通过context 多层级传递
2. FormItem 作为观察者 初始化时 就将自己注册到 form实例之中，更新store数据时会通知刷新
3. FormItem 给内部一个受控包装，接管value的传递 和 事件的触发
4. 校验还是用的 async-validator
