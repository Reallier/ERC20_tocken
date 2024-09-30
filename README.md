# ERC20_Token 示例项目

如果使用 pnpm

```shell
pnpm i
pnpm run test
```

如果使用 bun

```shell
bun i
bun run test
```

ERC20 是以太坊区块链上最常用的 Token 合约标准。

实现以下功能：

- 设置 Token 名称（name）："BaseERC20"
- 设置 Token 符号（symbol）："BERC20"
- 设置 Token 小数位 decimals：18
- 设置 Token 总量（totalSupply）:100,000,000
- 允许任何人查看任何地址的 Token 余额（balanceOf）
- 允许 Token 的所有者将他们的 Token 发送给任何人（transfer）；转帐超出余额时抛出异常(require),并显示错误消息 “ERC20: transfer amount exceeds balance”。
- 允许 Token 的所有者批准某个地址消费他们的一部分 Token（approve）
- 允许任何人查看一个地址可以从其它账户中转账的代币数量（allowance）
- 允许被授权的地址消费他们被授权的 Token 数量（transferFrom）；
- 转帐超出余额时抛出异常(require)，异常信息：“ERC20: transfer amount exceeds balance”
- 转帐超出授权数量时抛出异常(require)，异常消息：“ERC20: transfer amount exceeds allowance”。

遵循 ERC20 标准的同时，考虑到安全性，确保转账和授权功能在任何时候都能正常运行无误。
