# deepercheck

Automatically update **dependencies** & **devDependencies** with one command.

# Simple

Just run this:

```
npx deepercheck
```

# Under-the-hood

Uses node-fetch to make a request to the **npm** registry

Gets the latest versiont tag from the registry

Does some ooga booga magic and updates dependencies with the correct command (supporting yarn & npm)

# FAQ

> Features are always being added