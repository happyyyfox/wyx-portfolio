# 万羽旋个人求职网页

这是一个可以直接部署到 GitHub Pages 的静态个人网页，用于展示简历、实习经历、项目经历、获奖情况、专业技能与联系方式。

## 本地预览

直接在浏览器打开 `index.html` 即可预览。

## GitHub Pages 部署

1. 在 GitHub 新建一个仓库，例如 `personal-portfolio`。
2. 将本文件夹里的所有文件提交并推送到仓库。
3. 进入仓库的 `Settings` → `Pages`。
4. 在 `Build and deployment` 中选择 `Deploy from a branch`。
5. 分支选择 `main`，目录选择 `/root`，保存。
6. 等待 GitHub 生成访问地址，通常格式为 `https://你的用户名.github.io/personal-portfolio/`。

如果希望网页地址是 `https://你的用户名.github.io/`，仓库名需要命名为 `你的用户名.github.io`。

## 文件说明

- `index.html`：网页主体内容
- `styles.css`：页面样式
- `script.js`：中英切换、滚动显现、侧边节点导航交互
- `assets/resume.pdf`：可在线查看和下载的 PDF 简历
- `assets/profile-photo.jpg`：首页个人照片
