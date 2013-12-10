(defproject org.clojars.hippiccolo/qgame "0.1.2"
  :description "Quantum Gate And Measurement Emulator, or qgame. An instruction-level quantum computing simulator. Ported from Lee Spector's QGAME (written in Common Lisp)."
  :license {:name "MIT License"
            :url "http://http://en.wikipedia.org/wiki/MIT_License"}
  :url "https://github.com/omriBernstein/qgame"
  :dependencies [[org.clojure/clojure "1.4.0"]
                 [net.mikera/core.matrix "0.14.0"]
                 [potemkin "0.3.4"]]
  :javac-options ["-target" "1.6" "-source" "1.6" "-Xlint:-options"]
  :aot [qgame.core]
  :main qgame.core)
