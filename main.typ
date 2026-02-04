#import "@preview/touying:0.5.5": *
#import "template.typ": *
#let modelsnot = $cancel(models, length: #90%)$

#let colors = (
  primary: rgb("#021A99"),
  secondary: rgb("#5C7DFF"),
  accent: rgb("#FFE465"),
  dark: rgb("#1a1a2e"),
  light: rgb("#f8f9fa"),
  gray: rgb("#6c757d"),
  success: rgb("#28a745"),
  warning: rgb("#ffc107"),
  error: rgb("#dc3545"),
  info: rgb("#17a2b8"),
  purple: rgb("#6f42c1"),
  pink: rgb("#e83e8c"),
  orange: rgb("#fd7e14"),
  cyan: rgb("#20c997"),
  code-bg: rgb("#F2F2F2"),
)

#show: bamboo-theme.with(
  footer: self => utils.display-current-heading(level: 1),
  config-info(
    title: [Predicate Invention],
    subtitle: [in inductive logic programming],
    author: [Lucas Carr],
    date: none,
    institution: ([University of Cape Town], [University of Helsinki]),
  ),
)

#title-slide()

== Inductive Logic Programming
- A kind of supervised machine learning that uses logic (_-programming_)
- We are used to seeing something like
#v(7em)

#align(center)[
  #diagram(
    node-defocus: 0,
    spacing: (2cm, 1cm),
    edge-stroke: 1.5pt,
    node-outset: 5pt,

    node((0, 0), rect(fill: colors.code-bg, inset: 20pt, radius: 5pt)[#text(weight: "bold")[Training Data]]),
    edge((0, 0), "->", (1, 0)),
    node((1, 0), rect(fill: colors.primary, inset: 20pt, radius: 5pt)[#text(fill: white)[Algorithm]]),
    edge((1, 0), "->", (2, 0)),
    node((2, 0), rect(fill: colors.code-bg, inset: 20pt, radius: 5pt)[#text(weight: "bold")[Model]]),
  )
]

#slide[
  - A kind of supervised machine learning that uses logic (_-programming_)
  - We are used to seeing something like
    // #v(3em)

    #only(1)[#align(center)[
      #diagram(
        node-defocus: 0,
        spacing: (2cm, 1cm),
        edge-stroke: 1.5pt,
        node-outset: 5pt,

        node((0, -1), rect(fill: colors.code-bg, inset: 20pt, radius: 5pt)[#text(weight: "bold")[Examples]]),
        edge((0, -1), "->", (1, 0)),
        node((0, 1), rect(fill: colors.code-bg, inset: 20pt, radius: 5pt)[#text(weight: "bold")[Background]]),
        edge((0, 1), "->", (1, 0)),

        node((1, 0), rect(fill: colors.primary, inset: 20pt, radius: 5pt)[#text(fill: white)[ILP Algorithm]]),
        edge((1, 0), "->", (2, 0)),
        node((2, 0), rect(fill: colors.code-bg, inset: 20pt, radius: 5pt)[#text(weight: "bold")[Hypothesis]]),
      )
    ]]

    #only("2-")[#align(center)[
      #diagram(
        node-defocus: 0,
        spacing: (2cm, 1cm),
        edge-stroke: 1.5pt,
        node-outset: 5pt,

        node((0, -1), rect(fill: colors.code-bg, inset: 20pt, radius: 5pt)[#strike[Examples] ]),

        node((0, -0.75), [#text(fill: red)[Logic Program]]),
        edge((0, -1), "->", (1, 0)),
        node((0, 1), rect(fill: colors.code-bg, inset: 20pt, radius: 5pt)[#strike[Background]]),
        node((0, 1.5), [#text(fill: red)[Logic Program]]),
        edge((0, 1), "->", (1, 0)),

        node((1, 0), rect(fill: colors.primary, inset: 20pt, radius: 5pt)[#text(fill: white)[ILP Algorithm]]),
        edge((1, 0), "->", (2, 0)),
        node((2, 0), rect(fill: colors.code-bg, inset: 20pt, radius: 5pt)[#strike[Hypothesis] ]),

        node((2, 0.5), [#text(fill: red)[Logic Program]]),
      )
    ]]

  #only(3)[

    === Benefits of ILP
    - It is very sample efficient
    - Considers relational aspects of the data by nature
    - Interpretable (if you can read a logic program)
    - Quite naturally supports continual learning
  ]
]

== Example
- #text(weight: "bold")[Eleusis] is a card game where one person (me) writes down a rule, which describes a sequence of cards. #pause

#grid(
  columns: 2,
  gutter: 30pt,
  rect(
    fill: none,
    radius: 10pt,
  )[

    #align(center)[ === $S_1$ legal sequence
    #grid(
      columns: 2,
      gutter: -30pt,
      rect(
        fill: colors.code-bg,
        inset: 3pt,
        radius: 4pt,
      )[
        #image("assets/CLUB-1.svg", width: 50%)
      ], rect(
        fill: colors.code-bg,
        inset: 3pt,
        radius: 4pt,
      )[

        #image("assets/CLUB-1.svg", width: 50%)
      ],
    )]
  ], rect(
    fill: none,
    radius: 10pt,
  )[

    #align(center)[ === $S_2$ illegal sequence
    #grid(
      columns: 2,
      gutter: -30pt,
      rect(
        fill: colors.code-bg,
        inset: 3pt,
        radius: 4pt,
      )[
        #image("assets/CLUB-1.svg", width: 50%)
      ], rect(
        fill: colors.code-bg,
        inset: 3pt,
        radius: 4pt,
      )[

        #image("assets/DIAMOND-1.svg", width: 50%)
      ],
    )]
  ],
)
#pause
- Guess a rule (hypothesis) that correctly describes each example you are given.
#pause
#align(center)[ _A sequence is legal if it has two black cards_
#pause

_A sequence is legal if it has two clubs_

_A sequence is legal if it has two black aces_

#text(fill: red, style: "italic")[A sequence is legal if it has two aces.]]

== Encoding Eleusis as a logic program

*Background knowledge* $cal(B)cal(K)$
#align(center)[
  #rect(
    fill: colors.code-bg,
    inset: 15pt,
    radius: 10pt,
  )[
    #align(left)[
      #raw("seq(X):–card(X,Y). 
red(X):–suit(X,diamonds). red(X):–suit(X,hearts).
black(X):–suit(X,clubs). black(X):–suit(X,spades).
")
      $dots.v$
    ]
  ]
]

#pause
*Examples*
#align(center)[
  #grid(
    columns: 2,
    gutter: 0pt,
    align(left)[
      #rect(fill: colors.code-bg, inset: 15pt, radius: 10pt)[ === positive
      #text(size: 20pt)[#raw("seq(s1). card(s1,c11). suit(c11,clubs). card(s1,c12). suit(c12,clubs). rank(c11,ace). rank(c12,ace).")]]
    ], align(left)[
      #rect(fill: colors.code-bg, inset: 15pt, radius: 10pt)[ === negative
      #text(size: 20pt)[#raw("seq(s2). card(s2,c21). suit(c21,clubs). card(s2,c22). suit(c22,diamonds). rank(c21,ace). rank(c22,ace).")]]
    ],
  )
]

#pause
- Predicates occuring in *examples* and *background* construct the hypothesis space, $cal(H)$
- We search for a solutions $h in cal(H)$ such that $h union cal(B)cal(K) models e$ for all positive examples, and $h union cal(B)cal(K) modelsnot e$ for all negative examples

== The Hypothesis Space

Hypotheses can be ordered by *generality\**:

#align(center)[
  #diagram(
    node-defocus: 0,
    spacing: (1.2cm, 1.4cm),
    edge-stroke: 1pt,
    node-outset: 3pt,

    // Level 0 - most general
    node((0, 0), text(size: 12pt)[`seq(S):-card(S,X).`]),

    // Level 1 - specializations
    node((-1.5, 1), text(size: 12pt)[`seq(S):-card(S,X),`\
    `black(X).`]),
    node((0, 1), text(size: 12pt)[`seq(S):-card(S,X),`\
    `red(X).`]),
    node((1.5, 1), text(size: 12pt)[`seq(S):-card(S,X),`\
    `rank(X,ace).`]),

    edge((0, 0), "-", (-1.5, 1)),
    edge((0, 0), "-", (0, 1)),
    edge((0, 0), "-", (1.5, 1)),

    // Dots between level 1 nodes
    node((-0.75, 1), text(size: 12pt)[`...`]),
    node((0.75, 1), text(size: 12pt)[`...`]),

    // Level 2 - further specializations (under black)
    node((-2, 2.5), text(size: 11pt)[`seq(S):-card(S,X),`\
    `black(X),suit(X,club).`]),
    node((-1, 2.5), text(size: 11pt)[`seq(S):-card(S,X),`\
    `black(X),suit(X,spade).`]),
    node((1, 2.5), text(size: 12pt)[`seq(S):-card(S,X),`\
    `red(X),rank(X,ace).`]),

    edge((-1.5, 1), "-", (-2, 2.5), stroke: (dash: "dashed")),
    edge((-1.5, 1), "-", (-1, 2.5), stroke: (dash: "dashed")),
    edge((0, 1), "-", (1, 2.5), stroke: (dash: "dashed")),
    edge((1.5, 1), "-", (1, 2.5), stroke: (dash: "dashed")),
    edge((1.5, 1), "-", (-1.4, 4), stroke: (dash: "dashed")),

    // Level 3 - combining constraints
    node((-1.5, 4), text(size: 10pt)[`seq(S):-card(S,X),black(X),`\
    `suit(X,club),rank(X,ace).`]),
    node((0.5, 4), text(size: 10pt)[`...`]),

    edge((-2, 2.5), "-", (-1.5, 4), stroke: (dash: "dashed")),
    edge((-1, 2.5), "-", (-1.5, 4), stroke: (dash: "dashed")),
    edge((1, 2.5), "-", (0.5, 4), stroke: (dash: "dashed")),

    // Vertical dots indicating more levels
    node((0, 5), text(size: 16pt)[$dots.v$]),
    node((-1.5, 5), text(size: 14pt, weight: "bold")[h := `seq(S):-card(S,X),suit(X,club),`\
    `rank(X,ace),card(S,X1),`\
    `suit(X1,club),rank(X1,ace),X!=X1.`]),
    edge((-1.5, 4), "-", (-1.5, 5), stroke: (dash: "dashed")),
    edge((-1.5, 4), "-", (0, 5), stroke: (dash: "dashed")),
    edge((0.5, 4), "-", (0, 5), stroke: (dash: "dashed")),
  )

  *h *$union cal(B)cal(K) models S_1$

  *h *$union cal(B)cal(K) modelsnot S_2$
]

// TODO: so, we have the hypothesis space that we need to search. But what if we want to consider infinite sequences, or just extremely long sequences, or we want better generalisation? Can we find one hypothesis from this space which suits our needs?
// No - which is why we need predicate invention.
//

== Good solution?

- Our hypothesis is:
#align(center)[#text(size: 18pt)[`seq(S):-card(S,X),suit(X,club),rank(X,ace),card(S,X1),suit(X1,club),rank(X1,ace), X!=X1.`] ] #pause
- What if we are then given the information:
#grid(
  columns: 2,
  gutter: 30pt,
  rect(
    fill: none,
    radius: 10pt,
  )[

    #align(center)[ === $S_3$ legal sequence
    #grid(
      columns: 3,
      gutter: -70pt,
      rect(
        fill: colors.code-bg,
        inset: 3pt,
        radius: 4pt,
      )[
        #image("assets/CLUB-1.svg", width: 50%)
      ], rect(
        fill: colors.code-bg,
        inset: 3pt,
        radius: 4pt,
      )[

        #image("assets/CLUB-1.svg", width: 50%)
      ], rect(
        fill: colors.code-bg,
        inset: 3pt,
        radius: 4pt,
      )[
        #image("assets/CLUB-1.svg", width: 50%)
      ],
    )]
  ], rect(
    fill: none,
    radius: 10pt,
  )[

    #align(center)[ === $S_4$ illegal sequence
    #grid(
      columns: 3,
      gutter: -70pt,
      rect(
        fill: colors.code-bg,
        inset: 3pt,
        radius: 4pt,
      )[
        #image("assets/CLUB-1.svg", width: 50%)
      ], rect(
        fill: colors.code-bg,
        inset: 3pt,
        radius: 4pt,
      )[
        #image("assets/CLUB-1.svg", width: 50%)
      ], rect(
        fill: colors.code-bg,
        inset: 3pt,
        radius: 4pt,
      )[

        #image("assets/DIAMOND-1.svg", width: 50%)
      ],
    )]
  ],
)
- but *b* $union cal(B)cal(K) models S_4$ #pause
- We can add another rule to handle this case, but not feasible to generalise to sequences of arbitrary $n$. Certainly not infinite domains. #pause
- We also can see the correct hypothesis is
#align(center)[_Every card is an ace of clubs_.]

== Every card is an ace of clubs
#align(center)[_Every card is an ace of clubs_.]

- How to express this? #pause
- `seq(S):-card(S,X),rank(X,ace),suit(X,clubs).`
- - Doesn't work. `X` is _existentially quantified_ #pause
- This concept is not contained in the hypothesis space.
- Invent it!

#align(center)[
  #block(align(left)[
    `seq(S) :- card(S,X), not invented(S,X).`\
    `invented(S,X) :- card(S,X), not suit(X,clubs).`\
    `invented(S,X) :- card(S,X), not rank(X,ace).`
  ])
]

- `invented/2.` is entirely new, invented predicate.

== Grandparent

$cal(B)cal(K) =$

#align(center)[
  #block(align(left)[
    `mother(mary,tom). mother(susan,mary). mother(lisa,john).`\
    `father(david,tom). father(tom,emma). father(john,kate).`
  ])
]

#pause

$cal(E)^+ =$ `grandparent(ann,charlie). grandparent(dan,charlie). ...`

#pause

*Without predicate invention:*
#align(center)[
  #block(align(left)[
    `grandparent(X,Y) :- mother(X,Z), mother(Z,Y).`\
    `grandparent(X,Y) :- mother(X,Z), father(Z,Y).`\
    `grandparent(X,Y) :- father(X,Z), mother(Z,Y).`\
    `grandparent(X,Y) :- father(X,Z), father(Z,Y).`
  ])
]

#pause

*Invent parent/2.*
#align(center)[
  #block(align(left)[
    `grandparent(X,Y) :- parent(X,Z), parent(Z,Y).`\
    `parent(X,Y) :- mother(X,Y).`\
    `parent(X,Y) :- father(X,Y).`
  ])
]

- Shorter program, easier to learn, stronger generalisation\*

== My PhD is about answering the following questions:
#v(5em)
#align(center)[
  #block(align(left)[ - When do we need to do predicate invention?
  - When is it useful to do predicate invention?
  - In either event, _how_ do we do predicate invention?])
]

== References

// Force cite all references without showing inline
#hide[#cite(<cropper_learning_2021>) #cite(<cerna_generalisation_2024>) #cite(<cropper_inductive_2022>)]

#bibliography("refs.bib", style: "ieee", title: none)
