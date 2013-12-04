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
  [num-qubits]
  (let [num-amplitudes (bit-shift-left 1 num-qubits)]
    (update-in default-quantum-system [:amplitudes]
               into
               (repeat (dec num-amplitudes) 0))))

;;Example
(-> (new-quantum-system 2)
  (hadamard 0)
  (hadamard 1)
  (u-theta (/ Math/PI 5) 0)
  (cnot 0 1)
  (hadamard 1))


#_(should output [[0.572 0.572]
                  [0.416 -0.416]])

(def ^:dynamic *renderer* nil)
(def ^:dynamic *oracle-qgate* nil)

(defmacro execute-branch
  "Executes a given branch, outputing a new list of quantum systems."
  [q-systems & instructions]
  `(for [q-sys# ~q-systems]
     (-> q-sys# ~@instructions)))

(defmacro branch-by
  "Given a probability instruction and two branches, executes both with update prior probabilities and measurement histories."
  [q-systems [_ qubit :as prob-instruction] branch-1 branch-0]
  `(for [q-sys# ~q-systems
         :let [prob-1# (-> qsys# ~prob-instruction)
               prob-0# (- 1 prob-1#)]
         [msr# branch# prob#] [[1 ~branch-1 prob-1#]
                               [0 ~branch-2 prob-2#]]]
            (-> qsys#
              (update-in [:prior-probability]
                         * prob#)
              (update-in [:measurement-history]
                         conj [~qubit msr#])
              #branch)))

(defmacro render-and-return
  "Using dynamically bound *renderer*, renders the current quantum system and instruction, then does that instruction on quantum system."
  [q-system renderer [f & args :as instruction]]
  `(let [q-sys# ~q-system]
     (~renderer q-sys# '~instruction)
     (~f q-sys# ~@args)))

(defn maybe-render
  "Renders the intermediate steps of a quantum program using the *renderer* function, if it exists."
  [instructions]
  (if-let [renderer *renderer*]
    (for [instr instructions]
         `(render-and-return ~renderer ~instr))
    instructions))

#_(defmacro compile-single
  "Compiles a single-branched program. The compiled version is a function that takes a quantum system as input."
  [instructions]
  `(fn [q-system#]
        (-> q-system#
          ~@(maybe-render instructions))))


(defn compile-single
  [q-system instructions]
  `(-> ~q-system
     ~@(maybe-render instructions)))

(defn compile-multi
  [q-system instructions])

(defmacro execute-program
  [{:keys [single-branch? num-qubits oracle-matrix]}
   & instructions]
  (let [quantum-system (new-quantum-system num-qubits)
        program (if single-branch?
                  (compile-single quantum-system instructions)
                  (compile-multi quantum-system instructions)))]
    (binding [*oracle-qgate* (-> (unless nil? oracle-matrix [0])
                               binary-truth-table
                               anonymous-qgate)]
      program)))

(execute-branch [(new-quantum-system 4)]
                (hadamard 0)
                (branch-by (probability-of 0 1)
                           (execute-branch
                             (force-to 0 1)
                             (hadamard 1)
                             (branch-by (probability-of 1 1)
                                        (execute-branch
                                          (force-to 1 1))
                                        (execute-branch
                                          (force-to 1 0))))
                           (execute-branch
                             (force-to 0 0)
                             (hadamard 2)
                             (branch-by (probability-of 2 1)
                                        (execute-branch
                                          (force-to 2 1))
                                        (execute-branch
                                          (force-to 2 0))))))
                    

((hadamard 0)
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
 (end))

(-> (new-quantum-system 3)
  (hadamard 0)
  (force-to 4))

#_(defmacro execute-branch
  [q-system gate-instructions]
  ``(-> (:amplitudes ~~q-system)
     ~@~gate-instructions))
