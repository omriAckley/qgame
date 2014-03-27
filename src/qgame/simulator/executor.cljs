(ns qgame.simulator.executor
  "The guts of qgame: interprets and runs instructions to a simulated quantum computer."
  (:require [qgame.utils.general :as g :refer [update-sub]]
            [qgame.utils.amplitudes :as a :refer [probability-of
                                                  qubits-to-amplitude-indices
                                                  get-num-qubits]])
  (:use [qgame.simulator.shared :only [*stage*
                                       canonical-functions]])
  (:use-macros [qgame.macros :only [error!]]))

(defn new-quantum-system
  "Given some number of qubits, returns the default quantum system, but with 2^num-qubits amplitudes."
  [num-qubits]
  (let [num-amplitudes (bit-shift-left 1 num-qubits)]
    {:amplitudes (->> 0
                      (repeat (dec num-amplitudes))
                      (into [1]))
     :prior-probability 1
     :oracle-count 0
     :measurement-history ()}))

(defn to-qsys-updater
  "Given a qgate--a function which takes a vector of amplitudes and a list of indices, and outputs a vector of amplitudes--returns a function that updates a qsystem."
  [qgate*]
  (fn [qsys]
    (update-in qsys [:amplitudes] qgate*)))

(defn on-head-branch
  "Maps f down the head branch."
  [f [head-branch & remaining]]
  (cons (map f head-branch)
        remaining))

(defn execute-qgate
  "Exectues an qgate by mapping its effects down the head branch."
  [branches {caller :curried}]
  (-> caller to-qsys-updater
      (on-head-branch branches)))

(defn execute-oracle
  "Just like execute-qgate, but also updates all qsystems in the head branch by incrementing :oracle-count."
  [branches {caller :curried}]
  (let [f (comp (to-qsys-updater caller)
                #(update-in % [:oracle-count] inc))]
    (on-head-branch f branches)))

(defn execute-flow-control
  [branches {caller :curried}]
  (caller branches))

(defn execute-instruction
  [renderer branches
   {{fn-nm :name fn-type :type} :fn-meta :as instruction}]
  (when renderer
    (renderer branches instruction))
  (case fn-type
    :QGate (execute-qgate branches instruction)
    :Oracle (execute-oracle branches instruction)
    :FlowControl (execute-flow-control branches instruction)
    (do (error! "Unrecognized function type" instruction)
      branches)))

(defn execute
  [{:keys [program num-qubits renderer]}]
  (binding [*stage* "Execution"]
    (let [init-qsystem (new-quantum-system num-qubits)
          final-branches (reduce (partial execute-instruction renderer)
                                 (-> init-qsystem list list)
                                 program)]
      (apply concat final-branches))))
