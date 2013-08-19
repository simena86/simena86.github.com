---
layout: post
title: "Logging accelerometer from Android phone on PC"
date: 2013-01-26 00:25
comments: true
categories: [linux, android] 
---

I am pretty new to Android and decided to play around with the sensors. I always find accelerometers fun to play with, and like to visualize the sensor reading through a real time plot. In the java-script for the android app below, the acceleration in the x axis is read and streamed through a TCP socket to the PC over wlan. A simple python server script reads the data from a socket and writes it to a perl script, logging the data in GnuPlot, and thus setting my personal record for mixing different languages.

<!-- more-->



The Android script:

{% img left http://sacybernetics.files.wordpress.com/2012/06/2012-06-03-23-07-43.png 300 180 %}

show source

The simple python server script below opens a TCP socket and receives the readings from the Android app over WLAN. Note that the python script reads the last entry in the receive buffer, which then makes up a LIFO que, and no timestamp is added to the reading. For a signal analysis one would add a time stamp and a FIFO que should be used instead. For debugging and pure fun, the method I used is still pretty sufficient.
`
The plotting is excecuted with piping the output from the python script to the perl script in the linux terminal:

``` bash
$ ./server.py | ./driveGnuPlot.pl 1 500 "Accelerometer Reading"
```

Python server :

``` python server.py
#!/usr/bin/python
import socket
from time import *
import sys 

serv=socket.socket()

HOST=''
#let's set up some constants
#HOST="78.91.80.123"
PORT = 15000   #arbitrary port not currently in use
#ADDR = (HOST,PORT)    #we need a tuple for the address
BUFSIZE = 4096    #reasonably sized buffer for data
 
 
#bind our socket to the address
try:
	serv.bind((HOST, PORT))    
	serv.listen(5)   
	conn,addr = serv.accept()
except KeyboardInterrupt:
	print "Keyboard Interrupt"
	serv.close()
	exit(1)
try:
	for i in range(0,3100):
		data=conn.recv(4096)
		sys.stdout.flush()
		chunk=data.split()
		sys.stdout.write("0:%s\n" % chunk[-1]) # writes the last element in the list
		sleep(0.03)

	conn.close()
	sleep(10)

except KeyboardInterrupt:
	conn.close()
	print "bye!"
except IndexError:
	conn.close()
	print "indexError"
```


And lastly the python script pipes data to a Perl script written by Thanassis Tsiodras.


``` perl

#!/usr/bin/perl -w
use strict;
use Time::HiRes qw/sleep/;


sub usage {
    print "Usage: $0 <options>\n";
    print <<OEF;
where options are (in order):

  NumberOfStreams                         How many streams to plot (windows)
  Stream1_WindowSampleSize <Stream2...>   This many window samples for each stream
  Stream1_Title <Stream2_Title> ...       Title used for each stream
  (Optional) Stream1_geometry <Stream2_geometry>...  X and Y position in pixels from the top left

The last parameters (the optionally provided geometries of the gnuplot windows) 
are of the form: 
  WIDTHxHEIGHT+XOFF+YOFF
OEF
    exit(1);
}

sub Arg {
    if ($#ARGV < $_[0]) {
	print "Expected parameter missing...\n\n";
	usage;
    }
    $ARGV[int($_[0])];
}

sub main {
    my $argIdx = 0;
    my $numberOfStreams = Arg($argIdx++);
    print "Will display $numberOfStreams Streams (in $numberOfStreams windows)...\n";
    my @sampleSizes;
    for(my $i=0; $i<$numberOfStreams; $i++) {
		my $samples = Arg($argIdx++);
		push @sampleSizes, $samples;
		print "Stream ".($i+1)." will use a window of $samples samples\n";
    }
    my @titles;
    for(my $i=0; $i<$numberOfStreams; $i++) {
	my $title = Arg($argIdx++);
	push @titles, $title;
	print "Stream ".($i+1)." will use a title of '$title'\n";
    }
    my @geometries;
    if ($#ARGV >= $argIdx) {
	for(my $i=0; $i<$numberOfStreams; $i++) {
	    my $geometry = Arg($argIdx++);
	    push @geometries, $geometry;
	    print "Stream ".($i+1)." will use a geometry of '$geometry'\n";
	}
    }
    my $terminal = "";
    open GNUPLOT_TERM, "echo 'show terminal;' | gnuplot 2>&1 |";
    while (<GNUPLOT_TERM>) {
	if (m/terminal type is (\w+)/) {
	    $terminal=$1;
	}
    }
    close GNUPLOT_TERM;

    # unfortunately, the wxt terminal type does not support positioning. 
    # hardcode it...
    $terminal  = "x11";

    my @gnuplots;
    my @buffers;
    my @xcounters;
    shift @ARGV; # number of streams
    for(my $i=0; $i<$numberOfStreams; $i++) {
		shift @ARGV; # sample size
		shift @ARGV; # title
		shift @ARGV; # geometry
		local *PIPE;
		my $geometry = "";
		if (-1 != $#geometries) {
		    $geometry = " -geometry ".$geometries[$i];
		}
	open PIPE, "|gnuplot $geometry " || die "Can't initialize gnuplot number ".($i+1)."\n";
	select((select(PIPE), $| = 1)[0]);
	push @gnuplots, *PIPE;
	print PIPE "set xtics\n";
	print PIPE "set ytics\n";
	print PIPE "set style data lines\n";
	print PIPE "set grid\n";
	if ($numberOfStreams == 1) {
	    print PIPE "set terminal $terminal title '".$titles[0]."' noraise\n";
	} else {
	    print PIPE "set terminal $terminal noraise\n";
	}
	print PIPE "set autoscale\n";
	my @data = [];
	push @buffers, @data;
	push @xcounters, 0;
    }
    my $streamIdx = 0;
    select((select(STDOUT), $| = 1)[0]);
    while(<>) {
		chomp;
		my @parts = split /:/;
		$streamIdx = $parts[0];
		my $buf = $buffers[$streamIdx];
		my $pip = $gnuplots[$streamIdx];
		my $xcounter = $xcounters[$streamIdx];
		my $title = $titles[$streamIdx];

	# data buffering (up to stream sample size)
	push @{$buf}, $parts[1];
	#print "stream $streamIdx: ";
	print $pip "set xrange [".($xcounter-$sampleSizes[$streamIdx]).":".($xcounter+1)."]\n";
	if ($numberOfStreams == 1) {
	    print $pip "plot \"-\"\n";
	} else {
	    print $pip "plot \"-\" title '$title'\n";
	}
	my $cnt = 0;
	for my $elem (reverse @{$buf}) {
	    #print " ".$elem;
	    print $pip ($xcounter-$cnt)." ".$elem."\n";
	    $cnt += 1;
	}
	#print "\n";
	print $pip "e\n";
	if ($cnt>=$sampleSizes[$streamIdx]) {
	    shift @{$buf};
	}
	$xcounters[$streamIdx]++;
    }
    for(my $i=0; $i<$numberOfStreams; $i++) {
	my $pip = $gnuplots[$i];
	print $pip "exit;\n";
	close $pip;
    }
}

main;
sleep(3);

```




