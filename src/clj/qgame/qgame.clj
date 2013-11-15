(ns qgame.qgame
  (:refer-clojure :exclude [* - + == /])
  (:use clojure.core.matrix)
  (:use clojure.core.matrix.operators)
  (:use [clojure.math.numeric-tower :only [expt]]))

(def default-quantum-system
  {:amplitudes []
   :prior-probability 1
   :oracle-count 0
   :measurement-history ()
   :instruction-history ()
   :program ()})

(defn new-quantum-system
  [num-qubits]
  (let [num-amplitudes (expt 2 num-qubits)]
    (->> 0
      (repeat (dec num-amplitudes))
      (into [1])
      (assoc default-quantum-system :amplitudes))))
