---
layout: post
title: "Automatically Set desktop background to newest XKCD comic strip using python"
date: 2013-09-06 13:48
comments: true
categories: 
---

This semester I'm writing my master's project, which seems to be a time when procrastination thrives. When setting up Ubuntu on my school PC i had to decide what to use for desktop image. Between kinematics and lunch I wrote a script to update the desktop background to the most recent XKCD comic strip:

<!-- more -->

{%highlight python %}

#!/usr/bin/python

#	This script gets the latest xkcd comic strip 
#	downloads it and, makes it the desktop background
#	by simen andresen

import urllib
from selenium import webdriver
import os

# get the comic and save it as png
def getImage(imgPath,phantomJsPath):
	URL='http://www.xkcd.com'
	browser=webdriver.PhantomJS(phJsPath +'phantomjs')
	browser.get(URL)
	imageDiv=browser.find_element_by_id('comic')
	img=imageDiv.find_element_by_tag_name('img')
	imgURL=img.get_attribute('src')
	urllib.urlretrieve(imgURL, imgPath+ 'todaysXkcd.png')
	browser.close()

phantomJsPath='/my/path/to/phantonjs/' 
imgPath='/path/to/image/'
getImage(imgPath,phantomJsPath)

# set the comic as background
os.system('gsettings set org.gnome.desktop.background picture-uri file://'+imgPath +  '/todaysXkcd.png')

{%endhighlight%}

Using selenium is probably not a very efficient way of doing this, but after having messed around with selenium+phantomjs virtual browser for some days, it seemed like a good idea. 
To make the script work you have to install the python binding for selenium and the phantomjs binary. 
 
If your're using a Unix based OS you can schedule the script to run e.g. every  Monday, Wednesday and Friday using [crontab](http://www.adminschoice.com/crontab-quick-reference/) 
