export type Group = {
  key: string
  theme?: 'dark' | 'light'
  color: string
}
export type ColorGroup = {
  [key: string]: {
    [key in 'dark' | 'light']: { raw: string; r: string; g: string; b: string }
  }
}
export type ModifierGroup = {
  modifier: string
  color: string
  style: 'color' | 'background-color'
}

export type ZipStruct = {
  dir: boolean
  payload?: unknown
  name: string
  code: boolean
  children?: ZipStruct[]
}
export type InputArgs = {
  ext?: ModifierGroup[]
  color: {
    palette?: ColorGroup
    scheme: ColorGroup
  }
}
