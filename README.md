# **q**<sub><sup><sub><sup>uantum</sup></sub></sup></sub><span> </span>**g**<sub><sup><sub><sup>ate</sup></sub></sup></sub><span> </span>**a**<sub><sup><sub><sup>nd</sup></sub></sup></sub><span> </span>**m**<sub><sup><sub><sup>easurement</sup></sub></sup></sub><span> </span>**e**<sub><sup><sub><sup>mulator</sup></sub></sup></sub><span> </span>

A reimplementation of [Lee Spector's QGAME in Common Lisp](http://faculty.hampshire.edu/lspector/qgame.html). This ClojureScript library is strictly for the data crunching involved in simulating [quantum computation](http://en.wikipedia.org/wiki/Quantum_computer). For a visual qgame REPL (based on a Clojure beta version of this project), see [here](https://github.com/zhx2013/qgame-seesaw).

## Usage

To import using [leingingen](http://leiningen.org/), include these is in your project.clj `defproject` declaration (in addition to whatever other configurations you want):

	:dependencies [[org.clojars.hippiccolo/qgame "0.3.0"]]
	:cljsbuild {:builds [{:compiler {:foreign-libs [{:file "http://cdnjs.cloudflare.com/ajax/libs/mathjs/0.18.1/math.min.js"
	                                                 :provides ["math.js"]}]}}]}

Then in your ClojureScript namespace declaration:

	(ns your-mind-blowing-namespace
	  (:require [qgame.simulator.interpreter :as qgame]]))

## Quick demo

The central function is `interpret`, which will take a string of instructions, where each instruction should be separated by a space or new line. For example:

	user> (qgame/interpret "qnot A")
	> ({:amplitudes [0 1], :prior-probability 1, :oracle-count 0, :measurement-history ()})

*DOESN'T WORK RIGHT NOW*
Now using a simple customized step-by-step renderer:

	user> (qgame/execute-program {:num-qubits 1
	                              :renderer (fn [branches instruction]
	                                          (println)
	                                          (pprintln (first branches))
	                                          (println (apply str "Calling " (first instruction) " on qubit " (rest instruction))))}
	                             '((qnot 0)
	                               (qnot 0)))
	
	{:amplitudes [1 0], :prior-probability 1, :oracle-count 0, :measurement-history ()}
     Calling qnot on qubit 0

	{:amplitudes [0 1], :prior-probability 1, :oracle-count 0, :measurement-history ()}
	Calling qnot on qubit 0
	> ({:amplitudes [1 0], :prior-probability 1, :oracle-count 0, :measurement-history ()})
*END OF STUFF THAT DOESN'T WORK*

## Valid instructions

	qnot <qubit>
	cnot <qubitA> <qubitB>
	srn <qubit>
	nand <qubitA> <qubitB> <qubitC>
	hadamard <qubit>
	u-theta <qubit> <theta>
	cphase <qubitA> <qubitB> <alpha>
	u2 <qubit> <phi> <theta> <psi> <alpha>
	swap <qubitA> <qubitB>
	measure <qubit>
	end
	<name>:<target>
	forget:<name>
	with_oracle: <bitA>...<bit?>
	oracle <qubitA>...<qubit?>
	

The `oracle` quantum gate takes anywhere from 1 to N qubits, where N is the total number of qubits for a given quantum system. There is more on oracles [later](#oracles).

## Terminology

A program is a list of instructions. An instruction is a list that starts with a qgame function name and often has parameters following it. This function should either be one of the branch operators--`measure` or `end`--or a quantum gate. In the case of a quantum gate, the parameters will either be paramters for a quantum gate matrix, or qubits. A quantum gate matrix is any [unitary matrix](http://en.wikipedia.org/wiki/Unitary_matrix). A qubit is simply a letter between `A` and `T`. More generally, a quantum gate is a function that takes amplitudes, zero or more parameters, and one or more qubits. It returns the result of matrix multiplying some (possibly parameterized) gate matrix by certain sub-vectors of amplitudes--the sub-vectors are calculated by considering the relevant qubits. More simply, a quantum gate instruction could be thought of as a function that takes a quantum system and returns that quantum system with amplitudes updated by applying the quantum gate on the relevant qubits. For example, `qnot A` is a quantum gate instruction that `qnot`s some quantum system at qubit `A`. Internally qubit `A` is represented as qubit `0`, qubit `B` as qubit `1`, etc.

A quantum system is a hash-map of `:amplitudes`, `:prior-probability`, `:measurement-history`, and `:oracle-count`. The :amplitudes vector contains amplitudes for all the possible combinations of qubit states. For example, with three qubits, there would be eight amplitudes, each corresponding to one of: 000, 001, 010, 011, 100, 101, 110, 111--think of each right-most digit as the state of qubit 0, each middle digit as the state of qubit 1, and each left-most digit as the state of qubit 2. An amplitude's base-10 index can therefore be converted to a binary number to determine which possible state it corresponds to (the amplitude at index 3, whose binary equivalent is 011, is the amplitude for the possible state where qubit 0 equals 1, qubit 1 equal 1, and qubit 2 equals 0). A prior probability denotes the likelihood of having arrived at given quantum system. This is modified by measurement only. The measurement history keeps track of the results of measurements a quantum system has been subject to. The oracle count shows how many times the oracle gate has been called on this quantum system. A branch is a list of quantum systems. 

## Interpreter flow

During program execution, a list of branches is maintained, where only the head branch (the first branch in the list of branches) is acted upon by quantum gates. The head branch is updated by mapping the quantum gate instruction down each of the quantum systems it contains. Control operators are a different story. A measurement creates two branches by duplicating the head branch, and then altering the first copy so that all its quantum systems have the given qubit collapsed to the 1 state, and the second copy so that all of its quantum systems have the given qubit collapsed to the 0 state. The "one" branch is the new head branch. The first subsequent `(end)` instruction will act like an "else", swapping the first two branches so that the "zero" branch is the new head branch--and all quantum gate instructions will now act on this branch. The second `end` instruction will truly end the measurement, merging the first two branches into one, so that together they will form the new head branch. Any nested measurements must come to a complete end, i.e. they must have encountered two `(end)`s, before the "parent" measurement.

## Oracles

An oracle can be passed as a keyword argument to `execute-program`. To clarify, an "oracle" is different than an "oracle quantum gate". The latter (like all quantum gates) is a function that can be applied to some amplitudes. An "oracle", on the other hand, is expected to be the right column of some truth table. For example, the truth table for logical NAND is:

<table>
  <tr> <td><strong>A</strong></td> <td><strong>B</strong></td> <td><strong>NAND</strong></td> </tr>
  <tr> <td>0</td> <td>0</td> <td>1</td> </tr>
  <tr> <td>0</td> <td>1</td> <td>1</td> </tr>
  <tr> <td>1</td> <td>0</td> <td>1</td> </tr>
  <tr> <td>1</td> <td>1</td> <td>0</td> </tr>
</table>

And so it's right column is `1 1 1 0`. When calling `with_oracle 1 1 1 0`, the interpreter would construct the gate matrix equivalent of logical NAND, convert that to a quantum gate, and then use that as the oracle quantum gate. Ultimately, this quantum gate would be a function that takes amplitudes and three qubits. It would use the first two qubits as "input", and treat the third as output. If the first two qubits were both equal to 1, the third qubit would be set to 0. Otherwise, it would be set to 1. However, since qubits can be "sort of 0" and "sort of 1" at the same damn time, this quantum gate actually alters the third qubit in "fuzzier" ways.
