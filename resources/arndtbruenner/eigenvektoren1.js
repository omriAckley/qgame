
// m muß bereits diagonalisiert sein
// liefert die Eigenvektoren der diagonalisierten Matrix M-eE
// die Elemente von m können reele Fließkommazahlen sein oder [re,im] oder [re,im,n] mit (re+imî)/n und re, im, n ganz.
function eigenvektoren(m,n)
{	var i=0,j=0,s=new Array(),p=new Array(n),di=0,d=m[0].length;
	if(!isNaN(m[0]))d=1;
	for(i=0;i<n;i++)p[i]=-1;
	i=0;
	for(j=0;j<n;j++)
	{
		while(istNull(m[i*n+j])){s[s.length]=j;j++;if(j==n)break;}if(j==n)break;
		p[j]=i++;
	}
	//alert("s: "+s+"\np:  "+p+"\n\nm: "+m.join("   "));
	var v=new Array(s.length);
	for(i=0;i<s.length;i++)
	{
		v[i]=new Array(n);
		for(j=0;j<n;j++)
		{
			switch(d)
			{
			case 1:v[i][j]=(p[j]==-1)?0:-m[p[j]*n+s[i]]/m[p[j]*n+j];if(j==s[i])v[i][j]=1;break;
			case 2:
				v[i][j]=(p[j]==-1)?new Array(0,0):divkx2(m[p[j]*n+s[i]],m[p[j]*n+j]);v[i][j][0]*=-1;v[i][j][1]*=-1;
				if(j==s[i])v[i][j]=new Array(1,0);break;
			case 3:v[i][j]=(p[j]==-1)?new Array(0,0,1):divkx3(m[p[j]*n+s[i]],m[p[j]*n+j]);v[i][j][0]=multInt(-1,v[i][j][0]);v[i][j][1]=multInt(-1,v[i][j][1]);
				if(j==s[i])v[i][j]=new Array(1,0,1);break;
			}
		}
		ganzzahlig(v[i],n,d);
		//alert("Eigenvektor "+i+"\n"+v[i].join("\n")+"\n\n"+m.join("  "));
	}
	return v;
}
//m2=new Array(4,0,0,-3,0,1,0,-1,0,0,-4,5,0,0,0,0);
//m1=new Array(new Array(5,0,1),new Array(7,0,1),new Array(-5,0,1),new Array(-4,0,1),new Array(0,0,1),new Array(0,0,1),new Array(0,0,1),new Array(0,0,1),new Array(0,0,1),new Array(0,0,1),new Array(0,0,1),new Array(0,0,1),new Array(0,0,1),new Array(0,0,1),new Array(0,0,1),new Array(0,0,1));
//eigenvektoren(m1,4);


function istNull(x)
{
	if(!isNaN(x))return x==0;
	return(x[0]==0)&&(x[1]==0);
}
function divkx2(a,b)
{ 
	var n=b[0]*b[0]+b[1]*b[1];
	return new Array((a[0]*b[0]+a[1]*b[1])/n,(a[1]*b[0]-a[0]*b[1])/n);
}
function divkx3(a,b)
{
	return new Array(multInt(b[2],addInt(multInt(a[0],b[0]),multInt(a[1],b[1]))),
	                 multInt(b[2],subInt(multInt(a[1],b[0]),multInt(a[0],b[1]))),
	                 multInt(a[2],addInt(multInt(b[0],b[0]),multInt(b[1],b[1]))));
}
function ganzzahlig(v,n1,n2)
{
	var i,j,b,k=1,g=0,ii;
	if(n2==3)
	{
		for(i=0;i<n1;i++)
		{
			for(j=0;j<2;j++)
			{
				if(v[i][j]!=0){if(v[i][2]!=1)k=multInt(k,divInt(v[i][2],ggTInt(k,v[i][2])));}
			}
		}
		for(i=0;i<n1;i++){for(j=0;j<2;j++)v[i][j]=divInt(multInt(v[i][j],k),v[i][2]);v[i][2]=1;}
		for(i=0;i<n1;i++)
		{
			for(j=0;j<2;j++)
			{
				if(v[i][j]!=0)g=ggTInt(g,v[i][j]);
			}
		}
		if(g!=1){for(i=0;i<n1;i++)for(j=0;j<2;j++)v[i][j]=divInt(v[i][j],g);}
		return;
	}
	if(n2==2)
	{
		for(i=0;i<n1;i++)
		{
			for(j=0;j<2;j++)
			{
				if(v[i][j]!=0){b=kettenbruchapprox(v[i][j],10000,1e-10);
				if(b[1]!=1)k*=b[1]/ggT_(k,b[1]);}
			}
		}
		{
			var kk=0;
			for(i=0;i<n1;i++)for(j=0;j<2;j++)
			{
				v[i][j]=v[i][j]*k;
				if(Math.abs(v[i][j]-Math.round(v[i][j]))<1e-5){v[i][j]=Math.round(v[i][j]);kk++;}
			}
			if(kk>0)return;
		}
		return;
		
	}
	for(i=0;i<n1;i++)
	{
		if(v[i]!=0){b=kettenbruchapprox(v[i],10000,1e-14);if(b[1]!=1)k*=b[1]/ggT_(k,b[1]);}
		if((b[1]==1)&&(Math.round(b[0])!=b[0]))return;
	}
	for(i=0;i<n1;i++){v[i]=(v[i]*k);if(Math.abs(v[i]-Math.round(v[i]))<1e-10)v[i]=Math.round(v[i]);}
}
// d=1: m[i] reelle Fließkommazahl, d=2: m[i]=Array(re,im), d=3: m[i]=Array(re,im,n) (ganzzahlig!, siehe oben)
//n: Dimension, e: Eigenwert
function diagonalisieren(m_,n,e,d)
{
	if(d==2)return diag2(m_,n,e);
	if(d==3)return diag3(m_,n,e);
	var i,j,k,di=0,z,q,f,m=new Array(m_.length),dd=1e-13;
	do{
		for(i=0;i<m_.length;i++)m[i]=m_[i];
		for(i=0;i<n;i++)m[i*n+i]-=e;
		di=0;
		for(i=0;i+di<n;i++)
		{
			while(m[i*n+i+di]==0)
			{
				for(j=i+1;(j<n)&&(m[j*n+i+di]==0);j++);
				if(j==n){di++;if(i+di==n)break;else continue;}
				for(k=i+di;k<n;k++)m[i*n+i+di]+=m[j*n+i+di];
				break;			
			}
			q=m[i*n+i+di];
			for(j=0;j<n;j++)
			{
				if(i==j)continue;
				z=m[j*n+i+di];f=z/q;
				for(k=i+di;k<n;k++){m[j*n+k]-=f*m[i*n+k];if(Math.abs(m[j*n+k])<dd)m[j*n+k]=0;}
				m[j*n+i+di]=0;
			}
		}
		//alert(m+"\n\n"+dd);
		dd*=100;
	}while((m[m.length-1]!=0)&&(dd<1));
	return m;
}
function diag2(m_,n,e,d)
{
	var i,j,k,di=0,zr,zi,qr,qi,fr,fi,m=new Array(m_.length),dd=1e-13,nn;
	do{
		for(i=0;i<m_.length;i++)m[i]=new Array(m_[i][0],m_[i][1]);
		for(i=0;i<n;i++){m[i*n+i][0]-=e[0];m[i*n+i][1]-=e[1];}
		di=0;
		for(i=0;i+di<n;i++)
		{
			while(istNull(m[i*n+i+di]))
			{
				for(j=i+1;(j<n)&&(istNull(m[j*n+i+di]));j++);
				if(j==n){di++;if(i+di==n)break;else continue;}
				for(k=i+di;k<n;k++){m[i*n+k][0]+=m[j*n+k][0];m[i*n+k][1]+=m[j*n+k][1];}
				break;			
			}if(i+di>=n)break;
			qr=m[i*n+i+di][0];qi=m[i*n+i+di][1];nn=qr*qr+qi*qi;
			for(j=0;j<n;j++)
			{
				if(i==j)continue;
				zr=m[j*n+i+di][0];zi=m[j*n+i+di][1];
				fr=(zr*qr+qi*zi)/nn;fi=(zi*qr-zr*qi)/nn;
				for(k=i+di;k<n;k++)
				{
					m[j*n+k][0]-=fr*m[i*n+k][0]-fi*m[i*n+k][1];
					m[j*n+k][1]-=fr*m[i*n+k][1]+fi*m[i*n+k][0];
					if(Math.abs(m[j*n+k][0])+Math.abs(m[j*n+k][1])<dd)m[j*n+k][0]=m[j*n+k][1]=0;
				}
				m[j*n+i+di][0]=m[j*n+i+di][1]=0;
			}
		}
		//alert(m.join("\n")+"\n\n"+dd);
		dd*=100;
	}while((!istNull(m[m.length-1]))&&(dd<1));
	//alert(m.join("   ")+"\n\n"+dd);
	return m;
}
/*
var m=new Array( new Array(-652053591/695561897,-8939280/695561897),new Array(708337560/695561897,-36277920/695561897),new Array(-34882778/695561897,26221888/695561897),new Array(-3959802/695561897,5884368/695561897),new Array(5538731475/2782247588,27107795/695561897),new Array(-1568963471/695561897,116546480/695561897),new Array(111634967/695561897,-238548596/2086685691),new Array( 67312607/2782247588,-24379977/695561897),new Array(1145694210/695561897,30010440/695561897), new Array(   -2377990380/695561897,121790160/695561897),new Array( 812668366/695561897,-88030624/695561897),new Array( 13293621/695561897,-19754664/695561897),new Array(1490819285/695561897,-65580640/695561897),new Array(-2599620200/695561897,-203397600/695561897),new Array(-599095562/2086685691,577109632/2086685691),new Array(1408348696/695561897,-19576576/695561897));
//var m=new Array(-3.9589535250236403,   0.43252898119287036 ,  0.44172241095506603  ,  1.5322382936994367  ,  -1.9353482996532762 ,  -2.1770917241620844 ,   0.8130713059923649  ,  -1.6394949742583964 ,  0.9456099183973663 ,    2.285223969460302  , -0.7026407032535984  ,  2.0225545476832556 ,    2.963541484257346  ,  -0.3381080797114146 ,  -0.32707596399677796 ,  -1.1613140475606771 );
var dm=diagonalisieren(m,4,new Array(0,0),2);
eigenvektoren(dm,4);
*/