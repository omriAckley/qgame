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

   

(defn counter [arg]
  "used internally by sublist"
  (loop [from arg
         elt (first (first from))
         cnt 0
         goal 2
         found 0]
    (if (= goal found)
      (+ 1 cnt)
      (recur
        (rest from)
        (first (first from))
        (+ 1 cnt)
        (if (= 'measure elt)
          (+ 2 goal)
          goal)
        (if (= 'end elt)
          (+ 1 found)
          found)))))  


(defn end-to-else-branch [arg]
  "Converts (arg) program with (end)(end) after (measure) to (else)(end) format"
  (loop [to '()
         else true
         from arg]
    (if (or (and (not else)
                 (= 'end (first (first from))))
            (empty? from))
      (filter #(not= nil %) (concat to (list (first from))))
      (recur
        (if (= 'measure (first (first from)))
          (concat to (list (first from)) (end-to-else-branch (rest from)))
          (if (and else
                   (= 'end (first (first from))))
            (concat to '((else)))  
            (concat to (list (first from)))))
        (if (= 'end (first (first from)))
          false
          else)
        (if (not= 'measure (first (first from)))
          (rest from)
          (drop (counter (rest from)) from))))))
