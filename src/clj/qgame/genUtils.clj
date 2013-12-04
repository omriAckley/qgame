(ns qgame.genUtils)

(defmacro unless
  "If (pred then) returns true, returns else, else returns then."
  ([pred then]
    `(unless ~pred ~then nil))
  ([pred then else]
    `(if (~pred ~then)
      ~else
      ~then)))

(defn update-sub
  "Updates a sub-structure of m. Gets a list of values, each corresponding to a key in ks, calls f on that list (does *not* apply f), and assoc-s the elements of the resultant list back in, each resultant element corresponding, by order, to a key in ks. For function f, the number of inputs is expected to equal the number of outputs. Furthermore, the nth output should correspond to an 'updated' nth input."
  [m f ks]
  (->> (map (partial get m) ks)
    f
    (zipmap ks)
    (reduce-kv assoc m)))

(defn itermap
  "Iteratively concats init and f mapped down init."
  [f init coll]
  (if-let [s (seq coll)]
    (itermap f
             (concat init
                     (map #(f % (first s))
                          init))
             (rest s))
    init))

(defn bit-size
  "Given some integer x, gives the number of bits needed to represent it."
  [x]
  (loop [n 1]
  (if (<= x (bit-shift-left 1 n))
    n
    (recur (inc n)))))
