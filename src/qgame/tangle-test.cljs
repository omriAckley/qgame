(ns tangle-test
  (:require [qgame.utils.general :as g]
            [qgame.utils.math :as m]
            [qgame.utils.amplitudes :as a]))

(doseq [case [{:description "|UU>+|DD>"
               :amplitudes [0.70711 0 0 0.70711]}
              {:description "|UU>+|UD>+|DU>+|DD>"
               :amplitudes [0.5 0.5 0.5 0.5]}
              {:description "|UD>+|DU>"
               :amplitudes [0 0.70711 0.70711 0]}
              #_{:description "||UU>+|DD>>+||UU>+|UD>+|DU>+|DD>>"
               :amplitudes [0.61237 0.35355 0.35355 0.61237]}
              {:description "|UUU>+|UUD>+|DDU>+|DDD>"
               :amplitudes [0.5 0.5 0 0 0 0 0.5 0.5]}
              {:description "|UUU>+|DDD>"
               :amplitudes [0.70711 0 0 0 0 0 0 0.70711]}
              #_{:description "||UUU>+|UUD>+|DDU>+|DDD>>+||UUU>+|UUD>+|UDU>+|UDD>+|DUU>+|DUD>+|DDU>+|DDD>>"
               :amplitudes [0.43301 0.43301 0.25 0.25 0.25 0.25 0.43301 0.43301]}
              {:description "|UUUU>+|UUUD>+|UUDU>+|UUDD>+|DDUU>+|DDUD>+|DDDU>+|DDDD>"
               :amplitudes [0.35355 0.35355 0.35355 0.35355 0 0 0 0 0 0 0 0 0.35355 0.35355 0.35355 0.35355]}
              {:description "|UUUU>+|DDDD>"
               :amplitudes [0.70711 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.70711]}
              {:description "|UUUU>+|UUDD>+|DDUU>+|DDDD>"
               :amplitudes [0.5 0 0 0.5 0 0 0 0 0 0 0 0 0.5 0 0 0.5]}
              #_{:description "||UUUU>+|UUUD>+|UUDU>+|UUDD>+|DDUU>+|DDUD>+|DDDU>+|DDDD>>+||UUUU>+|UDUU>+|DUUU>+|DDUU>+|UUDD>+|UDDD>+|DUDD>+|DDDD>>"
               :amplitudes [0.35355 0.25 0.25 0.35355 0.25 0 0 0.25 0.25 0 0 0.25 0.35355 0.25 0.25 0.35355]}]
        :let [{amplitudes :amplitudes description :description} case
              n (g/bit-size (count amplitudes))
              to-letter (fn [qubit-index]
                          (nth "ABCDEFGHIJKLMNOPQRST" qubit-index))
              get-pairs (fn [coll]
                          (for [[a & remaining] (take (count coll) (iterate rest coll))
                                b remaining]
                            [a b]))]]
  (println "\nCase : " description)
  (doseq [pair (get-pairs (reverse (range n)))
          :let [letters (mapv #(to-letter (- (dec n) %))
                              pair)
                tangle (apply a/tangle-of case pair)]]
    (println "\n" letters ":" tangle))
  (println "\n"))