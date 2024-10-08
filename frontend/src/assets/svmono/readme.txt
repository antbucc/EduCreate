This directory holds the 8 components of the SVMono tool package:

(1) a subdirectory "styles" with
- the Springer document class "svmono.cls",
- the Springer MakeIndex style file "svind.ist"
- the Springer BibTeX styles "spbasic.bst", "spmpsci.bst", "spphys.bst"

(2) a subdirectory "templates" with
- the sample root file "book.tex",
- the sample text files
  - "dedication.tex" (dedication),
  - "foreword.tex" (foreword),
  - "preface.tex" (preface),
  - "acknowledgement.tex" (acknowledgements),
  - "ethics.tex" (declarations, competing Interests and ethics Approval)
  - "acronym.tex" (list of acronyms),
  - "part.tex" (part title),
  - "chapter.tex" (chapter),
  - "appendix.tex" (appendix),
  - "glossary.tex" (glossary),
  - "solutions.tex" (solutions chapter),
  - "references.tex" (references),
  - "figure.eps" (sample figure),
with preset class options, packages and coding examples;

Tip: Copy all these files to your working directory, run LaTeX
and produce your own example *.dvi file; rename the template files as
you see fit and use them for your own input.

(3) the pdf file "quickstart.pdf" with "essentials" for
an easy implementation of the "svmono" package (2 pages)

(4) the pdf file "instruction.pdf" with style and
coding instructions specific to -- Monographs --

Tip: Follow these instructions to set up your files,
to type in your text and to obtain a consistent formal style;
use these pages as checklists before you submit
your ready-to-print manuscript.

(5) the pdf file "refguide.pdf" describing the
SVMono document class features independent of any specific style
requirements.

Tip: Use it as a reference if you need to alter or
enhance the default settings of the SVMono document
class and/or the templates.

(6) the pdf file "example.pdf"

(7) a subdirectory "deutsch" with
- instructions for writing german texts

(8) a file "history.txt" with version history

(9) .\spmpsci.bst 
    .\spbasic.bst

      -   �n.separate" function that call within page range
                              removed(because lengthy page ranges get affected)
							  
(10) .\spbasic.bst

      -   �et~al." - end dot inserted based on feedback							  

(11) Special elements 
     .\author\book.tex
     .\author\book.pdf
     .\author\svmono.cls (V5.6)
     
     -- Trailer Head
     -- Questions
     -- Important
     -- Attention 
     -- Program Code
     -- Tips
     -- Overview
     -- Background Information
     -- Legal Text 

(12) Fast publishing suggestions given to author added in the documentation.

(13) Italian lanugage has been implemented using option "italiano" in documentclass.
