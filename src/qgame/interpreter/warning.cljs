(ns qgame.interpreter.warning
  "Warning handling for parsing and execution of qgame programs.")

(def warnings (atom []))

(add-watch warnings :alert
           (fn [_k _r old-vec new-vec]
             (let [messages (subvec new-vec (count old-vec))]
               (map js/alert messages))))

(defmulti problem-to-message
  ;"Converts a problem key to a message (string), tailored for different possible problems."
  (fn [k & args] k))

(defmethod problem-to-message :extra-end
  [_]
  "Extra '(end)' encountered")

(defmethod problem-to-message :lingering-status
  [_ s]
  (case s
    "then_clause" "Some '(measure)' missing two '(end)'s"
    "else_clause" "Some '(measure)' missing an '(end)'"
    (str "Lingering status: " s)))

(defn warn!
  "Emits a warning to the warning atom."
  [task-key problem-key & args]
  (let [message (str "Warning while "
                     (name task-key) ": "
                     (apply problem-to-message problem-key args))]
    (swap! warnings conj message)))
