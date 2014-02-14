---
layout: post
title: "Hand Tracking And Recognition with OpenCV"
date: 2013-08-12 21:52
comments: true
categories: [C++, OpenCV, Computer Vision] 
---

Computer Vision is in many ways the ultimate sensor, and has endless potential applications to robotics. Me and 2 classmates (Vegar Østhus and Martin Stokkeland ) did a project in Computer Vision at UCSB and wrote a program to recognize and track finger movements.

<!-- more --> 

Below is a flowchart representation of the program


{% img /images/handRecognition/gesture_flowchart.png 420 200  %}


The hand tracking is based on color recognition. The program is therefore initialized by sampling color from the hand:


{% img /images/handRecognition/waitforpalm.png  %}


The hand is then extracted from the background by using a threshold using the sampled color profile.
Each color in the profile produces a binary image which in turn are all summed together. A nonlinear median filter is then applied to get a smooth and noise free binary representation of the hand. 


{% img /images/handRecognition/binary.png  %}


When the binary representation is generated the hand is processed in the following way:


{% img /images/handRecognition/contour.png  %}

The properties determining whether  a convexity defect is to be dismissed is the angle between the lines going 	from the defect to the neighbouring convex polygon vertices



{% img /images/handRecognition/handangle.png  %}


The defect is dismissed if:

$$
\begin{aligned}
length < 0.4l_{bb} \\
angle > 80^o
\end{aligned}
$$

The analyzis results in data that can be of further use in gesture recognition:

+ Fingertip positions 
+ Number of fingers 
+ Number of hands  
+ Area of hands 

The source code can be found [here](https://github.com/simena86/handDetectionCV )

{% img /images/handRecognition/final_result.png  %}


{% youtube  o3LSOq6OC4I %}
