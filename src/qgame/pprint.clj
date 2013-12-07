(ns qgame.pprint
  "Useful for pretty printing quantum systems and/or branches in qgame."
  (:use [qgame.utils.general]
        [qgame.utils.complex])
  (:require [clojure.pprint :as p]
            [clojure.walk :as w]))

(defn all-to-floats
  "Coerces all numbers to floats, nested anywhere within a qsystem."
  [qsys]
  (w/postwalk #(unless number? % (float %))
              qsys))

(defn all-to-cstrings
  "For a qsystem, converts all the values in :amplitudes from complex matrix representations to complex string representations."
  [qsys]
  (update-in qsys [:amplitudes]
             (partial mapv (comp symbol cmatrix-to-cstring))))

(defn pprint-branch
  "Converts all the qsystems in the branch to more succint representations, then pretty prints the whole thing."
  [branch]
  (let [converted-branch (map (comp all-to-cstrings all-to-floats)
                              branch)]
    (p/pprint converted-branch)))
