import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { stripTypeScriptTypes } from "node:module"
import { test } from "node:test"
import { compileScript, parse } from "@vue/compiler-sfc"
import { createSSRApp } from "vue"
import { renderToString } from "vue/server-renderer"
import { libraries } from "../data/libraries"

const source = readFileSync(
  new URL("../components/LibraryLogo.vue", import.meta.url),
  "utf8"
)
const { descriptor } = parse(source)
const compiled = compileScript(descriptor, {
  id: "library-logo-test",
  inlineTemplate: true,
})
const moduleSource = stripTypeScriptTypes(compiled.content, {
  mode: "transform",
}).replace(/from ["']vue["']/g, `from "${import.meta.resolve("vue")}"`)
const { default: LibraryLogo } = await import(
  `data:text/javascript;base64,${Buffer.from(moduleSource).toString("base64")}`
)

test("SSR includes both logo variants before the browser resolves its saved or system theme", async () => {
  for (const library of libraries.filter(({ logoDark }) => logoDark)) {
    const html = await renderToString(createSSRApp(LibraryLogo, { library }))
    const images = html.match(/<img\b[^>]*>/g) || []

    assert.equal(images.length, 2, library.name)
    assert.ok(images[0].includes(`src="/img/${library.logo}"`), library.name)
    assert.ok(images[0].includes("dark:hidden"), library.name)
    assert.ok(images[1].includes(`src="/img/${library.logoDark}"`), library.name)
    assert.match(images[1], /class="hidden [^"]*dark:block"/, library.name)
    for (const image of images) {
      assert.ok(image.includes(`alt="${library.name} logo"`), library.name)
    }
  }
})

test("libraries with one logo keep it visible in both themes and preserve the caller's dimensions", async () => {
  const library = libraries.find(({ logoDark }) => !logoDark)!
  for (const size of ["h-12 w-12", "mt-2 h-10 w-10"]) {
    const html = await renderToString(createSSRApp(LibraryLogo, { library, class: size }))

    assert.equal((html.match(/<img\b/g) || []).length, 1)
    assert.ok(html.includes(`src="/img/${library.logo}"`))
    assert.ok(html.includes(`class="block ${size}"`))
    assert.doesNotMatch(html, /dark:hidden|dark:block/)
  }
})
