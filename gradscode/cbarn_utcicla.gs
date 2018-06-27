*
*  Script to plot a colorbar
*
*  The script will assume a colorbar is wanted even if there is 
*  not room -- it will plot on the side or the bottom if there is
*  room in either place, otherwise it will plot along the bottom and
*  overlay labels there if any.  This can be dealt with via 
*  the 'set parea' command.  In version 2 the default parea will
*  be changed, but we want to guarantee upward compatibility in
*  sub-releases.
*
*
*	modifications by mike fiorino 940614
*
*	- the extreme colors are plotted as triangles
*	- the colors are boxed in white
*	- input arguments in during a run execution:
* 
*	run cbarn sf vert xmid ymid
*
*	sf   - scale the whole bar 1.0 = original 0.5 half the size, etc.
*	vert - 0 FORCES a horizontal bar = 1 a vertical bar
*	xmid - the x position on the virtual page the center the bar
*	ymid - the x position on the virtual page the center the bar
*
*	if vert,xmid,ymid are not specified, they are selected
*	as in the original algorithm
*  

function colorbar (args)

sf=subwrd(args,1)
vert=subwrd(args,2)
xmid=subwrd(args,3)
ymid=subwrd(args,4)
res=subwrd(args,5)

if(sf='');sf=1.0;endif

*
*  Check shading information
*
*  'query shades'
  result=read("gradscode/utciclashadeinfo.conf")
  inter=sublin(result,2)
  cnum = subwrd(inter,2)
  say 'trovato 'inter
  say 'trovato 'cnum
  result=read("gradscode/utciclashadeinfo.conf")
  shdcolor=sublin(result,2)
  result=read("gradscode/utciclashadeinfo.conf")
  shdtime1 = sublin(result,2)
  if (cnum = 0) 
    say 'Cannot plot color bar: No shading information'
    return
  endif

* 
*  Get plot size info
*
  'query gxinfo'
  rec2 = sublin(result,2)
  rec3 = sublin(result,3)
  rec4 = sublin(result,4)
  xsiz = subwrd(rec2,4)
  ysiz = subwrd(rec2,6)
  ylo = subwrd(rec4,4)
  xhi = subwrd(rec3,6)
  xd = xsiz - xhi

  ylolim=0.6*sf
  xdlim1=1.0*sf
  xdlim2=1.5*sf  
  barsf=0.8*sf
  yoffset=0.2*sf
  stroff=0.05*sf
  strxsiz=0.12*sf
  strysiz=0.13*sf
*
*  Decide if horizontal or vertical color bar
*  and set up constants.
*
*  if (ylo<ylolim & xd<xdlim1) 
*    say "Not enough room in plot for a colorbar"
*    return
*  endif
*
*	logic for setting the bar orientation with user overides
*
  if (ylo<ylolim | xd>xdlim1)
    vchk = 1
    if(vert = 0) ; vchk = 0 ; endif
  else
    vchk = 0
    if(vert = 1) ; vchk = 1 ; endif
  endif
*
*	vertical bar
*
  if (vchk = 1 )

    if(xmid = '') ; xmid = xhi+xd/2 ; endif
    xwid = 0.2*sf
    ywid = 0.5*sf
    
    xl = xmid-xwid/2
    xr = xl + xwid
    if (ywid*cnum > ysiz*barsf) 
      ywid = ysiz*barsf/cnum
    endif
    if(ymid = '') ; ymid = ysiz/2 ; endif
    yb = ymid - ywid*cnum/2
    'set string 1 l 5'
    vert = 1

  else

*
*	horizontal bar
*

    ywid = 0.4
    xwid = 0.8

    if(ymid = '') ; ymid = ylo/2-ywid/2 ; endif
    yt = ymid + yoffset
    yb = ymid
    if(xmid = '') ; xmid = xsiz/2 ; endif
    if (xwid*cnum > xsiz*barsf)
      xwid = xsiz*barsf/cnum
    endif
    xl = xmid - xwid*cnum/2
    'set string 1 tc 5'
    vert = 0
  endif


*
*  Plot colorbar
*


  'set strsiz 'strxsiz' 'strysiz
  num = 0
  volte=1
  while (num<cnum) 
*    rec = sublin(shdinfo,num+2)
    col = subwrd(shdcolor,volte)
    hi1 = subwrd(shdtime1,volte)
*    hi2 = subwrd(shdtime2,volte)
    if (vert) 
      yt = yb + ywid
    else 
      xr = xl + xwid
    endif
*   Draw the left/bottom triangle
*    if (num = 0)
*      if(vert = 1)
*        xm = (xl+xr)*0.5
*        'set line 0'
*        'draw polyf 'xl' 'yt' 'xm' 'yb' 'xr' 'yt' 'xl' 'yt
*        'set line 0 1 5'
*        'draw line 'xl' 'yt' 'xm' 'yb
*        'draw line 'xm' 'yb' 'xr' 'yt
*        'draw line 'xr' 'yt' 'xl' 'yt
*      else
*        ym = (yb+yt)*0.5
*        'set line 0'
*        'draw polyf 'xl' 'ym' 'xr' 'yb' 'xr' 'yt' 'xl' 'ym
*        'set line 0 1 5'
*        'draw line 'xl' 'ym' 'xr' 'yb
*        'draw line 'xr' 'yb' 'xr' 'yt
*        'draw line 'xr' 'yt' 'xl' 'ym
*      endif
*    endif

*   Draw the middle boxes
*    if (num!=0 & num!= cnum+1)
      'set line 'col
      if (res='fine')
      'draw recf 'xl' 'yb' 'xr' 'yt-0.01
      else
      'draw recf 'xl' 'yb' 'xr' 'yt
      endif
      'set line 1 1 5'
      'draw rec  'xl' 'yb' 'xr' 'yt
*    endif

*   Draw the right/top triangle
*    if (num = cnum+1)
*      if (vert = 1)
*        'set line 0'
*        'draw polyf 'xl' 'yb' 'xm' 'yt' 'xr' 'yb' 'xl' 'yb
*        'set line 0 1 5'
*        'draw line 'xl' 'yb' 'xm' 'yt
*        'draw line 'xm' 'yt' 'xr' 'yb
*        'draw line 'xr' 'yb' 'xl' 'yb
*      else
*        'set line 0'
*        'draw polyf 'xr' 'ym' 'xl' 'yb' 'xl' 'yt' 'xr' 'ym
*        'set line 0 1 5'
*        'draw line 'xr' 'ym' 'xl' 'yb
*        'draw line 'xl' 'yb' 'xl' 'yt
*        'draw line 'xl' 'yt' 'xr' 'ym
*      endif
*    endif

*   Put numbers under each segment of the color key
    if (num < cnum+1)
      if (vert)
*        'set font 1' 
        xp=xr+stroff
        yo=(yt+yb)/2
        'draw string 'xp' 'yo' 'hi1
*        say 'draw string 'xp' 'yo' 'hi1
      else
        yp=yb-stroff
        xo=xr-xwid/2
*       'draw string 'xo' 'yp' 'hi1
*       say 'ecco 'hi1
*       'draw string 'xr' 'yp' 'hi1
      endif
    endif

*   Reset variables for next loop execution
    if (vert) 
      yb = yt
    else
      xl = xr
    endif
    num = num + 1
    volte=volte+1

  endwhile

return
