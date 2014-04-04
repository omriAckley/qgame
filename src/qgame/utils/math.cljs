(ns qgame.utils.math
  "Handles all of the math for qgame, including matrix math and complex number math. For all operations, converts the arguments so that any nested collectsion are math.js matrices, calls the operation, and then converts any nested matrices back to vectors."
  (:require [math.js]
            [arndtbruenner_eigenvalues.js]
            [clojure.walk :as w :refer [postwalk
                                        prewalk]]))

;Experimental math.js loader which won't require qgame library consumers to specify the math.js dependency foreign library file
;When trying this, remember to comment out the math.js require in the above namespace delcaration, and also to comment out the foreign libs usage
;(def mathscript (.createElement js/document "script"))
;(set! (.-type mathscript) "text/javascript")
;(set! (.-src mathscript) "http://cdnjs.cloudflare.com/ajax/libs/mathjs/0.18.0/math.min.js")
;(.appendChild (.-head js/document) mathscript)

(def math (js/mathjs))

;Collection to matrix, and matrix to collection conversion
(defn- to-matrix
  "Internal function for converting a collection to a math.js matrix, leaving any non-collection unchanged."
  [x]
  (if (sequential? x)
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

(defn matrix-safe
  "Calls a function on math.js-matrix-converted arguments then converts the result back to vectors."
  ([f x]
   (-> x nested-to-matrix f nested-to-vec))
  ([f x y]
   (let [x* (nested-to-matrix x)
         y* (nested-to-matrix y)]
     (nested-to-vec (f x* y*)))))

;Constants
(def pi (.-pi math))

(def sqrt2 (.-SQRT2 math))

(def sqrt1_2 (.-SQRT1_2 math))

(def i (.-i math))

;Arithmetic
(defn abs
  "Absolute value."
  [x]
  #_(-> x nested-to-matrix abs nested-to-vec)
  (matrix-safe math.abs x))

(defn round
  "Rounds a number (or collection of numbers) to a certain number of digits."
  ([x]
   (round x 0))
  ([x digits]
   (matrix-safe #(math.round % digits) x)))

(defn add
  "Adds the given collections and numbers. Collections must have matching dimensions."
  ([x]
   (add x 0))
  ([x y]
   (matrix-safe math.add x y))
  ([x y & more]
   (reduce add (add x y) more)))

(defn subtract
  "Subtracts the given collections and numbers. Collections must have matching dimensions."
  ([x]
   (subtract 0 x))
  ([x y]
   (matrix-safe math.subtract x y))
  ([x y & more]
   (reduce subtract (subtract x y) more)))

(defn multiply
  "Multiplies the given collections and numbers. Collections must have correct dimensions for matrix multiplication (i.e. for left collection size m x n, the right collection must be n x m)."
  [x y]
  (matrix-safe math.multiply x y))

(defn divide
  "Divides the given collections and numbers. Collections must have correct dimensions for matrix division (i.e. for left collection size m x n, the right collection must be n x m)."
  [x y]
  (matrix-safe math.divide x y))

(defn pow
  [x y]
  (matrix-safe math.pow x y))

(defn sqrt
  "Square root."
  [x]
  (matrix-safe math.sqrt x))

(defn cos
  "Cosine."
  [x]
  #_(-> x nested-to-matrix math.cos nested-to-vec)
  (matrix-safe math.cos x))

(defn sin
  "Sine."
  [x]
  (matrix-safe math.sin x))

(defn exp-xi
  "For some real x, calculates e^(xi)."
  [x]
  (math.exp (math.complex. 0 x)))

(defn- radians-to-degrees
  "Converts a number in radians to a number in degrees."
  [x]
  (-> x (divide (.-tau math)) (multiply 360)))

(defn to-phase
  "For some complex a+bi, returns the phase."
  [x]
  (matrix-safe (comp radians-to-degrees math.arg) x))

;Matrix operations
(defn det
  "Returns the determinant of some matrix"
  [mat]
  (matrix-safe math.det mat))

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
   (if (some false? (math.equal (.size mat01) (.size mat02)))
     false
     (->> (math.equal mat01 mat02)
          nested-to-vec
          flatten
          (every? true?))))
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
  (matrix-safe math.conj x))

(defn conjugate-transpose
  "The result of tranposing a 2D matrix whose elements have been complex conjugated."
  [mat]
  (complex-conjugate (matrix-safe math.transpose mat)))

(defn unitary?
  "Predicate test for whether a given collection, when converted to a matrix, is unitary. A matrix M is unitary if M multiplied by its conjugate transpose and its conjugate transpose multiplied by it are both equal to the identity matrix."
  [coll]
  (let [mat (nested-to-matrix coll)
        [m n] (.size mat)
        id-mat (math.eye m n)
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
  (round (math.eval s) 9))

;Eigenvalues
(defn complex?
  [x]
  (= "complex" (.typeof math x)))

(defn- coll->bruenner-matrix
  [coll]
  (to-array
    (map (fn [n]
           (if (complex? n)
             (array (.-re n) (.-im n))
             (array n 0)))
         (flatten coll))))

(defn- bruenner-matrix->coll
  [mat]
  (w/prewalk (fn [form]
               (if (array? form)
                 (let [[real imag :as v] (vec form)]
                   (if (and (number? real) (number? imag))
                     (math.complex. real imag)
                     v))
                 form))
             mat))

(defn eigenvalues
  [coll]
  {:pre [(= 4 (count coll))
         (every? (partial = 4) (map count coll))
         (every? (some-fn number? complex?) (flatten coll))]}
  (let [mat (coll->bruenner-matrix coll)]
    (bruenner-matrix->coll
      (bruenner.eigenvalues mat))))