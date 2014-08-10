(ns qgame.gp.generator
  (:require [qgame.simulator.shared :as shared :refer [canonical-functions]]))

(def gate-syms
  (->> ["with_oracle" "measure" "else" "end"]
       (apply dissoc shared/canonical-functions)
       vals
       (map (juxt (comp symbol :name :fn-meta)
                  (comp count :param-names)
                  :num-qubits))))

(defn rand-param
  [])

(defn rand-qubit
  [max-qubits])

(defn rand-expression
  [max-qubits oracle-size]
  (let [_rand-qubit (partial rand-qubit max-qubits)
        [sym
         num-params
         num-qubits] (rand-nth gate-syms)]
    (if (= 'oracle sym)
      (cons 'oracle
            (repeatedly oracle-size _rand-qubit))
      (concat '(sym)
              (repeatedly num-params rand-param)
              (repeatedly num-qubits _rand-qubit)))))

(defn rand-program
  [max-qubits oracle-size prog-size])