*###########################################################################
*#
*#                            CIBIC - Firenze
*#
*# Author  : Valerio Capecchi <valerio.capecchi@unifi.it>
*# Date    : 2008-02-15
*# UpDate  : 2012-06-22
*# Purpose : Generation of biometeo graphics for Italy
*# 
*#
*###########################################################################

function main(args)
filectl= subwrd(args,1)
inittime=subwrd(args,2)
tstep=subwrd(args,3)
fileconf = subwrd(args,4)
dirout = subwrd(args,5)

say 'file= 'filectl
say 'inittime= 'inittime
say 'tstep= 'tstep
say 'fileconf= 'fileconf
say 'dirout= 'dirout
*
* Reading config
*
ret = read (fileconf);tmp=sublin(ret,2);filemask=subwrd(tmp,3);
ret = read (fileconf);tmp=sublin(ret,2);filevector=subwrd(tmp,3);
ret = read (fileconf);tmp=sublin(ret,2);dirleg=subwrd(tmp,3);
ret = read (fileconf);tmp=sublin(ret,2);latmin=subwrd(tmp,3);latmax=subwrd(tmp,4);
ret = read (fileconf);tmp=sublin(ret,2);lonmin=subwrd(tmp,3);lonmax=subwrd(tmp,4);
* parea
ret = read (fileconf);tmp=sublin(ret,2);paxmin=subwrd(tmp,3);paxmax=subwrd(tmp,4);
ret = read (fileconf);tmp=sublin(ret,2);paymin=subwrd(tmp,3);paymax=subwrd(tmp,4);
* cbarn
ret = read (fileconf);tmp=sublin(ret,2);cbarnd=subwrd(tmp,3);cbarnvo=subwrd(tmp,4);cbarnx=subwrd(tmp,5);cbarny=subwrd(tmp,6);
ret = read (fileconf);tmp=sublin(ret,2);filecbarn=subwrd(tmp,3);
ret = read (fileconf);tmp=sublin(ret,2);filestring=subwrd(tmp,3);
ret = read (fileconf);tmp=sublin(ret,2);xtit1=subwrd(tmp,3);ytit1=subwrd(tmp,4);
ret = read (fileconf);tmp=sublin(ret,2);xtit2=subwrd(tmp,3);ytit2=subwrd(tmp,4);
ret = read (fileconf);tmp=sublin(ret,2);xtit3=subwrd(tmp,3);ytit3=subwrd(tmp,4);
ret = read (fileconf);tmp=sublin(ret,2);xinit=subwrd(tmp,3);yinit=subwrd(tmp,4);
ret = read (fileconf);tmp=sublin(ret,2);xinitd=subwrd(tmp,3);yinitd=subwrd(tmp,4);
ret = read (fileconf);tmp=sublin(ret,2);xvalid=subwrd(tmp,3);yvalid=subwrd(tmp,4);
ret = read (fileconf);tmp=sublin(ret,2);xvalidd=subwrd(tmp,3);yvalidd=subwrd(tmp,4);
ret = read (fileconf);tmp=sublin(ret,2);xtau=subwrd(tmp,3);ytau=subwrd(tmp,4);
ret = read (fileconf);tmp=sublin(ret,2);xcap1=subwrd(tmp,3);ycap1=subwrd(tmp,4);
ret = read (fileconf);tmp=sublin(ret,2);xcap2=subwrd(tmp,3);ycap2=subwrd(tmp,4);
* leggo title1
ret = read (fileconf);tit1=sublin(ret,2);
* leggo title2
ret = read (fileconf);tit2=sublin(ret,2);
* imagename
ret = read (fileconf);tmp=sublin(ret,2);imagename=subwrd(tmp,3);
* cap1
ret = read (fileconf);cap1=sublin(ret,2);
* file palette
ret = read (fileconf);tmp=sublin(ret,2);filepalette=subwrd(tmp,3);
* variabile da visualizzare
ret = read (fileconf);tmp=sublin(ret,2);biovar=subwrd(tmp,3);
*
* End of file conf
*
*
say "+++++++++++++++++++++++++++++++++++"
say "      "imagename
say "+++++++++++++++++++++++++++++++++++"

*
* Open nc
*
'sdfopen 'filectl
if (! filemask)
  say 'plot without mask'
else
  'sdfopen 'filemask
endif

* Trovo init time
'set time 'inittime
'q time'
initn=subwrd(result,6)
tmp=subwrd(result,3)
inith=substr(tmp,1,2)
initd=substr(tmp,4,2)
initm=substr(tmp,6,3)
inity=substr(tmp,9,5)
initstr=initn', 'initd' 'initm' 'inity' 'inith' UTC'

* Trovo lead time
'set t 1'
'q time'
leadn=subwrd(result,6)
tmp=subwrd(result,3)
leadh=substr(tmp,1,2)
leadd=substr(tmp,4,2)
leadm=substr(tmp,6,3)
leady=substr(tmp,9,5)
leadstr=leadn', 'leadd' 'leadm' 'leady' 'leadh' UTC'

'set csmooth on'
'set mpdset gradsdata/europa gradsdata/regioni 'filevector
'set map 1 1 1'
'set parea 'paxmin' 'paxmax' 'paymin' 'paymax
'set grads off'
'set grid off'
'set lat 'latmin ' 'latmax 
'set lon 'lonmin ' 'lonmax 

*
* Display var
*
'set gxout shaded'
'run 'dirleg'/'filepalette
 
say filepalette

*Set time and display var
'set t 1'

'd 'biovar


if (! filemask)
  say ''
else
  'set dfile 2'
  'set lat 'latmin ' 'latmax
  'set lon 'lonmin ' 'lonmax
  'set z 1'
  'set t 1'
  'set gxout fgrid'
  'set fgvals 1 0'
  'd mask_rho.2'
  'set dfile 1'
endif

* 
* Draw string
*

'set font 0'
'set string 15 tl 4 0'
'set strsiz 0.14'
'draw string 'xtit1' 'ytit1' 'tit1
'draw string 'xtit2' 'ytit2' 'tit2
'set string 15 tl 4'
'set strsiz 0.18'
'draw string 'xcap1' 'ycap1' 'cap1
'set font 0'
'set string 1 tl 4'
'set strsiz 0.14'
'draw string 'xinit' 'yinit' Init.:'
'draw string 'xvalid' 'yvalid' Valid:'
'set strsiz 0.16'
*'draw string 'xtau' 'ytau' t=+'tstep'h'
'draw string 'xtau' 'ytau' t='
'set strsiz 0.14'
'set string 4 tl 4'
'draw string 'xtau+0.265' 'ytau' +'tstep'h'
'draw string 'xinitd' 'yinitd' 'initstr
'draw string 'xvalidd' 'yvalidd' 'leadstr
*
* Draw strings near palette
*
'run 'dirleg'/'filestring
'run 'dirleg'/'filecbarn' 'cbarnd' 'cbarnvo' 'cbarnx+0.1' 'cbarny

*
* Layer vettoriale province toscana
*

*'set mpdraw off'
*'set line 1 1 1'
*'set cthick 1'
*'set mpdset 'filevector

*
* Printim
'printim 'dirout'/'imagename'_'tstep'.png x800 y600 white'
'c'
'quit'
return

