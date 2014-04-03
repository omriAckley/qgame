// Javascript von Arndt Brünner, Juli 2008
// für Polynome mit komplexen Koeffizienten
// - benötigt bigint1.js und kettenbruchapprox.js

// Übergabe als k[n][2] mit p(x)=(k[0][0]+k[0][1]*î) + (k[1][0]+k[1][1]*î)*x + (k[1][0]+k[1][1]*î)*x^2 + ...
// Alle Funktionen rechnen ganzzahlig, daher zuerst gegebenenfalls Aufruf von "machganzzahlig() "erforderlich.

function machganzzahlig(k)
{	
	while((Math.abs(k[k.length-1][0])<1e-10)&&(Math.abs(k[k.length-1][1])<1e-10)&&(k.length>2))k.pop();
	var i,j,g=k.length-1,r=new Array(g),kgv="1",ggt;
	for(i=0;i<=g;i++)
	{
		r[i]=new Array(2);
		for(j=0;j<=1;j++)
		{
			r[i][j]=kettenbruchapprox(k[i][j]);
			ggt=ggT_(r[i][j][1],kgv);
			kgv=divInt(multInt(r[i][j][1],kgv),ggt);
			//alert(k[i]+"\nre: "+r[i][j]+"\nggt: "+ggt+"\nkgv: "+kgv);
		}
	}
	for(i=0;i<=g;i++)for(j=0;j<2;j++)k[i][j]=divInt(multInt(String(r[i][j][0]),kgv),String(r[i][j][1]));
	return kgv;
}
function neup(g){var p=new Array(g+1),i;for(i=0;i<g+1;i++)p[i]=new Array(0,0);return p;}
function reducep(k)
{
	while((k[k.length-1][0]==0)&&(k[k.length-1][1]==0)&&(k.length>2)){k.pop();}
	if(k.length==2){if(k[0].length==1){k[0]=new Array(k[0],k[1]);k[1]=new Array(0,0);}}
	if(k.length==2){if((k[1][0]==0)&&(k[1][1]==0)){return 0;}}
	return k.length-1;
}
function clonep(a){var b=neup(a.length-1);for(var i=0;i<a.length;i++){b[i][0]=a[i][0];b[i][1]=a[i][1]};return b;}
function istNullp(a){var i;for(i=0;i<a.length;i++)if((Number(a[i][0])!=0)||(Number(a[i][1])!=0))return false;return true;}
function istEins(a)
{
	var i;if((Number(a[0][0])!=1)||(Number(a[0][1])!=0))return false;
	for(i=1;i<a.length;i++)if((Number(a[i][0])!=0)||(Number(a[i][1])!=0))return false;
	return true;
}
function invp(a){for(var i=0;i<a.length;i++)for(var j=0;j<2;j++){a[i][j]=(a[i][j]<0)?String(a[i][j]).replace(/-/,""):"-"+a[i][j];}}
function contp(a)
{
	var gr=reducep(a),g=new Array(a[gr][0],a[gr][1]),i;
	for(i=gr-1;i>=0;i--){if((a[0]!=0)||(a[1]==0))g=kxggt(g,a[i]);}
	//if(a[gr][0]>0){invp(g);}
	return g;
}
function machganzzahligr(k)
{	while((Math.abs(k[k.length-1])<1e-10)&&(k.length>1))k.pop();
	var i,j,g=k.length-1,r=new Array(g),kgv="1",ggt;
	for(i=0;i<=g;i++)
	{
		r[i]=kettenbruchapprox(k[i]);
		ggt=ggT_(r[i][1],kgv);
		kgv=divInt(multInt(r[i][1],kgv),ggt);
			//alert(k[i]+"\nre: "+r[i][j]+"\nggt: "+ggt+"\nkgv: "+kgv);
	}
	for(i=0;i<=g;i++)k[i]=divInt(multInt(String(r[i][0]),kgv),String(r[i][1]));
	return kgv;
}
function neupr(g){var p=new Array(g+1),i;for(i=0;i<g+1;i++)p[i]=0;return p;}
function reducepr(k)
{
	while((k[k.length-1]==0)&&(k.length>1)){k.pop();}
	return k.length-1;
}
function clonepr(a){var b=neupr(a.length-1);for(var i=0;i<a.length;i++)b[i]=a[i];return b;}
function istNullpr(a){var i;for(i=0;i<a.length;i++)if(Number(a[i])!=0)return false;return true;}
function istEinsr(a){var i;if(Number(a[0])!=1)return false;for(i=1;i<a.length;i++)if(Number(a[0])!=0)return false;return true;}
function invpr(a){for(var i=0;i<a.length;i++){a[i]=(a[i]<0)?String(a[i]).replace(/-/,""):"-"+a[i];}}
function contpr(a)
{
	var gr=reducepr(a),g=a[gr],i;
	if(g==0)return 1;
	for(i=gr-1;i>=0;i--){if(a[i]!=0)g=ggTInt(g,a[i]);}
	return g;
}

function kxadd(a,b){return new Array(addInt(a[0],b[0]),addInt(a[1],b[1]));}
function kxsub(a,b){return new Array(subInt(a[0],b[0]),subInt(a[1],b[1]));}
function kxmult(a,b){return new Array(subInt(multInt(a[0],b[0]),multInt(a[1],b[1])),addInt(multInt(a[0],b[1]),multInt(a[1],b[0])));}
var kxdivrestr=0,kxdivresti=0,kxnq=0;
function kxdiv(a,b)
{
	var n=addInt(multInt(b[0],b[0]),multInt(b[1],b[1]));
	kxnq=n;
	var r=addInt(multInt(a[0],b[0]),multInt(a[1],b[1]));
	var i=subInt(multInt(a[1],b[0]),multInt(a[0],b[1]));
	//alert("kxdiv\nr="+r+"\ni="+i+"\nn="+n+"\na="+a+"\nb="+b);
	r=divInt(r,n);kxdivrestr=divRest;
	i=divInt(i,n);kxdivresti=divRest;	
	return new Array(r,i);
}
function kxggt_(a_,b_)
{
	var a=new Array(a_[0],a_[1]),b=new Array(b_[0],b_[1]),q,rr,ri,r=new Array(2),j,i=0,c,dr,di;
	do{
		q=kxdiv(a,b);
		rr=multInt(kxdivrestr,2*sgn(kxdivrestr));ri=multInt(kxdivresti,2*sgn(kxdivresti));
		dr=Number(rr)>Number(kxnq);di=Number(ri)>Number(kxnq);
		//alert("a="+a+"\nb="+b+"\nq0="+q+"\nrr="+rr+"\nri="+ri+"\nkxnq="+kxnq+"\nkxdivrr="+kxdivrestr+"\nkxdivri="+kxdivresti);
		if((q[0]==0)&&(q[1]==0)&&(!dr)&&(!di))
		{
			for(j=0;j<2;j++){r[j]=a[j];}
			//alert("tausche\n"+a+"\n"+b);
		}
		else
		{
			if(dr)q[0]=addInt(q[0],(Number(q[0])==0)?sgn(kxdivrestr):sgn(q[0]));
			if(di)q[1]=addInt(q[1],(Number(q[1])==0)?sgn(kxdivresti):sgn(q[1]));
			r=kxsub(a,kxmult(q,b));//alert("q1="+q+"\nr="+r);
		}
		i++;
		for(j=0;j<2;j++){a[j]=b[j];b[j]=r[j];}
		if(Math.abs(a[0])+Math.abs(a[1])<1e14)return kxggt(a,b);
		if(Math.abs(b[0])+Math.abs(b[1])<1e14)return kxggt(a,b);
	}while(((Number(r[0])!=0)||(Number(r[1])!=0))&&(i<100));
	if(a[0]<0){a[0]=multInt(a[0],-1);a[1]=multInt(a[1],-1);}
	return a;
}
function kxggt(a_,b_)
{
	var a=new Array(a_[0],a_[1]),b=new Array(b_[0],b_[1]),q=new Array(2),n,rr,ri,r=new Array(2),j,i=0,c,dr,di;
	if((Number(b[0])==0)&&(Number(b[1])==0)){if((Number(a[0])==0)&&(Number(a[1])==0))return new Array(1,0); return a;}
	do
	{
		n=Number(b[0])*Number(b[0])+Number(b[1])*Number(b[1]);
		q[0]=Math.round((Number(a[0])*Number(b[0])+Number(a[1])*Number(b[1]))/n);
		q[1]=Math.round((Number(a[1])*Number(b[0])-Number(a[0])*Number(b[1]))/n);
		if(Math.abs(q[0])+Math.abs(q[1])>1e14)return kxggt_(a,b);
		if((Math.abs(a[0])+Math.abs(a[1])<1e14)&&(Math.abs(b[0])+Math.abs(b[1])<1e14))
		{
			r[0]=a[0]-q[0]*b[0]+q[1]*b[1];r[1]=a[1]-q[1]*b[0]-q[0]*b[1];
			//alert("q="+q+"\na="+a+"\nb="+b+"\nr="+r+"\nalg 1a");
		}
		else 
		{
			r=kxsub(a,kxmult(q,b));
			//alert("q="+q+"\na="+a+"\nb="+b+"\nr="+r+"\nalg 1b");
		}
		i++;
		for(j=0;j<2;j++){a[j]=b[j];b[j]=r[j];}
	}while(((Number(r[0])!=0)||(Number(r[1])!=0))&&(i<100));
	if(a[0]<0){a[0]=multInt(a[0],-1);a[1]=multInt(a[1],-1);}
	return a;
}
function kxpown(a,n)
{
	var p=new Array(1,0),i;
	for(i=0;i<n;i++)p=kxmult(p,a);
	return p;
}

function addp(a,b)
{
	var s=neup(Math.max(a.length,b.length)-1),i;
	for(i=0;i<s.length;i++)s[i]=new Array(addInt((i<a.length)?a[i][0]:"0",(i<b.length)?b[i][0]:"0"),addInt((i<a.length)?a[i][1]:"0",(i<b.length)?b[i][1]:"0"));
	reducep(s);
	return s;
}
function subp(a,b)
{
	var s=neup(Math.max(a.length,b.length)-1),i;
	for(i=0;i<s.length;i++)s[i]=new Array(subInt((i<a.length)?a[i][0]:"0",(i<b.length)?b[i][0]:"0"),subInt((i<a.length)?a[i][1]:"0",(i<b.length)?b[i][1]:"0"));
	reducep(s);
	return s;
}
function multp(a,b)
{
	var p=neup(a.length+b.length-2),i,j;
	for(i=0;i<a.length;i++)
		for(j=0;j<b.length;j++)
			{p[i+j]=kxadd(p[i+j],kxmult(a[i],b[j]));}
	
	reducep(p);
	return p;
}
var divrestp;
function divp(a,b)
{
	//alert("divp\n"+pStrkxf(a)+"\n"+pStrkxf(b));
	var gr=reducep(a),gb=reducep(b),i=0;
	var r=clonep(a),q=neup(gr-gb),d,qq,rr;
	if(gb==0){for(i=0;i<=gr;i++)q[i]=kxdiv(a[i],b[0]);divrest=new Array(new Array(0,0),new Array(0,0));return q;}
	while(gr>=gb)
	{
		qq=neup(gr-gb);
		qq[gr-gb]=kxdiv(r[gr],b[gb]);
		q=addp(q,qq);d=multp(b,qq);
		//alert("b="+pStrkxf(b)+"\nq= "+pStrkxf(q)+"\nr= "+pStrkxf(r)+"\nqq= "+pStrkxf(qq)+"\nd= "+pStrkxf(d)+"\nr-d="+pStrkxf(subp(r,d))+"\ngrad: "+reducep(subp(r,d))+"\nReste:\n"+kxdivrestr+"\n"+kxdivresti);
		if((kxdivrestr!=0)||(kxdivresti!=0))return;
		r=subp(r,d);
		gr=reducep(r);
		i++;if(i>10)return;
	}
	divrestp=r;
	return q;
}

//kz=true: a und b werden gekürzt
function ggtp(a,b,kz)
{
	//alert("ggt von "+a+"  und   "+b);
	if(istNullp(a))
	if(istNullp(b))
	{	//alert("ggtp(0,0)");
		if(kz){b=neup(2);b[0][0]=1;a=neup(2);a[0][0]=1;}
		return new Array(new Array(1,0),new Array(0,0));
	}
	else 
	{
		var r=clonep(b);
		if(kz){b=neup(2);b[0][0]=1;}
		return b;
	}
	//status="c1=cont(a), c2=cont(b), ggt(c1,c2)";
	var c1=contp(a),c2=contp(b),c3,d=kxggt(c1,c2);
	var u=neup(a.length-1),v=neup(b.length-1),i,ii=0;
	for(i=0;i<a.length;i++)u[i]=kxdiv(a[i],c1);//alert("divreste:  "+kxdivrestr+"  "+kxdivresti);
	for(i=0;i<b.length;i++)v[i]=kxdiv(b[i],c2);//alert("divreste:  "+kxdivrestr+"  "+kxdivresti);
	do
	{
		r=pseudopolydivp(u,v);
		var gr=reducep(r);
		if(istNullp(r))break;
		//status="cont("+r+")";
		c3=contp(r);
		//alert("u="+u+"\nv="+v+"\nr="+r+"\ngr="+gr+"\ncont(r)="+c3+"\nr=0?: "+istNullp(r));
		if(gr==0){v=new Array(new Array(1,0),new Array(0,0));reducep(v);break;}
		for(i=0;i<r.length;i++)r[i]=kxdiv(r[i],c3);
		//alert("u="+u+"\nv="+v+"\nr="+r);
		u=clonep(v);
		v=clonep(r);
		ii++;
	}while(ii<20);
	//alert("fertig\nu="+u+"\nv="+v+"\nr="+r);
	//status="";
	//alert(d);
	//alert(pStrkxf(a)+"\n"+pStrkxf(b)+"\n"+pStrkxf(v));
	for(i=0;i<v.length;i++)v[i]=kxmult(v[i],d);
	var aa=divp(a,v);//for(i=0;i<q.length;i++)a[i]=q[i];for(i=q.length;i<a.length;i++)a[i]=0;
	var bb=divp(b,v);//for(i=0;i<q.length;i++)b[i]=q[i];for(i=q.length;i<b.length;i++)b[i]=0;
	if((aa==null)||(bb==null))return new Array(new Array(1,0));
	if(!kz)return v;
	var vz=((aa[aa.length-1][0]<0)&&(bb[bb.length-1][0]<0))?-1:1;
	var c=ggT_(contp(aa),contp(bb));
	for(j=0;j<2;j++)
	{
		for(i=0;i<aa.length;i++)a[i][j]=divInt(multInt(aa[i][j],vz),c);for(i=aa.length;i<a.length;i++)a[i][j]=0;
		for(i=0;i<bb.length;i++)b[i][j]=divInt(multInt(bb[i][j],vz),c);for(i=bb.length;i<b.length;i++)b[i][j]=0;
	}
	reducep(a);reducep(b);
	//alert(a+"\n"+b);
	return v;
}

function pseudopolydivp(k1,k2)
{
	//alert("pseudopolydiv\n"+k1+"\n"+k2);
	var m=reducep(k1),n=reducep(k2),u=clonep(k1),v=clonep(k2),k,j,a,b,q,vk,uu;
	if(m<n)return u;
	//var c=new Array(kxpown(v[n],m-n+1),new Array(0,0));
	//q=neup(m-n);
	//uu=clonep(u);
	for(k=m-n;k>=0;k--)
	{
		//vk=kxpown(v[n],k);
		//q[k]=kxmult(u[n+k],vk);
		for(j=n+k-1;j>=0;j--)
		{
			//status="pseudopd: k="+k+" j="+j;
			a=kxmult(v[n],u[j]);
			if(j>=k){b=kxmult(u[n+k],v[j-k]);a=kxsub(a,b);}
			u[j][0]=a[0];u[j][1]=a[1];
		}
		u[n+k][0]=u[n+k][1]=0;
		//alert("pseudodiv\nu="+u+"\n");
	}
	reducep(u);
	//reducep(q);
	//alert("pseudodiv\n"+k1+"\n"+k2+"\n"+u);
	//alert("q*v+r=c*u\n("+q+")*("+v+") + ("+u+")\n("+addp(multp(q,v),u)+") \n("+multp(uu,c)+")\nc = "+c);
	return u;
}


function addpr(a,b)
{
	var s=neupr(Math.max(a.length,b.length)-1),i;
	for(i=0;i<s.length;i++)s[i]=addInt((i<a.length)?a[i]:"0",(i<b.length)?b[i]:"0");
	reducepr(s);
	return s;
}
function subpr(a,b)
{
	var s=neupr(Math.max(a.length,b.length)-1),i;
	for(i=0;i<s.length;i++)s[i]=subInt((i<a.length)?a[i]:"0",(i<b.length)?b[i]:"0");
	reducepr(s);
	return s;
}
function multpr(a,b)
{
	var p=neupr(a.length+b.length-2),i,j;
	for(i=0;i<a.length;i++)
		for(j=0;j<b.length;j++)
			{p[i+j]=addInt(p[i+j],multInt(a[i],b[j]));}
	
	reducepr(p);
	return p;
}
var divrestpr;
function divpr(a,b)
{
	//alert("divp\n"+a+"\n"+b);
	//status="divpr ("+a+")/("+b+")";
	var gr=reducepr(a),gb=reducepr(b),i=0;
	var r=clonepr(a),q=neupr(gr-gb),d,qq,rr;
	if(gb==0){for(i=0;i<=gr;i++)q[i]=divInt(a[i],b[0]);divrestr=0;return q;}
	while(gr>=gb)
	{
		qq=neupr(gr-gb);
		qq[gr-gb]=divInt(r[gr],b[gb]);
		q=addpr(q,qq);d=multpr(b,qq);
		//alert("b="+b+"\nq= "+q+"\nr= "+r+"\nqq= "+qq+"\nd= "+d+"\nr-d="+subp(r,d)+"\ngrad: "+reducepr(subp(r,d))+"\nReste:\n"+kxdivrestr+"\n"+kxdivresti);
		if((divRest!=0))return;
		r=subpr(r,d);
		gr=reducepr(r);
		i++;if(i>10)return;
	}
	divrestpr=r;
	return q;
}

//kz=true: a und b werden gekürzt
function ggtpr(a,b,kz)
{
	//alert("ggt von "+a+"  und   "+b);
	if(istNullpr(a))
	if(istNullpr(b))
	{	alert("ggtpr(0,0)");
		if(kz){b=neupr(1);b[0]=1;a=neupr(1);a[0]=1;}
		return clonepr(b);
	}
	else 
	{
		var r=clonepr(b);
		if(kz){b=neupr(1);b[0]=1;}
		return clonepr(b);
	}
	//status="c1=cont(a), c2=cont(b), ggt(c1,c2)";
	var c1=contpr(a),c2=contpr(b),c3,d=ggTInt(c1,c2);
	var u=neupr(a.length-1),v=neupr(b.length-1),i,ii=0;
		//status="teile "+a.join(";")+" durch "+c1;
	for(i=0;i<a.length;i++)u[i]=divInt(a[i],c1);//alert("divreste:  "+kxdivrestr+"  "+kxdivresti);
		//status="teile "+b.join(";")+" durch "+c2;
	for(i=0;i<b.length;i++)v[i]=divInt(b[i],c2);//alert("divreste:  "+kxdivrestr+"  "+kxdivresti);
	do
	{
		r=pseudopolydivpr(u,v);
		var gr=reducepr(r);
		if(istNullpr(r))break;
		if(gr==0){v=neupr(1);v[0]=1;break;}
		//status="cont("+r+")";
		c3=contpr(r);
		//alert("u="+u+"\nv="+v+"\nr="+r+"\ngr="+gr+"\ncont(r)="+c3+"\nr=0?: "+istNullp(r));
		//status="teile "+r.join(";")+" durch "+c3;
		for(i=0;i<r.length;i++)r[i]=divInt(r[i],c3);

		//alert("u="+u+"\nv="+v+"\nr="+r);
		u=clonepr(v);
		v=clonepr(r);
		ii++;
	}while(ii<20);
	//alert("fertig\nu="+u+"\nv="+v+"\nr="+r);
	//status="v="+v.join(";");
	for(i=0;i<v.length;i++)v[i]=multInt(v[i],d);
	if(!kz)return v;
	//status="teile "+a.join(";")+" durch "+v ;
	var aa=divpr(a,v);//for(i=0;i<q.length;i++)a[i]=q[i];for(i=q.length;i<a.length;i++)a[i]=0;
	var bb=divpr(b,v);//for(i=0;i<q.length;i++)b[i]=q[i];for(i=q.length;i<b.length;i++)b[i]=0;
	var vz=((aa[aa.length-1]<0)&&(bb[bb.length-1]<0))?-1:1;
	var c=ggT_(contpr(aa),contpr(bb));
	for(i=0;i<aa.length;i++)a[i]=divInt(multInt(aa[i],vz),c);for(i=aa.length;i<a.length;i++)a[i]=0;
	for(i=0;i<bb.length;i++)b[i]=divInt(multInt(bb[i],vz),c);for(i=bb.length;i<b.length;i++)b[i]=0;
	reducepr(a);reducepr(b);
	//alert(a+"\n"+b);
	return v;
}

function pseudopolydivpr(k1,k2)
{
	//alert("pseudopolydiv\n"+k1+"\n"+k2);
	var m=reducepr(k1),n=reducepr(k2),u=clonepr(k1),v=clonepr(k2),k,j,a,b,q,vk,uu;
	if(m<n)return u;
	//var c=new Array(kxpown(v[n],m-n+1),new Array(0,0));
	//q=neup(m-n);
	//uu=clonep(u);
	for(k=m-n;k>=0;k--)
	{
		//vk=kxpown(v[n],k);
		//q[k]=kxmult(u[n+k],vk);
		for(j=n+k-1;j>=0;j--)
		{
			//status="pseudopdr: k="+k+" j="+j+" u="+u.join(";");
			a=multInt(v[n],u[j]);
			if(j>=k){b=multInt(u[n+k],v[j-k]);a=subInt(a,b);}
			u[j]=a;
		}
		u[n+k]=0;
		//alert("pseudodiv\nu="+u+"\n");
	}
	reducepr(u);
	//reducep(q);
	//alert("pseudodiv\n"+k1+"\n"+k2+"\n"+u);
	//alert("q*v+r=c*u\n("+q+")*("+v+") + ("+u+")\n("+addp(multp(q,v),u)+") \n("+multp(uu,c)+")\nc = "+c);
	return u;
}

var fxz=0,fxn=0;
// approximiert Nullstelle ab a/b des Polynoms mit reellen, ganzzahligen Koeffizienten p
function newtonstepr(a,b,p)
{
	//(sum((k - 1)·APPEND(p, k)·a^k·b^(n - k), k, 2, n) - b^n·"p0")
	//sum(k·a^(k - 1)·APPEND(p, k)·b^(n + 1 - k), k, 1, n)
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
//Formate: x0[3] p[i][3] mit (x0[0]+x0[1]*i)/x0[2]
function newtonstepkx(x0,p)
{
	var i,g=p.length-1,z="0",n="1",f=new Array(3),ff=new Array(3),r,re,im,nn;
	ff[0]=f[0]=p[g][0];ff[1]=f[1]=p[g][1];ff[2]=f[2]=p[g][2];
	for(i=g-1;i>=0;i--)
	{
		r=subInt(multInt(f[0],x0[0]),multInt(f[1],x0[1]));
		f[1]=addInt(multInt(f[1],x0[0]),multInt(f[0],x0[1]));
		f[2]=multInt(f[2],x0[2]);
		f[0]=r;
		f[0]=addInt(multInt(f[0],p[i][2]),multInt(p[i][0],f[2]));
		f[1]=addInt(multInt(f[1],p[i][2]),multInt(p[i][1],f[2]));
		f[2]=multInt(f[2],p[i][2]);
		kzkx(f);
		if(i==0)break;
		r=subInt(multInt(ff[0],x0[0]),multInt(ff[1],x0[1]));
		ff[1]=addInt(multInt(ff[1],x0[0]),multInt(ff[0],x0[1]));
		ff[2]=multInt(ff[2],x0[2]);
		ff[0]=r;
		ff[0]=multInt(ff[0],i+1);ff[1]=multInt(ff[1],i+1);
		ff[0]=addInt(multInt(ff[0],p[i][2]),multInt(p[i][0],ff[2]));
		ff[1]=addInt(multInt(ff[1],p[i][2]),multInt(p[i][1],ff[2]));
		ff[2]=multInt(ff[2],p[i][2]);
		kzkx(ff);
	}
	var zr=multInt(ff[2],f[0]),zi=multInt(f[1],ff[2]);
	var nr=multInt(f[2],ff[0]),ni=multInt(ff[1],f[2]);
	re=addInt(subInt(multInt(ni,multInt(ni,x0[0])),multInt(ni,multInt(x0[2],zi))),multInt(nr,subInt(multInt(nr,x0[0]),multInt(x0[2],zr))));
	im=addInt(addInt(multInt(ni,multInt(ni,x0[1])),multInt(ni,multInt(x0[2],zr))),multInt(nr,subInt(multInt(nr,x0[1]),multInt(x0[2],zi))));
	nn=multInt(x0[2],addInt(multInt(ni,ni),multInt(nr,nr)));
	x0[0]=re;x0[1]=im;x0[2]=nn;
	kzkx(x0);
	return f;
}


function newtonkx(x0,p)
{
	
}
function pStrr(p)
{
	var i,g=reducepr(p),t=(p[g]>0)?"":"-",pp;
	if(istNullpr(p))return "0";
	for(i=g;i>=0;i--)
	{
		pp=String(p[i]).replace(/-/,"");
		if(pp=="0")continue;
		if((t!="")&&(i<g))t+=(p[i]>0)?" + ":" - ";
		if((pp!="1")||(i==0))t+=pp;
		if(i>0)t+="x";
		if(i>1)t+="^"+i;
	}
	return t;
}
function pStr(p)
{
	if(istNullp(p))return "0";
	var pr=new Array(reducep(p)+1),i,pi=new Array(pr.length),t="";
	for(i=0;i<p.length;i++){pr[i]=p[i][0];pi[i]=p[i][1];}
	if(!istNullpr(pr))t=pStrr(pr);
	if(!istNullpr(pi)){if(t!="")t+=" + ";t+="("+pStrr(pi)+")·i";}
	t=t.replace(/\(1\)·/,"");
	return t;
}
function kxStrf(x)
{
	var t="_"+String(Number(x[0]))+"+"+String(Number(x[1]))+"î";
	t=t.replace(/\+-/,"-").replace(/\+0î/,"");
	t=t.replace(/\+1î/,"+î").replace(/-1î/,"-î").replace(/_0\+/,"").replace(/_0-/,"-");
	t=t.replace(/_/,"").replace(/\./g,komma);
	return(t=="")?"0":t;
}
function vStrkxf(v)
{
	var i,t="";
	for(i=0;i<v.length;i++)
	{
		t+=kxStrf(v[i])+((i<v.length-1)?" ; ":"");
	}
	return t;
}
function vbetrkx(v)
{
	var i,j,s=0;
	for(i=0;i<v.length;i++)for(j=0;j<v[i].length;j++)s+=v[i][j]*v[i][j];
	return Math.sqrt(s);
}
//alert(pStr(new Array(new Array(1,1),new Array(0,0),new Array(0,6))));

function test()
{
	var ggt=neup(2),k1=neup(5),k2=neup(3),i;
	for(i=0;i<ggt.length;i++)
	{
		ggt[i][0]=Math.round(2*(Math.random()-.5)*500);
		if(Math.random()>0.7)ggt[i][1]=Math.round(2*(Math.random()-.5)*500);
	}
	for(i=0;i<k1.length;i++)
	{
		k1[i][0]=Math.round(2*(Math.random()-.5)*500);
		if(Math.random()>0.7)k1[i][1]=Math.round(2*(Math.random()-.5)*500);
	}
	for(i=0;i<k2.length;i++)
	{
		k2[i][0]=Math.round(2*(Math.random()-.5)*500);
		if(Math.random()>0.7)k2[i][1]=Math.round(2*(Math.random()-.5)*500);
	}
	var k11=clonep(k1),k22=clonep(k2);k1=multp(k1,ggt);k2=multp(k2,ggt);
	g=ggtp(k1,k2);
	k1=divp(k1,g);k2=divp(k2,g);
	alert(k11+"\n"+k1+"\n\n"+k22+"\n"+k2+"\n\n"+ggt+"\n"+g);
}
function test1()
{
		var a,b,g;
/*	a=new Array(-27,-5);
	b=new Array(-28,12);
	alert(g=kxggt(a,b));
	alert(kxdiv(a,g)+"\n"+kxdivrestr+","+kxdivresti);
	alert(kxdiv(b,g)+"\n"+kxdivrestr+","+kxdivresti);return;*/
	for(var i=0;i<100;i++)
	{status=i;
		do{g=new Array(Math.round(2*(Math.random()-.5)*50000),Math.round(2*(Math.random()-.5)*50000));}while((g[0]==0)&&(g[1]==0));
		do{a=new Array(Math.round(2*(Math.random()-.5)*50000),Math.round(2*(Math.random()-.5)*50000));}while((a[0]==0)&&(a[1]==0));
		do{b=new Array(Math.round(2*(Math.random()-.5)*50000),Math.round(2*(Math.random()-.5)*50000));}while((b[0]==0)&&(b[1]==0));
		a=kxmult(a,g);b=kxmult(b,g);
		var gg=kxggt(a,b);
		kxdiv(a,gg);var rr1=kxdivrestr,ri1=kxdivresti;
		kxdiv(b,gg);var rr2=kxdivrestr,ri2=kxdivresti;
		if((rr1!=0)||(rr2!=0)||(ri1!=0)||(ri2!=0))
		{
			alert("Reste:\n"+rr1+"  "+ri1+"\n"+rr2+"  "+ri2+"\na = "+a+"\nb = "+b+"\ng = "+g+"\nkxggt = "+gg+"\ni="+i);
			break;
		}
	}
}


//test();
//pseudopolydivp(new Array(new Array(-5,0),new Array(2,0),new Array(8,0),new Array(-3,0),new Array(-3,0),new Array(0,0),new Array(1,0),new Array(0,0),new Array(1,0)),new Array(new Array(21,0),new Array(-9,0),new Array(-4,0),new Array(0,0),new Array(5,0),new Array(0,0),new Array(3,0)));

var k8=new Array(new Array(-2432,-2176),new Array(5312,5088),new Array(-1744,-1952),new Array(-3600,-2784),new Array(4448,1824),new Array(-2880,128),new Array(656,-128),new Array(272,0),new Array(-32,0));
var k9=new Array(new Array(-640,0),new Array(1184,0),new Array(256,0),new Array(-1472,0),new Array(640,0),new Array(32,0));
//(ggtp(k8,k9,true));
//alert(k8+"\n"+k9);

//var k1=new Array(new Array(2,1),new Array(-1,0));
//var k2=new Array(new Array(-1,0),new Array(0,1));
//machganzzahlig(k);
//alert(k);
//k3=new Array(new Array(-32,0),new Array(-12,16),new Array(16,3),new Array(6,-3));
//k4=new Array(new Array(-8,0),new Array(1,2),new Array(3,0));
//k5=new Array(new Array(-4,8),new Array(8,5),new Array(4,-2));
k6=new Array(new Array(3,1),new Array(-6,2),new Array(-12,0),new Array(42,4));
//k7=new Array(new Array(7,0),new Array(-18,0),new Array(8,0),new Array(-1,0),new Array(2,0));

//alert(multInt(0,0));
//alert(ggtp(k6,k7,true));
//alert(k6+"\n"+k7);
//alert(kxmult(new Array(3,0),new Array(4,0)));


//alert("ggt="+kxggt(new Array(100,0),new Array(17,0)));
//alert(contp(k6));
//alert(divInt("-500000000000000000000000000","-300000000000000000000000000")+"      "+divRest);
