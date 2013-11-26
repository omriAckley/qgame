(ns qgame.qgates
  (:refer-clojure :exclude [* - + == /])
  (:use [clojure.core.matrix]
        [clojure.core.matrix.operators])
  (:use [qgame.complex-utils]))

(def qnot
  [[0 1]
   [1 0]])

(def cnot
  [[1 0 0 0]
   [0 1 0 0]
   [0 0 0 1]
   [0 0 1 0]])

(def srn
  (* (/ (sqrt 2) 2)
     [[1 -1]
      [1  1]]))

(def nand #_HELP)

(def hadamard
  (* (/ (sqrt 2) 2)
     [[1  1]
      [1 -1]]))

(defn u-theta
  [theta]
  [[   (cos theta)  (sin theta)]
   [(- (sin theta)) (cos theta)]])

(defn cphase
  [alpha]
  [[1 0 0  0            ]
   [0 1 0  0            ]
   [0 0 1  0            ]
   [0 0 0 (exp-xi alpha)]])

(defn u2
  [phi theta psi alpha]
  [[(* (cos    theta)  (exp-xi (+ (- phi) (- psi) alpha)))
    (* (sin (- theta)) (exp-xi (+ (- phi)    psi  alpha)))]
   [(* (sin    theta)  (exp-xi (+    phi  (- psi) alpha)))
    (* (cos    theta)  (exp-xi (+    phi     psi  alpha)))]])

(def swap
  [[1 0 0 0]
   [0 0 1 0]
   [0 1 0 0]
   [0 0 0 1]])
