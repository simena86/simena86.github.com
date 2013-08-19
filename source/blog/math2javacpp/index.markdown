---
layout: page
title: "Math Equations to Java and C/C++ Syntax"
date: 2013-01-29 21:44
comments: true
sharing: true
footer: true
---


<br />Convert simple mathematical equations to Java or C/C++ syntax			
<BR>
Enter mathematical equations: <BR>

<FORM NAME="myform" METHOD="GET">
<table STYLE="vertical-align:top;"  >
<tr>
<td><TEXTAREA ID="f1_in" NAME="maxima_text" ROWS="8"  COLS="55"></TEXTAREA>	</td>
<td id="f1_out"  STYLE="vertical-align:top;"></td>
<br>
				
</tr>
</table>
 <input type="radio" name="syntax" value="java" checked/>Java
 <input type="radio" name="syntax" value="c++" />C/C++<br />
	
<INPUT TYPE="button"  NAME="button" Value="Convert" onClick="convert_to_java()">

</FORM>

<br>

<div id="error"></div><br>

<div id="status"></div>



<script type="text/javascript" src="math2java.js"> 

</script>


