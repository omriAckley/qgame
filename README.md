# qgame

A Clojure library for simulating quantum computation, which is a reimplementation of [Lee Spector's QGAME in Common Lisp](http://faculty.hampshire.edu/lspector/qgame.html). This library is strictly data crunching. For a visual qgame REPL, see [here](https://github.com/zhx2013/qgame-seesaw).

## Usage

To import using [leingingen](http://leiningen.org/), include this is in your project.clj dependecies:

	[[org.clojars.hippiccolo/qgame "0.1.0"]]

Then from a REPL:

	user> (use 'qgame.core)
	> nil

From here, the central function is `execute-program`, which will take a hash-map of options and a quoted list of instructions to execute. For example:

	user> (execute-program {:num-qubits 1}
	                           '((qnot 0)))
	> ({:amplitudes [[[0 0] [0 0]] [[1 0] [0 1]]], :prior-probability 1, :oracle-count 0, :measurement-history ()})

Which doesn't look so pretty. To prettify slightly:

	user> (->> (execute-program {:num-qubits 1}
	                               '((qnot 0)))
	              first
	              :amplitudes
	              (mapv cmatrix-to-cstring))
	> ["0" "1"]

## Syntax

Soon to be written.
