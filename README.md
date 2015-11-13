# stateAutomatonJS

# gulp
## Problème d'installation des packages
J'ai rencontré un problème avec gulp-minify-css, voici comment j'ai résolu le problème.

1 - rm -rf node_modules

2 - update node to the latest version

  2.1 - sudo npm cache clean -f
  2.2 - sudo npm install -g n
  2.3 - sudo n stable

3 - sudo npm link gulp
