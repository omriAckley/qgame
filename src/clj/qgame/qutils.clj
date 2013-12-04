(ns qgame.qutils
  (:use [qgame.complexUtils]
        [qgame.genUtils]))

(defn get-num-qubits
  "Given the amplitudes (or any collection of equal length), returns the number of qubits in the system."
  [amplitudes]
  (bit-size (count amplitudes)))

(defn amplitude-to-probability
  "Converts an amplitude to its probability by doing |a|^2."
  [amplitude]
  (let [abs-val (complex-abs amplitude)]
    (* abs-val abs-val)))

(defn qubits-to-amplitude-indices
  "Given which qubits should be involved in a computation, determines the appropriate amplitude indices to be affected."
  [qubits tot-num-qubits]
  (let [excluded-qubits (remove (set qubits)
                                (range tot-num-qubits))]
    (for [seed-index (itermap bit-flip [0] excluded-qubits)]
      (itermap bit-flip [seed-index] qubits))))

(defn qubit-state-amplitudes
  "Gets the amplitudes for a particualr qubit in a particular binary state."
  [amplitudes qubit binary-state]
  (let [excluded-qubits (remove #{qubit}
                                (range (get-num-qubits amplitudes)))
        seed-index (* binary-state (bit-set 0 qubit))
        indices (itermap bit-flip [seed-index] excluded-qubits)]
    (map (partial get amplitudes) indices)))

(defn probability-of
  "Given some quantum system, a qubit, and a binary state, returns the current probability of finding that qubit in that binary state."
  [{amplitudes :amplitudes} qubit binary-state]
  (let [sub-amplitudes (qubit-state-amplitudes amplitudes qubit binary-state)
        probabilities (map amplitude-to-probability sub-amplitudes)]
    (reduce + probabilities)))
