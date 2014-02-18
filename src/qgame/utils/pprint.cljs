(ns qgame.utils.pprint
  #_(:require-macros [qgame.macros :as macros :refer [unless]])
  #_(:require [qgame.utils.math :as m :refer [to-string]]
            [clojure.walk :as w :refer [postwalk]]))
;"Useful for pretty printing quantum systems and/or branches in qgame."

#_(defn all-to-floats
  "Coerces all numbers to floats, nested anywhere within a qsystem."
  [qsys]
  (w/postwalk #(macros/unless number? % (float %))
              qsys))

#_(defn all-to-strings
  "For a qsystem, converts all the values in :amplitudes from complex matrix representations to complex string representations."
  [qsys]
  (update-in qsys [:amplitudes]
             (partial mapv (comp symbol to-string))))

;No pretty printing library in ClojureScript!
#_(defn pprint-branch
  "Converts all the qsystems in the branch to more succint representations, then pretty prints the whole thing."
  [branch]
  (let [converted-branch (map (comp all-to-cstrings all-to-floats)
                              branch)]
    (pp/pprint converted-branch)))
