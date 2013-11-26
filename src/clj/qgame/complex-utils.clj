(ns qgame.complex-utils
  (:use [clojure.core.matrix :only [sin cos]]
        [clojure.pprint :only [cl-format]]
        [qgame.gen-utils])
  (:require [clojure.string :as s :only [replace]]))

(def i
  [[0 -1]
   [1  0]]) ;Will work fine for multiplication

(defn exp-xi
  [x]
  [[(cos x) (- (sin x))]
   [(sin x)    (cos x) ]])

(defn cmap-to-cmatrix
 "Given a complex number a+bi in hash-map form {:a a :b b}, returns it in matrix form:
[[a -b]
 [b a]]
Such that matrix multiplication can stand in for arithmetic multiplication."
 [{:keys [a b]}]
 [[a (- b)]
  [b    a ]])

(defn cmatrix-to-cmap
  "Given a complex number a+bi in matrix form [[a -b][b a]], returns it in hash-map form {:a a :b b}"
  [[[a neg-b]]]
  {:a a :b (- neg-b)})

(defn cmap-to-cstring
  "Given a complex number a+bi in hash-map form {:a a :b b}, returns the string 'a+bi' or 'a-bi' as the case may be (omitting zeros)."
  [{:keys [a b]}]
  (cl-format nil "~[~@[~d~]-i~;~:[0~;~:*~d~]~;~@[~d+~]i~:;~:[~d~;~:*~d~@d~]i~]"
             (inc b) (unless zero? a) b))

(defn cstring-to-cmap
  "Given a string of the form 'a+bi' or 'a-bi', with zeros omitted (unless both are zeros), returns a complex number in hash-map form {:a a :b b}."
  [s]
  {:a (Integer. (unless nil? (re-find #"[+-]?\d+(?!i)" s) "0"))
   :b (Integer. (s/replace (unless nil?
                                   (re-find #"[+-]?(?:\d+(?=i)|i)" s)
                                   "0")
                           "i" "1"))})

(def cstring-to-cmatrix (comp cmap-to-cmatrix cstring-to-cmap))

(def cmatrix-to-cstring (comp cmap-to-cstring cmatrix-to-cmap))