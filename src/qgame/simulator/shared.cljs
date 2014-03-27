(ns qgame.simulator.shared
  "Shared constants and variables."
  (:require [qgame.simulator.flow :as f :refer [measure
                                                else
                                                end]]
            [qgame.simulator.qgates :as q :refer [qnot
                                                  cnot
                                                  srn
                                                  nand
                                                  hadamard
                                                  utheta
                                                  cphase
                                                  u2
                                                  swap
                                                  with_oracle]]))

(def ^:dynamic *stage* "Interpretation")

(declare ^:dynamic *current-qgame-fn*)

(def canonical-functions
  (atom {"qnot" q/qnot
         "cnot" q/cnot
         "srn"  q/srn
         "nand" q/nand
         "hadamard" q/hadamard
         "utheta" q/utheta
         "cphase" q/cphase
         "u2" q/u2
         "swap" q/swap
         "oracle" nil
         "measure" f/measure
         "else" f/else
         "end" f/end
         "with_oracle" q/with_oracle}))
