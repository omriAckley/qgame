(ns qgame.simulator.compiler
  "Compiles parsed programs into executable programs."
  (:require [clojure.walk :as w :refer [postwalk]])
  (:use [qgame.simulator.shared :only [*stage*
                                       canonical-functions]])
  (:use-macros [qgame.macros :only [warn!]]))

(defn revise-on-end
  "Revises the open branches for when the current expression's function name is 'end'."
  [[current-status & remaining :as open-branches]]
  (if (empty? open-branches)
    (warn! "Extra end" open-branches)
    (case current-status
      :then-clause (cons :else-clause remaining)
      :else-clause remaining)))

(defn revise
  "Revises the open branches based on the current expression's function name."
  [open-branches {{fn-nm :name} :fn-meta}]
  (case fn-nm
    "measure" (cons :then-clause open-branches)
    "else" (cons :else-clause (rest open-branches))
    "end" (revise-on-end open-branches)
    open-branches))

(defn curry-caller
  "Curries the caller for the instruction, incorporating the qubit and params as arguments."
  [{:keys [qubits params caller]
    :as instruction}]
  (let [args (concat (map :value qubits) (map :value params))
        caller+ (fn [form] (apply caller form args))]
    (assoc instruction
      :curried caller+)))

(defn compile-expression
  "Converts an expression to an instruction, which just means it is compiled. In this case, all it does is swap a measure's first 'end' with an 'else'."
  [{{fn-nm :name} :fn-meta :as expression}
   [current-status]]
  (-> (if (and (= "end" fn-nm)
               (= :then-clause current-status))
        (merge expression (@canonical-functions "else"))
        expression)
      (assoc :type :Instruction)
      curry-caller))

(defn wrap-up
  "Wraps up the compilation stage."
  [open-branches compiled largest-qubit-index]
  (doseq [status open-branches]
    (warn! "Lingering status" status))
  {:type :ExecutionSpecs
   :program compiled
   :num-qubits largest-qubit-index})

(defn compile
  "Given a parsed program with 'measure...end...end' syntax, converts it to 'measure...else...end' syntax. It also determines certain execution parameters."
  [program]
  (binding [*stage* "Compilation"]
    (loop [open-branches ()
           largest-qubit-index 0
           compiled []
           [expression & remaining :as uncompiled] program]
      (if (empty? uncompiled)
        (wrap-up open-branches compiled largest-qubit-index)
        (recur (revise open-branches expression)
               (->> expression :qubits (map (comp inc :value)) (apply max largest-qubit-index))
               (conj compiled (compile-expression expression open-branches))
               remaining)))))
