import tpl from '@/tpl/Color.tpl?raw'
import modifierTpl from '@/tpl/Modifier.tpl?raw'
import handlebars from 'handlebars'
import JSZip from 'jszip'

import type { ColorGroup, InputArgs, ZipStruct } from '@/types/types'
const colorContentJson = handlebars.compile(tpl)
const modifierTplCache = handlebars.compile(modifierTpl)

export async function gen(input: InputArgs) {
  const zip = new JSZip()
  const tree = buildTree(input)
  tree.forEach((v) => {
    mkdir(v, zip)
  })
  zip.generateAsync({ type: 'blob' }).then(
    function (blob) {
      // 1) generate the zip file
      downloadBlob(blob) // 2) trigger the download
    },
    function (err) {}
  )
}

function mkdir(struct: ZipStruct, parent: JSZip) {
  const { dir, children, name } = struct
  if (dir) {
    const dirRoot = parent.folder(name)
    children?.forEach((z) => {
      touch(z, dirRoot!)
    })
  }
}

function touch(struct: ZipStruct, parent: JSZip) {
  const { code, payload, name, dir } = struct
  if (dir) {
    mkdir(struct, parent)
  } else {
    parent.file(name, code ? modifierTplCache(payload || {}) : colorContentJson(payload || {}))
  }
}

export function buildTree({ ext, color }: InputArgs) {
  const children = Object.entries(color).map(([key, group]) => {
    return {
      dir: true,
      name: key,
      code: false,
      children: mkdirStruct(group)
    } as ZipStruct
  })
  const result: ZipStruct[] = []
  const xcassetsRoot = {
    dir: true,
    code: false,
    name: 'MaterialDesign.xcassets',
    children: [
      {
        name: 'Contens.json',
        code: false,
        dir: false
      },
      ...children
    ]
  } as ZipStruct
  result.push(xcassetsRoot)
  if (ext) {
    const swiftCode = {
      dir: true,
      code: false,
      name: 'MdModifierExt',
      children: [
        {
          name: 'MdModifier.swift',
          dir: false,
          code: true,
          payload: { list: ext }
        }
      ]
    } as ZipStruct
    result.push(swiftCode)
  }

  return result
}

function mkdirStruct(args: ColorGroup) {
  return Object.entries(args).map(([folder, payload]) => {
    return {
      name: folder,
      dir: true,
      code: false,
      children: [
        {
          name: 'Contents.json',
          payload: payload,
          dir: false,
          code: false
        }
      ]
    } as ZipStruct
  })
}

function downloadBlob(blob: Blob, name = 'MaterialDesignXcodeAssets.zip') {
  // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
  const blobUrl = URL.createObjectURL(blob)

  // Create a link element
  const link = document.createElement('a')

  // Set link's href to point to the Blob URL
  link.href = blobUrl
  link.download = name

  // Append link to the body
  document.body.appendChild(link)

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    })
  )

  // Remove link from body
  document.body.removeChild(link)
}

/**
 *
 * ext
 *  - Modifier.swift
 * MaterialDesign.xcassets
 *  - Contents.json
 *  - palette
 *      - Contents.json
 *      - md-ref-palette.colorset
 *          - Contents.json
 *  - theme
 *      - Contents.json
 *      - md-sys-color-primary.colorset
 *          -Contents.json
 *
 *
 *
 */
