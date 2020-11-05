#!/usr/bin/env node
const fetch = require("node-fetch");
const pkgDir = require("pkg-dir");
const path = require("path");
const hasOwn = require("has-own-prop");
const fs = require("fs");
const child_process = require("child_process");
const baseUrl = "https://registry.npmjs.com/";
async function getInfo(pkgName) {
  return await fetch(baseUrl + pkgName).then((res) => res.json());
}
(async () => {
  const packageDir = await pkgDir();
  const pkg = JSON.parse(
    fs.readFileSync(path.join(packageDir, "package.json")).toString()
  );
  if (!hasOwn(pkg, "dependencies") && !hasOwn(pkg, "devDependencies"))
    return console.log(`No dependency fields`);
  const cmd =
    fs.existsSync(path.join(packageDir, "yarn.lock")) == true
      ? "yarn add"
      : "npm install";
  // do deps
  Object.entries(pkg.dependencies).map(async (value) => {
    const info = await getInfo(value[0]);
    const versions = Object.entries(info.versions);
    const latestVersion = versions[versions.length - 1][1].version;
    if(value[1].includes('/')) return;
    if (pkg.dependencies[value[0]] != `^${latestVersion}`) {
      console.log(`Executing: ${cmd} ${value[0]}@${latestVersion}`);
      console.log(
        child_process.execSync(`${cmd} ${value[0]}@${latestVersion}`).toString()
      );
    }
  });
  if (hasOwn(pkg, "devDependencies")) {
    Object.entries(pkg.devDependencies).map(async (value) => {
      const info = await getInfo(value[0]);
      const versions = Object.entries(info.versions);
      const latestVersion = versions[versions.length - 1][1].version;
      if(value[1].includes('/')) return;
      if (pkg.devDependencies[value[0]] != `^${latestVersion}`) {
        console.log(`Executing: ${cmd} -D ${value[0]}@${latestVersion}`);
        console.log(
          child_process
            .execSync(`${cmd} -D ${value[0]}@${latestVersion}`)
            .toString()
        );
      }
    });
  }
})();
