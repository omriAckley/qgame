(ns qgame.interpreter.qgates
  "Functions for defining and working with quantum gates. In qgame semantics, a quantum gate is a function that takes an amplitudes vector, zero or more args (which can paramaterize the gate matrix), and one or more qubits. It then returns a new vector of amplitidues with the (possibly parameterized) gate matrix multiplied at the sub-indices corresponding to the given qubits."
  (:require-macros [qgame.macros :as macros :refer [defn-qgate]])
  (:require [qgame.utils.math :as m :refer [square?
                                            unitary?
                                            multiply
                                            divide
                                            sqrt
                                            cos
                                            sin
                                            subtract
                                            exp-xi
                                            add]]
            [qgame.utils.general :as g :refer [update-sub]]
            [qgame.utils.amplitudes :as a :refer [get-num-qubits
                                                  qubits-to-amplitude-indices]]))

(defn apply-operator
  "For each set of indices (calculated given the qubits to operate on), applies some operator to the amplitudes at those indices."
  [amplitudes operator qubits]
  (->> (a/get-num-qubits amplitudes)
       (a/qubits-to-amplitude-indices qubits)
       (reduce operator amplitudes)))

(defn to-operator
  "Converts a gate matrix to an operator: a function that takes amplitudes and indices, and returns new amplitudes.
  In the context of an oprerator derived from a gate matrix, the returned operator updates a sub-matrix of amplitudes through matrix multiplication of the gate matrix and the amplitude sub-matrix."
  [matrix]
  {:pre [(m/square? matrix)
         (m/unitary? matrix)]}
  (fn [amps indices]
    (g/update-sub amps
                  (partial m/multiply matrix)
                  indices)))

(defn binary-gate-matrix
  "Given the right column of some binary truth table, returns the equivalent gate matrix."
  [tt-right-column]
  (let [dim (* 2 (count tt-right-column))]
    (->> (interleave tt-right-column tt-right-column)
         (map-indexed (fn [idx tt-val]
                        (assoc (vec (repeat dim 0))
                          ((if (even? idx) + -) idx tt-val)
                          1)))
         vec)))

(defn anonymous-qgate
  "Create an anonymous quantum gate from a gate matrix. Especially useful for oracle gates."
  [matrix]
  (fn [amplitudes & qubits]
    (apply-operator amplitudes
                    (to-operator matrix)
                    qubits)))

(macros/defn-qgate qnot []
                   [[0 1]
                    [1 0]])

(macros/defn-qgate cnot []
                   [[1 0 0 0]
                    [0 1 0 0]
                    [0 0 0 1]
                    [0 0 1 0]])

(macros/defn-qgate srn []
                   (m/multiply
                     (m/divide (m/sqrt 2) 2)
                     [[1 -1]
                      [1  1]]))

(macros/defn-qgate nand []
                   (binary-gate-matrix [1 1 1 0]))

(macros/defn-qgate hadamard []
                   (m/multiply
                     (m/divide (m/sqrt 2) 2)
                     [[1  1]
                      [1 -1]]))

(macros/defn-qgate u-theta [theta]
                   [[            (m/cos theta)  (m/sin theta)]
                    [(m/subtract (m/sin theta)) (m/cos theta)]])

(macros/defn-qgate cphase [alpha]
                   [[1 0 0  0              ]
                    [0 1 0  0              ]
                    [0 0 1  0              ]
                    [0 0 0  (m/exp-xi alpha)]])

(macros/defn-qgate u2 [phi theta psi alpha]
                   [[(m/multiply (m/cos theta)              (m/exp-xi (m/add (m/subtract phi) (m/subtract psi) alpha)))
                     (m/multiply (m/sin (m/subtract theta)) (m/exp-xi (m/add (m/subtract phi) psi              alpha)))]
                    [(m/multiply (m/sin theta)              (m/exp-xi (m/add phi              (m/subtract psi) alpha)))
                     (m/multiply (m/cos theta)              (m/exp-xi (m/add phi              psi              alpha)))]])

(macros/defn-qgate swap []
                   [[1 0 0 0]
                    [0 0 1 0]
                    [0 1 0 0]
                    [0 0 0 1]])
