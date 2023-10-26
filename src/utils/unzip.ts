import JSZIP, { type JSZipObject } from 'jszip'
import { type ColorGroup, type Group, type ModifierGroup } from '@/types/types.d'
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
      return (
        /tokens\.css/.test(v.name) || (moudleModifier ? /colors\.module\.css/.test(v.name) : false)
      )
    })
    .reduce(
      (p, v) => {
        const key = v.name.match(/css\/(.+)\.css/)![1]?.replace('.', '')
        return { ...p, [key]: v }
      },
      {} as { [key in 'tokens' | 'colorsmodule']: JSZipObject }
    )
  const result = {} as {
    ext?: ModifierGroup[]
    color: { palette?: ColorGroup; scheme: ColorGroup }
  }
  if (moudleModifier) {
    result.ext = await generatorModifier(content.colorsmodule)
  }
  result.color = await parseTokens(content.tokens, { palette })
  return result
}
async function parseTokens(tokens: JSZipObject, { palette }: { palette: boolean }) {
  const content = await tokens.async('string')
  const result = {} as { scheme: ColorGroup; palette?: ColorGroup }
  if (palette) {
    result['palette'] = await parseRawPalette(content)
  }
  result['scheme'] = await parseColorScheme(content)
  return result
}
export async function parseRawPalette(tokens: String) {
  const reg = /--(?<key>md-(?:ref-palette)-[^:#]+):\s+(?<color>#?(?:[0-9a-f]{6}|[0-9a-f]{3}));$/gm
  const result = tokens.matchAll(reg)
  const palettes = Array.from(result)
    .map((v) => v.groups as Group)
    .reduce((p, v: Group) => {
      const key = v['key'] + '.colorset'
      const theme = v['theme'] || 'light'
      const color = v['color']
      const prev = p[key] || {}
      const value = {
        ...prev,
        [theme]: {
          raw: color,
          r: color.slice(1, 3),
          g: color.slice(3, 5),
          b: color.slice(5, 7)
        }
      }
      return { ...p, [key]: value }
    }, {} as ColorGroup)
  return palettes
}

export async function parseColorScheme(tokens: String) {
  const reg =
    /--(?<key>md-sys-color-[^:#]+)-(?<theme>light|dark):\s+(?<color>#?(?:[0-9a-f]{6}|[0-9a-f]{3}));$/gm
  const result = tokens.matchAll(reg)
  const group = Array.from(result)
    .map((v) => v.groups as Group)
    .reduce((p: ColorGroup, v: Group) => {
      const key = v['key'] + '.colorset'
      const theme = v['theme']!
      const color = v['color']
      const prev = p[key] || {}
      const value = {
        ...prev,
        [theme]: {
          raw: color,
          r: color.slice(1, 3),
          g: color.slice(3, 5),
          b: color.slice(5, 7)
        }
      }
      return { ...p, [key]: value }
    }, {} as ColorGroup)

  return group
}
function kebabToCamelCase(str: string, capitalizeFirstLetter: boolean = false) {
  const q = str.replace(/-([a-z])/g, function (match, letter) {
    return letter.toUpperCase()
  })
  if (capitalizeFirstLetter) {
    return q[0].toUpperCase() + q.slice(1)
  }
  return q
}
async function generatorModifier(module: JSZipObject) {
  const content = await module.async('string')
  const reg = /^\.(?<modifier>[^{\s]+)\s+{\s+(?<style>[^\s:]+)\s*:\s*var\(--(?<color>[^)]+)\);\s}/gm
  const result = content.matchAll(reg)
  const group = Array.from(result)
    .map((v) => v.groups as ModifierGroup)
    .map((v) => {
      return {
        ...v,
        name: kebabToCamelCase(v.modifier, true),
        color: kebabToCamelCase(v.color)
      }
    })
  return group
}
