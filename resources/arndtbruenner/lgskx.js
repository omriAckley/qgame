// Javascript (c) Arndt Brünner, Gelnhausen 2008
// löst Gleichungssysteme mit Koeffizienten (a+bî)/c, mit a,b aus Z und c aus N.
// benötigt im genauen Modus bigint1.js

//m=new Array(new Array(0,0,1),new Array(1,0,1),new Array(1,0,1),new Array(5,0,1),new Array(2,0,1),new Array(-1,0,1),new Array(1,0,1),new Array(3,0,1),new Array(1,0,1),new Array(0,0,1),new Array(-2,0,1),new Array(-5,0,1));
//solvelgskx(m,3,true,true);alert(matrixstr(m,4));alert(matrixstr(I,3));

var I // inverse Matrix
function solvelgskx(m,n,exakt,inv)
{
	if(exakt)return solvelgskxexakt(m,n,inv);//alert(m);
	var i,j,k,kk,di,dj,x,dii=0,r0,i0,fr,fi,ni,nn=n+1,Ir1,Ir0,Ii1,Ii0,In1;
	if(m[0].length==3){for(i=0;i<m.length;i++){m[i][0]/=m[i][2];m[i][1]/=m[i][2];}}
	if(inv){I=new Array(n*n);for(i=0;i<I.length;i++){I[i]=new Array((i%(n+1)==0)?1:0,0);}}
	//alert(matrixstr(m,n));
	for(i=0;i<n;i++)
	{
		do{
			di=i*nn+dii;
			if((Math.abs(m[di][0])<1e-10)&&(Math.abs(m[di][1])<1e-10))
			{
				for(j=i+1;j<n;j++)
				{
					dj=j*nn+dii;if((Math.abs(m[dj][0])>1e-10)||(Math.abs(m[dj][1])>1e-10))
					{
						for(k=0;k<=n;k++)for(kk=0;kk<2;kk++)m[i*nn+k][kk]=1.0*(m[j*nn+k][kk]+Number(m[i*nn+k][kk]));
						//alert("Zeile "+j+" auf "+i+" addiert\n\n"+matrixstr(m,n+1)+"\n\n"+matrixstr(I,n));
						if(inv){for(k=dii;k<n;k++)for(kk=0;kk<2;kk++)I[i*n+k][kk]=1.0*I[j*n+k][kk]+I[i*n+k][kk];}
						break;
					}
				}
				if(j<n)break;
				dii++;
			}
			else break;	
		}while(dii<n);if(dii>=n)break;
		if(dii>i)return null;
		r1=m[di][0];i1=m[di][1];ni=r1*r1+i1*i1;
		if(inv){Ir1=I[n*i+dii][0];Ii1=I[n*i+dii][1];Ini=Ir1*Ir1+Ii1*Ii1;}
		for(j=0;j<n;j++)
		{
			if(i==j)continue;
			dj=nn*j+dii;r0=m[dj][0];i0=m[dj][1];if((r0==0)&&(i0==0))continue;
			if(inv){Ir0=I[n*j+dii][0];Ii0=I[n*j+dii][1];}
			fr=(r0*r1+i0*i1)/ni;fi=(i0*r1-i1*r0)/ni;//alert(fr+"  "+fi+"\n"+r0+"  "+i0+"\n"+r1+"  "+i1)
			for(k=n;k>=0;k--)
			{
				if(k>dii)
				{
					m[j*nn+k][0]-=fr*m[i*nn+k][0]-fi*m[i*nn+k][1];m[j*nn+k][1]-=fi*m[i*nn+k][0]+fr*m[i*nn+k][1];
					if(Math.abs(m[j*nn+k][0])<1e-14)m[j*nn+k][0]=0;if(Math.abs(m[j*nn+k][1])<1e-14)m[j*nn+k][1]=0;
				}
				if((inv)&&(k<n))
				{
					I[j*n+k][0]-=fr*I[i*n+k][0]-fi*I[i*n+k][1];
					I[j*n+k][1]-=fi*I[i*n+k][0]+fr*I[i*n+k][1];
				}
			}
			m[dj][0]=m[dj][1]=0;
			//alert("in Zeile "+j+": -("+fr+")*Zeile "+i+"\n\n"+matrixstr(m,n+1)+"\n\n"+matrixstr(I,n));
		}
		//alert(matrixstr(m,n));
		dii++;
	}
	if(dii!=n)return null;
	for(i=0;i<n;i++)
	{
		i1=-1;
		for(j=0;j<=n;j++)
		{
			i0=i*nn+j;
			if((i1==-1)&&((m[i0][0]!=0)||(m[i0][1]!=0)))
			{i1=i0;r1=m[i0][0];i1=m[i0][1];m[i0][0]=1;m[i0][1]=0;ni=r1*r1+i1*i1;}
			else if((m[i0][0]!=0)||(m[i0][1]!=0))
			{
				x=(m[i0][0]*r1+m[i0][1]*i1)/ni;m[i0][1]=(m[i0][1]*r1-m[i0][0]*i1)/ni;m[i0][0]=x;
			}
		}
		if(inv)
		for(j=0;j<n;j++)
		{
			x=(I[i*n+j][0]*r1+I[i*n+j][1]*i1)/ni;
			I[i*n+j][1]=(I[i*n+j][1]*r1-I[i*n+j][0]*i1)/ni;
			I[i*n+j][0]=x;
		}
			//alert("teile Zeile "+i+" durch "+r1+"\n\n"+matrixstr(I,2));
	}
	//alert(matrixstr(m,n+1));
	//prompt("",deriveStr(I,n).replace(/\/undefined/g,""));
	return dii-i;
}


function solvelgskxexakt(m,n,inv)
{
	var i,j,k,di,dj,n1=n+1,st=status;
	if(inv){I=new Array(n*n);for(i=0;i<I.length;i++){I[i]=new Array((i%(n+1)==0)?1:0,0,1);}}
		//alert(m.join("\n")+"\n\nn="+n);return;
	status=st+" 0%";
	for(i=0;i<n;i++)
	{
		di=n1*i+i;
		if((m[n1*i+i][0]==0)&&(m[di][1]==0))
		{
			if(i==n-1)return null;
			for(j=i+1;j<n;j++)
			{
				if((m[n1*j+i][0]!=0)||(m[n1*j+i][1]!=0))
				{
					//alert(status="addiere Zeile "+j);
					for(k=i;k<n1;k++)sube(m,n1,i,j,k,1,0,1,-1,0,1);
					if(inv){for(k=0;k<n;k++)sube(I,n,i,j,k,1,0,1,-1,0,1);}
					break;
				}
				if(j==n-1)return null;
			}
		}
		var rr=m[di][0],ii=m[di][1],nn=m[di][2];
		for(j=0;j<n;j++)
		{
			if(i==j)continue;
			dj=n1*j+i;
			//alert(status=i+"  "+j+"\n\ndj="+dj);
			var rrr=m[dj][0],iii=m[dj][1],nnn=m[dj][2];
			if((rrr==0)&&(iii==0))continue;
			if(inv)for(k=0;k<n;k++){sube(I,n,j,i,k,rr,ii,nn,rrr,iii,nnn);kzkx(I[n*j+k]);}
			for(k=n;k>=0;k--){sube(m,n1,j,i,k,rr,ii,nn,rrr,iii,nnn);kzkx(m[n1*j+k]);}
			m[dj][0]=0;m[dj][1]=0;m[dj][2]=1;
			//alert("Zeile "+j+": ("+rr+","+ii+","+nn+")*Z "+j+" - ("+rrr+","+iii+","+nnn+")*Z"+i+"\n\n"+matrixstr(m,n+1)+"\n\n"+matrixstr(I,n));
			//alert(matrixstr(m,n+1)+"\n\ni="+i+"\nn="+n);
		}
		//alert(matrixstr(m,n+1)+"\n\ni="+i);
	
	status=st+"  "+Math.floor(100*(i+1)/(n+1))+"%";
	}
	//prompt("",deriveStr(I,n));
	for(i=0;i<n;i++)
	{
		var d=new Array(m[i*n1+i][0],m[i*n1+i][1],m[i*n1+i][2]);
		for(j=0;j<=n;j++)
		{
			if(j>=i){m[i*n1+j]=divkx(m[i*n1+j],d);kzkx(m[i*n1+j]);}
			if((inv)&&(j<n)){I[i*n+j]=divkx(I[i*n+j],d);kzkx(I[i*n+j]);}
		}
	}
	//prompt("",deriveStr(I,n));
	return true;
}
function solvelgsexakt(m,n,inv)
{
	var i,j,k,di,dj,n1=n+1,st=status;
	if(inv){I=new Array(n*n);for(i=0;i<I.length;i++){I[i]=new Array((i%(n+1)==0)?1:0,0,1);}}
		//alert(m.join("\n")+"\n\nn="+n);return;
	status=st+" 0%";
	for(i=0;i<n;i++)
	{
		di=n1*i+i;
		if(Number(m[di][0])==0)
		{
			if(i==n-1)return null;
			for(j=i+1;j<n;j++)
			{
				if(m[n1*j+i][0]!=0)
				{
					//alert(status="addiere Zeile "+j);
					for(k=i;k<n1;k++)suber(m,n1,i,j,k,1,0,1,-1,0,1);
					if(inv){for(k=0;k<n;k++)suber(I,n,i,j,k,1,0,1,-1,0,1);}
					break;
				}
				if(j>=n-1)return null;	
			}
		}
		var rr=m[di][0],nn=m[di][2];
		for(j=0;j<n;j++)
		{
			if(i==j)continue;
			dj=n1*j+i;
			//alert(status=i+"  "+j+"\n\ndj="+dj);
			var rrr=m[dj][0],nnn=m[dj][2];
			if((m[dj][0]==0)&&(m[dj][1]==0))continue;
			if(inv)for(k=0;k<n;k++){suber(I,n,j,i,k,rr,0,nn,rrr,0,nnn);kzkx(I[n*j+k]);}
			for(k=n;k>=0;k--){suber(m,n1,j,i,k,rr,0,nn,rrr,0,nnn);kzkx(m[dj]);}
			//alert("Zeile "+j+": ("+rr+"/"+nn+")*Z "+j+" - ("+rrr+"/"+nnn+")*Z"+i+"\n\n"+matrixstr(m,n+1)+"\n\n"+matrixstr(I,n));
			m[dj][0]=0;m[dj][1]=0;m[dj][2]=1;
			//alert(matrixstr(m,n+1)+"\n\ni="+i+"\nn="+n);
		}
		//alert(matrixstr(m,4)+"\n\ni="+i);
		status=st+"  "+Math.floor(100*(i+1)/(n+1))+"%";
		//alert(matrixstr(m,n+1)+"\n\n"+matrixstr(I,n));
	}
	for(i=0;i<n;i++)
	{
		var d=new Array(m[i*n1+i][0],0,m[i*n1+i][2]);if(d[0]<0){d[0]=multInt(d[0],-1);d[2]=multInt(d[2],-1);}
		for(j=0;j<=n;j++)
		{
			//status=m[i*n1+j][0]+"  "+m[i*n1+j][2]+"  "+((j<n)?I[i*n+j][0]+"  "+I[i*n+j][2]:"/ / ")+"  "+d[0]+"   "+d[2];
			if(j>=i){m[i*n1+j][0]=multInt(m[i*n1+j][0],d[2]);m[i*n1+j][2]=multInt(m[i*n1+j][2],d[0]);kzkx(m[i*n1+j]);}
			if((inv)&&(j<n)){I[i*n+j][0]=multInt(I[i*n+j][0],d[2]);I[i*n+j][2]=multInt(I[i*n+j][2],d[0]);kzkx(I[i*n+j]);}
		}
	}
	return true;
}

e=new Array(new Array(1,0,1),new Array(2,0,1),new Array(2,0,1));
v=new Array(new Array(new Array(1,0,1),new Array(2,0,1),new Array(3,0,1)),
            new Array(new Array(1,0,1),new Array(0,0,1),new Array(2,0,1)),
            new Array(new Array(0,0,1),new Array(1,0,1),new Array(0,0,1)));
//alert(matrixstr(eigenmatrix(e,v),3));


// liefert zu Eigenwerten e und zugehörigen Eigenvektoren v die Koeffizienten der zugehörigen Matrix
function eigenmatrix(e,v)
{
	var n=e.length,i;
	if(e[0].length==3)return eigenmatrix2(e,v);
	var V=new Array(n*(n+1)),A=new Array(n*n),vv=new Array(n);
	for(i=0;i<n;i++){for(j=0;j<n;j++)V[i*(n+1)+j]=new Array(v[i][j][0]/v[i][j][2],v[i][j][1]/v[i][j][2]);V[i*(n+1)+j]=new Array(0,0);}
	if(solvelgskx(V,n,false,true)==null)return null;
	status="Berechne Koeffizienten der Matrix (im Fließkommamodus)";
	for(i=0;i<n;i++)
	{
		for(j=0;j<n;j++)vv[j]=new Array((v[j][i][0]*e[j][0]-v[j][i][1]*e[j][1])/v[j][i][2],(v[j][i][1]*e[j][0]+v[j][i][0]*e[j][1])/v[j][i][2]);
		var a=matrixmalvektor(I,vv,n);
		for(j=0;j<n;j++)A[i*n+j]=new Array(a[j][0],a[j][1]);
	}
	return A;
}
function eigenmatrix2(e,v)
{
	var n=e.length,i,j;
	var V=new Array(n*(n+1)),A=new Array(n*n),vv=new Array(n),kx;
	for(i=0;i<e.length;i++){if(e[i][1]!=0)break;for(j=0;j<e.length;j++){if(v[i][j][1]!=0)break;}if(j<e.length)break;}
	kx=(i<e.length);
	for(i=0;i<n;i++){for(j=0;j<n;j++)V[i*(n+1)+j]=new Array(v[i][j][0],v[i][j][1],v[i][j][2]);V[i*(n+1)+j]=new Array(0,0,1);}
	if(kx){status="Berechne Inverse (exakt, komplex) ";if(solvelgskxexakt(V,n,true)==null)return null;}
	else{status="Berechne Inverse (exakt, reell) ";if(solvelgsexakt(V,n,true)==null)return null;}
	status="Berechne Koeffizienten der Matrix (exakt, "+((kx)?"komplex":"reell")+") ";
	for(i=0;i<n;i++)
	{
		if(kx)
		for(j=0;j<n;j++)vv[j]=new Array( subInt(multInt(v[j][i][0],e[j][0]),multInt(v[j][i][1],e[j][1])) ,
		                                 addInt(multInt(v[j][i][1],e[j][0]),multInt(v[j][i][0],e[j][1])) ,
		                                 multInt(v[j][i][2],e[j][2])    );
		else
		for(j=0;j<n;j++)vv[j]=new Array( multInt(v[j][i][0],e[j][0]) ,
		                                 0                           ,
		                                 multInt(v[j][i][2],e[j][2])    );
		var a=(kx)?matrixmalvektor2(I,vv,n):matrixmalvektor2r(I,vv,n);
		for(j=0;j<n;j++)A[i*n+j]=new Array(a[j][0],a[j][1],a[j][2]);
		status="Berechne Koeffizienten der Matrix (exakt) "+Math.round((i+1)*100/n)+"%";
	}
	return A;
}

function matrixmalvektor(m,v,n)
{
	var u=new Array(n),i,j;
	for(i=0;i<n;i++)
	{
		u[i]=new Array(m[i*n][0]*v[0][0]-m[i*n][1]*v[0][1],m[i*n][1]*v[0][0]+m[i*n][0]*v[0][1]);
		for(j=1;j<n;j++)
		{
			u[i][0]+=m[i*n+j][0]*v[j][0]-m[i*n+j][1]*v[j][1];
			u[i][1]+=m[i*n+j][1]*v[j][0]+m[i*n+j][0]*v[j][1];
		}
	}
	return u;
}
function matrixmalvektor2(m,v,n)
{
	var u=new Array(n),i,j,s0,s1,s2,r;
	for(i=0;i<n;i++)
	{
		u[i]=new Array(subInt(multInt(m[i*n][0],v[0][0]),multInt(m[i*n][1],v[0][1])),
		               addInt(multInt(m[i*n][1],v[0][0]),multInt(m[i*n][0],v[0][1])),
		               multInt(m[i*n][2],v[0][2]));
		for(j=1;j<n;j++)
		{
			s0=subInt(multInt(m[i*n+j][0],v[j][0]),multInt(m[i*n+j][1],v[j][1]));
			s1=addInt(multInt(m[i*n+j][1],v[j][0]),multInt(m[i*n+j][0],v[j][1]));
			s2=multInt(m[i*n+j][2],v[j][2]);
			u[i][0]=addInt(multInt(u[i][0],s2),multInt(u[i][2],s0));
			u[i][1]=addInt(multInt(u[i][1],s2),multInt(u[i][2],s1));
			u[i][2]=multInt(u[i][2],s2);
			kzkx(u[i]);
		}
	}
	return u;
}
function matrixmalvektor2r(m,v,n)
{
	var u=new Array(n),i,j,s0,s1,s2,r,g;
	for(i=0;i<n;i++)
	{
		u[i]=new Array(multInt(m[i*n][0],v[0][0]),
		               0,
		               multInt(m[i*n][2],v[0][2]));
		for(j=1;j<n;j++)
		{
			s0=multInt(m[i*n+j][0],v[j][0]);
			s1=0;
			s2=multInt(m[i*n+j][2],v[j][2]);
			u[i][0]=addInt(multInt(u[i][0],s2),multInt(u[i][2],s0));
			u[i][2]=multInt(u[i][2],s2);
			g=ggTInt(u[i][0],u[i][2]);if(g!=1){u[i][0]=divInt(u[i][0],g);u[i][2]=divInt(u[i][2],g);}
		}
	}
	return u;
}
function deriveStr(m,n)
{
	var i,t="[";
	for(i=0;i<m.length;i++)t+="("+m[i][0]+"+("+m[i][1]+"î))/"+m[i][2]+(((i%(n))==n-1)?(i<m.length-1)?";":"]":",");
	return t;
}
function matrixstr(m,n)
{
	var i,t="";
	for(i=0;i<m.length;i++)t+=m[i]+(((i%(n))==n-1)?"\n":"  ");
	return t;
}