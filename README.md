## 快速开始

`HUI CONSOLE`本身作为一个独立的模块，提供了前端的后管框架以及后台对用户、角色、菜单菜单权限的数据以及接口功能。开发者只需要专注于使用自己的技术栈开发自己的业务系统后管接口和页面。

### 启动系统

为了系统的安全，需要在配置文件中指定新的JWT密钥以及cookie加密密钥。

`huiconsole.config.json`

```json
{
    "server": {
        "keys": "huiconsole-cookie-key",
        "jwtSecret": {
            "user": "huiconsole-jwtsecret",
            "passwordChanging": "huiconsole-jwtsecret2"
        }
    }, 
    "ui": {
        "title": "HUI CONSOLE",
        "description": "后台管理系统"
    }
}
```

```bash
# 启动系统命令，请先安装docker
docker compose up

# 低版本docker 应该需要再安装docker-compose
# docker-compose up
```

启动完成后 `http://localhost:8080` 将会打开系统的登录页面，初次登陆会需要设置admin账号的密码。

### 对接系统

#### 前端页面

- 菜单项的链接填写自己单独开发的后管页面地址。
- 页面中可以使用[huiconsole-web-sdk](https://github.com/longjiahui/huiconsole-web-sdk)来与框架进行通信，包含获取当前登陆用户的TOKEN、操作TAB栏，获取菜单信息等功能。

```js
import { HUIConsole } from '@anfo/huiconsole-web-sdk'

let huiconsole = new HUIConsole
huiconsole.getToken().then(token=>localStorage.setItem('token', token))

export default huiconsole
```

#### 业务系统后管接口权限管理

`HUI CONSOLE`服务器提供了接口`/api/user/decode`对前端获取到的`HUI CONSOLE`TOKEN进行验证，同时返回用户的信息以及角色权限信息，这个时候根据创建的角色Key值可以对当前请求用户进行接口权限的管理。

## 自定义主题/样式

`HUI CONSOLE`将前端功能抽象为`/ui/src/views/HuiConsole.vue`组件。

可以参考`/ui/src/views/Layout`文件使用`HuiConsole.vue`的方法自定义主题/样式。