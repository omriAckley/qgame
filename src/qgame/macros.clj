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

(defmacro def-qgate
  "Expects zero or more named params that are used to calculate the gate matrix. It expands to define a function that takes amplitudes, those named params, and some number of qubits, and outputs amplitudes updated by applying the gate matrix as an operator."
  [nm param-names matrix]
  `(let [dummy-matrix# ~(if (empty? param-names)
                          matrix
                          `(let [~param-names (repeat 1)] ~matrix))
         num-qubits# (qgame.utils.general/bit-size (count dummy-matrix#))]
     (def ~nm
       {:fn-meta {:type :QGate
                  :name ~(str nm)}
        :caller (fn [amplitudes# ~'& runtime-args#]
                  (let [[qubits# 
                         ~param-names] (split-at num-qubits# runtime-args#)]
                    (qgame.simulator.qgates/apply-operator amplitudes#
                                                           (qgame.simulator.qgates/to-operator ~matrix)
                                                           qubits#)))
        :num-qubits num-qubits#
        :param-names '~param-names
        :matrix-body '~matrix})))

(defmacro get-repl-listen-port
  "Gets the cljsbuild repl listen port (as a string, not a number) at compile time. Defaults to \"9000\"."
  []
  (let [proj-string (slurp "project.clj")
        port (->> proj-string
                  (re-find #":repl-listen-port\s+\d+(?=\b)")
                  (re-find #"\d+"))]
    (unless nil? port "9000")))

(defmacro if-let*
  "Like if-let, but with multiple forms. Assumes a shared else clause between the various tests."
  [[nm value & remaining :as binding-vector] then else]
  (if (empty? binding-vector)
    then
    `(if-let ~[nm value]
       (if-let* ~remaining ~then ~else)
       ~else)))

(defmacro error!
  "Expands to an a log-and-return-error! call with the added dynamic context of the current calling function, or rather the function in which this macro expands."
  [& body]
  `(binding [qgame.simulator.shared/*current-fn* ~'js/arguments.callee.name]
     (qgame.simulator.error/log-and-return-error! ~@body)))

(defmacro warn!
  "Expands to an a log-and-return-warning! call with the added dynamic context of the current calling function, or rather the function in which this macro expands."
  [& body]
  `(binding [qgame.simulator.shared/*current-fn* ~'js/arguments.callee.name]
     (qgame.simulator.error/log-and-return-warning! ~@body)))
