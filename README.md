# stateAutomatonJS

# gulp
## Problème d'installation des packages
J'ai rencontré un problème avec gulp-minify-css, voici comment j'ai résolu le problème.

```bash
  rm -rf node_modules
```

update node to the latest version
```bash
  sudo npm cache clean -f
```
```bash
  sudo npm install -g n
```
```bash
  sudo n stable
```
```bash
  sudo npm install
```
```bash
  sudo npm link gulp
```
