(defproject org.clojars.hippiccolo/qgame "0.2.4"
  :description "Quantum Gate And Measurement Emulator, or qgame. An instruction-level quantum computing simulator. Ported from Lee Spector's QGAME (written in Common Lisp)."
  :license {:name "MIT License"
            :url "http://http://en.wikipedia.org/wiki/MIT_License"}
  :url "https://github.com/omriBernstein/qgame"
  :dependencies [[org.clojure/clojure "1.5.1"]
                 [org.clojure/clojurescript "0.0-2156"]]
  :plugins [[lein-cljsbuild "1.0.2"]]
  :cljsbuild {:builds [{:source-paths ["src"]
                        :compiler {:output-to "static/qgame.js"
                                   :optimizations :whitespace
                                   :pretty-print true
                                   :foreign-libs [{:file "http://cdnjs.cloudflare.com/ajax/libs/mathjs/0.18.1/math.min.js"
                                                   :provides ["math.js"]}]}}]
              :repl-listen-port 9000}
  :min-lein-version "2.0.0")
