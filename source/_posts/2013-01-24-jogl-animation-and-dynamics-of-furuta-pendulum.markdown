---
layout: post
title: "JOGL - Animation and Dynamics of Furuta pendulum"
date: 2013-01-24 20:44
comments: true
categories: [linux, java, jogl]
---



I wanted to animate a furuta pendulum, and include the real dynamics in the animation. First off, what is a Furuta pendulum? It is a pendulum with two degrees of freedom (see wikipedia) where, from a control engineers' point of view, one is interested in stabilizing the second arm of the pendulum, by applying torque to the first arm. This poses quite an interesting control problem (much the same as in e.g. a segway). First lets look at the dynamimcs of the furuta pendulum:
<!-- more -->

The dynamics of the furuta pendulum can be modeled with two second order differential equations. For simulations we will reduce the order and model the system with 4 first order ODE's. The following state space vector will be used:
$$
 \begin{aligned} x=\begin{bmatrix} \\ \frac{d\theta_{1}}{dt} & \frac{d\theta_1}{dt}& \theta_{1}&\theta_{2}\end{bmatrix}  \end{aligned}
$$

With the use of Lagrangian or Newton dynamics one can model the system which yields the following 2. order ODE's:

$$
{ \scriptsize
\begin{aligned}
& \frac{d^2\theta_1}{dt^2}= \\
&  \frac{ (mx_1^2cos(x_4)
sin(x_4)^3L_2^3+(gmsin(x_4)^3-2mx_1x_2cos(x_4)^2sin(x_4)L_1)L_2^2+((mx_1^2-mx_2^2)cos(x_4)sin(x_4)L_1^2+x_1^2cos(x_4)sin(x_4)J_1)
L_2+gmsin(x_4)L_1^2+\tau cos(x_4)L_1+gsin(x_4)J_1)}{(msin(x_4)^2L_2^3+((m-mcos(x_4)^2)L_1^2+J_1)L_2)}
\\
&\frac{d^2\theta_2}{dt^2}=\\
& \frac{(mx_1^2cos(x_4) 
sin(x_4)^3L_2^3+(gmsin(x_4)^3-2mx_1x_2cos(x_4)^2sin(x_4)L_1)L_2^2+((mx_1^2-mx_2^2)cos(x_4)sin(x_4)L_1^2+x_1^2cos(x_4)sin(x_4)J_1)
L_2+gmsin(x_4)L_1^2+taucos(x_4)L_1+gsin(x_4)J_1)}{(msin(x_4)^2L_2^3+((m-mcos(x_4)^2)L_1^2+J_1)L_2)}
\end{aligned}
}
$$

The following state space equations used in the simulation is therefor
$$
\dot{x}= \begin{bmatrix}\ddot{\theta}_1 \\ \ddot{\theta}_2 \\ \theta_1 \\ \theta_2 \end{bmatrix} = f(x)
$$

And one can easily solve the dynamics by numerical integration. I have solved the system using Explicit Runge Kutta 4 which yields a discrete solution that can easily be used in a OpenGl 3d animation. The main idea for capturing the dynamics in the animation is to, in  each call to the display() function (each new frame of the animation), calculate the next iterate of the numerical integrator (RK4 in this case). This can be seen in the code below, where $$ f_1=\ddot{\theta}_1 $$ and f2, f3,f4 (not shown in the code) each calculates their derrivatives which is used in one multiple input, multiple output function f. Lastly this is used in solve_dyn() to calculate an iterate from the RK4 method.

{% highlight java %}
public double f1(Matrix x, double u ){
	double x1,x2,x4;
	double tau;
	x1=x.get(0,0); x2=x.get(0,1); x4=x.get(0,3);
	double sign;
	if (x1<0){sign=1;}else{sign=-1;}
	u=u+sign*5.0;
	tau=u;

	double f_num=(arm1*arm2*m*Math.pow(x1,2)*Math.pow((Math.cos(x4)),2)+(arm1*g*m-
              2*Math.pow(arm2,2)*m*x1*x2)
	 	*(Math.cos(x4))-arm1*arm2*m*Math.pow(x2,2))*(Math.sin(x4))+tau;
	double f_denum=Math.pow(arm2,2)*m*Math.pow((Math.sin(x4)),2)-Math.pow(arm1,2)*m*Math.pow((Math.cos(x4)),2)+                  Math.pow(arm1,2)*m+J1;
	if(f_denum==0){
		System.out.println("divide by zero");
	        return 1.0f;
	}else
	        return f_num/f_denum;
	}

public Matrix f(Matrix x, double u){
       Matrix retVal = new Matrix(new double[]{f1(x, u) ,f2(x, u),f3(x, u),f4(x, u)},1);
       return retVal;
 }

public double [] solve_dyn(){
       k1= f(x,tau).times(h);
       k2= f( x.plus(k1.times(0.5)),tau).times(h);
       k3= f(x.plus(k2.times(0.5)),tau).times(h);
       k4= f( x.plus(k3),tau).times(h);
       x_next= x.plus(k1.times((1.0/6.0))).plus(k2.times((1.0/3.0))).
               plus(k3.times(1.0/3.0)).plus(k4.times(1.0/6.0));
       x=x_next;
       return new double [] {x.get(0,2)*rad2deg, x.get(0,3)*rad2deg};
 }


{% endhighlight%}

The animation:

{% youtube Lmvn_uDE4HE %}




The source can now be cloned from git here.
