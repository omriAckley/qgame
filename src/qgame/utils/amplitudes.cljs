(ns qgame.utils.amplitudes
  "Various functions for working with amplitudes."
  (:require [qgame.utils.math :as m :refer [abs
                                            add
                                            multiply
                                            to-phase
                                            det]]
            [qgame.utils.general :as g :refer [bit-size
                                               itermap]]))

(defn get-num-qubits
  "Given the amplitudes (or any collection of equal length), returns the number of qubits in the system."
  [amplitudes]
  (g/bit-size (count amplitudes)))

(defn amplitude-to-probability
  "Converts an amplitude to its probability by doing |a|^2."
  [amplitude]
  (let [abs-val (m/abs amplitude)]
    (m/multiply abs-val abs-val)))

(defn amplitudes-to-probability
  "Converts a list of amplitudes to a single probability by summing together all the sub-probabilities."
  [amplitudes]
  (reduce + (map amplitude-to-probability amplitudes)))

(defn qubits-to-amplitude-indices
  "Given which qubits should be involved in a computation, determines the appropriate amplitude indices to be affected."
  [qubits tot-num-qubits]
  (let [excluded-qubits (remove (reduce conj #{} qubits) ;Qubits cannot directly be cast into a set because of a bug when it is initially an RSeq
                                (range tot-num-qubits))]
    (for [seed-index (g/itermap bit-flip [0] excluded-qubits)]
      (g/itermap bit-flip [seed-index] qubits))))

(defn qubit-state-amplitudes
  "Gets the amplitudes for a particular qubit in a particular binary state."
  [amplitudes qubit binary-state]
  (let [excluded-qubits (remove #{qubit}
                                (range (get-num-qubits amplitudes)))
        seed-index (* binary-state (bit-set 0 qubit))
        indices (g/itermap bit-flip [seed-index] excluded-qubits)]
    (map (partial get amplitudes) indices)))

(defn probability-of
  "Given some quantum system, a qubit, and a binary state, returns the current probability of finding that qubit in that binary state."
  [{amplitudes :amplitudes} qubit binary-state]
  (let [sub-amplitudes (qubit-state-amplitudes amplitudes qubit binary-state)]
    (amplitudes-to-probability sub-amplitudes)))

(defn phase-of
  "Given some quantum system, a qubit, and a binary state, returns the current phase of that qubit's state's amplitude."
  [{amplitudes :amplitudes} qubit binary-state]
  (let [sub-amplitudes (qubit-state-amplitudes amplitudes qubit binary-state)
        amplitude (reduce m/add sub-amplitudes)]
    (to-phase amplitude)))

(defn substate-amplitudes
  "Given a particular substate, a particular combination of states of qubits, returns all amplitudes for which that combination is present."
  [amplitudes substate]
  (let [qubits (keys substate)
        excluded-qubits (remove (set qubits)
                                (range (get-num-qubits amplitudes)))
        flip-digits (keep (fn [[qubit state]]
                            (when-not (zero? state) qubit))
                          substate)
        seed-index (reduce bit-flip 0 flip-digits)
        indices (g/itermap bit-flip [seed-index] excluded-qubits)]
    (map (partial get amplitudes) indices)))

(defn inner-amplitudes
  "Gets the lists of sub-amplitudes for a sub-system comprising the given qubits. For each combination of states of the given qubits, returns all amplitudes for which that combination is present."
  [global-amplitudes qubits]
  (let [all-zero-state (zipmap qubits (repeat 0))
        all-one-state (zipmap qubits (repeat 1))
        all-combinations (g/itermap conj [all-zero-state] all-one-state)]
    (mapv (partial substate-amplitudes global-amplitudes) all-combinations)))

(defn self-conj-outer-prod
  "Returns the outer product of amplitudes and its conjugate transpose."
  [amplitudes]
  (let [ket (mapv vector amplitudes)
        bra (m/conjugate-transpose ket)]
    (m/multiply ket bra)))

(defn density-matrix
  "Returns a reduced density matrix of the ampltiudes for the given qubits. This is a kind of 'local amplitudes', scoped to the given qubits, and as such is re-ordered to be in the same order they appear as arguments here."
  [amplitudes qubits]
  (let [inner-amps (inner-amplitudes amplitudes qubits)
        sub-amplitudes (mapv amplitudes-to-probability inner-amps)]
    (self-conj-outer-prod sub-amplitudes)))

(defn tangle-of
  "Given a quantum system and two qubits (the order should not matter), returns the tangle, a number between 0 and 1."
  [{amplitudes :amplitudes} qubit-a qubit-b]
  (let [rho-ab (density-matrix amplitudes [qubit-a qubit-b])
        top-left-quadrant (mapv #(subvec % 0 2) (subvec rho-ab 0 2))
        bottom-right-quadrant (mapv #(subvec % 2) (subvec rho-ab 2))
        rho-a (m/add top-left-quadrant bottom-right-quadrant)]
    (* 4 (m/det rho-a))))
