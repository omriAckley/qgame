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

