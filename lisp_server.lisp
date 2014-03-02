
(in-package :cl-user)

(defpackage :hyperspec-glossary-server
  (:use :cl :asdf)
  (:export init-server)
  (:import-from :clack
		:<component> 
		:call
		:clackup)
  (:import-from :kmrcl
		:split-uri-query-string)
  (:import-from :yason
		:encode)
  (:import-from :sqlite
		:connect
		:prepare-statement
		:reset-statement
		:bind-parameter 
		:step-statement
		:statement-column-value))

(in-package :hyperspec-glossary-server)

;;(defvar *db-location* "/home/jmr/github/Hyperspec-Custom-Style/hyperspec.sqlite")
(defvar *db-location* "hyperspec.sqlite")

(defvar *db*)
(setf *db* (connect *db-location*))

(defvar *prepared-stmt*)
(setf *prepared-stmt* (prepare-statement *db*
					 "select 
  key,
  term,
  definition
from glossary
where key = ?"
					 ))

(defun gen-response (env)
  (loop
     with result = nil
     for (key . val) in (split-uri-query-string 
			 (getf env :http-posted-content))
     when (string= key "d%5B%5D")
     do (progn
	  (reset-statement *prepared-stmt*)
	  (bind-parameter *prepared-stmt* 1 val)
	  (when (step-statement *prepared-stmt*)
	    (push (mapcar (lambda (n)
			    (statement-column-value *prepared-stmt* n))
			  '(0 1 2))
		  result)))
     finally (return (with-output-to-string (s)
		       (yason:encode result s)))))

(defclass <hyperspec-glossary-app> (<component>) ())

(defmethod call ((this <hyperspec-glossary-app>) env)
  `(200
    (:content-type "application/json")
    (,(gen-response env))))

(defvar *hyperspec-glossary-server*)

(defun init-server (&optional (server :apache) (port 4040))
  (setf *hyperspec-glossary-server*
	(clackup (make-instance '<hyperspec-glossary-app>)
		 :server server
		 :port port)))

