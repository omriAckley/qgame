(ns qgame.simulator.interpreter
  (:require [qgame.simulator.reader :as r :refer [read]]
            [qgame.simulator.parser :as p :refer [parse]]
            [qgame.simulator.compiler :as c :refer [compile]]
            [qgame.simulator.executor :as e :refer [execute]]))

(defn interpret
  [raw]
  (let [processed (-> raw r/read p/parse c/compile)]
    (e/execute processed)))
