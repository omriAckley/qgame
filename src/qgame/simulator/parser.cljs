(ns qgame.simulator.parser
  "Parses already-read strings into compilable objects."
  (:require [qgame.utils.math :as m :refer [eval-math-string]]
            [qgame.utils.general :as g :refer [anywhere?
                                               regex-join]]
            [clojure.string :as s :refer [split
                                          replace]])
  (:use [qgame.simulator.shared :only [*stage*
                                       canonical-functions]])
  (:require-macros [qgame.macros :as mac :refer [unless
                                                 if-let*]])
  (:use-macros [qgame.macros :only [error!]]))

(defn qubit-letter-to-index
  "Converts a qubit represented as a letter into a numerical index."
  [letter]
  (.indexOf "ABCDEFGHIJKLMNOPQRST" letter))

(defn match-only
  "Matches only if the entire string matches the given pattern."
  [pat s]
  (re-find (g/regex-join "^" pat "$") s))

(def word-pattern
  #"\b[a-zA-Z_]\w*\b")

(def math-string-pattern
  #"(?:\w*[\-.+*/^()]\w*)+")

(defn parse-forget-rule
  "Converts a bite into a parser name forget rule."
  [bite nm-target-text]
  (let [rule (assoc bite :type :Rule :forget true :name-target nm-target-text)
        target-is-word? (match-only word-pattern nm-target-text)]
    (if target-is-word?
      rule
      (error! "Target is not a word" rule))))

(defn parse-name-rule
  "Converts a bite into a parser name replace rule."
  [bite nm-text target-text]
  (let [rule (assoc bite :type :Rule :replace-name nm-text :target target-text)
        nm-is-word? (match-only word-pattern nm-text)]
    (if nm-is-word?
      rule
      (error! "Name is not a word" rule))))

(defn parse-bite
  "Converts a bite into either a token or a parser rule."
  [{text :text :as bite}]
  (if-let [[nm target] (mac/unless #(= (count %) 1)
                                   (s/split text #":" 2))]
    (if (= nm "forget")
      (parse-forget-rule bite target)
      (parse-name-rule bite nm target))
    (assoc bite :type :Token)))

(defn replace-word
  "Replaces all matches of a given word in string with target."
  [s word target]
  (let [word-pat (g/regex-join "\\b" word "\\b")]
    (s/replace s word-pat target)))

(defn replace-named
  "Replaces names in string based on all currently accumulated naming rules."
  [name-map s]
  (reduce-kv replace-word s name-map))

(defn safe-eval-math
  [s]
  (m/eval-math-string s))

(defn replace-math
  "Replaces any matched math with its evaluate."
  [s]
  (s/replace s math-string-pattern safe-eval-math))

(defn parser-execute-token
  "Executes parsing rules on the given token."
  [name-map token]
  (let [token* (->> token
                    :text
                    (replace-named name-map)
                    replace-math
                    (assoc token :post-rules))]
    [name-map token*]))

(defn parser-execute-rule
  "Executes parsing rules on the given rule."
  [name-map rule]
  (if (:forget rule)
    [(dissoc name-map (:name-target rule)) rule]
    (let [rule* (->> (:target rule)
                     (replace-named name-map)
                     replace-math
                     (assoc rule :target))
          entry ((juxt :replace-name :target) rule*)]
      [(conj name-map entry) rule*])))

(defn execute-parser-rules
  "Executes all parser rules on the given bites."
  [{:keys [name-map new-bites]} bite]
  (let [typed-bite (parse-bite bite)
        [name-map*
         bite*] (if (= :Token (:type typed-bite))
                  (parser-execute-token name-map typed-bite)
                  (parser-execute-rule name-map typed-bite))]
    {:name-map name-map*
     :new-bites (conj new-bites bite*)}))

(def qubit-pattern
  #"\b(?:[A-T]|1?[0-9])\b")

(defn parse-qubit
  "Converts a token to a qubit."
  [{post-rules :post-rules :as token}]
  (if-let [qubit-str (match-only qubit-pattern post-rules)]
    (let [qubit-val (mac/unless js/isNaN
                                (js/parseInt post-rules)
                                (qubit-letter-to-index qubit-str))]
      (assoc token :type :Qubit :value qubit-val))
    (error! "Qubit parse failure" token)))

(def param-pattern
  #"\b\d+\.?\d*\b")

(defn parse-param
  "Converts a token to a function parameter."
  [{post-rules :post-rules :as token}]
  (if-let [param-str (match-only param-pattern post-rules)]
    (assoc token :type :Param :value (js/parseFloat param-str))
    (error! "Param parse failure" token)))

(def bit-pattern
  #"\b[01]\b")

(defn parse-bit
  [{post-rules :post-rules :as token}]
  (if-let [bit-str (match-only bit-pattern post-rules)]
    (assoc token :type :Bit :value (get {"0" 0 "1" 1} bit-str))
    (error! "Bit parse failure" token)))

(defn taste
  "Parses any tokens with the given parse-with, spitting up non-tokens."
  [parse-with bite]
  (if-let [token (mac/unless #(not= :Token (:type %)) bite)]
    (parse-with token)
    (error! "Unrecognized argument" bite)))

(defn swallow
  "Attempts to parse n bites using parse-with. If successful, returns the cud and the now-remaining bites. Given no bound, continues to swallow bites until it encounters an error."
  ([parse-with bites]
   (let [swallowed (reduce (fn [swallowed bite]
                             (if-let [parsed (mac/unless :error (taste parse-with bite))]
                               (conj swallowed parsed)
                               (reduced swallowed)))
                           [] bites)]
     [swallowed (drop (count swallowed) bites)]))
  ([n parse-with bites]
   (if (zero? n)
     [() bites]
     (when (<= n (count bites))
       (let [[to-taste bites-] (split-at n bites)]
         [(map (partial taste parse-with) to-taste) bites-])))))

(defn package-parse-time
  [fnc bites]
  (if (= (get-in fnc [:fn-meta :name]) "with_oracle")
    (let [[swallowed bites-] (swallow parse-bit bites)
          oracle (apply (:caller fnc) (map :value swallowed))]
      (swap! canonical-functions assoc "oracle" oracle)
      [nil bites-])
    (error! "Uncrecognized parse time function" fnc)))

(defn package-expression
  "Given a function and following bites, attempts to package the function and all of its necessary arguments into an expression."
  [{:keys [num-qubits param-names] :as fnc} bites]
  (if (= :ParseTime (get-in fnc [:fn-meta :type]))
    (package-parse-time fnc bites)
    (mac/if-let* [[qubits bites-] (swallow num-qubits parse-qubit bites)
                  [params bites--] (swallow (count param-names) parse-param bites-)]
                 (let [expression (assoc fnc :type :Expression
                                    :qubits qubits
                                    :params params)]
                   [expression bites--])
                 (error! "Too few parameters"
                         (assoc fnc :type :Expression :swallowed bites)))))

(defn parse-expressions
  "Recursively packages expressions until no more bites remain."
  ([bites]
   (parse-expressions [] bites))
  ([new-program [bite & remaining :as bites]]
   (if (empty? bites)
     new-program
     (let [[new-program* remaining*]
           (if-let [token (mac/unless #(not= :Token (:type %)) bite)]
             (if-let [fnc (->> token :post-rules (get @canonical-functions))]
               (let [fnc+ (merge token fnc)
                     [expression remaining-] (package-expression fnc+ remaining)]
                 [(conj new-program expression) remaining-])
               [(conj new-program (error! "Lonely" token)) remaining])
             [new-program remaining])]
       (recur new-program* remaining*)))))

(defn errant
  "Predicate for testing whether an expression has any errors, even nested errors."
  [expression]
  (g/anywhere? (every-pred map? :error)
               expression))

(defn wrap-up
  "Wraps up the parsing stage."
  [program]
  (remove errant program))

(defn parse
  "Converts an already-read program into a compilable list of expressions."
  [program]
  (binding [*stage* "Parsing"]
    (->> program
         (reduce execute-parser-rules
                 {:name-map {} :new-bites []})
         :new-bites
         parse-expressions
         wrap-up)))
