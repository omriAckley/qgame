(ns qgame.qgame
  (:refer-clojure :exclude [* - + == /])
  (:use clojure.core.matrix)
  (:use clojure.core.matrix.operators)
  (:use [clojure.math.numeric-tower :only [expt]])
  (:use clojure.insepctor)
  (:use [clojure.walk :only [postwalk-replace]])

(def default-quantum-system
  {:amplitudes []
   :prior-probability 1
   :oracle-count 0
   :measurement-history ()
   :instruction-history ()
   :program ()})

(defn new-quantum-system
  [num-qubits]
  (let [num-amplitudes (expt 2 num-qubits)]
    (->> 0
      (repeat (dec num-amplitudes))
      (into [1])
      (assoc default-quantum-system :amplitudes))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;; LISP stuff  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(defn subst [to from col]
  (if (not (coll? col))
    (if (= col from) to col)
    (cons (subst to from (first col))
          (subst to from (next col)))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; quantum computer manipulation utilities

;; set-address-components
(defn set-address-components [qsys count qubits]
  "Sets amplitude-address to refer to a particular amplitude, as
indicated by the bits in the integer count."
  (dotimes [i (count qubits)]
    (replace (nth amplitude-address (nth i qubits))
          (if (bit-test count i) 1 0))))
               
; map-qubit-combinations
(defn map-qubit-combinations [qsys function qubits]
  "Calls function once for each of the 1/0 combinations of the provided
qubits, with the right-most qubit varying the fastest."
  (def qubits (reverse qubits))
  (let [number-of-iterations (Math/pow 2 (count qubits))]
    (dotimes [i number-of-iterations]
      (set-address-components qsys i qubits)
      (function))))

;; get-addressed-amplitude

(defn unless
	"Unless"
	[test-form form]
	(when (not test-form)
		(eval form)))
	
(defn get-addressed-amplitude
	"Returns the amplitude currently addressed by (amplitude-address qsys)"
	[qsys]
	(let [numerical-address (atom 0)]
		(dotimes [i (:number-of-qubits qsys)]
			(unless (zero? (nth (:amplitude-address qsys) i))
				(swap! numerical-address (+ numerical-address (Math/pow 2 i)))))
			(nth (:amplitudes qsys) @numerical-address)))

;; set-addressed-amplitude
(defn set-addressed-amplitude
	"Sets the amplitude currently addressed by (amplitude-address qsys) to new-value"
	[qsys new-value]
	(let [numerical-address (atom 0)]
		(dotimes [i (:number-of-qubits qsys)]
			(unless (zero? (nth (:amplitude-address qsys) i))
				(swap! numerical-address (+ numerical-address (Math/pow 2 i)))))
			(update-in qsys [:amplitudes] #(assoc % @numerical-address new-value)))))

;; matrix-multiply

;; extract-column

;; install-column

;; apply-operator

;; qc-output-probabilities

;; multi-qsys-output-probabilities
(defn multi-qsys-output-probabilities 
  "Returns a list of the probabilities for all combinations for the
given qubits, in binary order with the rightmost qubit varying fastest.
This function takes a LIST of quantum systems as input and sums the
results across all systems."
  [qsys-list qubits]
  (let ((probabilities
         (map (fn [qsys] 
                     (qc-output-probabilities qsys qubits))
                 qsys-list)))
    (labels ((add-lists (l1 l2) ;not sure how to translate this
               (if (nil? l1) 
                 nil
                 (cons (+ (first l1) (first l2))
                       (add-lists (rest l1) (rest l2))))))
      (reduce (doc add-lists probabilities)))))

;; expected-oracles 
(defn expected-oracles 
  "Returns the expected number of oracle calls for the given
set of quantum systems."
  [qsys-list]
  (reduce (doc +)
          (map (fn [qsys]
                      (* (prior-probability qsys)
                         (oracle-count qsys)))
                  qsys-list)))
    

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; oracle gates

(defn binary-operator-matrix 
  "Returns a matrix operator for a binary function with the
given tt-right-column as the right column of its truth table."
  [tt-right-column]
  (let [(column-length (length tt-right-column))
         (operator-size (* 2 column-length))
         (matrix (make-array (list operator-size operator-size)
                             :initial-element 0))]
    (dotimes (i column-length)
      (let ((offset (* i 2)))
        (if (zero? (nth i tt-right-column))
          (setf (aref matrix offset offset) 1
                (aref matrix (+ 1 offset) (+ 1 offset)) 1)
          (setf (aref matrix offset (+ 1 offset)) 1
                (aref matrix (+ 1 offset) offset) 1))))
    matrix))

(defn oracle 
  "Applies the oracle operator built from tt-right-column, which
is the right column of the corresponding truth table."
  [qsys tt-right-column & qubits]
  (incf (oracle-count qsys))
  (apply-operator
   qsys
   (binary-operator-matrix tt-right-column)
   qubits))

(defn limited-oracle 
  "If (oracle-count qsys) is less than max-calls then this applies 
the oracle operator built from tt-right-column, which is the right 
column of the corresponding truth table. Otherwise this does nothing."
  [qsys max-calls tt-right-column & qubits]
  (if (< (oracle-count qsys) max-calls)
    (progn (incf (oracle-count qsys)) ;The site I found suggests do, but I am not sure how to make that work - Mitchel
           (apply-operator
            qsys
            (binary-operator-matrix tt-right-column)
            qubits))
    qsys))



;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; other quantum gates

(defn qnot 
  "Quantum NOT gate"
  [qsys q]
  (apply-operator qsys 
                  '('(0 1)
                      '(1 0))
                  (list q)))


(defn cnot
  "Quantum Controlled NOT gate"
  [qsys q1 q2]
  (apply-operator qsys 
                  '('(1 0 0 0)
                      '(0 1 0 0)
                      '(0 0 0 1)
                      '(0 0 1 0))
                  (list q1 q2)))

(defn srn
  "Quantum Square-Root-of-NOT gate"
  [qsys q]
  (apply-operator
   qsys 
   (make-array '(2 2)
               :initial-contents 
               (list (list (/ 1 (Math/sqrt 2.0))  (- (/ 1 (Math/sqrt 2.0))))
                     (list (/ 1 (Math/sqrt 2.0))  (/ 1 (Math/sqrt 2.0)))
                     ))
   (list q)))

(defn nand 
  "Quantum NAND gate"
  [qsys q1 q2 q3]
  (apply-operator
   qsys 
   (binary-operator-matrix '(1 1 1 0))
   (list q1 q2 q3)))
   
;; hadamard gate
(defn hadamard
      "Quantum Hadamard gate"
      [qsys q]
      (apply-operator
	      qsys
	      (make-array '(2 2)
			  :initial-contents
			  (list (list (/ 1 (Math/sqrt 2.0)) (/ 1 (Math/sqrt 2.0)))
				(list (/ 1 (Math/sqrt 2.0)) (- (/ 1 (Math/sqrt 2.0))))))
      (list q)))

;; u-theta
(defn u-theta
      "Quantum U-theta (roration) gate"
      [qsys q theta]
      (apply-operator
	      qsys
	      (make-array '(2 2)
			  :initial-concents
			  (list (list (Math/cos theta) (Math/sin theta))
				(list (- (Math/sin theta)) (Math/cos theta))))
	      (list q)))

;; cphase
(defn cphase
      "Quantum conditional phase gate"
      [qsys q1 q2 alpha]
      (apply-operator
	      qsys
	      (make-array '(4 4)
			  :initial-contents
			  (list (list 1 0 0 0)
				(list 0 1 0 0)
				(list 0 0 1 0)
				(list 0 0 0 (Math/exp (* (Math/sqrt -1.0) alpha)))))
	      (list q1 q2)))

;; U2
(defn u2
      "Quantum U2 gate, implemented as:
      e^(i(-phi-psi+alpha))*cos(theta) e^(i(-phi+psi+alpha))*sin(-theta)
      e^(i(phi-psi+alpha))*sin(theta)   e^(i(phi+psi+alpha))*cos(theta)"
      [qsys q phi theta psi alpha]
      (apply-operator
	      qsys
	      (let [i (Math/sqrt -1.0)]
		   (make-array
			   '(2 2)
			   :initial-contents
			   (list (list (* (Math/exp (* i (+ (- phi) (- psi) alpha))) (Math/cos theta))
				       (* (Math/exp (* i (+ (- phi) psi alpha))) (Math/sin (- theta))))
				 (list (* (Math/exp (* i (+ phi (- psi) alpha))) (Math/sin theta))
				       (* (Math/exp (* i (+ phi psi alpha))) (Math/cos theta))))))
	      (list q)))

;;swap
(defn swap
      "A quantum gate that swaps the amplitudes for the two specified qubits"
      [qsys q1 q2]
      (apply-operator
	      qsys
	      (make-array '(4 4)
			  :initial-contents
			  (list (list 1 0 0 0)
				(list 0 0 1 0)
				(list 0 1 0 0)
				(list 0 0 0 1)))
	      (list q1 q2)))

;; printamps
(defn printamps
      "For use in quantum programs; causes the amplitudes of the executing quantum system to be printed."
      [qsys]
      (println (amplitudes qsys)
	       qsys))

;; insp
(defn insp
      "For use in quantum programs; causes the inspector to be invoked on the executing quantum system."
      [qsys]
      (inspect qsys)
      qsys)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; utilities for measurement and branching

(defn end 
  "Marks the end of a measurement branch; has no effect when used
in a quantum program in any other context." 
       [qsys]
  qsys)

(defn distance-to-next-unmatched-end 
  "Returns 0 if there is no unmatched (end) in list; otherwise returns
the number of instructions to the next unmatched (end) (counting the (end))."
  [list & 
   (num-measures 0) (num-ends 0) 
   (distance-so-far 0)]
  (if (nil? list) 
    0
    (if (= (ffirst list) 'end)
      (if (zero? num-measures)
        (+ 1 distance-so-far)
        (if (odd? num-ends) ;; then this one closes a measure
          (distance-to-next-unmatched-end (rest list)
                                          (- num-measures 1) (- num-ends 1)
                                          (+ 1 distance-so-far))
          (distance-to-next-unmatched-end (rest list)
                                          num-measures (+ num-ends 1) 
                                          (+ 1 distance-so-far))))
      (if (= (ffirst list) 'measure)
        (distance-to-next-unmatched-end (rest list)
                                        (+ num-measures 1) num-ends
                                        (+ 1 distance-so-far))
        (distance-to-next-unmatched-end (rest list)
                                        num-measures num-ends
                                        (+ 1 distance-so-far))))))

(defn without-if-branch 
  "Assuming that a MEASURE form has just been removed from the given
program, returns the remainder of the program without the IF (measure-1)
branch."
  [program]
  (let [(distance-to-first-unmatched-end 
          (distance-to-next-unmatched-end program))
         (distance-from-first-to-second-unmatched-end
          (distance-to-next-unmatched-end
           (nthcdr distance-to-first-unmatched-end program)))]
    (if (zero? distance-to-first-unmatched-end)
      ;; it's all the if part
      nil
      ;; there is some else part
      (if (zero? distance-from-first-to-second-unmatched-end)
        ;; the else never ends
        (subseq program distance-to-first-unmatched-end)
        ;; the else does end
        (concat (subseq program
                        distance-to-first-unmatched-end
                        (+ distance-to-first-unmatched-end
                           distance-from-first-to-second-unmatched-end
                           -1))
                (subseq program (+ distance-to-first-unmatched-end
                                   distance-from-first-to-second-unmatched-end
                                   )))))))

(defn without-else-branch 
  "Assuming that a MEASURE form has just been removed from the given
program, returns the remainder of the program without the ELSE (measure-0)
branch."
  [program]
  (let [(distance-to-first-unmatched-end 
          (distance-to-next-unmatched-end program))
         (distance-from-first-to-second-unmatched-end
          (distance-to-next-unmatched-end
           (nthcdr distance-to-first-unmatched-end program)))]
    (if (zero? distance-to-first-unmatched-end)
      ;; it's all the if part
      program
      ;; there is some else part
      (if (zero? distance-from-first-to-second-unmatched-end)
        ;; the else never ends
        (subseq program 0 (- distance-to-first-unmatched-end 1))
        ;; the else does end
        (concat (subseq program 0 (- distance-to-first-unmatched-end 1))
                (subseq program (+ distance-to-first-unmatched-end
                                   distance-from-first-to-second-unmatched-end
                                   )))))))
        
(comment
Test code for without-if-branch and without-else-branch:

(setq p1 '((foo) (bar) (end) (baz) (bingo) (end) (biff) (boff)))
(setq p2 '(  (foo) (bar) 
             (measure 0) (blink) (end) (blank) (end) 
           (end) 
             (baz) (bingo) 
             (measure 1) (plonk) (end) (plank) (end)
           (end) 
           (biff) (boff)))
(setq p3 '(  (foo) (bar) 
             (measure 0) (blink) (measure 0)(end)(end)(end) (blank) (end) 
           (end) 
             (baz) (bingo) 
             (measure 1) (plonk) (end) (plank) (measure 0)(end)(end)(end)
           (end) 
           (biff) (boff)))

(without-if-branch p1)
(without-if-branch p2)
(without-if-branch p3)
(without-else-branch p1)
(without-else-branch p2)
(without-else-branch p3)


(setq p4 '((end) (measure 1) (end) (end) (measure 1) (end)))
(without-if-branch p4)
(without-else-branch p4)
)

(defn force-to (measured-value qubit qsys)
  "Collapses a quantum system to the provided measured-value for the provided
qubit."
  (map-qubit-combinations
   qsys
   (fn []
       (let [(pre-column (extract-column qsys (list qubit))) ;Not sure what to do about the columns - Mitchel
              (new-column (case measured-value
                            (0 (list (first pre-column) 0))
                            (1 (list 0 (second pre-column)))))]
         (install-column qsys new-column (list qubit))))
   (remove qubit (qubit-numbers qsys)))
  qsys)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; top level functions
;;
;; are entirely untested, but should theoretically work
;;


(defn run-qsys [qsys]
  (if (or (empty? (:program qsys))
          (zero? (:prior-probability qsys)))
    (list qsys)
    (let [instruction (first (:program qsys))
          qsys (assoc qsys :instruction-history
                      (concat (:instruction-history qsys) (list instruction)))]
      (if (= (first instruction) 'halt)
        (list qsys)
        (if (= (first instruction) 'measure)
          (let [measurement-qubit (second instruction)
                probabilities (qc-output-probabilities qsys (list measurement-qubit))]
            (concat
              (run-qsys
                (force-to 1 mesurement-qubit
                          (make-qsys 
                            :number-of-qubits (:number-of-qubits qsys)
                            :amplitudes (:amplitudes qsys)
                            :prior-probability (second probabilities)
                            :oracle-count (:oracle-count qsys)
                            :measurement-history (concat (:measurement-history qsys)
                                                         (list (list measurement-history 
                                                                     'is 1)))
                            :instruction-history (:instruction-history qsys)
                            :program (without-if-branch (rest (:program qsys))))))
              (run-qsys
                (force-to 0 measurement-qubit
                          (make-qsys
                            :number-of-qubits (:number-of-qubits qsys)
                            :amplitudes (:amplitudes qsys)
                            :prior-probability (first probabilities)
                            :oracle-count (:oracle-count qsys)
                            :measurement-history (concat (:measurement-history qsys)
                                                         (list (list measurement-qubit
                                                                     'is 0)))
                            :instruction-history (:instruction-history qsys)
                            :program (without-if-branch (rest (:program qsys))))))))
          (let [resulting-sy (apply (first instruction) (cons qsys (rest instruction)))
                resulting-sys (assoc (:program resulting-sy) 
                                     (rest (:program resulting-sy)))]
            (run-qsys resulting-sys)))))))



(defn execute-quantum-program
  ([pgm num-qubits]
    (run-qsys (make-qsys
                :number-of-qubits num-qubits
                :program (subst nil 'ORACLE-TT pgm))))
  ([pgm num-qubits oracle-tt]
    (run-qsys (make-qsys
                :number-of-qubits num-qubits
                :program (subst oracle-tt 'ORACLE-TT pgm)))))
