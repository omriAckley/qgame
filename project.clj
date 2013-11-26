(defproject qgame "0.1.0-SNAPSHOT"
  :description "FIXME: write this!"
  :dependencies [[org.clojure/clojure "1.5.1"]
                 [org.clojure/clojurescript "0.0-2030"]
                 [ring "1.1.8"]
                 [net.mikera/core.matrix "0.14.0"]
                 [org.clojure/math.numeric-tower "0.0.2"]]
  :plugins [[lein-cljsbuild "1.0.0-alpha2"]
            [lein-ring "0.8.5"]]
  :hooks [leiningen.cljsbuild]
  :source-paths ["src/clj"]
  :javac-options ["-target" "1.6" "-source" "1.6" "-Xlint:-options"]
  :cljsbuild { 
    :builds {
      :main {
        :source-paths ["src/cljs"]
        :compiler {:output-to "resources/public/js/cljs.js"
                   :optimizations :simple
                   :pretty-print true}
        :jar true}}}
  :aot [qgame.core]
  :main qgame.core
  :ring {:handler qgame.core/app})
