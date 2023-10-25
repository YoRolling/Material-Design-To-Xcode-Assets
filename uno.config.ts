// uno.config.ts
import { defineConfig, presetUno } from 'unocss'
import { presetForms } from '@julr/unocss-preset-forms'

export default defineConfig({
  // ...UnoCSS options

  presets: [presetUno(), presetForms()]
})
