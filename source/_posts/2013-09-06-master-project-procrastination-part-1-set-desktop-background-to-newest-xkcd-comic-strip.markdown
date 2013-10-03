---
layout: post
title: "Automatically Set desktop background to newest XKCD comic strip using python"
date: 2013-09-06 13:48
comments: true
categories: 
---

This semester I'm writing my master's project, which seems to be a time when procrastination thrives. When setting up Ubuntu on my school PC i had to decide what to use for desktop image. I therefor wrote a script to update the desktop background to the most recent [XKCD](http://www.xkcd.com) comic strip:

<!-- more -->

{%highlight python %}

#!/usr/bin/python

#	This script gets the latest xkcd comic strip 
#	downloads it and, makes it the desktop background
#	by simen andresen

import urllib
from lxml import etree, html
import os

# get the comic and save it as png
def getImage(imgPath):
	url='http://www.xkcd.com'
	page = html.fromstring(urllib.urlopen(url).read())
	img=page.xpath('//div[@id="comic"]/img/@src')
	img=img[0]
	urllib.urlretrieve(img, imgPath+ 'todaysXkcd.png')

imgPath='full/path/to/image/'
getImage(imgPath)

# set the comic as background
os.system('gsettings set org.gnome.desktop.background picture-uri file://'+imgPath +  '/todaysXkcd.png')

{%endhighlight%}
 
If your're using a Unix based OS you can schedule the script to run e.g. every  Monday, Wednesday and Friday using [crontab](http://www.adminschoice.com/crontab-quick-reference/) 
