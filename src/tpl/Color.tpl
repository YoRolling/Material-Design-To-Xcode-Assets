{
  {{#xif light '||' dark }}
  "colors" : [
  {{#if light}}
    {
      "color" : {
        "color-space" : "srgb",
        "components" : {
          "alpha" : "1.000",
          "blue" : "0x{{light.b}}",
          "green" : "0x{{light.g}}",
          "red" : "0x{{light.r}}"
        }
      },
      "idiom" : "universal"
    }
    {{/if}} {{#if dark}},
    {
      "appearances" : [
        {
          "appearance" : "luminosity",
          "value" : "dark"
        }
      ],
      "color" : {
        "color-space" : "srgb",
        "components" : {
          "alpha" : "1.000",
          "blue" : "0x{{dark.b}}",
          "green" : "0x{{dark.g}}",
          "red" : "0x{{dark.r}}"
        }
      },
      "idiom" : "universal"
    }
    {{/if}}
  ],
  {{/xif}}
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}
  