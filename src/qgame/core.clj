(ns qgame.core
  "The guts of qgame: interprets and runs instructions to a simulated quantum computer."
  (:refer-clojure :exclude [* - + == /])
  (:use [clojure.core.matrix]
        [clojure.core.matrix.operators])
  (:use [qgame.utils.general]
        [qgame.utils.complex]
        [qgame.qgates]
        [qgame.amplitudes]
        [qgame.pprint])
  (:gen-class))

(defn new-quantum-system
  "Given some number of qubits, returns the default quantum system, but with 2^num-qubits amplitudes."
  [num-qubits]
  (let [num-amplitudes (bit-shift-left 1 num-qubits)]
    {:amplitudes (->> 0
                   (repeat (dec num-amplitudes))
                   (into [1])
                   (mapv number-to-cmatrix))
     :prior-probability 1
     :oracle-count 0
     :measurement-history ()}))

(def threshold 0)

(defn force-to
  "Forces a given qubit to a given binary state. It does so by forcing the opposite of that binary state to have an amplitude of zero. Also update the qsystem's prior probability."
  [qsys qubit binary-state]
  (let [qsys (-> qsys
               (update-in [:measurement-history] conj [qubit binary-state])
               (assoc-in [:prior-probability] (probability-of qsys qubit binary-state)))
        all-indices (qubits-to-amplitude-indices [qubit] (get-num-qubits (:amplitudes qsys)))
        relevant-indices (map #(nth % (- 1 binary-state))
                              all-indices)]
    (when (> (:prior-probability qsys) threshold) 
      (update-in qsys [:amplitudes]
                 update-sub (constantly (repeat [[0 0][0 0]])) relevant-indices))))

(defn measure
  "Splits the head branch into two branches: one in which the qubit has been forced to the 1 state, and the other in which the qubit has been forced to the 0 state."
  [[head-branch & remaining] qubit]
  (let [one-branch (keep (fn [qsys] (force-to qsys qubit 1)) head-branch)
        zero-branch (keep (fn [qsys] (force-to qsys qubit 0)) head-branch)]
    (into remaining [(not-empty one-branch)
                     (not-empty zero-branch)])))

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

(defn on-head-branch
  "Maps f down the head branch."
  [f [head-branch & remaining]]
  (cons (map f head-branch)
        remaining))

(defn execute-oracle-qgate
  "Just like execute-qgate, but also updates all qsystems in the head branch by incrementing :oracle-count."
  [branches oracle-qgate qubits]
  (let [f (comp (to-qsys-updater oracle-qgate qubits)
                #(update-in % [:oracle-count] inc))]
    (on-head-branch f branches)))

(defn execute-qgate
  "Exectues an qgate by mapping its effects down the head branch."
  [branches qgate qubits]
  (on-head-branch (to-qsys-updater qgate qubits)
                  branches))

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
    oracle (execute-oracle-qgate branches oracle-qgate args)
    (execute-qgate branches (resolve i-sym) args)))

(defn parse-instruction
  "Outputs an instruction, changing an '(end) to an '(else) if the head of the branch counters equals 1.
Actually, it outputs [instruction new-branch-counters], where a 1 will be appended onto branch counters if the instruction is a measure instruction, and if the instruction is end, it will turn the head to 0 if it is 1, or remove the head if it is 0."
  [[_ [head & remaining :as branch-counters]]
   [i-sym :as instruction]]
  (case i-sym
    measure [instruction (cons 1 branch-counters)]
    end (case head
          0 ['(end) remaining]
          1 ['(else) (cons 0 remaining)]
          [nil branch-counters])
    [instruction branch-counters]))

(defn to-else-syntax
  "Converts a list of instructions in '((measure)...(end)...(end)) syntax to '((measure)...(else)...(end)) syntax."
  [instructions]
  (->> instructions
       (reductions parse-instruction [nil ()])
       (keep first)))

(defn execute-program
  "Executes and renders a list of qgame instructions. At the end, it merges any unclosed branches."
  [{:keys [num-qubits renderer oracle]}
   instructions]
  (let [init-qsystem (new-quantum-system num-qubits)
        parsed-instructions (to-else-syntax instructions)
        oracle-qgate (->> (unless nil? oracle [0])
                       binary-gate-matrix
                       anonymous-qgate)
        final-branches (reduce (partial execute-instruction renderer oracle-qgate)
                               (-> init-qsystem list list)
                               parsed-instructions)]
    (apply concat final-branches)))

(defn- -main [& args])

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

;;Eseentially, same as above
#_(pprint-branch
    (execute-program {:num-qubits 2}
                     `((hadamard 0)
                       (hadamard 1)
                       (u-theta ~(/ Math/PI 5) 0)
                       (cnot 0 1)
                       (hadamard 1))))

;;Measurement example
#_(pprint-branch
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
