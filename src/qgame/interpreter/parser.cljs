(ns qgame.interpreter.parser
  "Parses strings and programs, outputting something the interpreter core can run."
  (:require [qgame.interpreter.warning :as w :refer [warn!]]
            [cljs.reader :as r :refer [read-string]]))

(defn parse-instruction
  "Outputs an instruction, changing an '(end) to an '(else) when the head of the open-branches is a \"then_clause\"."
  [[i-sym :as instruction]
   [current]]
  (if (= 'end i-sym)
    (case current
      "then_clause" '(else)
      "else_clause" '(end))
    instruction))

(defn revise-on-end
  "Revises the open branches for when the current instruction is '(end)."
  [[current & remaining :as open-branches]]
  (if (empty? open-branches)
    (do (w/warn! :parsing :extra-end)
      open-branches)
    (case current
      "then_clause" (cons "else_clause" remaining)
      "else_clause" remaining)))

(defn revise
  "Revises the open branches based on the current instruction symbol."
  [open-branches [i-sym]]
  (case i-sym
    measure (cons "then_clause" open-branches)
    else (cons "else_clause" (rest open-branches))
    end (revise-on-end open-branches)
    open-branches))

(defn parse-program
  "Converts a program, a list of instructions, in '((measure)...(end)...(end)) syntax to '((measure)...(else)...(end)) syntax."
  [program]
  (loop [open-branches ()
         parsed-program []
         [instruction & remaining :as unparsed] program]
    (if (empty? unparsed)
      (do (doseq [status open-branches]
            (w/warn! :parsing :lingering-status status))
        (seq parsed-program))
      (recur (revise open-branches instruction)
             (conj parsed-program (parse-instruction instruction open-branches))
             remaining))))
  
(defn parse-string
  [s]
  (parse-program (r/read-string s)))
