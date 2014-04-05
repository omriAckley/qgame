//ALL THE CREDIT GOES TO Arndt Brünner
//I'm using code from this wonderful website: http://www.arndt-bruenner.de/mathe/scripts/engl_eigenwert2.htm
//Specifically, I'm using code from the detb.js and solvepkx.js files

// Javascript (c) Arndt Brünner, Juli 2008
// Eigenwerte und -vektoren komplexwertiger Matrizen

//////////////////////////////////////////////////////////////////////////////////////
//FROM FILE: bigint1.js

// alle Übergaben mit Strings oder Ganzzahlen
var divRest=0,useJava=(1==0);
//alert(divInt("17987876678900","678767")+"\n"+divRest);
function multInt(a,b)
{
	if(isNaN(a)||isNaN(b)){alert("a*b!\n"+a+"\n"+b);return "0";}
	var x;if(Math.abs(x=Number(a)*Number(b))<1e15)return String(x);
	if(useJava)return String(document.bigIntApplet.calc("*",String(a),String(b)));
	var A=String(a).replace(/-/,""),B=String(b).replace(/-/,""),s=sgn(a*b);
	//alert("mult "+a+" * "+b);
	A=prep(A,6);B=prep(B,6);
	var p=multInt_(A,B,1000000);
	return ((s==-1)?"-":"")+perp(p,6);
}
function divInt(a,b)
{
	if(isNaN(a))alert("a! /\n"+a);if(isNaN(b))alert("b! /\n"+b);
	if((Math.abs(Number(a))<1e15)&&(Math.abs(Number(b))<1e15))
	{
		divRest=String(a%b);return String(Math.floor(Math.abs(Number(a))/Math.abs(Number(b)))*sgn(a)*sgn(b));
	}
	if(useJava)
	{
		divRest=String(document.bigIntApplet.calc("%",String(a),String(b)));
		return String(document.bigIntApplet.calc("/",String(a),String(b)));
	}
	var A=String(a).replace(/-/,""),B=String(b).replace(/-/,""),s=sgn(a*b);
	//alert("div "+a+" / "+b);
	A=prep(A,6);B=prep(B,6);
	var q=divInt_(A,B,1000000);
	if(Number(a)<0)divRest="-"+divRest;
	return ((s==-1)?"-":"")+perp(q,6);
}
function subInt(a,b)
{	
	if(isNaN(a))alert("a! -\n"+a);if(isNaN(b))alert("b! -\n"+b);
	if((Math.abs(Number(a))<1e15)&&(Math.abs(Number(b))<1e15))return String(Number(a)-Number(b));
	if(useJava)return String(document.bigIntApplet.calc("-",String(a),String(b)));
	var sa=sgn(a),sb=sgn(b),A=String(a).replace(/-/,""),B=String(b).replace(/-/,""),d;
	A=prep(A,6);B=prep(B,6);
	//alert("sub "+a+" - "+b);
	if(sa==0)return ("-"+b).replace(/--/,""); if(sb==0)return a; 
	if(sa*sb==-1)return((sa<0)?"-":"")+perp(addInt_(A,B,1000000),6);
	var cmp=comp(A,B);
	if((sa>0)&&(sb>0))
	{
		if(cmp==-1)return perp(subInt_(A,B,1000000),6);
		if(cmp==1)return "-"+perp(subInt_(B,A,1000000),6);
		return "0";
	}
	if((sa<0)&&(sb<0))
	{
		if(cmp==-1)return "-"+perp(subInt_(A,B,1000000),6);
		if(cmp==1)return perp(subInt_(B,A,1000000),6);
		return "0";
	}
}
function addInt(a,b)
{	
if(isNaN(a))alert("a! +\n"+a);if(isNaN(b))alert("b! +\n"+b);
	if((Math.abs(Number(a))<1e15)&&(Math.abs(Number(b))<1e15))return String(Number(a)+Number(b));
	if(useJava)return String(document.bigIntApplet.calc("+",String(a),String(b)));
	var sa=sgn(a),sb=sgn(b),A=String(a).replace(/-/,""),B=String(b).replace(/-/,""),s;
	A=prep(A,6);B=prep(B,6);
	//alert("add "+a+" + "+b);
	if(sa==0)return b; if(sb==0)return a;
	if(sa*sb>0){s=addInt_(A,B,1000000);return((sa<0)?"-":"")+perp(s,6);}
	var cmp=comp(A,B);
	if((sa>0)&&(sb<0))
	{
		if(cmp==-1){s=subInt_(A,B,1000000);return perp(s,6);}
		else {s=subInt_(B,A,1000000);return "-"+perp(s,6);}
	}
	if((sa<0)&&(sb>0))
	{
		if(cmp==-1){s=subInt_(A,B,1000000);return "-"+perp(s,6);}
		else {s=subInt_(B,A,1000000);return perp(s,6);}
	}
}
function comp(a,b)
{
	var i,j;
	for(i=a.length-1;i>=0;i--){if(Number(a[i])!=0)break;}
	for(j=b.length-1;j>=0;j--){if(Number(b[j])!=0)break;}
	if(i>j)return -1;
	if(i<j)return 1;
	for(i=j;i>=0;i--)
	{
		if(Number(a[i])>Number(b[i]))return -1;
		if(Number(a[i])<Number(b[i]))return 1;
	}
	return 0;
}

function prep(a,n)
{
	a=String(a);
	var aa=a;
	var i,m=Math.ceil(a.length/n);
	var A=new Array(m);
	for(i=0;i<m;i++)
	{
		A[i]=Number(a.substring(a.length-n,a.length));
		a=a.substring(0,a.length-n);
	}
	return A;
}
function perp(A,n)
{
	if(A==null)return;
	var a="",i;
	for(i=0;i<A.length;i++){a="000000000000000".substr(0,n-String(A[i]).length)+String(A[i])+a;}
	while((a.length>1)&&(a.charAt(0)=="0"))a=a.substr(1,a.length-1);
	return a;
}
function sgn(a){return (Number(a)<0)?-1:((Number(a)==0)?0:1);}
function addInt_(a,b,d)
{
	var i,c=new Array(a.length);
	for(i=0;i<a.length;i++)c[i]=a[i];
	for(i=0;i<b.length;i++)
	{
		if(i==c.length)c[i]=0;
		c[i]+=b[i];
		if(c[i]>=d)
		{
			if(i+1==c.length)c[i+1]=0;
			c[i+1]+=Math.floor(c[i]/d);
			c[i]%=d;
		}
	}//alert("add  "+c);
	return c;
}
function subInt_(a,b,d)   //   a>b  !!!
{
	//alert("sub "+a+"-"+b);
	var i,c=new Array(a.length);
	for(i=0;i<a.length;i++)c[i]=a[i];
	for(i=0;i<b.length;i++)
	{
		if(i==c.length)c[i]=0;
		c[i]-=b[i];
		while(c[i]<0){if(i==c.length)c[i+1]=0; c[i+1]-=1;c[i]+=d;}
	}//alert("sub  "+c);
	return c;
}
function multInt_(a,b,d)
{
	var aa=a.length,bb=b.length,cc=aa+bb,i,j,k;
	var c=new Array(cc);for(i=0;i<cc;i++)c[i]=0;
	for(i=0;i<aa;i++)
	{
		for(j=0;j<bb;j++)
		{
			k=i+j
			c[k]+=a[i]*b[j]
			if(c[k]>=d)
			{
				if(c.length==k+1)c[k+1]=0;
				c[k+1]+=Math.floor(c[k]/d);c[k]%=d;
			}
		}
	}//alert(c);
	return c;
}

function divInt_(a,b,d)
{
	if(b.length>1)return divInt2_(a,b,d);
	var c=new Array(a.length),i,r=0;
	//for(i=0;i<c.length;i++)c[i]=0;
	for(i=a.length-1;i>=0;i--)
	{
		c[i]=Math.floor((r*d+Number(a[i]))/b[0]);
		r=(r*d+Number(a[i]))%b[0];
	}
	divRest=r;
	return c;
}

function divInt2_(uu,v,b) //Knuth II, S. 272, Algorithm D
{
	//alert("div2 "+uu+"  "+v+"  "+b);
	//var vm=perp(v,6);
	var d=Math.floor(b/(Number(v[v.length-1])+1)),D=new Array(1),n=v.length,m=uu.length-n,j=m,qq,rr,Q=new Array(0),b_=String(b).length-1;
	D[0]=0;if(m<0){divRest=perp(uu,b_);return D;}
	var u=new Array(m+n),i,B=new Array(0),q=new Array(m),uuu=new Array(n+1);
	for(i=0;i<uu.length;i++)u[i]=Number(uu[i]);for(i=0;i<v.length;i++)v[i]=Number(v[i]);
	var bn=new Array();for(i=0;i<n;i++)bn[i]="0";bn[i]="1";//alert(bn);
	for(i=0;i<m;i++)q[i]=0;//alert("d="+d);
	D[0]=String(d);B[0]=String(b);
	if(d==1)u[m+n]=0;else{u=multInt_(u,D,b);v=multInt_(v,D,b);}
	//----"D2"----
	for(j=m;j>=0;j--) // siehe D7
	{
		//----"D3"----
		qq=Math.floor((u[j+n]*b+u[j+n-1])/v[n-1]);
		//alert("Berechnung von q:\nu[j+n]*b+u[j+n-1] = "+(u[j+n]*b+u[j+n-1])+"\nv[n-1] = "+v[n-1]+"\nqq = "+qq);
		rr=(u[j+n]*b+u[j+n-1])%v[n-1];
		while((qq==b)||(qq*v[n-2]>b*rr+u[j+n-2]))
		{
			qq--;rr+=v[n-1];
			//alert("Korrektur von q:\nq = "+qq+"\nqq*v[n-2] = "+(qq*v[n-2])+"\nb*rr+u[j+n-2] = "+(b*rr+u[j+n-2]));
			if(rr>=b)break;
		}
		Q[0]=qq;
		//----"D4"----
		var p=multInt_(v,Q,b),P=perp(p,b_);
		for(i=0;i<=n;i++)uuu[i]=u[i+j];
		var UUU=perp(uuu,b_);
		var ii=0;
		//alert("  P="+P+"\nUUU="+UUU+"\nP>UUU: "+(Number(P)>Number(UUU)));
		if(Number(P)>Number(UUU)){uuu=subInt_(addInt_(uuu,bn,b),p,b);ii=1;} else uuu=subInt_(uuu,p,b);
		for(i=0;i<=n;i++)u[i+j]=uuu[i];
		//alert("vor Korrektur: u="+u+"\n"+P+"\n"+"Komplement gebildet: "+(ii==1));
		//----"D5"----
		q[j]=qq;
		if(ii>0)
		{
			//----"D6"----
			q[j]--;
			for(i=0;i<n;i++)u[i+j]+=v[i];
			for(i=0;i<u.length;i++)
			{
				if(u[i]>=b)
				{
					if(i<u.length-1)u[i+1]+=Math.floor(u[i]/b);
					u[i]%=b;
				}
			}//alert("nach Korrektur: u="+u);
		}
		//---"D7"---
		//alert("qq="+q[j]+"\nq ="+q);
	}
	//---"D8"---
	divRest=perp(divInt_(u,D,b),b_);
	//alert("Division\n"+perp(uu,6)+"\n/"+vm+"\n="+perp(q,6)+"\nRest "+divRest);
	return q;
}

// berechnet floor(sqrt(a))
function sqrtInt(a)
{
	a=String(a);
	var e=Math.round((a.length-1)*3.3219280948873623478/2),i,s="1",ss;
	ss=s=potInt(2,e);
	for(i=0;i<10;i++){s=divInt(addInt(s,divInt(a,s)),2);if(s==ss)break;ss=s;}
	if(comp(multInt(s,s),a)==-1)s=subInt(s,1);
	return s;
}

// e normale Ganzzahl
function potInt(a,e)
{
	a=String(a);e=Math.floor(e);
	var b=new Array(),i=0,p="1";
	while(e>0){b[i++]=e%2;e=Math.floor(e/2);}
	for(i=b.length-1;i>=0;i--){p=multInt(p,p);if(b[i]==1)p=multInt(p,a);}
	return p;
}

function modInt(a,m)
{
	divInt(a,m);
	return divRest;
}

function ggTInt(a,b)
{
	if(useJava)return String(document.bigIntApplet.ggt(String(a),String(b)));
	if(a==1)return 1;if(b==1)return 1;
	if(a==-1)return 1;if(b==-1)return 1;
	var A=prep(String(a).replace(/-/,""),6);
	var B=prep(String(b).replace(/-/,""),6);
	if(a*b==0)return (comp(A,B)==1)?String(b).replace(/-/,""):String(a).replace(/-/,"");
	//alert("ggtint "+A+" , "+B);
	var R,i,j=0;
	do
	{
		if(B.length==1)divInt_(A,B,1000000);else divInt2_(A,B,1000000);
		//alert("A="+perp(A,6)+"\nB="+perp(B,6)+"\nR="+divRest);
		A=new Array(B.length);for(i=0;i<B.length;i++)A[i]=B[i];
		B=prep(divRest,6);
		if((A.length<=2)&&(B.length<=2))return ggT_(perp(A,6),perp(B,6));
		j++;
	}while((divRest!="0")&&(divRest!=0)&&(j<100));
	return perp(A,6);
}
function ggT_(a,b)
{
	if((Math.abs(a)>1e15)||(Math.abs(b)>1e15))return ggTInt(a,b);
	if(isNaN(a)||isNaN(b))return 1;
	if(a*b==0)return Math.max(Math.abs(a),Math.abs(b));//if(!confirm(a+"  "+b))return 1;
	a=Math.abs(a);b=Math.abs(b);
	var c;do{c=a%b;a=b;b=c;}while(c!=0);return a;
}
function kgVInt(a,b)
{
	var k=divInt(multInt(a,b),ggTInt(a,b));
	if(Number(k)<0)k=multInt(k,"-1");
	return k;
}

//alert(ggTInt("25095997860712576140513325","465271489830614921660040335291893054575"));
//var a=new Array(1);a[0]="16";var b=new Array(1);b[0]="11";
//alert(divInt2_(a,b,1000000)+"\n"+divRest);
//prompt("",multInt("-25095997860712576140513325","465271489830614921660040335291893054575"));


//benötigt bigint1.js

//m[0...n*n-1] usw. mit (m[i][0]+m[i][1]*î)/m[i][2]
/*

//////////////////////////////////////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////////////////////////////////////
//FROM FILE: kxpolynome.js

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

//////////////////////////////////////////////////////////////////////////////////////
//FROM FILE: solvepkx.js

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

var bruenner = {};
bruenner.eigenvalues = function eigenvalues(m) {
	var poly = new Array();
	var n = Math.sqrt(m.length);
	for (i=0;i<=n;i++) {
		poly[i] = charpolykoefff(m,n,i);
	}
	return solvepkx(poly);
};
