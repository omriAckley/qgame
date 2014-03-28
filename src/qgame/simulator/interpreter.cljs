(ns qgame.simulator.interpreter
  (:require [qgame.simulator.reader :as r :refer [read]]
            [qgame.simulator.parser :as p :refer [parse]]
            [qgame.simulator.compiler :as c :refer [compile]]
            [qgame.simulator.executor :as e :refer [execute]])
  (:use [qgame.simulator.shared :only [on-error]]))

(defn interpret
  ([raw]
  (let [processed (-> raw r/read p/parse c/compile)]
    (e/execute processed)))
  ([{:keys [pre-exec in-exec on-err]} raw]
   (reset! on-error on-err)
   (let [processed (-> raw r/read p/parse c/compile)]
     (when pre-exec (pre-exec processed))
     (e/execute (assoc processed :renderer in-exec)))))

