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
    

(defn to-binary [num] ; not two's complement binary representation of num
  (loop [ret [] idx 0 en (Math/abs num)]; used internally by logbitp
    (let [numy (bit-shift-right en idx)]
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

