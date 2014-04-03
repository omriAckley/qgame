//benötigt bigint1.js

//m[0...n*n-1] usw. mit (m[i][0]+m[i][1]*î)/m[i][2]
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
