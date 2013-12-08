(ns qgame.api
  "Internalizes imports from various other qgame namespaces, packaging it all into a clean API."
  (:use [potemkin :only [import-vars]])
  (:require [qgame.core]
            [qgame.qgates]
            [qgame.amplitudes]
            [qgame.utils.complex]
            [qgame.pprint]))

(import-vars
  [qgame.core
   new-quantum-system
   force-to
   measure
   execute-qgate
   execute-instruction
   execute-program]
  [qgame.qgates
   binary-gate-matrix
   anonymous-qgate
   defn-qgate
   qnot cnot srn nand hadamard u-theta cphase u2 swap]
  [qgame.amplitudes
   qubits-to-amplitude-indices
   qubit-state-amplitudes
   probability-of]
  [qgame.utils.complex
   i
   number-to-cmatrix
   get-real
   get-imaginary
   cmap-to-cmatrix
   cmatrix-to-cmap
   cmap-to-cstring
   cstring-to-cmap
   cstring-to-cmatrix
   cmatrix-to-cstring]
  [qgame.pprint
   all-to-floats
   all-to-cstring
   pprint-branch])