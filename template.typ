#import "@preview/touying:0.5.5": *
#import "@preview/zebraw:0.6.1": *
#import "@preview/fletcher:0.5.8" as fletcher: diagram, node, edge
#show: zebraw

#let slide(title: auto, ..args) = touying-slide-wrapper(self => {
  if title != auto {
    self.store.title = title
  }
  // set page
  let header(self) = {
    set align(top)
    show: components.cell.with(fill: self.colors.primary, inset: 1em)
    set align(horizon)
    set text(fill: self.colors.neutral-lightest, size: 1em)
    // utils.display-current-heading(level: 1)
    set text(size: 1.5em)
    if self.store.title != none {
      utils.call-or-display(self, self.store.title)
    } else {
      utils.display-current-heading(level: 2)
    }
  }
  let footer(self) = {
    set align(bottom)
    show: pad.with(.4em)
    set text(fill: self.colors.neutral-darkest, size: .8em)
    utils.call-or-display(self, self.store.footer)
    h(1fr)
    context utils.slide-counter.display() + " / " + utils.last-slide-number
  }
  self = utils.merge-dicts(
    self,
    config-page(
      header: header,
      footer: footer,
    ),
  )
  touying-slide(self: self, ..args)
})

#let title-slide(..args) = touying-slide-wrapper(self => {
  let info = self.info + args.named()
  let body = {
    set align(center + horizon)
    text(size: 2.2em, fill: self.colors.primary, weight: "bold", info.title)
    v(-1.5em)
    text(size: 1.2em, fill: self.colors.primary, weight: "medium", info.subtitle)
    v(1em)
    if info.author != none {
      text(size: 1em, fill: self.colors.primary, weight: "medium", info.author)
    }
    v(-0.25em)
    if info.institution != none {
      block({
        set par(leading: 0.5em)
        if type(info.institution) == array {
          for inst in info.institution {
            text(size: 1em, fill: self.colors.primary, weight: "medium", inst)
            linebreak()
          }
        } else {
          text(size: 1em, fill: self.colors.primary, weight: "medium", info.institution)
        }
      })
    }
    if info.date != none {
      block(utils.display-info-date(self))
    }
  }
  touying-slide(self: self, body)
})

#let new-section-slide(self: none, body) = touying-slide-wrapper(self => {
  let main-body = {
    set align(center)
    set text(size: 2em, fill: self.colors.primary, weight: "bold", style: "italic")
    utils.display-current-heading(level: 1)
  }
  touying-slide(self: self, main-body)
})

#let focus-slide(body) = touying-slide-wrapper(self => {
  self = utils.merge-dicts(
    self,
    config-page(
      fill: self.colors.primary,
      margin: 2em,
    ),
  )
  set text(fill: self.colors.neutral-lightest, size: 2em)
  touying-slide(self: self, align(horizon + center, body))
})

#let toc-slide(
  title: "Contents",
  ..args,
) = touying-slide-wrapper(self => {
  self.store.title = title
  let header(self) = {
    set align(top)
    show: components.cell.with(fill: self.colors.primary, inset: 1em)
    set align(horizon)
    set text(fill: self.colors.neutral-lightest, size: 1.5em)
    utils.call-or-display(self, self.store.title)
  }

  let footer(self) = {
    set align(bottom)
    show: pad.with(.4em)
    set text(fill: self.colors.neutral-darkest, size: .8em)
    utils.call-or-display(self, self.store.footer)
    h(1fr)
    context utils.slide-counter.display() + " / " + utils.last-slide-number
  }

  self = utils.merge-dicts(
    self,
    config-page(
      header: header,
      footer: footer,
    ),
  )

  let body = {
    set text(size: 1em)
    components.adaptive-columns(outline(title: none, indent: 1em, depth: 2))
  }

  touying-slide(self: self, body, ..args)
})

#let bamboo-theme(
  aspect-ratio: "4-3",
  footer: none,
  ..args,
  body,
) = {
  set text(size: 20pt, font: "SF Pro Text")
  show raw: set text(font: "TX-02-XlabMono")

  show: touying-slides.with(
    config-page(
      paper: "presentation-" + aspect-ratio,
      margin: (top: 4em, bottom: 1.5em, x: 2em),
    ),
    config-common(
      slide-fn: slide,
      new-section-slide-fn: new-section-slide,
    ),
    config-methods(alert: utils.alert-with-primary-color),
    config-colors(
      primary: rgb("#021A99"),
      neutral-lightest: rgb("#ffffff"),
      neutral-darkest: rgb("#000000"),
    ),
    config-store(
      title: none,
      footer: footer,
    ),
    ..args,
  )

  body
}
