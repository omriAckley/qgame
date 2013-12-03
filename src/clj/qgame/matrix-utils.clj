(ns qgame.matrix-utils
  (:refer-clojure :exclude [* - + == /])
  (:use [clojure.core.matrix]
       [clojure.core.matrix.operators])
  (:use [qgame.gen-utils]
        [qgame.complex-utils]
        [clojure.walk :only [postwalk]]))

(defn conjugate-transpose
  "The result of tranposing a 2-D matrix whose elements have been complex conjugated."
  [matrix]
  (-> (partial mapv complex-conjugate)
    (mapv matrix)
    transpose))

(defn unitary?
  "Returns true if the matrix is unitary. A matrix M is unitary if M multiplied by its conjugate transpose and its conjugate transpose multiplied by it are both equal to the identity matrix."
  [matrix]
  (let [id-mat (identity-matrix (count matrix))
        conj-trans (conjugate-transpose matrix)]
    (== id-mat
        (postwalk #(unless number? % (float %))
                  (mmul matrix conj-trans))
        (postwalk #(unless number? % (float %))
                  (mmul conj-trans matrix)))))
