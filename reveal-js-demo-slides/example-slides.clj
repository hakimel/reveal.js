(ns user
  (:use hiccup.core)
  (:import (java.io File)))

(let [;; Roots for media based on having this project as a Git submodule of `reveal.js`.
      IMAGE-ROOT-URL "reveal-js-demo-slides/images/"
      VIDEO-ROOT-URL "reveal-js-demo-slides/movies/"
      INCLUDE-ROOT "../_included/"      ; Relative to this .clj.

      image-h (fn [h f]
                [:img {:height h
                       :style "margin:10px; vertical-align:middle"
                       :src (str IMAGE-ROOT-URL f)}])

      image (partial image-h 480)

      video (fn  [f]
              [:video {:height 480
                       :controls 1
                       :data-autoplay 1}
               [:source {:src (str VIDEO-ROOT-URL f)}]])

      github (fn [stem text]
               [:a {:href (str "https://github.com/" stem)} text])]

  (-> (File. INCLUDE-ROOT)
      (.mkdir))

  (spit
   (str INCLUDE-ROOT "head.html")
   (html
    [:title "Title of Presentation"]
    [:meta {:name "description" :content "Title of Presentation"}]
    [:meta {:name "author" :content "A. N. Author"}]
    ;; Stylesheet path relative to the enclosing .shtml:
    [:link#theme {:rel "stylesheet"
                  :href "css/theme/beige.css"}]))

  (spit
   (str INCLUDE-ROOT "content.html")
   (html
    [:div.reveal
     [:div.slides
      [:section
       [:h1 "Slides via Clojure and Hiccup"]
       [:h2 "Nick Rothwell"]
       [:h3 "www.cassiel.com"]
       [:h3 "@cassieldotcom"]]

      [:section
       [:h2 "Nick Rothwell / Cassiel"]

       (image-h 400 "IMG_6760-1.jpg")

       [:aside.notes
        "Here are some presenter notes." [:br]
        "Here are some more."]]

      [:section
       [:h2 "Three Images from Another Project"]
       [:div
        (image-h 200 "mini-cla-statements.jpg")
        (image-h 200 "mini-cla-3d.jpg")
        (image-h 200 "mini-cla-history.jpg")]
       [:p "Generative editor for statements"]
       [:p "Visualisation of textual instructions"]
       [:p "Documentation and change history"]]

      [:section {:data-state "alert"}
       [:p "An important point!"]]

      [:section
       [:h2 "Get the code!"]
       [:p (github "cassiel/reveal.js"
                   "cassiel's reveal.js")]
       [:p (github "cassiel/reveal-js-demo-slides"
                   "These slides")]]

      [:section
       [:h4 "This demo deck by"]
       [:p "nick rothwell"]
       [:p "www.cassiel.com"]
       [:p "@cassieldotcom"]]]])))
