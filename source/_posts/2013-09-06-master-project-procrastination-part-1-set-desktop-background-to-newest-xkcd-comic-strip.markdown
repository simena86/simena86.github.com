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
from PIL import Image
from lxml import etree, html
import os

url='http://www.xkcd.com'

# get the comic and save it as png
def getImage(imgPath):
	page = html.fromstring(urllib.urlopen(url).read())
	img=page.xpath('//div[@id="comic"]/img/@src')
	img=img[0]
	urllib.urlretrieve(img, imgPath+ 'todaysXkcd.png')

def getMouseOverText():
	page = html.fromstring(urllib.urlopen(url).read())
	mText=page.xpath('//div[@id="comic"]/img/@title')[0]
	return mText
	
# using pil for image
from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw 
import textwrap

def textToImage(text,imgPath):
	font = ImageFont.truetype("FreeSerif.ttf", 14)
	textW,textH=font.getsize("S")
	xkcd=Image.open(imgPath)	
	xwidth, xheight = xkcd.size
	img= Image.new("RGBA", (xwidth,488), (255,255,255))
	draw=ImageDraw.Draw(img)
	margin = offset = 5
	for line in textwrap.wrap(text, width=xwidth/textW):
		draw.text((margin, offset), line, font=font, fill=(0,0,0))
		offset += font.getsize(line)[1]
	img=img.crop((0,0,xwidth,offset+textH ))
	return img

def stitchImagesTogether(xkcdImgPath,tImg):
	xImg=Image.open(xkcdImgPath)
	xw,xh=xImg.size
	tw,th=tImg.size
	img= Image.new("RGBA", (xw,xh+th), (255,255,255))
	img.paste(xImg,(0,0))
	img.paste(tImg,(0,xh))
	img.save('todaysXkcd.png')

imgPath='/home/simena/household/xkcdDesktop/'
getImage(imgPath)
text=getMouseOverText()
textImage=textToImage(text,imgPath + 'todaysXkcd.png')
stitchImagesTogether(imgPath + 'todaysXkcd.png',textImage)

# set the comic as background
os.system('gsettings set org.gnome.desktop.background picture-uri file://'+imgPath +  '/todaysXkcd.png')


{%endhighlight%}

The script fetches the image of the comic and the mouseover text. The mouseover text is rendered as an image and finally stitched together with the comic image.
If your're using a Unix based OS you can schedule the script to run e.g. every  Monday, Wednesday and Friday using [crontab](http://www.adminschoice.com/crontab-quick-reference/) 

<center>{% img /images/xkcd/xkcd.png %}</center>
