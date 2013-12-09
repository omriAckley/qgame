(ns qgame.examples
  "Usage examples for the qgame simulator library."
  (:use qgame.api))

;;Example
(-> (new-quantum-system 2)
  :amplitudes
  (hadamard 0)
  (hadamard 1)
  (u-theta (/ Math/PI 5) 0)
  (cnot 0 1)
  (hadamard 1))
#_(should output [[0.572 0.572]
                  [0.416 -0.416]])

;;Eseentially, same as above
(pprint-branch
  (execute-program {:num-qubits 2}
                   `((hadamard 0)
                     (hadamard 1)
                     (u-theta ~(/ Math/PI 5) 0)
                     (cnot 0 1)
                     (hadamard 1))))

;;Measurement example
(pprint-branch
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
                     (end))))

;;With custom step-by-step renderer
(execute-program {:num-qubits 3
                  :renderer (fn [branches instruction]
                              (println)
                              (println "head branch amplitudes...")
                              (doseq [qsys (first branches)]
                                (print "  ")
                                (-> qsys
                                  all-to-floats
                                  all-to-cstrings
                                  :amplitudes
                                  println))
                              (print "instruction: ")
                              (println (case (first instruction)
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

