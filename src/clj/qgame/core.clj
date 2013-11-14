(ns qgame.core
  (:require [ring.adapter.jetty :as jetty]
            [ring.middleware.resource :as resources]
            [ring.util.response :as response])
  (:use (clojure.inspector))
  (:gen-class))

(defn render-app []
  {:status 200
   :headers {"Content-Type" "text/html"}
   :body
   (str "<!DOCTYPE html>"
        "<html>"
        "<head>"
        "<link rel=\"stylesheet\" href=\"css/page.css\" />"
        "</head>"
        "<body>"
        "<div>"
        "<p id=\"clickable\">Click me!</p>"
        "</div>"
        "<script src=\"js/cljs.js\"></script>"
        "</body>"
        "</html>")})

(defn handler [request]
  (if (= "/" (:uri request))
      (response/redirect "/help.html")
      (render-app)))

(def app 
  (-> handler
    (resources/wrap-resource "public")))

(defn -main [& args]
  (jetty/run-jetty app {:port 3000}))

(defn expt
  "Lifted from clojure.math.numeric-tower"
  [base pow]
  (loop [n pow y (num 1) z base]
    (let [t (even? n) n (quot n 2)]
      (cond
        t (recur n y (* z z))
        (zero? n) (* z y)
        :else (recur n (* z y) (* z z))))))


(def default-quantum-system
  {:amplitudes []
   :prior-probability 1
   :oracle-count 0
   :measurement-history ()
   :instruction-history ()
   :program ()
   :number-of-qubits 1})


(defn new-quantum-system
  [num-qubits]
  (let [num-amplitudes (expt 2 num-qubits)]
    (assoc default-quantum-system
           :amplitudes (into [1] (repeat (dec num-amplitudes) 0))
           :number-of-qubits num-qubits)))


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

;; expected-oracles



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
			  (list (list (/ 1 (Math/sqrt 2.0L0)) (/ 1 (Math/sqrt 2.0L0)))
				(list (/ 1 (Math/sqrt 2.0L0)) (- (/ 1 (Math/sqrt 2.0L0))))))
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


