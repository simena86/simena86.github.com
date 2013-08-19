#!/bin/bash

cnt=0
for f in ./*.JPG
do
	convert -resize 800x533 $f $f
	mv $f im_$cnt.JPG
	convert im_$cnt.JPG im_$cnt.png

	cnt=$(($cnt+1))
done

