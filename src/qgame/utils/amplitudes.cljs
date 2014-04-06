(ns qgame.utils.amplitudes
  "Various functions for working with amplitudes."
  (:require [qgame.utils.math :as m :refer [abs
                                            add
                                            subtract
                                            multiply
                                            pow
                                            to-phase
                                            det
                                            complex-conjugate
                                            conjugate-transpose
                                            eigenvalues
                                            round]]
            [qgame.utils.general :as g :refer [bit-size
                                               itermap]]))

(defn get-num-qubits
  "Given the amplitudes (or any collection of equal length), returns the number of qubits in the system."
  [amplitudes]
  (g/bit-size (count amplitudes)))

(defn amplitude-to-probability
  "Converts an amplitude to its probability by doing |a|^2."
  [amplitude]
  (let [abs-val (m/abs amplitude)]
    (m/multiply abs-val abs-val)))

(defn amplitudes-to-probability
  "Converts a list of amplitudes to a single probability by summing together all the sub-probabilities."
  [amplitudes]
  (reduce + (map amplitude-to-probability amplitudes)))

(defn qubits-to-amplitude-indices
  "Given which qubits should be involved in a computation, determines the appropriate amplitude indices to be affected."
  [qubits tot-num-qubits]
  (let [excluded-qubits (remove (reduce conj #{} qubits) ;Qubits cannot directly be cast into a set because of a bug when it is initially an RSeq
                                (range tot-num-qubits))]
    (for [seed-index (g/itermap bit-flip [0] excluded-qubits)]
      (g/itermap bit-flip [seed-index] qubits))))

(defn qubit-state-amplitudes
  "Gets the amplitudes for a particular qubit in a particular binary state."
  [amplitudes qubit binary-state]
  (let [excluded-qubits (remove #{qubit}
                                (range (get-num-qubits amplitudes)))
        seed-index (* binary-state (bit-set 0 qubit))
        indices (g/itermap bit-flip [seed-index] excluded-qubits)]
    (map (partial get amplitudes) indices)))

(defn probability-of
  "Given some quantum system, a qubit, and a binary state, returns the current probability of finding that qubit in that binary state."
  [{amplitudes :amplitudes} qubit binary-state]
  (let [sub-amplitudes (qubit-state-amplitudes amplitudes qubit binary-state)]
    (amplitudes-to-probability sub-amplitudes)))

(defn phase-of
  "Given some quantum system, a qubit, and a binary state, returns the current phase of that qubit's state's amplitude."
  [{amplitudes :amplitudes} qubit binary-state]
  (let [sub-amplitudes (qubit-state-amplitudes amplitudes qubit binary-state)
        amplitude (reduce m/add sub-amplitudes)]
    (to-phase amplitude)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(defn substate-to-index
  [substate]
  (reduce-kv (fn [idx qubit state]
               (if (zero? state)
                 idx
                 (bit-flip idx qubit)))
             0
             substate))

(defn combine
  [amplitudes substate substate*]
  (let [idx (substate-to-index substate)
        idx* (substate-to-index substate*)
        amp (get amplitudes idx)
        amp* (m/complex-conjugate (get amplitudes idx*))]
    (m/multiply amp amp*)))

(defn all-combinations
  [qubits]
  (let [all-zero-state (zipmap qubits (repeat 0))
        all-one-state (zipmap qubits (repeat 1))]
    (g/itermap conj [all-zero-state] all-one-state)))

(defn reduced-entry
  [amplitudes partial-substate partial-substate* excluded-qubits]
  (let [sub-amplitudes (for [remaining-substate (all-combinations excluded-qubits)]
                         (combine amplitudes
                                  (merge partial-substate remaining-substate)
                                  (merge partial-substate* remaining-substate)))]
    (reduce m/add sub-amplitudes)))

(defn reduced-density-matrix
  [amplitudes qubits]
  (let [all-combinations (all-combinations qubits)
        excluded-qubits (remove (set qubits)
                                (range (get-num-qubits amplitudes)))]
    (for [row all-combinations]
      (for [col all-combinations]
        (reduced-entry amplitudes row col excluded-qubits)))))

(defn spin-flip
  [density-matrix]
  (let [flipper [[0 0 0 -1]
                 [0 0 1 0]
                 [0 1 0 0]
                 [-1 0 0 0]]
        rho-ab* (m/conjugate-transpose density-matrix)]
    (m/multiply (m/multiply flipper rho-ab*)
                flipper)))

(defn tangle-of
  [{amplitudes :amplitudes} qubit-a qubit-b]
  (let [rho-ab (reduced-density-matrix amplitudes [qubit-a qubit-b])
        spin-flipped (spin-flip rho-ab)
        tangle-mat (m/multiply rho-ab spin-flipped)
        eigenvals (m/eigenvalues tangle-mat)
        lambdas (sort #(> (.-re %1) (.-re %2))
                      (m/sqrt eigenvals))
        diff (reduce m/subtract lambdas)
        tangle (m/pow (max diff 0) 2)]
    (m/abs (m/round tangle 8))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;#_(defn substate-amplitudes
;  "Given a particular substate, a particular combination of states of qubits, returns all amplitudes for which that combination is present."
;  [amplitudes substate]
;  (let [qubits (keys substate)
;        excluded-qubits (remove (set qubits)
;                                (range (get-num-qubits amplitudes)))
;        flip-digits (keep (fn [[qubit state]]
;                            (when-not (zero? state) qubit))
;                          substate)
;        seed-index (reduce bit-flip 0 flip-digits)
;        indices (g/itermap bit-flip [seed-index] excluded-qubits)]
;    (map (partial get amplitudes) indices)))
;
;#_(defn inner-amplitudes
;  "Gets the lists of sub-amplitudes for a sub-system comprising the given qubits. For each combination of states of the given qubits, returns all amplitudes for which that combination is present."
;  [global-amplitudes qubits]
;  (let [all-zero-state (zipmap qubits (repeat 0))
;        all-one-state (zipmap qubits (repeat 1))
;        all-combinations (g/itermap conj [all-zero-state] all-one-state)]
;    (mapv (partial substate-amplitudes global-amplitudes) all-combinations)))
;
;#_(defn self-conj-outer-prod
;  "Returns the outer product of amplitudes and its conjugate transpose."
;  [amplitudes]
;  (let [ket (mapv vector amplitudes)
;        bra (m/conjugate-transpose ket)]
;    (m/multiply ket bra)))
;
;#_(defn mangled-mean-step
;  [accumulated to-incorporate]
;  (let [weight (amplitudes-to-probability to-incorporate)]
;    (mapv (fn [amp new-amp]
;            (->> (/ weight 2) js.Math.log (/ (js/Math.log 2)) - (* weight)
;                 (js/Math.pow new-amp)
;                 (* amp)))
;          accumulated
;          to-incorporate)))
;
;#_(defn get-pairs
;  [coll]
;  (for [[a & remaining] (take (count coll) (iterate rest coll))
;        b remaining]
;    [a b]))
;
;#_(defn to-letter
;  [qubit-index]
;  (nth "ABCDEFGHIJKLMNOPQRST" qubit-index))
;
;#_(defn reduced-density-matrix
;  [amplitudes qubits]
;  (let [inner-amps (inner-amplitudes amplitudes qubits)
;        inner-amps* (apply mapv vector inner-amps)
;        means (reduce mangled-mean-step
;                      (repeat (count inner-amps) 1)
;                      inner-amps*)]
;    (self-conj-outer-prod means)))
;
;#_(defn tangle-of
;  [{amplitudes :amplitudes} qubit-a qubit-b]
;  (let [rho-ab (reduced-density-matrix amplitudes [qubit-a qubit-b])
;        [[a1 _ b1 _]
;         [_ a2 _ b2]
;         [c1 _ d1 _]
;         [_ c2 _ d2]] rho-ab
;        rho-a [[(+ a1 a2) (+ b1 b2)]
;               [(+ c1 c2) (+ d1 d2)]]]
;    (* 4 (m/det rho-a))))
;
;#_(doseq [case [{:description "|UU>+|DD>"
;               :amplitudes [0.70711 0 0 0.70711]}
;              {:description "|UU>+|UD>+|DU>+|DD>"
;               :amplitudes [0.5 0.5 0.5 0.5]}
;              {:description "|UD>+|DU>"
;               :amplitudes [0 0.70711 0.70711 0]}
;              {:description "||UU>+|DD>>+||UU>+|UD>+|DU>+|DD>>"
;               :amplitudes [0.61237 0.35355 0.35355 0.61237]}
;              {:description "|UUU>+|UUD>+|DDU>+|UUD>"
;               :amplitudes [0.5 0.5 0 0 0 0 0.5 0.5]}
;              {:description "|UUU>+|DDD>"
;               :amplitudes [0.70711 0 0 0 0 0 0 0.70711]}
;              {:description "||UUU>+|UUD>+|DDU>+|DDD>>+||UUU>+|UUD>+|UDU>+|UDD>+|DUU>+|DUD>+|DDU>+|DDD>>"
;               :amplitudes [0.43301 0.43301 0.25 0.25 0.25 0.25 0.43301 0.43301]}
;              {:description "|UUUU>+|UUUD>+|UUDU>+|UUDD>+|DDUU>+|DDUD>+|DDDU>+|DDDD>"
;               :amplitudes [0.35355 0.35355 0.35355 0.35355 0 0 0 0 0 0 0 0 0.35355 0.35355 0.35355 0.35355]}
;              {:description "|UUUU>+|DDDD>"
;               :amplitudes [0.70711 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.70711]}
;              {:description "|UUUU>+|UUDD>+|DDUU>+|DDDD>"
;               :amplitudes [0.5 0 0 0.5 0 0 0 0 0 0 0 0 0.5 0 0 0.5]}
;              {:description "||UUUU>+|UUUD>+|UUDU>+|UUDD>+|DDUU>+|DDUD>+|DDDU>+|DDDD>>+||UUUU>+|UDUU>+|DUUU>+|DDUU>+|UUDD>+|UDDD>+|DUDD>+|DDDD>>"
;               :amplitudes [0.35355 0.25 0.25 0.35355 0.25 0 0 0.25 0.25 0 0 0.25 0.35355 0.25 0.25 0.35355]}]
;        :let [{amplitudes :amplitudes description :description} case
;              n (g/bit-size (count amplitudes))]]
;  (println "\nCase : " description)
;  (doseq [pair (get-pairs (reverse (range n)))
;          :let [letters (mapv #(to-letter (- (dec n) %))
;                              pair)
;                tangle (apply tangle-of case pair)]]
;    (println "\n" letters ":" tangle))
;  (println "\n"))
;
;#_(doseq [case [{:description "|UU>+|DD>"
;               :amps [0.70711 0 0 0.70711]}
;              {:description "|UU>+|UD>+|DU>+|DD>"
;               :amps [0.5 0.5 0.5 0.5]}
;              {:description "|UD>+|DU>"
;               :amps [0 0.70711 0.70711 0]}
;              {:description "||UU>+|DD>>+||UU>+|UD>+|DU>+|DD>>"
;               :amps [0.61237 0.35355 0.35355 0.61237]}
;              {:description "||UU>+|DD>>+||UU>+|UD>+|DU>+|DD>>"
;               :amps [0.65331 0.27053 0.27053 0.65331]}
;              {:description "|UUU>+|UUD>+|DDU>+|UUD>"
;               :amps [0.5 0.5 0 0 0 0 0.5 0.5]}
;              {:description "|UUU>+|DDD>"
;               :amps [0.70711 0 0 0 0 0 0 0.70711]}
;              {:description "||UUU>+|UUD>+|DDU>+|DDD>>+||UUU>+|UUD>+|UDU>+|UDD>+|DUU>+|DUD>+|DDU>+|DDD>>"
;               :amps [0.43301 0.43301 0.25 0.25 0.25 0.25 0.43301 0.43301]}
;              {:description "||UUU>+|UUD>+|DDU>+|DDD>>+||UUU>+|DUU>+|UDD>+|DDD>>+||UUU>+|UDU>+|DUD>+|DDD>>"
;               :amps [0.5 0.16666 0.288675 0.288675 0.288675 0.288675 0.16666 0.5]}
;              {:description "|UUUU>+|UUUD>+|UUDU>+|UUDD>+|DDUU>+|DDUD>+|DDDU>+|DDDD>"
;               :amps [0.35355 0.35355 0.35355 0.35355 0 0 0 0 0 0 0 0 0.35355 0.35355 0.35355 0.35355]}
;              {:description "|UUUU>+|DDDD>"
;               :amps [0.70711 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.70711]}
;              {:description "|UUUU>+|UUDD>+|DDUU>+|DDDD>"
;               :amps [0.5 0 0 0.5 0 0 0 0 0 0 0 0 0.5 0 0 0.5]}
;              {:description "||UUUU>+|UUUD>+|UUDU>+|UUDD>+|DDUU>+|DDUD>+|DDDU>+|DDDD>>+||UUUU>+|UDUU>+|DUUU>+|DDUU>+|UUDD>+|UDDD>+|DUDD>+|DDDD>>"
;               :amps [0.35355 0.25 0.25 0.35355 0.25 0 0 0.25 0.25 0 0 0.25 0.35355 0.25 0.25 0.35355]}]
;        :let [{amplitudes :amps description :description} case
;              n (g/bit-size (count amplitudes))
;              weird-mean (fn [accumulated to-incorporate]
;                           (let [weight (a/amplitudes-to-probability to-incorporate)]
;                             #_(println "\n**" weight "**")
;                             (mapv (fn [amp new-amp]
;                                     #_(println "\n****" amp)
;                                     #_(println "\n****" new-amp)
;                                     #_(* amp (js/Math.pow new-amp (/ weight (dec n))))
;                                     #_(+ amp (js/Math.pow new-amp 2))
;                                     (* amp (js/Math.pow new-amp (* weight
;                                                                    (- (/ (js/Math.log 2)
;                                                                          (js/Math.log (/ weight 2))))))))
;                                   accumulated
;                                   to-incorporate)))
;              qubit-combinations (for [[a & remaining] (take n (iterate rest (reverse (range n))))
;                                       b remaining]
;                                   [a b])]]
;  (println "\nCase :" description)
;  (doseq [pair qubit-combinations
;          :let [letters (mapv (fn [index] (nth "ABCDEFGHIJKLMNOPQRST" (- (dec n) index))) pair)
;                inner-amps (a/inner-amplitudes amplitudes pair)
;                inner-amps* (apply mapv vector inner-amps)
;                means (reduce weird-mean
;                              [1 1 1 1]
;                              inner-amps*)
;                means* (do #_(mapv js/Math.sqrt means)
;                         means)
;                rho-ab (a/self-conj-outer-prod means*)
;                [[a1 _ b1 _]
;                 [_ a2 _ b2]
;                 [c1 _ d1 _]
;                 [_ c2 _ d2]] rho-ab
;                rho-a [[(+ a1 a2) (+ b1 b2)]
;                       [(+ c1 c2) (+ d1 d2)]]
;                tangle (* 4 (m/det rho-a))]]
;    (println "\n" letters ":" tangle))
;  (println "\n"))
;
;#_(defn density-matrix
;  "Returns a reduced density matrix of the ampltiudes for the given qubits. This is a kind of 'local amplitudes', scoped to the given qubits, and as such is re-ordered to be in the same order they appear as arguments here."
;  [amplitudes qubits]
;  (let [inner-amps (inner-amplitudes amplitudes qubits)
;        sub-amplitudes (mapv amplitudes-to-probability inner-amps)]
;    (self-conj-outer-prod sub-amplitudes)))
;
;#_(defn weighted-geo-mean-step
;  ([to-incorporate]
;   (weighted-geo-mean-step (repeat (count to-incorporate) 0)
;                  to-incorporate))
;  ([accumulated to-incorporate]
;   (let [weight (amplitudes-to-probability to-incorporate)]
;     (mapv (fn [amp new-amp]
;             (+ amp (if (= weight 0) 0 (* weight (js/Math.log new-amp)))))
;           accumulated
;           to-incorporate))))
;
;#_(defn tangle-of
;  "Given a quantum system and two qubits (the order should not matter), returns the tangle, a number between 0 and 1."
;  [{amplitudes :amplitudes} qubit-a qubit-b]
;  (let [rho-ab (density-matrix amplitudes [qubit-a qubit-b])
;        top-left-quadrant (mapv #(subvec % 0 2) (subvec rho-ab 0 2))
;        bottom-right-quadrant (mapv #(subvec % 2) (subvec rho-ab 2))
;        rho-a (m/add top-left-quadrant bottom-right-quadrant)]
;    (* 4 (m/det rho-a))))
;
;#_(defn tangle-of
;  [{amplitudes :amplitudes} qubit-a qubit-b]
;  (let [inner-amps (inner-amplitudes amplitudes [qubit-a qubit-b])
;        inner-amps* (apply mapv vector inner-amps)
;        geo-means (reduce weighted-geo-mean-step
;                          (weighted-geo-mean-step (first inner-amps*))
;                          (rest inner-amps*))
;        rho-ab (self-conj-outer-prod geo-means)
;        [[a1 _ b1 _]
;         [_ a2 _ b2]
;         [c1 _ d1 _]
;         [_ c2 _ d2]] rho-ab
;        rho-a [[(+ a1 a2) (+ b1 b2)]
;               [(+ c1 c2) (+ d1 d2)]]]
;    (* 4 (m/det rho-a))))
