(ns qgame.examples
  "Usage examples for the qgame simulator library."
  (:use [qgame.interpreter.core :only [execute-program]])
  (:require [qgame.utils.math :as m :refer [round]]))

(enable-console-print!)

;Example
(execute-program {:num-qubits 2}
                '((hadamard 0)
                  (hadamard 1)
                  (u-theta 0.62832 0)
                  (cnot 0 1)
                  (hadamard 1)))
#_(should output approx
  ({:amplitudes [0.572 0.572 0.416 -0.416]
    :prior-probability 1
    :oracle-count 0
    :measurement-history ()}))


;Measurement example
(execute-program {:num-qubits 3}
                '((hadamard 0)
                  (measure 0)
                   (hadamard 1)
                   (measure 1)
                   (end)
                   (end)
                  (end)
                   (hadamard 2)
                   (measure 2)
                   (end)
                   (end)
                  (end)))
#_(should output approx
  ({:amplitudes [0 0.5 0 0 0 0 0 0]
    :prior-probability 0.25
    :oracle-count 0
    :measurement-history ([2 0] [0 1])}
   {:amplitudes [0 0 0 0 0 0.5 0 0]
    :prior-probability 0.25
    :oracle-count 0
    :measurement-history ([2 1] [0 1])}
   {:amplitudes [0 0 0.5 0 0 0 0 0]
    :prior-probability 0.25
    :oracle-count 0
    :measurement-history ([1 1] [0 0])}
   {:amplitudes [0.5 0 0 0 0 0 0 0]
    :prior-probability 0.25
    :oracle-count 0
    :measurement-history ([1 0] [0 0])}))

;;With custom step-by-step renderer
(execute-program {:num-qubits 3
                  :renderer (fn [branches instruction]
                              (println "head branch amplitudes...")
                              (doseq [qsys (first branches)]
                                (println (str "   ")
                                  (-> qsys :amplitudes (m/round 3))))
                              (println (str "action:")
                                (case (first instruction)
                                  measure (str "measure and branch on qubit " (second instruction))
                                  else "switch branches"
                                  end "merge branches"
                                  (apply str (first instruction) " on qubit " (rest instruction))))
                              (println "--------------------------------------------"))}
                 '((hadamard 0)
                   (measure 0)
                    (hadamard 1)
                    (measure 1)
                    (end)
                    (end)
                   (end)
                    (hadamard 2)
                    (measure 2)
                    (end)
                    (end)
                   (end)))
#_(should output same as above (but with intermediate printing))
