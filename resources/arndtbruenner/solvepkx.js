var h_p=new Array();
var kx_nullstellen=new Array();
var solvepkx_nichtneu=1==0;
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

function kx_div(z,n,q)
{
	var nn=n[0]*n[0]+n[1]*n[1],zr=z[0]*n[0]+z[1]*n[1],zi=z[1]*n[0]-z[0]*n[1];
	q[0]=zr/nn;q[1]=zi/nn;
}
function kx_eq(a,b)
{
	return (Math.abs(a[0]-b[0])<1e-12)&&(Math.abs(a[1]-b[1])<1e-12)
}
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
