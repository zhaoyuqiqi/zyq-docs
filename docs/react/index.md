# React

很久没写 react 了，前几天想做个低代码的平台又重温了一下

## React-route

### 简介

- 在 react 中有几种路由例如：`react-router-dom`、`react-router-native`等，`dom`运行在浏览器中，`native`运行在客户端中。

- 在 v6 版本中路由的声明有了不同的方法，路由（Route）必须包含在路由器（Router）中，其中有`HashRouter`、`BrowserRouter`以及`MemoryRouter`等几种路由器。

```tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
```

### 嵌套路由

上述的示例展示的是非嵌套路由的使用方式，在使用嵌套路由时例如`/home/pic`上述的路由就无能为力了，此时我们需要在`<Route />`组件内部再添加一个`<Route />`组件，如下：

```tsx
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />}>
          <Route path="pic" element={<Pic />} />
        </Route>
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

function Home() {
  return (
    <>
      <span>hello </span>
      <Outlet />
      <span>world </span>
    </>
  );
}
function Pic() {
  return <span>你好</span>;
}
export default App;
```

其中，我们在路由组件内部又声明了一个路由`pic`， 该组件渲染了`<Pic />`组件，因此当我们的路由为`/home/pic`时，页面会展示：`hello你好world`，当路由为`/home`时，只会展示`helloworld`，我们还在父组件中使用了`<Outlet/>`组件，该组件是个占位符，它会将我们的子组件放在该位置，类似于`Vue`中的`<router-view />`组件

### 路由导航

在 `react-router-rom` 中我们使用`useNavigate`进行路由导航，t 通过`useLocation`获取路由上的信息

```tsx
import { useLocation, useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const loc = useLocation();
  console.log(loc);
  setTimout(() => navigate('/home'));
}
```
