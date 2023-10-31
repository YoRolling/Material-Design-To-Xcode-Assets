# material-design-to-xcode-assets

`Material-Design-To-Xcode-Xcassets` 工具是一个用于将 `Material Design` 的设计规范中的`token`（颜色）转换为Xcode项目中的xcassets格式的工具。通过该工具，用户可以方便地将`Material Design` 的配色方案应用到Xcode应用的开发中。

<p>在线地址：👉 
<a href="https://md-to-xcassets.vercel.app/">Online Demo</a> 👈
</p>

## 特色

- [x] 支持 `Palette`  
- [x] 支持将特定的 `CSS Rule` (`colors.module.css`文件内) 转成 `SwiftUI` 的 `modifier`  
- [ ] 支持自定义颜色

## 使用

- 在 [Material Design Theme Builder](https://m3.material.io/theme-builder#/custom) 上自定义或者使用默认的配色方案
- 导出(下载)成 `Web(CSS)` 格式
- 将下载好的zip格式文件上传到上传区域
- 定制一些扩展功能
- 准备好了，点击开始处理
- 保存转换后zip文件,默认文件名为 `MaterialDesignXcodeAssets.zip`

## 原理

- 利用`jszip`读取原始zip文件并生成最终文件
- 正则解决了核心问题：提取`CSS Vars`、`CSS Rules`

## 贡献

如果你想为项目做贡献，欢迎提交 Issue 或者 Pull Request。

## 许可证

该项目采用 Apache-2.0 license 许可证 进行许可。

## 联系方式

如果你有任何问题或者建议，可以通过以下方式联系我们：

- 项目地址：[GitHub](https://github.com/YoRolling/Material-Design-To-Xcode-Assets)

## 感谢

在这里可以感谢一些为项目做出贡献或者提供帮助的人或者组织。

感谢以下开源项目节省了我的时间：

- [jszip](https://github.com/Stuk/jszip)
- [handlebars](https://github.com/handlebars-lang/handlebars.js)
- [floating-vue](https://github.com/Akryum/floating-vue)
- [unocss](https://github.com/unocss/unocss)

感谢所有为这个项目做出贡献的人！

如果用户在使用过程中遇到问题，可以在 GitHub 上提出 Issue。

如果用户发现了bug，并且知道如何修复，欢迎提交 Pull Request。
