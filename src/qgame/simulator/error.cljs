(ns qgame.simulator.error
  (:require [qgame.simulator.parser :as p :refer [qubit-pattern
                                                  param-pattern
                                                  word-pattern
                                                  bit-pattern]])
  (:use [qgame.simulator.shared :only [*stage*
                                       *current-qgame-fn*]]))

(defmulti get-message
  (fn [title context] title))

(defn to-error
  [title context]
  (assoc context :error
    {:stage *stage*
     :current-qgame-fn *current-qgame-fn*
     :title title
     :message (get-message title context)}))

(defn log-and-return-error!
  ([title]
   (log-and-return-error! title {}))
  ([title context]
   (let [{{:keys [stage current-qgame-fn title message]} :error :as context+}
         (to-error title context)]
     (js/console.log "qgame error during " stage ", in qgame function " current-qgame-fn ": " title "\n" message)
     (js/console.log "More context..." (clj->js context+))
     context+)))

(defn to-warning
  [title context]
  (assoc context :warning
    {:stage *stage*
     :current-qgame-fn *current-qgame-fn*
     :title title
     :message (get-message title context)}))

(defn log-and-return-warning!
  ([title]
   (log-and-return-warning! title {}))
  ([title context]
   (let [{{:keys [stage current-qgame-fn title message]} :warning :as context+}
         (to-warning title context)]
     (js/console.log "qgame error warning " stage ", in qgame function " current-qgame-fn ": " title "\n" message)
     (js/console.log "More context..." (clj->js context+))
     context+)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;Error messages

(defmethod get-message "Qubit parse failure"
  [title bite]
  (str "Token " (:text bite) " does not match the qubit regex pattern: " (str p/qubit-pattern)))

(defmethod get-message "Param parse failure"
  [title bite]
  (str "Token " (:text bite) " does not match the param regex pattern: " (str p/param-pattern)))

(defmethod get-message "Unrecognized argument"
  [title bite]
  (str "Bite " (:text bite) " does not taste like a token."))

(defmethod get-message "Too few parameters"
  [title expression]
  (let [{:keys [fn-name num-qubits param-names swallowed]} expression]
    (str "Function " fn-name " requires " (+ num-qubits (count param-names))
         " arguments, swallowed only " (count swallowed) ".")))

(defmethod get-message "Lonely"
  [title token]
  (str "Token " (:text token) " is neither function nor an argument to a function."))

(defmethod get-message "Target is not a word"
  [title rule]
  (str "Target " (:name-target rule) " does not match the word regex pattern: " (str p/word-pattern)))

(defmethod get-message "Name is not a word"
  [title rule]
  (str "Name " (:replace-name rule) " does not match the word regex pattern: " (str p/world-pattern)))

(defmethod get-message "Uncrecognized parse time function"
  [title fnc]
  (str "Text " (:text fnc) "is not a recognized parse time function, despite having the :ParseTime function type."))

(defmethod get-message "Bit parse failure"
  [title token]
  (str "Token " (:text token) " does not match the bit regex pattern:" (str p/bit-pattern)))

(defmethod get-message "Unrecognized function type"
  [title instruction]
  (str "Function type " (get-in instruction [:fn-meta :type]) " has no execution specs."))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;Warning messages

(defmethod get-message "Extra end"
  [title expression]
  (str "Encountered an extra 'end' instruction."))

(defmethod get-message "Lingering status"
  [title {status :status}]
  (case status
    "then_clause" "Some 'measure' missing two 'end's"
    "else_clause" "Some 'measure' missing an 'end'"
    (str status)))
