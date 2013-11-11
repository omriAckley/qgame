(ns qgame.core
  (:require [ring.adapter.jetty :as jetty]
            [ring.middleware.resource :as resources]
            [ring.util.response :as response])
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
   :program ()})

(defn new-quantum-system
  [num-qubits]
  (let [num-amplitudes (expt 2 num-qubits)]
    (assoc default-quantum-system
           :amplitudes (into [1] (repeat (dec num-amplitudes) 0)))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;; binary stuff  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(defn twos-compliment [num]
  (loop [v (into [] (map false? num)) idx 0]
    (if (false? (nth v idx))
      (lazy-cat (assoc v idx true) (repeat true))
      (recur
        (assoc v idx false)
        (+ 1 idx)))))
    

(defn to-binary [num] ; two's complement binary representation of num
  (loop [ret [] idx 0 en (Math/abs num)]; used internally by logbitp
    (let [numy (bit-shift-right en idx)]; is an infinite sequence, don't index in without (take)
      (if (= 0 numy)
        (if (< num 0)
          (twos-compliment (reverse ret))
          (lazy-cat (reverse ret) (repeat false)))
        (recur
          (cons (= 1 (bit-and 1 numy)) ret)
          (+ 1 idx)
          en)))))


(defn logbitp [index integer]
  (nth (to-binary integer) index))


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
