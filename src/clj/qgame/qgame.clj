(ns qgame.qgame
  (:refer-clojure :exclude [* - + == /])
  (:use [clojure.core.matrix]
        [clojure.core.matrix.operators])
  (:use [qgame.genUtils]
        [qgame.complexUtils]
        [qgame.qgates]
        [qgame.qutils]))

(def default-quantum-system
  {:amplitudes [1]
   :prior-probability 1
   :oracle-count 0
   :measurement-history ()})

(defn new-quantum-system
  "Given some number of qubits, returns the default quantum system, but with 2^num-qubits amplitudes."
  [num-qubits]
  (let [num-amplitudes (bit-shift-left 1 num-qubits)]
    (update-in default-quantum-system [:amplitudes]
               into (repeat (dec num-amplitudes) 0))))

;;Example
#_(-> (new-quantum-system 2)
  :amplitudes
  (hadamard 0)
  (hadamard 1)
  (u-theta (/ Math/PI 5) 0)
  (cnot 0 1)
  (hadamard 1))
#_(should output [[0.572 0.572]
                  [0.416 -0.416]])

(defn force-to
  "Forces a given qubit to a given binary state. It does so by forcing the opposite of that binary state to have an amplitude of zero. Also update the qsystem's prior probability."
  [qsys qubit binary-state]
  (let [all-indices (qubits-to-amplitude-indices [qubit] (get-num-qubits (:amplitudes qsys)))
        relevant-indices (map #(nth % (bit-flip binary-state 0))
                              all-indices)]
    (-> qsys
      (update-in [:amplitudes]
                 update-sub (constantly (repeat 0)) relevant-indices)
      (update-in [:measurement-history]
                 conj [qubit binary-state])
      (update-in [:prior-probability]
                 * (probability-of qsys qubit binary-state)))))

(defn measure
  "Splits the head branch into two branches: one in which the qubit has been forced to the 1 state, and the other in which the qubit has been forced to the 0 state."
  [[head-branch & remaining] qubit]
  (into remaining
        [(map (fn [qsys]
                (force-to qsys qubit 1))
              head-branch)
         (map (fn [qsys]
                (force-to qsys qubit 0))
              head-branch)]))

(defn swap-first-two
  "Swaps the first two items in a collection. If the collection contains only one item, will return the collection as is. In the context of program execution, switches between executing qgates on the current forced-1 branch and the current forced-0 branch, if they exist."
  [[head-branch alternate-branch & remaining]]
  (->> [head-branch alternate-branch]
    (take-while identity)
    (into remaining)))

(defn concat-first-two
  "Concatenates the first two items in a collection. If the collection contains only one item, will return the collection as is. In the context of program execution, this merges any current forced-1 and forced-0 branches."
  [[head-branch alternate-branch & remaining]]
  (cons (into alternate-branch head-branch)
        remaining))

(defn to-qsys-updater
  "Given a qgate--a function which takes a vector of amplitudes and a list of indices, and outputs a vector of amplitudes--returns a function that updates a qsystem."
  [qgate qubits]
  (fn [qsys]
    (update-in qsys [:amplitudes]
               #(apply qgate % qubits))))

(defn execute-qgate
  "Exectues an qgate by mapping its effects down the head branch."
  [[head-branch & remaining] qgate qubits]
  (-> (to-qsys-updater qgate qubits)
    (map head-branch)
    (cons remaining)))

(defn execute-instruction
  "Executes (and renders) a single instruction. Instructions should be quoted lists containing a symbol and possibly arguments. Symbols such as measure, else, and end will affect control flow by splitting, swapping, or merging branches. Other instructions are assumed to be qgates, and execute as such."
  [renderer oracle-qgate
   branches [i-sym & args :as instr]]
  (when renderer
    (renderer branches instr))
  (case i-sym
    measure (apply measure branches args)
    else (swap-first-two branches)
    end (concat-first-two branches)
    oracle (execute-qgate branches oracle-qgate args)
    (execute-qgate branches (resolve i-sym) args)))

(defn execute-program
  "Executes and renders a list of qgame instructions. At the end, it merges any unclosed branches."
  [{:keys [num-qubits renderer oracle]}
   instructions]
  (let [init-qsystem (new-quantum-system num-qubits)
        oracle-qgate (->> (unless nil? oracle [0])
                       binary-gate-matrix
                       anonymous-qgate)
        final-branches (reduce (partial execute-instruction renderer oracle-qgate)
                               (-> init-qsystem list list)
                               instructions)]
    (apply concat final-branches)))

;;Examples
(execute-program {:num-qubits 2}
                 `((hadamard 0)
                    (hadamard 1)
                    (u-theta ~(/ Math/PI 5) 0)
                    (cnot 0 1)
                    (hadamard 1)))

(execute-program {:num-qubits 3}
                 '((hadamard 0)
                   (measure 0)
                    (hadamard 1)
                    (measure 1)
                    (else)
                    (end)
                   (else)
                    (hadamard 2)
                    (measure 2)
                    (else)
                    (end)
                   (end)))

;End-end test
(end-to-else-branch
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
              
     
