
(defsystem hyperspec-glossary-server
  :version "0.1"
  :author "Jeremy Ryan"
  :depends-on (:clack
	       :kmrcl
	       :sqlite
	       :yason)
  :components ((:file "hyperspec-glossary-server"))
  :description "Server for Common Lisp Hyperspec glossary terms")
