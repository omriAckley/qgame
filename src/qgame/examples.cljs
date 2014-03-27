(ns qgame.examples
  "Usage examples for the qgame simulator library."
  (:use [qgame.simulator.interpreter :only [interpret]])
  (:require [qgame.utils.math :as m :refer [round]]))

(enable-console-print!)

;Example
#_(interpret "hadamard A
             hadamard B
             utheta A PI/5
             cnot B A
             hadamard B")
;should output approx
;({:amplitudes [0.572 0.572 0.416 -0.416]
;  :prior-probability 1
;  :oracle-count 0
;  :measurement-history ()})

;Example with complex numbers
#_(interpret "hadamard A
             hadamard B
             utheta A PI/5
             cphase A B 0.1234
             hadamard B")
;should output approx
;({:amplitudes [0.988 #<0.156 + 0.01i> 0 #<5.948e-4 - 0.01i>],
;  :prior-probability 1,
;  :oracle-count 0,
;  :measurement-history ()})


;Example with oracle
#_(interpret "with_oracle 1 1 1 0
             oracle A B C")
;should output approx
;({:amplitudes [0 0 0 0 1 0 0 0],
;  :prior-probability 1,
;  :oracle-count 1,
;  :measurement-history ()})


;Measurement example
#_(interpret "hadamard A
             measure A
              hadamard B
              measure B
              end
              end
             end
              hadamard C
              measure C
              end
              end
             end")
;should output approx
;({:amplitudes [0 0.5 0 0 0 0 0 0]
;  :prior-probability 0.25
;  :oracle-count 0
;  :measurement-history ([2 0] [0 1])}
; {:amplitudes [0 0 0 0 0 0.5 0 0]
;  :prior-probability 0.25
;  :oracle-count 0
;  :measurement-history ([2 1] [0 1])}
; {:amplitudes [0 0 0.5 0 0 0 0 0]
;  :prior-probability 0.25
;  :oracle-count 0
;  :measurement-history ([1 1] [0 0])}
; {:amplitudes [0.5 0 0 0 0 0 0 0]
;  :prior-probability 0.25
;  :oracle-count 0
;  :measurement-history ([1 0] [0 0])})


;FIXME
;Now with custom step-by-step renderer
;#_(execute-program {:num-qubits 3
;                    :renderer (fn [branches instruction]
;                                (println "head branch amplitudes...")
;                                (doseq [qsys (first branches)]
;                                  (println (str "   ")
;                                           (-> qsys :amplitudes (m/round 3))))
;                                (println (str "action:")
;                                         (case (first instruction)
;                                           measure (str "measure and branch on qubit " (second instruction))
;                                           else "switch branches"
;                                           end "merge branches"
;                                           (apply str (first instruction) " on qubit " (rest instruction))))
;                                (println "--------------------------------------------"))}
;                   '((hadamard 0)
;                     (measure 0)
;                     (hadamard 1)
;                     (measure 1)
;                     (end)
;                     (end)
;                     (end)
;                     (hadamard 2)
;                     (measure 2)
;                     (end)
;                     (end)
;                     (end)))
;should output same as above (but with intermediate printing)
