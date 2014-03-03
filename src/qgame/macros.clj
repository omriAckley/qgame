(ns qgame.macros
  "Separate macro namespace.")

(defmacro unless
  "If (pred then) returns true, returns else, else returns then."
  ([pred then]
   `(unless ~pred ~then nil))
  ([pred then else]
   `(if (~pred ~then)
      ~else
      ~then)))

(defn- bit-size
  "Given some positive integer x, gives the number of bits needed to represent it."
  [x]
  (loop [n 1]
    (if (<= x (bit-shift-left 1 n))
      n
      (recur (inc n)))))

(defmacro defn-qgate
  "Expects zero or more named args that are used to calculate the gate matrix. It expands to define a function that takes amplitudes, those named args, and some number of qubits, and outputs amplitudes updated by applying the gate matrix as an operator."
  [nm param-names matrix]
  `(defn ~nm [amplitudes# ~'& runtime-args#]
     (let [split-point# (- (count runtime-args#) ~(count param-names))
           [qubits#
            ~param-names] (split-at split-point# runtime-args#)]
       (qgame.interpreter.qgates/apply-operator amplitudes#
                                                (qgame.interpreter.qgates/to-operator ~matrix)
                                                qubits#))))

(defmacro get-repl-listen-port
  "Gets the cljsbuild repl listen port (as a string, not a number) at compile time. Defaults to \"9000\"."
  []
  (let [proj-string (slurp "project.clj")
        port (->> proj-string
                  (re-find #":repl-listen-port\s+\d+(?=\b)")
                  (re-find #"\d+"))]
    (unless nil? port "9000")))