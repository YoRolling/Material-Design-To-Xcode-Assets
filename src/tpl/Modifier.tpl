import SwiftUI
{{#each list}}
struct Md{{name}}: ViewModifier {
  func body(content: Content) -> some View {
    content
      {{#xif style '==' "color"}}
      .foregroundStyle(Color.{{color}})
      {{else}}
      .background(Color.{{color}})
      {{/xif}}
  }
}

extension View {
  func md{{name}}() -> some View {
    ModifiedContent(content: self, modifier: Md{{name}}())
  }
}

{{/each}}