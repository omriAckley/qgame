(ns qgame.utils.complex
  "This library is for representing complex numbers, some a+bi, only within qgame--this is not a general purpose complex numbers library. The matrix form [[a -b][b a]] allows for a consistent representation for doing any matrix operations. The string form \"a+bi\" is succint and useful for printing. The map form {:a a :b b} is just a nice default representation and stays closest to idiomatic Clojure."
  (:use [clojure.core.matrix :only [sin cos]]
        [clojure.pprint :only [cl-format]]
        [qgame.utils.general])
  (:require [clojure.string :as s :only [replace]]))

(def i
  [[0 -1]
   [1  0]])

(defn exp-xi
  "Given some x, outputs the complex matrix equivalent of e^xi."
  [x]
  [[(cos x) (- (sin x))]
   [(sin x)    (cos x) ]])

(defn complex-abs
  "Returns the absolute value of some number that may or may not be represented in complex matrix form."
  [x]
  (if (number? x)
    (Math/abs x)
    (reduce + (map complex-abs (first x)))))

(defn complex-conjugate
  "Returns the complex conjugate of some number that may or may not be represented in complex matrix form. The complex conjugate of a+bi is a-bi."
  [x]
  (unless (complement number?) x
          (let [[[a neg-b]] x]
            [[a (- neg-b)]
             [neg-b a]])))

(defn number-to-cmatrix
  "Given a real number, returns it in complex matrix form."
  [x]
  [[x 0]
   [0 x]])

(defn get-real
	"Gets the real part, 'a', from a complex number in matrix form."
	[[[a neg-b]]]
	a)

(defn get-imaginary
	"Gets the imaginary part, 'b', from a complex number in matrix form."
	[[[a neg-b]]]
	(- neg-b))

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
