# Simple TCP Terminal

一个简单的远程终端程序，通过网络操作终端。

![simple_tcp_terminal](./simple_tcp_terminal.png)


## 使用

### 服务端

```bash
$ node ./simple_tcp_terminal.js
```

### 客户端

```
$ stty raw -echo
$ nc <server_address> 4444
```
