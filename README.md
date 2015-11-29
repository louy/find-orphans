# find-orphans
Locates orphan js files in the current project

## Usage

First, install it:
```
npm i --save-dev find-orphans
```

Then, add it to **package.json**:
```json
{
  "scripts": {
    "find-orphans": "./node_modules/.bin/find-orphans"
  }
}
```

You can customize it easily. Try `./node_modules/.bin/find-orphans --help` to
get a list of available options.
