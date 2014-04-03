function kettenbruchapprox(x,nn,d)
{
if(isNaN(x))return x;
if(x==0)return new Array(0,1);
var bn=1,bz=x;
if(d==null)d=1e-12;
if(nn==null)nn=1000000;
if(Math.round(x)==x){return new Array(bz,bn);}
var q=Math.abs(x),r=1;
var vz=(x<0)?-1:1;
while(Math.round(q)!=q){q*=10;r*=10;}
var rr=q%r,c=r;
q=Math.floor(q/r);r=rr;
var a2=0,a1=1,a0=q,b2=1,b1=0,b0=1,i=0;
while((b0<=nn)&&(i<1000))
{
	i++;
	q=Math.floor(c/r);rr=c%r;c=r;r=rr;
	var aa=q*a0+a1;a2=a1;a1=a0;a0=aa;
	var bb=q*b0+b1;b2=b1;b1=b0;b0=bb;
	if(Math.abs(a1/b1-Math.abs(x))<d)break;
	//alert("a0="+a0+"\nb0="+b0+"\nb="+q+"\na1="+a1+"\nb1="+b1+"\na2="+a2+"\nb2="+b2);
	//if(b1>nn)break;
}//alert(Math.abs(a1/b1-Math.abs(x))+"\n"+d);
if(Math.abs(a1/b1-Math.abs(x))>d)return new Array(bz,bn);
nm=b1;zm=a1;
bz=vz*zm;bn=nm;
return new Array(bz,bn);
}