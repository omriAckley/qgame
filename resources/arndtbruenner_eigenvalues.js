//ALL THE CREDIT GOES TO Arndt Brünner
//I'm using code from this wonderful website: http://www.arndt-bruenner.de/mathe/scripts/engl_eigenwert2.htm
//Specifically, I'm using code from the detb.js and solvepkx.js files

// Javascript (c) Arndt Brünner, Juli 2008
// Eigenwerte und -vektoren komplexwertiger Matrizen

//benötigt bigint1.js

//m[0...n*n-1] usw. mit (m[i][0]+m[i][1]*î)/m[i][2]
/*

//FROM FILE: detb.js

function det(m)
{
	if(m[0].length==2)return detf(m);
	var nq=m.length,n=Math.round(Math.sqrt(nq));
	if(n*n!=nq)return;
	if(n==1)return new Array(m[0][0],m[0][1],m[0][2]);
	var i,j,k,d=new Array(1,0,1),dd=new Array(1,0,1),di,dj;
		//alert(m.join("\n")+"\n\nn="+n);

	for(i=0;i<n-1;i++)
	{status=n+"  "+i;
		di=n*i+i;
		if((m[n*i+i][0]==0)&&(m[di][1]==0))
		for(j=i+1;j<n;j++)
		{
			if((m[n*j+i][0]!=0)||(m[n*j+i][1]!=0))
			{
				//status="addiere Zeile "+j;
				for(k=i;k<n;k++)sube(m,n,i,j,k,1,0,1,-1,0,1);
				break;
			}
			if(j==n)return new Array(0,0,1);
		}
		var rr=m[di][0],ii=m[di][1],nn=m[di][2];
		for(j=i+1;j<n;j++)
		{
			//status=i+"  "+j;
			dj=n*j+i;
			if((m[dj][0]==0)&&(m[dj][1]==0))continue;
			for(k=n-1;k>i;k--){sube(m,n,j,i,k,rr,ii,nn,m[dj][0],m[dj][1],m[dj][2]);kzkx(m[dj]);zmult++;zadd++;}
			dd=multkx(dd,m[di]);zmult++;
			m[dj][0]=0;m[dj][1]=0;m[dj][2]=1;
		}
		//alert(m.join("\n")+"\n\nd=("+d+")/("+dd+")");
		kzkx(dd);
	}
	//status="mult d";
	for(i=0;i<n;i++){d=multkx(d,m[i*n+i]);zmult++;if(d[2]==0)alert("!");if((d[0]==0)&&(d[1]==0)){d[2]=1;return d;}}
	
	//alert("("+d+")/("+dd+")");
	//status="div d/dd";
	d=divkx(d,dd);zmult++;
	//status="krz d";
	kzkx(d);
	//status="";
	return d;
}
*/
function detf(m)
{
	var nq=m.length,n=Math.round(Math.sqrt(nq));
	if(n*n!=nq)return;
	if(n==1)return new Array(m[0][0],m[0][1]);
	var i,j,k,d=new Array(1,0),dd=new Array(1,0),di,dj,fr,fi,x;
		//alert(m.join("\n")+"\n\nn="+n);

	for(i=0;i<n-1;i++)
	{
		di=n*i+i;
		if((m[di][0]==0)&&(m[di][1]==0))
		for(j=i+1;j<n;j++)
		{
			if((m[n*j+i][0]!=0)||(m[n*j+i][1]!=0))
			{
				//status="addiere Zeile "+j;
				for(k=i;k<n;k++){m[n*i+k][0]+=m[n*j+k][0];m[n*i+k][1]+=m[n*j+k][1];}
				break;
			}
			if(j==n)return;
		}
		var rr=m[di][0],ii=m[di][1],nn=rr*rr+ii*ii;
		for(j=n-1;j>i;j--)
		{
			//status=i+"  "+j;
			dj=n*j+i;
			if((m[dj][0]==0)&&(m[dj][1]==0))continue;
			fr=(m[dj][0]*rr+m[dj][1]*ii)/nn;
			fi=(m[dj][1]*rr-m[dj][0]*ii)/nn;
			for(k=n-1;k>i;k--)
			{
				m[n*j+k][0]-=fr*m[i*n+k][0]-fi*m[i*n+k][1];
				m[n*j+k][1]-=fr*m[n*i+k][1]+fi*m[n*i+k][0];
			}
			x=dd[0]*m[di][0]-dd[1]*m[di][1];
			//dd[1]=dd[1]*m[di][0]+dd[0]*m[di][1];
			//dd[0]=x;
			m[dj][0]=0;m[dj][1]=0;
			//alert(m.join("\n"));
		}
		//alert(m.join("\n")+"\n\nd=("+d+")/("+dd+")");
	}
	//alert(m.join("\n")+"\n\nd=("+d+")/("+dd+")");
	//status="mult d";
	//alert("d="+d+"\ndd="+dd);
	for(i=0;i<n;i++)
	{
		di=i*n+i;
		x=d[0]*m[di][0]-d[1]*m[di][1];d[1]=d[1]*m[di][0]+d[0]*m[di][1];d[0]=x;
	}	
	//alert("("+d+")/("+dd+")");
	//status="div d/dd";
	//nn=dd[0]*dd[0]+dd[1]*dd[1];
	//x=(d[0]*dd[0]+d[1]*dd[1])/nn;
	//d[1]=(d[1]*dd[0]-d[0]*dd[1])/nn;
	//d[0]=x;
	//status="krz d";
	//status="";
	return d;
}


//5,2,3;4,3,2;0,1,2
/*var m=new Array(new Array(5,0,1),new Array(2,0,1),new Array(3,0,1),new Array(0,0,1),
                new Array(4,0,1),new Array(3,1,1),new Array(2,0,1),new Array(-3,0,2),
                new Array(0,0,1),new Array(1,0,1),new Array(2,0,1),new Array(-2,0,1),
	          new Array(0,0,1),new Array(9,0,1),new Array(-2,0,1),new Array(1,0,1));*/
//alert(det(m));
//alert(charpolykoeff(m,4,4));
//alert(minor(m,3," 0 2").join("\n"));
/*
var zadd,zmult;

function charpolykoeff(m_,n,i)
{
	if(m_[0].length==2)return charpolykoefff(m_,n,i);
	//status="cpk "+n+" "+i;
	var v=((i%2)==1)?-1:1;
	var m=new Array(n*n),a=new Array(0,0,1),j,mm,d,ii=new Array(i),k,kkk=0;
	if(i==n)return new Array(v,0,1);
	for(j=0;j<m_.length;j++)m[j]=new Array(m_[j][0],m_[j][1],m_[j][2]);
	if(i==0){d=det(m);return new Array(multInt(v,d[0]),multInt(v,d[1]),d[2]);}
	if(i==n-1){var s=spur(m,n);return new Array(multInt(v,s[0]),multInt(v,s[1]),s[2]);}
	for(j=0;j<i;j++)ii[j]=j;
	do
	{
		kkk++;
		//status="I="+" "+ii.join(" ");
		mm=minor(m,n," "+ii.join(" ")+" ",ii.length);
		//alert("Minor, "+ii.join(" ")+"\n\n"+mm.join("\n"));
		d=det(mm);
		if(d[2]==0)alert();
		//alert(mm.join("\n")+"\n\nDet = "+d+"\nI= "+ii+"\nj="+j);
		//status="add d (a=("+a+")+("+d+")";
		a=addkx(a,d);kzkx(a);
		//status=a;
		ii[k=i-1]++;
		while(ii[k]>n+k-i)
		{
			k--;
			if(k<0)break;
			ii[k]++;
			for(kk=k+1;kk<ii.length;kk++)ii[kk]=ii[kk-1]+1;
		}
	}while(k>=0);
	//status="mult "+a+"*"+v;
	if(v==-1)a[0]=multInt(a[0],v);a[1]=multInt(a[1],v);
	return a;
}
*/

function charpolykoefff(m_,n,i)
{
	var v=((i%2)==1)?-1:1;
	var m=new Array(n*n),a=new Array(0,0),j,mm,d,ii=new Array(i),k,kkk=0;
	if(i==n)return new Array(v,0);
	for(j=0;j<m_.length;j++)m[j]=new Array(m_[j][0],m_[j][1]);
	if(i==0){d=detf(m);return new Array(v*d[0],v*d[1]);}
	if(i==n-1){var s=spurf(m,n);return new Array(v*s[0],v*s[1]);}
	for(j=0;j<i;j++)ii[j]=j;
	do
	{
		kkk++;
		//status="I="+" "+ii.join(" ");
		mm=minorf(m,n," "+ii.join(" ")+" ",ii.length);
		//alert("Minor, "+ii.join(" ")+"\n\n"+mm.join("\n"));
		d=detf(mm);
		if(d[2]==0)alert();
		//alert(mm.join("\n")+"\n\nDet = "+d+"\nI= "+ii+"\nj="+j);
		//status="add d (a=("+a+")+("+d+")";
		a[0]+=d[0];a[1]+=d[1];
		//status=a;
		ii[k=i-1]++;
		while(ii[k]>n+k-i)
		{
			k--;
			if(k<0)break;
			ii[k]++;
			for(kk=k+1;kk<ii.length;kk++)ii[kk]=ii[kk-1]+1;
		}
	}while(k>=0);
	//status="mult "+a+"*"+v;
	if(v==-1){a[0]*=v;a[1]*=v;}
	return a;
}



/*
function sube(m,n,zz,qz,s,rz,iz,nz,rq,iq,nq)
{
	//alert("subtrahiere: \nQuellzeile: "+qz+"  ("+m[n*qz+s]+")\nZielzeile: "+zz+"  ("+m[n*zz+s]+")\nSpalte: "+s+"\nFaktor q: "+rq+","+iq+","+nq+"\nFaktor z: "+rz+","+iz+","+nz);
	var r,i,n,jz=zz*n+s,jq=qz*n+s;
	//(iq·mjq1·mjz2·nz - iz·mjq2·mjz1·nq - mjq0·mjz2·nz·rq + mjq2·mjz0·nq·rz)/(mjq2·mjz2·nq·nz) 
	r=multInt(multInt(iq,m[jq][1]),multInt(m[jz][2],nz));
	r=subInt(r,multInt(multInt(iz,m[jq][2]),multInt(m[jz][1],nq)));
	r=subInt(r,multInt(multInt(nz,m[jq][0]),multInt(m[jz][2],rq)));
	r=addInt(r,multInt(multInt(nq,m[jq][2]),multInt(m[jz][0],rz)));
	n=multInt(multInt(nq,m[jq][2]),multInt(m[jz][2],nz));
	// î·(iz·mjq2·mjz0·nq - iq·mjq0·mjz2·nz - mjq1·mjz2·nz·rq + mjq2·mjz1·nq·rz)/(mjq2·mjz2·nq·nz)
	i=multInt(multInt(iz,m[jq][2]),multInt(m[jz][0],nq));
	i=subInt(i,multInt(multInt(iq,m[jq][0]),multInt(m[jz][2],nz)));
	i=subInt(i,multInt(multInt(rq,m[jq][1]),multInt(m[jz][2],nz)));
	i=addInt(i,multInt(multInt(nq,m[jq][2]),multInt(m[jz][1],rz)));
	m[jz][0]=r;m[jz][1]=i;m[jz][2]=n;//alert(m[jz]);
	kzkx(m[jz]);
}
function suber(m,n,zz,qz,s,rz,iz,nz,rq,iq,nq)
{
	//alert("subtrahiere: \nQuellzeile: "+qz+"  ("+m[n*qz+s]+")\nZielzeile: "+zz+"  ("+m[n*zz+s]+")\nSpalte: "+s+"\nFaktor q: "+rq+","+iq+","+nq+"\nFaktor z: "+rz+","+iz+","+nz);
	var r,i,n,jz=zz*n+s,jq=qz*n+s,g;
	//(iq·mjq1·mjz2·nz - iz·mjq2·mjz1·nq - mjq0·mjz2·nz·rq + mjq2·mjz0·nq·rz)/(mjq2·mjz2·nq·nz) 
	r=multInt(multInt(nq,m[jq][2]),multInt(m[jz][0],rz));
	r=subInt(r,multInt(multInt(nz,m[jq][0]),multInt(m[jz][2],rq)));
	n=multInt(multInt(nq,m[jq][2]),multInt(m[jz][2],nz));

	// î·(iz·mjq2·mjz0·nq - iq·mjq0·mjz2·nz - mjq1·mjz2·nz·rq + mjq2·mjz1·nq·rz)/(mjq2·mjz2·nq·nz)
	if(r!=0)
	{
		g=ggTInt(r,n);if(g!=1){r=divInt(r,g);n=divInt(n,g);}
	}
	m[jz][0]=r;m[jz][2]=n;//alert(m[jz]);
}


function  multkx(a,b)
{
	return new Array(subInt(multInt(a[0],b[0]),multInt(a[1],b[1])),
	                 addInt(multInt(a[0],b[1]),multInt(a[1],b[0])),
	                 multInt(a[2],b[2]));
}
function divkx(a,b)
{
//b2·(a0·b0 + a1·b1)/(a2·(b0^2 + b1^2)) + î·b2·(a1·b0 - a0·b1)/(a2·(b0^2 + b1^2))
	return new Array(multInt(b[2],addInt(multInt(a[0],b[0]),multInt(a[1],b[1]))),
	                 multInt(b[2],subInt(multInt(a[1],b[0]),multInt(a[0],b[1]))),
	                 multInt(a[2],addInt(multInt(b[0],b[0]),multInt(b[1],b[1]))));
}
function addkx(a,b)
{
	return new Array(addInt(multInt(b[2],a[0]),multInt(a[2],b[0])),
	                 addInt(multInt(b[2],a[1]),multInt(a[2],b[1])),
	                 multInt(a[2],b[2]));
}
function kzkx(x)
{
	var g=ggTInt(x[0],x[1]),i;
	for(i=2;i<x.length;i++)g=ggTInt(g,x[i]);
	if(g==0)return;
	if(Number(g)!=1){for(i=0;i<x.length;i++)x[i]=divInt(x[i],g);}
} 

//I=" 0 3 4" streicht aus m die 0., 3. und 4. Zeile/Spalte
function minor(m,n,I,ii)
{
	var mm=new Array((n-ii)*(n-ii)),z,s,kk=0;
	for(z=0;z<n;z++)
	{
		if(I.indexOf(" "+String(z)+" ")>-1)continue;
		for(s=0;s<n;s++)if(I.indexOf(" "+String(s)+" ")==-1)mm[kk++]=new Array(m[z*n+s][0],m[z*n+s][1],m[z*n+s][2]);
	}
	return mm;
}

function spur(m,n)
{
	var i,s=new Array(m[0][0],m[0][1],m[0][2]);
	for(i=1;i<n;i++)s=addkx(s,m[i*n+i]);
	kzkx(s);
	return s;
}
*/
function minorf(m,n,I,ii)
{	
	var mm=new Array((n-ii)*(n-ii)),z,s,kk=0;
	for(z=0;z<n;z++)
	{
		if(I.indexOf(" "+String(z)+" ")>-1)continue;
		for(s=0;s<n;s++)if(I.indexOf(" "+String(s)+" ")==-1)mm[kk++]=new Array(m[z*n+s][0],m[z*n+s][1]);
	}
	if(I==" 10 ")alert(mm);
	return mm;
}

function spurf(m,n)
{
	var i,s=new Array(m[0][0],m[0][1]);
	for(i=1;i<n;i++){s[0]+=m[i*n+i][0];s[1]+=m[i*n+i][1]};
	return s;
}

var h_p=new Array();
var kx_nullstellen=new Array();
var solvepkx_nichtneu=1==0;

//FROM FILE: solvepkx.js

// benötigt kxpolynome.js (v.a. wegen ggtp)

//var x=new Array(0,-5),y=new Array(4,5),z=new Array(2);
//var k=new Array(10);
//x^3 - 6·x + 5 - î·(4·x^2 - 5·x + 1)
//k=new Array(new Array(5,-1),new Array(-6,5),new Array(0,-4),new Array(1,0));
//for(var i=0;i<k.length;i++){k[i]=new Array(Math.round(Math.random()*6-3),Math.round(Math.random()*6-3));h_p[i]=new Array(2);}
//kx_pdiv(k,x);alert(k);
//alert("NS:\n"+solvepkx(k).join("\n"));
//kx_newton(k,x,true);alert(x);

function solvepkx(p)
{

	var x=new Array(2),xr,xi,i,ii=0,g,r,pt,qf;
	for(g=p.length-1;g>0;g--){if((Math.abs(p[g][0])<1e-10)&&(Math.abs(p[g][1])<1e-10))p.pop();else break;}
	var k=new Array(p[g][0],p[g][1]),d=10000,t="";
	h_p=new Array(g+1);
	var kk=new Array(g+1);for(i=0;i<p.length;i++){kk[i]=new Array(p[i][0],p[i][1]);h_p[i]=new Array(2);}
	var y1=new Array(2),y2=new Array(2),y3=new Array(2),kx=1==0;
	if(!solvepkx_nichtneu)kx_nullstellen=new Array();
	for(i=0;i<g;i++){if(Math.abs(p[i][1])>1e-10)kx=true;}
	if(p.length==3){solveQuad(p);return kx_nullstellen;}
	if(p.length==2){solveLin(p);return kx_nullstellen;}
	if(p.length==1){return kx_nullstellen;}

	var t0=(new Date()).getTime();
	for(i=0;(i<p.length)&&(p.length<8);i++){if((p[i][0]!=Math.round(p[i][0]))||(p[i][1]!=Math.round(p[i][1])))break;}
	if(i==p.length)  // ganzzahlig!
	{
		var abl=new Array(p.length-1);
		for(i=0;i<p.length-1;i++)abl[i]=new Array(p[i+1][0]*(i+1),p[i+1][1]*(i+1));
		qf=ggtp(p,abl,true);for(i=0;i<p.length;i++){p[i][0]=Number(p[i][0]);p[i][1]=Number(p[i][1]);}
		if(reducep(qf)>0)  // ggT(p,p') ist quadratischer Faktor von p. (Nur verwertbar, wenn Grad(ggT(p,p'))>0.)
		{
			solvepkx(qf);
			for(i=0;i<p.length;i++){p[i][0]=Number(p[i][0]);p[i][1]=Number(p[i][1]);}
			if(p.length==1)return kx_nullstellen;
			h_p=new Array(p.length);
			kk=new Array(p.length);
			for(i=0;i<p.length;i++){kk[i]=new Array(p[i][0],p[i][1]);h_p[i]=new Array(0,0);}
			if(p.length==3){solveQuad(p);return kx_nullstellen;}
			if(p.length==2){solveLin(p);return kx_nullstellen;}
		}
	}
	
	for(xr=0;(xr<=20)&&(p.length>0);xr++)
	{
		x[0]=xr;x[1]=0;
		do{kx_horner(p,x,y1);if((d=kx_betrq(y1))<1e-30)kx_ns(x,p);else break;}while(p.length>0);if(p.length<2)break;
		d=kx_newton(p,x);if(d<1e-26){d=kx_newton(kk,x);if(d<1e-26)kx_ns(x,p);}if(p.length<2)break;
		x[0]=xr;
		for(x[1]=-3;x[i]<=3;x[i]++)
		do{kx_horner(p,x,y1);if((d=kx_betrq(y1))<1e-26)kx_ns(x);else break;}while(p.length>0);if(p.length<2)break;
		x[0]=xr;
		for(x[1]=-3;x[i]<=3;x[i]++)
		do{kx_horner(p,x,y1);if((d=kx_betrq(y1))<1e-26)kx_ns(x,p);else break;}while(p.length>0);if(p.length<2)break;
		if(xr==0)continue;
		x[0]=-xr;x[1]=0;
		do{kx_horner(p,x,y1);if((d=kx_betrq(y1))<1e-26){kx_ns(x,p);}else break;}while(p.length>0);if(p.length<2)break;
		d=kx_newton(p,x);if(d<1e-30){d=kx_newton(kk,x);if(d<1e-26)kx_ns(x,p);}if(p.length<2)break;
	}

	var dd=1e-26;
	if(p.length==3){solveQuad(p);return kx_nullstellen;}
	if(p.length==2){solveLin(p);return kx_nullstellen;}

	while((p.length>0)&&(ii<1000))
	{
		for(i=1;(i<10)&&(p.length>0);i++)
		{
			x[0]=(Math.random()-.5);
			x[1]=(Math.random()-.5);
			d=kx_newton(p,x,(ii>1000));if(d<dd){d=kx_newton(kk,x,true);if(d<1e-12){kx_ns(x,p);}}
			if(p.length==3){solveQuad(p);return kx_nullstellen;}
			if(p.length==2){solveLin(p);return kx_nullstellen;}
			ii++;
		}
		for(i=1;(i<10000000)&&(p.length>0);i*=10)
		{
			x[0]=Math.random()*Math.random()*Math.random()*Math.random()*(Math.random()-.5)*i;
			x[1]=Math.random()*Math.random()*Math.random()*Math.random()*(Math.random()-.5)*i;
			d=kx_newton(p,x,(ii>1000));if(d<dd){d=kx_newton(kk,x,true);if(d<1e-12){kx_ns(x,p);}}
			ii++;
			if(p.length==3){solveQuad(p);return kx_nullstellen;}
			if(p.length==2){solveLin(p);return kx_nullstellen;}
		}
		dd=ii*ii*ii*ii*ii/1e23;
	}
	
	//if(kx_nullstellen.length<kk.length){prompt("nicht alle Nullstellen gefunden\nRestpolynom:",pStrkxf(p,false).replace(/,/g,"."));}
	
	return kx_nullstellen;

}
function solveQuad(p)
{
	var rr=p[1][0]*p[1][0]-p[1][1]*p[1][1];
	rr-=4*(p[0][0]*p[2][0]-p[0][1]*p[2][1]);
	var ri=2*p[1][1]*p[1][0];
	ri-=4*(p[0][1]*p[2][0]+p[0][0]*p[2][1]);
	var w=new Array(2);
	kx_sqrt(new Array(rr,ri),w);
	var x=new Array((w[0]-p[1][0])/2,(w[1]-p[1][1])/2);
	kx_div(x,p[2],x);
	kx_nullstellen[kx_nullstellen.length]=new Array(x[0],x[1]);
	x[0]=(-w[0]-p[1][0])/2;
	x[1]=(-w[1]-p[1][1])/2;
	kx_div(x,p[2],x);
	kx_nullstellen[kx_nullstellen.length]=new Array(x[0],x[1]);
	p=new Array();
}
/*
function solveLin(p)
{
	var x=new Array(0,0);
	p[0][0]=-p[0][0];
	p[0][1]=-p[0][1];
	kx_div(p[0],p[1],x);
	p[0][0]=-p[0][0];p[0][1]=-p[0][1];
	kx_ns(x,p,true);
	return;
}
*/

/*
function fix(k,q,l,a,x)
{
	var xx=new Array(Math.round(x[0]*10000)/10000,Math.round(x[1]*10000)/10000),yy=new Array(2);
	kxhorner3(k,q,l,a,xx,yy);
	if(kxbetrq(yy)<1e-20){x[0]=xx[0];x[1]=xx[1];return;}
	xx[0]=Math.round(x[0]*210000)/210000;xx[1]=Math.round(x[1]*210000)/210000;
	kxhorner3(k,q,l,a,xx,yy);if(kxbetrq(yy)<1e-20){x[0]=xx[0];x[1]=xx[1];return;}
	xx[0]=Math.round(x[0]*1430000)/1430000;xx[1]=Math.round(x[1]*1430000)/1430000;
	kxhorner3(k,q,l,a,xx,yy);if(kxbetrq(yy)<1e-20){x[0]=xx[0];x[1]=xx[1];return;}
}
*/

function kx_div(z,n,q)
{
	var nn=n[0]*n[0]+n[1]*n[1],zr=z[0]*n[0]+z[1]*n[1],zi=z[1]*n[0]-z[0]*n[1];
	q[0]=zr/nn;q[1]=zi/nn;
}
/*
function kx_eq(a,b)
{
	return (Math.abs(a[0]-b[0])<1e-12)&&(Math.abs(a[1]-b[1])<1e-12)
}
*/
function kx_sqrt(x,w)
{
	var b=Math.sqrt(x[0]*x[0]+x[1]*x[1]);
	var r=Math.sqrt((b+x[0])/2);
	var i=Math.sqrt((b-x[0])/2)*((x[1]>=0)?1:-1);
	w[0]=r;w[1]=i;
}
function kx_betrq(x)
{
	return x[0]*x[0]+x[1]*x[1];
}
function kx_horner(p,x,f)
{
	var i,y,n=p.length;if(n<2){alert("p: "+p);return;}
	h_p[n-1][0]=f[0]=p[n-1][0];
	h_p[n-1][1]=f[1]=p[n-1][1];
	for(i=n-2;i>=0;i--)
	{
		h_p[i][0]=y=f[0]*x[0]-f[1]*x[1]+p[i][0];
		h_p[i][1]=f[1]=x[0]*f[1]+x[1]*f[0]+p[i][1];
		f[0]=y;
	}
}
function kx_hornera(p,x,f)
{
	var i,y,n=p.length;f[0]=p[n-1][0]*(n-1);f[1]=p[n-1][1]*(n-1);
	for(i=n-2;i>0;i--)
	{
		y=(f[0]*x[0]-f[1]*x[1])+p[i][0]*i;
		f[1]=(x[0]*f[1]+x[1]*f[0])+p[i][1]*i;
		f[0]=y;
	}
}
function kx_ns(x,p,o)
{
	var r,i,f=new Array(2);
	var xg=new Array(Math.round(x[0]*1000)/1000,Math.round(x[1]*1000)/1000),xx=new Array(xg[0],xg[1]);
	kx_horner(p,xx,f);
	if(kx_betrq(f)<1e-26){x[0]=xx[0];x[1]=xx[1];}
	else
	{
		xx[0]=x[0];xx[1]=xg[1];kx_horner(p,xx,f);
		if(kx_betrq(f)<1e-26){x[0]=xx[0];x[1]=xx[1];}
		else
		{
			xx[0]=xg[0];xx[1]=x[1];kx_horner(p,xx,f);
			if(kx_betrq(f)<1e-26){x[0]=xx[0];x[1]=xx[1];}
		}
	}
	kx_horner(p,x,f);//alert("f("+x+") = "+f);
	kx_nullstellen[kx_nullstellen.length]=new Array(x[0],x[1]);
	//var t="("+pStrkxf(p,false).replace(/,/g,".")+")/(x-("+kxStrf(x).replace(/,/,".")+"))-(";
	p.pop();if(p.length==1){p.pop();return;}
	for(i=0;i<p.length;i++)p[i]=new Array(h_p[i+1][0],h_p[i+1][1]);
	//prompt("",t+pStrkxf(p,false).replace(/,/g,".")+")");
	//else(kx_pdiv(p,x));
	//alert("x="+x+"\npred="+p);
	if(p.length==2)
	{
		p[0][0]=-p[0][0];p[0][1]=-p[0][1];kx_div(p[0],p[1],x);p[0][0]=-p[0][0];p[0][1]=-p[0][1];return kx_ns(x,p,true);
	}
	if((o)||(x[1]==0))return;
	x[1]=-x[1];kx_horner(p,x,f);if(kx_betrq(f)<1e-30)kx_ns(x,p,true);
}
function kx_newton(p,x,o)
{
	var i,i1=(o)?100:10,d,dd=1e100,f=new Array(2),ff=new Array(2),Q=new Array(2),xg=new Array(2),fg=new Array(2);
	for(i=0;i<10;i++)
	{
		kx_horner(p,x,f);
		d=kx_betrq(f);
		//if(o)alert(x+"\n"+d+"\n"+i);
		if(d<1e-28)break;
		if((d>1)&&(i>5))break;
		kx_hornera(p,x,ff);
		kx_div(f,ff,Q);
		x[0]-=Q[0];x[1]-=Q[1];
	}
	//if(d<1e-28)alert("newton: "+x+"\n"+d); 
	return d;
}
/*
function kx_pdiv(p,x)
{
	var q=new Array(p.length-1),i,g=p.length-1,d=new Array(),f=new Array(2),j;
	for(i=g;i>0;i--)
	{
		f[0]=p[i][0];f[1]=p[i][1];
		p[i][0]=p[i][1]=0;
		p[i-1][0]-=f[1]*x[1]-f[0]*x[0];p[i-1][1]+=f[0]*x[1]+f[1]*x[0];
		//-( q·x - q·x0 + qi·x0i + î·(qi·x - q·x0i - qi·x0))
		q[i-1]=new Array(f[0],f[1]);
		//alert(p.join("\n"));
	}
	p.pop();
	for(i=0;i<g;i++){p[i][0]=q[i][0];p[i][1]=q[i][1];}
}
*/
// approximiert Nullstelle ab a/b des Polynoms mit reellen, ganzzahligen Koeffizienten p
function newtonstepr(a,b,p)
{
	var k,aa="0",bb="0",n=p.length-1,A=new Array(n+1),B=new Array(n+1);A[0]=1;B[0]=1;A[1]=a;B[1]=b;fxz=0;
	for(k=2;k<=n;k++){A[k]=multInt(A[k-1],a);B[k]=multInt(B[k-1],b);}
	for(k=2;k<=n;k++)aa=addInt(aa,multInt(k-1,multInt(p[k],multInt(A[k],B[n-k]))));
	aa=subInt(aa,multInt(p[0],B[n]));
	for(k=1;k<=n;k++)bb=addInt(bb,multInt(k,multInt(A[k-1],multInt(p[k],B[n+1-k]))));
	fxn=B[n];
	for(k=0;k<=n;k++)fxz=addInt(fxz,multInt(p[k],multInt(A[k],B[n-k])));
	return new Array(aa,bb);
}
// approximiert Nullstelle mit |f(x)|<10^-d
function newton(a,b,p,d)
{
	var i,x=new Array(a,b);
	for(i=0;i<20;i++)
	{
		x=newtonstepr(x[0],x[1],p);
		if(fxz==0)break;
		if(String(fxn).length-String(fxz).length>d)break;
	}
	return x;
}


// ACTUALLY MADE BY ME

function eigenvalues (m) {
	var poly = new Array();
	var n = Math.sqrt(m.length);
	for (i=0;i<=n;i++) {
		poly[i] = charpolykoefff(m,n,i);
	}
	return solvepkx(poly);
}