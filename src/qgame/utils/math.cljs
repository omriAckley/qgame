(ns qgame.utils.math
   "Handles all of the math for qgame, including matrix math and complex number math. For all operations, converts the arguments so that any nested collectsion are math.js matrices, calls the operation, and then converts any nested matrices back to vectors."
   (:require [math.js]
      [clojure.walk :as w :refer [postwalk
                                  prewalk]]))

;Constants
(def math (js/mathjs))

(def pi (.-pi math))

(def sqrt2 (.-SQRT2 math))

(def sqrt1_2 (.-SQRT1_2 math))

(def i (.-i math))

;Arithmetic
(defn abs
   "Absolute value."
   [x]
   (->> x
      nested-to-matrix
      (.abs math)
      nested-to-vec))

(defn round
   "Rounds a number (or collection of numbers) to a certain number of digits."
   ([x]
      (round x 0))
   ([x digits]
      (-> x
         nested-to-matrix
         (math.round digits)
         nested-to-vec)))

(defn add
   "Adds the given collections and numbers. Collections must have matching dimensions."
   ([x]
      (add x 0))
   ([x y]
      (nested-to-vec (.add math (nested-to-matrix x)
         (nested-to-matrix y))))
   ([x y & more]
      (reduce add (add x y) more)))

(defn subtract
   "Subtracts the given collections and numbers. Collections must have matching dimensions."
   ([x]
      (subtract 0 x))
   ([x y]
      (nested-to-vec (.subtract math (nested-to-matrix x)
         (nested-to-matrix y))))
   ([x y & more]
      (reduce subtract (subtract x y) more)))

(defn multiply
   "Multiplies the given collections and numbers. Collections must have correct dimensions for matrix multiplication (i.e. for left collection size m x n, the right collection must be n x m)."
   [x y]
   (nested-to-vec (.multiply math (nested-to-matrix x)
      (nested-to-matrix y))))

(defn divide
   "Divides the given collections and numbers. Collections must have correct dimensions for matrix division (i.e. for left collection size m x n, the right collection must be n x m)."
   [x y]
   (nested-to-vec (.divide math (nested-to-matrix x)
      (nested-to-matrix y))))

(defn sqrt
   "Square root."
   [x]
   (->> x
      nested-to-matrix
      (.sqrt math)
      nested-to-vec))

(defn cos
   "Cosine."
   [x]
   (->> x
      nested-to-matrix
      (.cos math)
      nested-to-vec))

(defn sin
   "Sine."
   [x]
   (->> x
      nested-to-matrix
      (.sin math)
      nested-to-vec))

(defn exp-xi
   "For some x, calculates e^(xi)."
   [x]
   (.exp math (math.complex. 0 x)))

;Matrix math

(def ordered-collection?
   (some-fn vector? list? seq?))

(defn- to-matrix
   "Internal function for converting a collection to a math.js matrix, leaving any non-collection unchanged."
   [x]
   (if (ordered-collection? x)
      (math.matrix. (to-array x))
      x))

(defn- nested-to-matrix
   "Internal function for converting any/all nested collections to math.js matrices."
   [coll]
   (w/postwalk to-matrix coll))

(defn- to-vec
   "Internal function for converting a math.js matrix and/or a JavaScript array to a vector, leaving any non-math.js-matrix or non-array unchanged."
   [x]
   (cond
      (array? x) (vec x)
      (= (.typeof math x) "matrix") (vec (.toArray x))
      :else x))

(defn- nested-to-vec
   "Internal function for converting any/all nested math.js matrices to vectors."
   [mat]
   (w/prewalk to-vec mat))

(defn- rand-2D-complex
   "Creates a 2D math.js matrix with elements equal to a random complex number with real part between positive and minus real-bound, and with imaginary part between positive and minus imag-bound."
   ([m n bound]
      (rand-2D-complex m n bound bound))
   ([m n real-bound imag-bound]
      (letfn [(rand-n [bound] (-> bound (* 2) inc (- bound) rand-int))
         (rand-cmp [] (math.complex. (rand-n real-bound)
            (rand-n imag-bound)))
         (rand-1D [dim] (->> rand-cmp
            (repeatedly dim)
            to-matrix))]
      (->> #(rand-1D n)
         (repeatedly m)
         to-matrix))))

(defn- mat=?
   "Internal function for testing whether two matrices are equal (i.e. dimensions are the same, and corresponding elements are equal)."
   ([mat01 mat02]
      (set! result true)
      (if (some false? (.equal math (.size mat01) (.size mat02)))
         (set! result false)
         (.forEach (.equal math mat01 mat02)
            (fn [val] (when (false? val) (set! result false)))))
      result)
   ([mat01 mat02 & more]
      (and (mat=? mat01 mat02) (apply mat=? mat02 more))))

(defn square?
   "Predicate test for whether a 2D collection is square (i.e. its height and width are equal)."
   [coll]
   (let [mat (nested-to-matrix coll)
      [rows cols] (.size mat)]
      (= rows cols)))

(defn complex-conjugate
   "Returns the complex conjugate of some number. The complex conjugate of a+bi is a-bi."
   [x]
   (->> x
      nested-to-matrix
      (.conj math)
      nested-to-vec))

(defn conjugate-transpose
   "The result of tranposing a 2D matrix whose elements have been complex conjugated."
   [x]
   (->> x
      complex-conjugate
      nested-to-matrix
      (.transpose math)
      nested-to-vec))

(defn unitary?
   "Predicate test for whether a given collection, when converted to a matrix, is unitary. A matrix M is unitary if M multiplied by its conjugate transpose and its conjugate transpose multiplied by it are both equal to the identity matrix."
   [coll]
   (let [mat (nested-to-matrix coll)
      [m n] (.size mat)
      id-mat (.eye math m n)
      conj-trans (conjugate-transpose mat)]
      (mat=? id-mat
         (nested-to-matrix (round (multiply mat conj-trans) 5))
         (nested-to-matrix (round (multiply conj-trans mat) 5)))))

;Helpful utilities
(defn to-string
   [x]
	(.toString x))

(defn eval-math-string
   "Evaluates a string as a mathematical expressions. For example (eval-math-string \"e^(pi*i)\") should return -1."
   [s]
	(round (.eval math s) 5))
