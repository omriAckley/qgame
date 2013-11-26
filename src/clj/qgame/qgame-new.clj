(ns qgame.qgame-new
  (:refer-clojure :exclude [* - + == /])
  (:use [clojure.core.matrix]
       [clojure.core.matrix.operators])
  (:use [qgame.gen-utils]
       [qgame.complex-utils]
       [qgame.qgates]))

(def default-quantum-system
  {:amplitudes []
   :prior-probability 1
   :oracle-count 0
   :measurement-history ()
   :instruction-history ()
   :program ()})

(defn new-quantum-system
  [num-qubits]
  (let [num-amplitudes (bit-shift-left 1 num-qubits)]
    (->> 0
      (repeat (dec num-amplitudes))
      (into [1])
      (assoc default-quantum-system :amplitudes))))
   
(defn qubits-to-amplitude-indices
  "Given which qubits should be involved in the computation, determines the appropriate amplitude indices to update."
  [qubits tot-num-qubits]
  (let [excluded-qubits (remove (set qubits)
                                (range tot-num-qubits))]
  (for [x (itermap bit-flip [0] excluded-qubits)]
    (itermap bit-flip [x] qubits))))

(defn apply-qgate
  "Applies the given qgate (a matrix) to the specified qubits by matrix multiplication on the appropiate sub-matrix of amplitudes."
  [amplitudes qgate qubits]
  (reduce (fn [amps indices]
            (update-sub amps
                        (partial mmul qgate)
                        indices))
          amplitudes
          (qubits-to-amplitude-indices qubits
                                       (bit-size (count amplitudes)))))

(defn run-qprogram
  [qsys & instructions]
  (if-let [[[qgate qubits] & remaining] instructions]
    (apply run-qprogram
           (update-in qsys [:amplitudes]
                      apply-qgate qgate qubits)
           remaining)
    qsys))

;Example, taken from Lee's slideshow
(run-qprogram
  (new-quantum-system 2)
  [hadamard [0]]
  [hadamard [1]]
  [(u-theta (/ Math/PI 5)) [0]]
  [cnot [0 1]]
  [hadamard [1]])
