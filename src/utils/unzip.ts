import JSZIP, { type JSZipObject } from 'jszip'

export async function parseZip(
  file: File,
  { moudleModifier, palette }: { palette: boolean; moudleModifier: boolean } = {
    palette: false,
    moudleModifier: false
  }
) {
  const zip = await JSZIP.loadAsync(file)
  const content = zip
    .filter((path) => path.indexOf('__MACOSX/') === -1)
    .filter((v) => !v.dir)
    .filter((v) => {
      console.log({ v })
      return (
        /tokens\.css/.test(v.name) || (moudleModifier ? /colors\.module\.css/.test(v.name) : false)
      )
    })
    .reduce(
      (p, v) => {
        const key = v.name.match(/css\/(.+)\.css/)![1]
        console.log(v)
        return { ...p, [key]: v }
      },
      {} as { [key in 'tokens' | 'colors']: JSZipObject }
    )
  parseTokens(content.tokens, { palette })
}
async function parseTokens(tokens: JSZipObject, { palette }: { palette: boolean }) {
  const content = await tokens.async('string')
  if (palette) {
    parseRawPalette(content)
  }
  parseColorScheme(content)
}
export async function parseRawPalette(tokens: String) {
  // const reg =
  //   /--md(?:-(?:ref-palette)-)(?<key>[^:#]+):\s+(?<color>#?(?:[0-9a-f]{6}|[0-9a-f]{3}));$/gm
  const reg = /--(?<key>md-(?:ref-palette)-[^:#]+):\s+(?<color>#?(?:[0-9a-f]{6}|[0-9a-f]{3}));$/gm
  const result = tokens.matchAll(reg)
  const palettes = Array.from(result).map((v) => v.groups)
}

export async function parseColorScheme(tokens: String) {
  // const reg =
  //   /--md(?:-(?:sys-color)-)(?<key>[^:#]+)-(?<theme>light|dark):\s+(?<color>#?(?:[0-9a-f]{6}|[0-9a-f]{3}));$/gm
  const reg =
    /--(?<key>md-sys-color-[^:#]+)-(?<theme>light|dark):\s+(?<color>#?(?:[0-9a-f]{6}|[0-9a-f]{3}));$/gm
  const result = tokens.matchAll(reg)
  Array.from(result)
    .map((v) => v.groups)
    .forEach((v) => {
      console.log('colorScheme', v)
    })
}
