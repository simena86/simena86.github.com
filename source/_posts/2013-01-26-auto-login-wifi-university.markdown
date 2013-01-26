---
layout: post
title: "Auto login WiFi – University"
date: 2013-01-26 01:23
comments: true
categories: 
---

When using the University WiFi I found it annoying that I always had to login through a browser using my university username and password. Using the simple scripts below, this bothersome procedure can be done automatically each time the computer discovers a network.
<!-- more -->
I am using Wicd Network Manager, which has a nice feature where one can include scripts that you want to run when the computer connects and disconnects to a network ( see wicd documentation). Using this feature I made a short script to run different tasks when the computer discovered different Wifi's. I have a file called perform_on_post_connect.sh in the directory /etc/wicd/scripts/postconnect on my linux machine with the following code:


{% highlight bash%}

#!/bin/bash

essid=$2
connection_type=$1

if 	[ "${essid}" == "Foo network" ]; then
	# do something when logging into 'Foo network'
	./myscripts/foo_autologin.py
elif [ "${essid}" == "Bar network" ]; then
	# do something else when connecting to 'Bar network'
fi

{%endhighlight%}

I then use a python script called foo_autologin.py that performs the nessecary login procedure. If I am not mistaken, with Wicd one has to have this in a directory with only root access. The source for foo_autologin.py:

{%highlight python %}

#!/usr/bin/python
import requests
import sys

#
# AUTO LOGIN TO Foo NETWORK
#

print "This is an automatic login to Foo network"
URL='<login url>' 
EMAIL = '<your email>'
PASSWORD = '<your password>'

def main():
   # Start a session so we can have persistant cookies
   session = requests.session(config={'verbose': sys.stderr})
   # use headers that is posted in the HTML POSt method
   headers={'Connection':'keep-alive'}
   # use data originally in your html-login
   login_data = {
        'username': EMAIL,
        'password': PASSWORD,
        'buttonClicked':'4',
		'err_flag':'0',		
    }
    r = session.post(URL, data=login_data, headers=headers, timeout=10.00)

if __name__ == '__main__':
    main()

{%endhighlight%}


When using the code above one has to use the headers and data used in the post method. The way I got the data from a login to the university was through using a Firefox Extension called Live HTTP Headers, as I found that chrome would not show HTTP traffic for HTTPS sites.

After monitoring a login using Live HTTP headers one can fill in the headers and data. Im sure there is a way of automating this task So feel free to share.
