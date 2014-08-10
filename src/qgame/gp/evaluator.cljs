(ns qgame.gp.evaluator
  (:require [qgame.simulator.interpreter :as i :refer [interpret]]
            [qgame.utils.amplitudes :as a :refer [all-combinations
                                                  substate-amplitudes
                                                  amplitudes-to-probability]]
            [qgame.utils.math :as m :refer [pow]]
            [clojure.string :as s :refer [join]]))

(defn spacify
  [coll]
  (s/join " " coll))

(defn prog-to-string
  [program]
  (spacify (map spacify program)))

(defn to-number
  [read-order combination]
  (reduce +
          (map-indexed (fn [idx qubit]
                         (if (= 1 (get combination qubit))
                           (m/pow 2 idx)
                           0))
                       read-order)))

(defn substate-to-prob
  [quantum-systems substate]
  (reduce (fn [sum q-sys]
            (-> q-sys
                :amplitudes
                (a/substate-amplitudes substate)
                a/amplitudes-to-probability
                (+ sum)))
          0
          quantum-systems))

(defn evaluate
  [program read-from oracle-case]
  (let [program+ (cons (cons 'with_oracle oracle-case) program)
        output (-> program+ prog-to-string i/interpret)
        combinations (a/all-combinations read-from)]
    (reduce (fn [m substate]
              (assoc m
                (to-number read-from substate)
                (substate-to-prob output substate)))
            {}
            combinations)))

(defn test-quantum-program
  [& args]
  (let [{:keys [program read-from cases]} (apply hash-map args)]
    (reduce (fn [m case]
              (assoc m case (evaluate program read-from case)))
            {}
            cases)))
