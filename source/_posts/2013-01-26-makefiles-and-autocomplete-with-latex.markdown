---
layout: post
title: "Makefiles and autocomplete with Latex"
date: 2013-01-26 00:14
comments: true
categories: [latex, linux]
---


I am using Latex a lot and have done some customization in order to speed up the process of writing academic reports. I am using the TeXworks editor. TeXworks is a clean and simple editor, and with the help of a make file and some autotyping it is very efficient.

<!-- more -->

Custom typesetting
In order to use Texworks efficient i have done some modification to the typesetting process. Instead of using pdflatex which doesn't allow vector graphics (at least not with the default settings), I am using the power of a make-file. I have written a linux bash script that is run from texworks:

Edit>Preferences>Typesetting>+ to add a Processing tool, and add the script below with the following arguments

$basename

-shell-escape

-enable-write18

The script I use is

{% highlight bash %}
#!/bin/sh
##
main_file=$(ls * | grep '.tex' | xargs grep "begin{document}" -sl)
main_file=${main_file%".tex"}

#compile two times to get the reference alright
latex -synctex=1 "$main_file.tex"
latex -synctex=1 "$main_file.tex"
dvips "$main_file.dvi" && ps2pdf "$main_file.ps"

#searching for main_files that dosnt end with .tex and moving them to build
ls * | grep "$main_file" | 
while read line ; do 
	echo $line
	if echo $line | grep -Eq 'tex$|pdf$|gz$' 
	then
		echo "not moving tex file"
	else
		mv $line ./build
	fi
done

texworks $main_file.pdf

{% endhighlight %}

Put the script somewhere in your PATH and it is automatically run from Texworks every time you typeset the document. What the script does is find the main file for the latex document and typeset that. This allows you to typeset the whole document from a .tex-file included in the main document. One should note that there should be only one main tex file (the file with \begin{document}) in the directory. 

Auto complete
For speeding up the process of writing latex code, auto completion comes in handy. On my computer auto completion is added in ~/.Texworks/completion/tw-basic.txt. Some of the entries in my tx-basic.txt

{% highlight bash %}
align:=\begin{align}#RET#\label{eq:}#RET# #INS# #RET# \end{align}

figure:=\begin{figure}[h!] #RET# \center #RET# \includegraphics[scale=]{./figures/#INS#}#RET# \caption{ \label{fig:}}#RET# \end{figure}#RET#
{% endhighlight %}

With this in your tw-basic.txt you can just type "figure" in the Texworks editor, press tab and it is completed to the align environment with the cursor ready in place for writing your favourite differential equation, matrix or 1+1=3.
