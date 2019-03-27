# changelog-generator
changelog生成器

> 依赖：`conventional-changelog`, `@commitlint/cli`, `commitlint-config-cz`, `cz-customizable`, `husky`

```sh
conventional-changelog --config ./changelog-generator/index.js -i CHANGELOG.md -s && git add CHANGELOG.md
```

### eg
```json
{
  "name": "xxx",
  "version": "0.1.0",
  "description": "...",
  "scripts": {
    "version": "conventional-changelog --config ./changelog-generator/index.js -i CHANGELOG.md -s && git add CHANGELOG.md",
    "postversion": "git push $(git config branch.$(git rev-parse --abbrev-ref HEAD).remote) $(git rev-parse --abbrev-ref HEAD):$(git rev-parse --abbrev-ref HEAD)"
  },
  "repository": {
    "type": "git",
    "url": ""
  },
  "devDependencies": {
    "@commitlint/cli": "^7.5.2",
    "commitlint-config-cz": "^0.11.1",
    "cz-customizable": "^5.5.3",
    "husky": "^1.3.1"
  },
  "license": "MIT",
  "engines": {
    "node": ">= 8.0.0",
    "npm": ">= 5.0.0"
  },
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -e $GIT_PARAMS"
    }
  },
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-customizable"
    },
    "cz-customizable": {
      "config": "./.cz-config.js"
    }
  }
}
```
