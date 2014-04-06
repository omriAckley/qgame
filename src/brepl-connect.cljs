(ns brepl-connect
  "Made for the sole purpose of running a ClojureScript browser REPL with this project."
  (:require-macros [qgame.macros :as macros :refer [get-repl-listen-port]])
  (:require [clojure.browser.repl :as repl :refer [connect]]))

(repl/connect (str "http://localhost:" (macros/get-repl-listen-port) "/repl"))

(js/console.log "Connected to ClojureScript REPL")
