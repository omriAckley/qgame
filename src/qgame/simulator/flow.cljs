(ns qgame.simulator.flow
  (:require [qgame.utils.general :as g :refer [update-sub]]
            [qgame.utils.amplitudes :as a :refer [probability-of
                                                  qubits-to-amplitude-indices
                                                  get-num-qubits]]))

(defn force-to
  "Forces a given qubit to a given binary state. It does so by forcing the opposite of that binary state to have an amplitude of zero. Also update the qsystem's prior probability."
  [qsys qubit binary-state]
  (let [threshold 0
        qsys (-> qsys
                 (update-in [:measurement-history] conj [qubit binary-state])
                 (assoc-in [:prior-probability] (a/probability-of qsys qubit binary-state)))
        all-indices (a/qubits-to-amplitude-indices [qubit] (a/get-num-qubits (:amplitudes qsys)))
        relevant-indices (map #(nth % (- 1 binary-state))
                              all-indices)]
    (when (> (:prior-probability qsys) threshold) 
      (update-in qsys [:amplitudes]
                 g/update-sub (constantly (repeat 0)) relevant-indices))))

(defn force-and-split
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

(def measure
  {:fn-meta {:type :FlowControl
             :name "measure"}
   :caller force-and-split
   :num-qubits 1})

(def else
  {:fn-meta {:type :FlowControl
             :name "else"}
   :caller swap-first-two})

(def end
  {:fn-meta {:type :FlowControl
             :name "end"}
   :caller concat-first-two})
