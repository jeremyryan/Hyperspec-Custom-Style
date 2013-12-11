

(ql:quickload '(:clack :cl-who :kmrcl :sqlite :yason))

(import '(clack:call clack:<component> kmrcl:split-uri-query-string))

(defvar *db-location* "/home/jmr/github/Hyperspec-Custom-Style/hyperspec.sqlite")

(defvar *db* (sqlite:connect *db-location*))

(defvar *prepared-stmt* (sqlite:prepare-statement *db*
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
     with indexes = (loop for i from 0 to 2 collect i)
     for (key . val) in (split-uri-query-string 
			 (getf env :http-posted-content))
     when (string= key "d%5B%5D")
     do (progn
	  (sqlite:reset-statement *prepared-stmt*)
	  (sqlite:bind-parameter *prepared-stmt* 1 val)
	  (when (sqlite:step-statement *prepared-stmt*)
	    (push (mapcar (lambda (n)
			    (sqlite:statement-column-value *prepared-stmt* n))
			  indexes)
		  result)))
     finally (return (with-output-to-string (s)
		       (yason:encode result s)))))

(defclass <test-app> (<component>) ())

(defmethod call ((this <test-app>) env)
  `(200
    (:content-type "application/json")
    (,(gen-response env))))

(defvar clack-test-server)

(setf clack-test-server
  (clack:clackup (make-instance '<test-app>)
		 :server :apache
		 :port 4040))

