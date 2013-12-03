(ns qgame.qgates
  (:refer-clojure :exclude [* - + == /])
  (:use [clojure.core.matrix]
        [clojure.core.matrix.operators])
  (:use [qgame.complex-utils]
        [qgame.gen-utils]
        [qgame.matrix-utils]
        [qgame.qutils]))

(defn apply-operator
  "For each set of indices, applies some operator to the amplitudes at those indices."
  [amplitudes operator qubits]
  (->> (get-num-qubits amplitudes)
    (qubits-to-amplitude-indices qubits)
    (reduce operator amplitudes)))

(defn to-operator
  "Converts a gate matrix to an operator: a function that can update a sub-matrix of amplitudes through matrix multiplication of the gate matrix and the amplitude sub-matrix."
  [matrix]
  {:pre [(square? matrix)
         (unitary? matrix)]}
  (fn [amps indices]
    (update-sub amps
                (partial mmul matrix)
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
  (fn [q-system & qubits]
    (update-in q-system [:amplitudes]
               apply-operator
               (to-operator matrix)
               qubits)))

(defmacro defn-qgate
  "Expects zero or more named args that are used to calculate the gate matrix. It expands to define a function that takes a quantum system, those named args, and some number of qubits, and outputs a quantum system with amplitudes updated by applying the gate matrix as an operator."
  [nm args matrix]
  `(defn ~nm [~'q-system ~@args ~'& ~'qubits]
     (update-in ~'q-system [:amplitudes]
                apply-operator
                (to-operator ~matrix)
                ~'qubits)))

(defn-qgate qnot []
  [[0 1]
   [1 0]])

(defn-qgate cnot []
  [[1 0 0 0]
   [0 1 0 0]
   [0 0 0 1]
   [0 0 1 0]])

(defn-qgate srn []
  (* (/ (sqrt 2) 2)
     [[1 -1]
      [1  1]]))

(defn-qgate nand []
  (binary-gate-matrix [1 1 1 0]))

(defn-qgate hadamard []
  (* (/ (sqrt 2) 2)
     [[1  1]
      [1 -1]]))

(defn-qgate u-theta [theta]
  [[   (cos theta)  (sin theta)]
   [(- (sin theta)) (cos theta)]])

(defn-qgate cphase [alpha]
  [[1 0 0  0            ]
   [0 1 0  0            ]
   [0 0 1  0            ]
   [0 0 0 (exp-xi alpha)]])

(defn-qgate u2 [phi theta psi alpha]
  [[(* (cos    theta)  (exp-xi (+ (- phi) (- psi) alpha)))
    (* (sin (- theta)) (exp-xi (+ (- phi)    psi  alpha)))]
   [(* (sin    theta)  (exp-xi (+    phi  (- psi) alpha)))
    (* (cos    theta)  (exp-xi (+    phi     psi  alpha)))]])

(defn-qgate swap []
  [[1 0 0 0]
   [0 0 1 0]
   [0 1 0 0]
   [0 0 0 1]])
