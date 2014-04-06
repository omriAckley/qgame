(ns qgame.simulator.interpreter
  (:require [qgame.simulator.reader :as r :refer [read]]
            [qgame.simulator.parser :as p :refer [parse]]
            [qgame.simulator.compiler :as c :refer [compile]]
            [qgame.simulator.executor :as e :refer [execute]])
  (:use [qgame.simulator.shared :only [on-error
                                       on-warning]]
        [qgame.simulator.error :only []]))

(defn default-error
  [{{:keys [stage current-qgame-fn title message]} :error :as context}]
  (js/console.log (str "qgame error during " stage ", in qgame function " current-qgame-fn ": " title "\n" message)
                  "\n" (clj->js context)))

(defn default-warning
  [{{:keys [stage current-qgame-fn title message]} :error :as context}]
  (js/console.log (str "qgame warning during " stage ", in qgame function " current-qgame-fn ": " title "\n" message)
                  "\n" (clj->js context)))

(defn interpret
  ([raw]
   (interpret {} raw))
  ([{:keys [pre-exec in-exec on-err on-warn]} raw]
   (if on-err
     (reset! on-error on-err)
     (reset! on-error default-error))
   (if on-warn
     (reset! on-warning on-warn)
     (reset! on-warning default-warning))
   (let [processed (-> raw r/read p/parse c/compile)]
     (when pre-exec (pre-exec processed))
     (e/execute (assoc processed :renderer in-exec)))))
