// Javascript (c) Arndt Brünner, Juli 2008
// Eigenwerte und -vektoren komplexwertiger Matrizen

// benötigt kxpolynome.js

//berechnet das charakteristische Polynom der Matrix M[0...n*n-1][0...1], 
// wobei M[][0] die reellen, M[][1] die imaginären Anteile darstellen.

//useJava=navigator.javaEnabled();

function charpolykx(M)
{
	var i,j,k,nn=M.length,n=Math.round(Math.sqrt(M.length)),fz,fn,eins=neup(1),qz,qn,kx=1==0;
	if(n*n!=nn){return null;}
	var N=new Array(nn),Z=new Array(nn);
	eins[0][0]=1;
	
	if(M[0].length==2)
	{
		for(i=0;i<nn;i++)
		{
			Z[i]=neup(1);N[i]=neup(1);
			Z[i][0][0]=M[i][0];
			Z[i][0][1]=M[i][1];
			N[i][0][0]=machganzzahlig(Z[i]);
			if((i%(n+1))==0)Z[i][1][0]=-N[i][0][0];
			if(M[i][1]!=0)kx=true;
		}
	}
	else
	{
		for(i=0;i<nn;i++)
		{
			Z[i]=neup(1);N[i]=neup(1);
			Z[i][0][0]=M[i][0];
			Z[i][0][1]=M[i][1];
			N[i][0][0]=M[i][2];
			if((i%(n+1))==0)Z[i][1][0]=-N[i][0][0];
			if(M[i][1]!=0)kx=true;
		}
	}
	//alert(Z.join("\n")+"\n\n"+N.join("\n"));return;

	for(i=n-1;i>0;i--)
	{
		status="diagonalisiere Matrix, Schritt "+(n-i)+" von "+(n-1);
		if(istNullp(Z[i*n+n-1-i]))
		{
			for(j=i-1;j>=0;j--)
			{
				if(!istNullp(Z[j*n+n-1-i]))
				{
					for(k=0;k<n;k++)addbp(Z,N,n,i,j,k,eins,eins);
					break;
				}
			}
		}
		fz=Z[i*n+n-1-i];fn=N[i*n+n-1-i];//alert(fz+"\n"+fn);
		ggtp(fz,fn,true);
		for(j=i-1;j>=0;j--)
		{
			//status=i+"  "+j;
			qz=multp(fn,Z[j*n+n-1-i]);  invp(qz);
			qn=multp(fz,N[j*n+n-1-i]);
			//ggtp(qz,qn,true);
			//alert(fz+"\n"+fn+"\n"+qz+"\n"+qn);
			for(k=n-1-i;k<n;k++)
			{
				addbp(Z,N,n,j,i,k,qz,qn);
				if(k>2)
				{
					//status="suche ggt von "+j+"  "+k+"  "+Z[n*j+k]+" | "+N[n*j+k];
					//document.getElementById("t").innerHTML=Z[n*j+k]+"<br>"+N[n*j+k];
					ggtp(Z[n*j+k],N[n*j+k],true);
				}
			}
			//alert("mit "+i+". Zeile die "+j+".Zeile\n\n"+Z.join("\n")+"\n\n"+N.join("\n"));
		}
		//alert(Z.join("\n")+"\n\n"+N.join("\n"));
	}

	//alert(Z[n-1]+"\n\n"+N[n-1]);
	var pn=clonep(N[n-1]),pz=clonep(Z[n-1]);
	ggtp(pz,pn,true);
	//alert(pz+"\n"+pn);

	for(i=1;i<n;i++)
	{
		status="multipliziere Diagonalelemente";
		pz=multp(Z[i*n+n-1-i],pz);pn=multp(N[i*n+n-1-i],pn);
		//alert("multipliziere mit \n"+Z[i*n+n-1-i]+"\n"+N[i*n+n-1-i]+"\n\n=\n"+pz+"\n"+pn);
		//status="ggt von pz/pn";
		ggtp(pz,pn,true)
		//alert("pz="+pz+"\npn="+pn+"\n\nggt="+g);
	}
	if(sgn(pn[0][0])==-1)invp(pn);
	if(sgn(pz[n][0])==sgn(((n%2)-.5)*2))invp(pz);
	status="";
	return new Array(pz,pn);
}

function charpolyr(M)
{
	var i,j,k,nn=M.length,n=Math.round(Math.sqrt(M.length)),fz,fn,eins=neupr(1),qz,qn,kx=1==0;
	if(n*n!=nn){return null;}
	var N=new Array(nn),Z=new Array(nn);
	eins[0]=1;
	
	for(i=0;i<nn;i++)
	{
		Z[i]=new Array(M[i],((i%(n+1))==0)?-1:0);
		N[i]=new Array(1);N[i][0]=machganzzahligr(Z[i]);
	}

		//alert(Z.join("\n")+"\n\n"+N.join("\n"));

	for(i=n-1;i>0;i--)
	{
		status="diagonalisiere Matrix, Schritt "+(n-i)+" von "+(n-1);
		if(istNullpr(Z[i*n+n-1-i]))
		{
			for(j=i-1;j>=0;j--)
			{
				if(!istNullpr(Z[j*n+n-1-i]))
				{
					for(k=0;k<n;k++)addbpr(Z,N,n,i,j,k,eins,eins);
					break;
				}
			}
			//alert("Habe zur "+i+". Zeile die "+j+". Zeile addiert\n\n"+Z.join("\n")+"\n\n"+N.join("\n"));
		}

		fz=Z[i*n+n-1-i];fn=N[i*n+n-1-i];ggtpr(fz,fn,true);
		for(j=i-1;j>=0;j--)
		{
			//status=i+"  "+j;
			qz=multpr(fn,Z[j*n+n-1-i]);  invpr(qz);   zmult++;
			qn=multpr(fz,N[j*n+n-1-i]);               zmult++;

			//ggtpr(qz,qn,true);
			//alert(fz+"\n"+fn+"\n"+qz+"\n"+qn);
			for(k=n-1-i;k<n;k++)
			{
				addbpr(Z,N,n,j,i,k,qz,qn);          zmult++;zadd++;
				if(k>=0)
				{
					//status="suche ggt von "+j+"  "+k+"  "+Z[n*j+k]+" | "+N[n*j+k];
					//document.getElementById("t").innerHTML=Z[n*j+k]+"<br>"+N[n*j+k];
					ggtpr(Z[n*j+k],N[n*j+k],true);
				}
			}
			//alert("mit "+i+". Zeile die "+j+". Zeile\n\n"+Z.join("\n")+"\n\n"+N.join("\n"));
		}
		//alert(Z.join("\n")+"\n\n"+N.join("\n"));
	}

	//alert(Z[n-1]+"\n\n"+N[n-1]);
	var pn=clonepr(N[n-1]),pz=clonepr(Z[n-1]);
	//ggtp(pz,pn,true);
	//alert(pz+"\n"+pn);

	for(i=1;i<n;i++)
	{
		status="multipliziere Diagonalelemente";
		pz=multpr(Z[i*n+n-1-i],pz);pn=multpr(N[i*n+n-1-i],pn);    zmult++;
		//alert("multipliziere \n"+Z[i*n+n-1-i]+"\n"+N[i*n+n-1-i]+"\n\n=\n"+pz+"\n"+pn);
		//status="ggt von pz/pn";
		var g=ggtpr(pz,pn,true)
		//alert("pz="+pz+"\npn="+pn+"\n\nggt="+g);
		//alert("gekürzt\n"+pz+"\n"+pn);
	}
	if(sgn(pn[0])==-1)invpr(pn);
	if(sgn(pz[n])==sgn(((n%2)-.5)*2))invpr(pz);
	status="";
	return new Array(pz,pn);
	
}

//var k=new Array(0)
//k[0]=new Array(0,0);
//alert(istNullp(k));
//- x^5 + 5.5·x^4 + 40·x^3 + 12.5·x^2 + 62·x + 76 - î·(4·x^3 + 8·x^2 - 45·x - 68)
//M[zz*n+s]+=M[qz+s]*fz/fn



function addbp(Z,N,n,zz,qz,s,fz,fn)
{
	var NN=multp(N[zz*n+s],multp(fn,N[qz*n+s])),i;
	//alert(Z[qz*n+s]+"\n"+N[qz*n+s]+"\n"+Z[zz*n+s]+"\n"+N[zz*n+s]+"\n"+fz+"\n"+fn+"\n"+multp(fn,N[qz*n+s]));
	Z[zz*n+s]=addp(multp(Z[zz*n+s],multp(fn,N[qz*n+s])),multp(multp(fz,Z[qz*n+s]),N[zz*n+s]));
	for(i=0;i<N[zz*n+s].length;i++){N[zz*n+s][i][0]=NN[i][0];N[zz*n+s][i][1]=NN[i][1];}
	for(i=N[zz*n+s].length;i<NN.length;i++)N[zz*n+s].push(new Array(NN[i][0],NN[i][1]));
}
function addbpr(Z,N,n,zz,qz,s,fz,fn)
{
	var NN=multpr(N[zz*n+s],multpr(fn,N[qz*n+s])),i;
	//alert(Z[qz*n+s]+"\n"+N[qz*n+s]+"\n"+Z[zz*n+s]+"\n"+N[zz*n+s]+"\n"+fz+"\n"+fn+"\n"+multp(fn,N[qz*n+s]));
	Z[zz*n+s]=addpr(multpr(Z[zz*n+s],multpr(fn,N[qz*n+s])),multpr(multpr(fz,Z[qz*n+s]),N[zz*n+s]));
	for(i=0;i<N[zz*n+s].length;i++){N[zz*n+s][i]=NN[i];}
	for(i=N[zz*n+s].length;i<NN.length;i++)N[zz*n+s].push(NN[i]);
}

//alert(new Array(1,2)[0][1]);