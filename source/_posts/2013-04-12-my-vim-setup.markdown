---
layout: post
title: "My Vim Setup"
date: 2013-04-12 20:03
comments: true
categories: [linux]
---
Vim is a very popular text editor for Unix-like systems, written by Bram Moolenaar. I have been using Vim for a couple of years now and have found some nice features that make it more efficient for my use.  

<!-- more -->

Basics
-------


First of all one should look into the root configuration file /etc/vim/vimrc.
I uncommented some things here that I found useful, like for instance 
`

``` vim /etc/vim/vimrc 
set showcmd		" Show (partial) command in status line.
set showmatch		" Show matching brackets.
set ignorecase		" Do case insensitive matching
set hidden             " Hide buffers when they are abandoned
set mouse=a		" Enable mouse usage (all modes)
```

For the rest of the changes i updatet .vimrc and the .vim folder in the home directory. In my ~/.vimrc I have some basic commands :



``` vim ~/.vimrc
filetype plugin on
set nocp
set autoindent
set cindent
set ts=4
set nu
set scrolloff=2
set clipboard=unnamedplus
```

This changes things like the lenght of the indentation (which I found to be way too long with the default setup), as well as enabling plugins, setting the right clipboard etc.

Plugins
---------

This is where it gets interesting. There is alot of plugins out there and I've found some really nice ones. 
[Pathogen](http://www.vim.org/scripts/script.php?script_id=2332 "Pathogen") is used to make dealing with plugins very easy. To make this work follow the instructions from the plugin page and remember to add the following to ~/.vimrc :
{% highlight vim %}
execute pathogen#infect()
{% endhighlight %}



### C/C++

[Exuberant Ctags](http://ctags.sourceforge.net/) is another great plugin that makes a tags database wich is used by vim to autocomplete variables and functions. Together with [code_complete](http://www.vim.org/scripts/script.php?script_id=1764) and [omniCppComplete](http://www.vim.org/scripts/script.php?script_id=1520) it also offers autocompletion of function parameters and class and struct members much the same way that can be found with IDE's like eclipse:


{% img /images/vim/autocomplete.png 420 200 %}

If you're running a debian systems the easiest way to install ctags is to use

{% highlight vim %}
sudo apt-get install exuberant-ctags
{% endhighlight %}

Code\_complete can just be downloaded [here](http://www.vim.org/scripts/script.php?script_id=1764) and placed in the ~/.vim/plugin/ directory.

To use these plugins tag-files is made by generating tags based on source code files. Im using the following command to do this:

{% highlight vim %}
ctags -R * --c++-kinds=+p --fields=+iaS --extra=+q  
{% endhighlight %}

When executing this command it will generate a file in the current directory and make tags based on all source code in the current and all subdirectories. The tag file is used by ctags, code\_complete and omniCppComplete. To let vim know where to look for tag files on has to specify this in vimrc by 


``` vim ~/.vimrc
set tags=/path/to/tagdir1
set tags+=/path/to/tagdir2
``` 

Ctags searches for tag-files which is specified in ~/.vimrc. I'm using the following in my .vimrc file to look for tag files 

``` vim ~/.vimrc
set tags=/usr/include/tags
set tags+=./tags
``` 


Lastly I use git hooks to update tag files in projects. The best way to do this is to first make the directory ~/.git\_template where you can define templates for git to use every time you run git init. In the .git_templates directory I have a directory for [git hooks](http://git-scm.com/book/en/Customizing-Git-Git-Hooks) with two files: \_    

post-commit:

``` bash ~/.git_templates/hooks/post-commit
#!/bin/sh
.git/hooks/ctags >/dev/null 2>&1 &
```

ctags:

``` bash ~/.git_templates/hooks/ctags
#!/bin/sh
set -e
PATH="/usr/local/bin:$PATH"
trap "rm -f .git/tags.$$" EXIT
ctags  --c++-kinds=+p --fields=+iaS --extra=+q --tag-relative -Rf.git/tags.$$  --exclude=.git --languages=-javascript,sql
mv .git/tags.$$ .git/tags
```

With these scripts you will generate a new tag file in the local .git directory of the current project every time you make a commit. 



### Python

For python source code I use the wonderful jedi-vim. Which is a really great and advanced plugin, providing the same functionality ctags and omniCppComplete provides for C/C++. 

Install it with the following

``` bash
cd ~/.vim/bundle/; 
git clone git://github.com/davidhalter/jedi-vim.git; 
cd jedi-vim;
git submodule update --init
```

I also found installing supertab useful

``` bash
cd ~/.vim/bundle/; 
git clone git://github.com/ervandew/supertab.git
```

To configure jedi-vim and supertab, put the following in your .vimrc file

``` bash ~/.vimrc
let g:SuperTabDefaultCompletionType = "context"
let g:jedi#popup_on_dot = 0  # disables the autocomplete to popup whenever you press .
syntax on
filetype plugin indent on
```



