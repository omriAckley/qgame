(ns qgame.simulator.reader
  "Converts raw text into parser-ready objects."
  (:require [clojure.string :as s :refer [blank?
                                          split-lines
                                          replace-first
                                          split]]
            [qgame.utils.general :as g :refer [regex-join]])
  (:use [qgame.simulator.shared :only [*stage*]]))

(defn split-into-lines
  "Splits and numbers by lines, omitting blank lines."
  [program]
  (keep-indexed (fn [idx s]
                  (when-not (s/blank? s)
                    {:line-number idx
                     :line s}))
                (s/split-lines program)))

(def comment-pattern
  #"\#.*")

(def whitespace-equivalent-pattern
  #"[^\-\w\.\:\+\*\/\^\(\)]+")

(def ignore-pattern
  (g/regex-join "(?:" comment-pattern "|" whitespace-equivalent-pattern ")"))

(defn chew
  "Keeps chomping on the line until the line ends."
  ([s]
   (chew s []))
  ([s bites]
   (loop [s- (s/replace-first s (g/regex-join "^" whitespace-equivalent-pattern) "")
          bites bites]
     (if (s/blank? s-)
       bites
       (let [pos (- (count s) (count s-))
             [text s--] (s/split s- ignore-pattern 2)
             bite {:text text :character-position pos}]
         (recur (str s--) (conj bites bite)))))))

(defn split-into-bites
  "Converts a line into a list of bites."
  [{line-number :line-number line :line}]
  (let [bites (chew line)]
    (map #(assoc % :line-number line-number) bites)))

(defn read
  "Converts a raw string into parse-able bites."
  [program]
  (binding [*stage* "Reading"]
    (->> program
         split-into-lines
         (mapcat split-into-bites))))
