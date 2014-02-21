Test oracle gates.

Unify with the old Common Lisp QGAME's argument order for quantum gates.

Functions `execute-string` and `parse-string` that will allow for math expression evaluation.

Error handling for parsing and execution, so that any arbitrary string can be evaluated without JavaScript-level errors. Non-viable qgame programs should either return `nil` or throw a non-blocking exception or something like that.

Ability to name qubits and to pass numerical index OR name index to reference a qubit.

Keyword arguments `:on-start` and `:on-finish` for `execute-program`. These allow side-effects to take place at the beginning or end of a program. (Also, possibly change the keyword argument `:renderer` to `:on-step`.)

"Baking in" of math.js dependency, so that qgame library consumers do not need to manage this very tangential upstream dependency.

Advanced compilation to make lighter-weight compiled JavaScript.

Conversion to cljx project, so that the library can be used from either ClojureScript or Clojure. Accompanied by inclusion of some Clojure math namespace&mdash;probably a wrapper for some Java or Clojure library.

Extensible parsing and execution? Maybe? If so, I'm thinking in the form of optional arguments that are functions to pre-process, stepwise-process, and post-process the parsing and execution flow.
