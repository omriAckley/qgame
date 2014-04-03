var T="",ITER="",komplex=(1==1),reell=(1==1),newtonq=1,normieren=2,quatsch=0;
var iterationsverfahren=(8==8),probemachen=(1==1);
var tol1,tol1b,tol2,jmax,gzmax,engl=(0==1);
var k_merk=new Array(),Lr_merk=new Array(),Li_merk=new Array(),dirty=(1==1),dirty1=(1==1);

function test()
{return;
	m=new Array(7,-2,0,-2,6,-2,0,-2,5);
	solveEigenwerte(m,3);
}

function runengl()
{
	engl=(1==1);
	run();
	T=T.replace(/, /g,"Ü").replace(/,/g,".").replace(/;/g,",").replace(/Ü/g,", ");
	T=T.replace(/Müßte Nullvektor ergeben/g,"all numbers should be 0");
	T=T.replace(/Eigenvektor/g,"Eigenvector").replace(/vektor/g,"vector");
	T=T.replace(/Eigenwerte/g,"eigenvalues").replace(/Eigenwert/g,"eigenvalue");
	T=T.replace(/reeller/g,"Real").replace(/reelle/g,"Real");
	T=T.replace(/komplexer/g,"Complex").replace(/komplexe/g,"Complex");
	T=T.replace(/zum/g,"related to").replace(/zu/g,"of");
	T=T.replace(/Probe/g,"test");
	T=T.replace(/Nullstellen wurden nicht gefunden/,"zeros of polynomial couldn't be found");
	T=T.replace(/OFFENSICHTLICH FALSCH!/g,"ERROR!");
	T=T.replace(/UNGENAUES ERGEBNIS!  Maximaler Fehler/g,"INEXACT RESULT!   max. err.");
	document.f.t.value=T;
}

function run()
{
	var t=document.f.m.value;
	if(t=="")return;
	T="";ITER="";
	normieren=document.f.norm.selectedIndex;
	iterationsverfahren=document.f.iterationsverfahren.checked;
	probemachen=document.f.probe.checked;
	var i;
	i=Number(document.f.jmax[document.f.jmax.selectedIndex].text);
	if(i>jmax)dirty1=true;jmax=i;
	gzmax=parseInt(document.f.gzmax[document.f.gzmax.selectedIndex].text);
	i=Number(document.f.tol1[document.f.tol1.selectedIndex].text);
	if(i!=tol1)dirty1=true;tol1=i;
	i=Number(document.f.tol1b[document.f.tol1b.selectedIndex].text);
	if(i!=tol1b)dirty1=true;tol1b=i;
	tol2=Number(document.f.tol2[document.f.tol2.selectedIndex].text);
	t=t.replace(/,/g,".").replace(/\n/g," ").replace(/\r/g," ").replace(/;/g," ").replace(/ +/g," ");
	while(t.charAt(0)==" ")t=t.substr(1,t.length-1);
	while(t.charAt(t.length-1)==" ")t=t.substr(0,t.length-1);
	var m=t.split(" ");
	var n=Math.sqrt(m.length);
	if((n%1)!=0)
	{
		T+=(engl)?"The matrix is not square":"Die Matrix ist nicht quadratisch.";
	}
	else
	{
		for(i=0;i<m.length;i++){if(m[i].indexOf("/")>-1){var M=m[i].split("/");m[i]=Number(M[0])/Number(M[1]);}else m[i]=Number(m[i]);}
		solveEigenwerte(m,n);
	}
	T=T.replace(/e \+ /g,"e+").replace(/e - /g,"e-");
	document.f.t.value=T;
}

function zufall(n)
{
	var i,j,t="",x;
	for(i=0;i<n;i++)
	{
		for(j=0;j<n;j++)
		{
			x=Math.floor(Math.random()*20-10);
			if(n>5)x=Math.floor(Math.random()*10-5);
			t+="       ".substr(0,4-String(x).length)+x;
		}
		t+="\n";
	}
	dirty=true;
	document.f.m.value=t;
	document.f.t.value="";
}
 function solveEigenwerte(m,n)
{
	var nn=n*n,Z=new Array(nn),N=new Array(nn),i,j,d=new Array(n);
	var r=new Array();
	var k=new Array(),Lr=new Array(),Li=new Array();

	if(dirty)
	{
		for(i=0;i<nn;i++){Z[i]=new Array(m[i],0);N[i]=new Array(1,0);}
		for(i=0;i<nn;i+=n+1)Z[i][1]=-1;

		for(i=0;i<nn;i++)if((m[i]%1)!=0)break;
		var ganzzahlig=i==nn;	

		if(n==1)
		{
			k[0]=-m[0];k[1]=1;r[0]=0;		
		}
		else
		{
		//T+="eigenvalues([";
		//for(i=0;i<n;i++){for(j=0;j<n-1;j++)T+=m[i*n+j]+",";T+=m[i*n+j]+((n*i+j<nn-1)?";":"");}T+="],x)\n\n";
		status="berechne Dreiecksmatrix";
		document.f.t.value="Erstelle Matrix und wandle sie in eine untere Dreiecksmatrix um.\n\n";
		Dreiecksform(Z,N,n);
		//alert(Z.join("   ")+"\n\n"+N.join("   "));
		var dz=new Array(1,0),dn=new Array(1,0);
		status="multipliziere Diagonalelemente";
		document.f.t.value+="Multipliziere Diagonalelemente\n\n";
		for(i=(n-1)*n;i>0;i-=n-1)
		{
			//T+=Z[i]+"\n-----------------------------------------\n"+N[i]+"\n\n";
			//T+=PStr("x",Z[i])+"\n-----------------------------------------\n"+PStr("x",N[i])+"\n\n";
			dz=polymult(dz,Z[i]),dn=polymult(dn,N[i]);
		}
		//alert(dz+"\n"+dn);return;
		//T+=PStr("x",dz)+"\n-----------------------------------------\n"+PStr("x",dn)+"\n\n";

		status="Polynomdivision";
		document.f.t.value+="Polynomdivision mit Produktterm. \n";
		polydiv(dz,dn,k,r);	

		var vz=(k[0]<0)?-1:1;
		if(ganzzahlig)for(i=0;i<k.length;i++)k[i]=Math.round(k[i])*vz;	

		if(getGrad(r)>0)
		{
			if(engl)
			{
				T+="Integer overflow: The determinant could not be calculated exactly|\nThe coefficients of the characteristic polynomial are perhaps incorrect| \nSee the tests below| \n\n";
			}
			else
			{
			T+="Kann aufgrund Ganzzahlüberlaufs oder Fließkommarundung die Determinante \nnicht exakt berechnen| ";
			T+="Das charakteristische Polynom hat daher möglicherweise \nungenaue Koeffizienten, wodurch die Lösungen verfälscht sein mögen| \n\n";
			}
			probemachen=true;
		}//Rest: "+PStr("x",r)+"\n\nQuotient: "+PStr("x",k);return;}
		}
		if(k[getGrad(k)]<0){for(i=0;i<k.length;i++)k[i]*=-1;}
		for(i=0;i<k.length;i++){k_merk[i]=k[i];}
	}
	else
	{
		for(i=0;i<k_merk.length;i++){k[i]=k_merk[i];}
	}

	T+=((engl)?"Characteristic polynomial:\n    ":"charakteristisches Polynom:\n    ")+PStr("x",k,n)+"\n\n";
	
	if((dirty1)||(dirty))
	{
		document.f.t.value+=T.replace(/\|/g,".")+"\n\nSuche Nullstellen...";
	
		for(i=0;i<Lr.length;i++)Lr[i]=Li[i]=null;
		solvePoly(k,Lr,Li);
		status="sortiere Lösungen";
		quicksort2(Lr,Li);
		for(i=0;i<Lr.length;i++){Lr_merk[i]=Lr[i];Li_merk[i]=Li[i];}
	}
	else
	{
		for(i=0;i<Lr_merk.length;i++){Lr[i]=Lr_merk[i];Li[i]=Li_merk[i];}
	}

	dirty=dirty1=false;

	var LR=new Array(),LI=new Array();
	var komplL=(1==0),reellL=(1==9);
	j=0;kk=0;
	for(i=0;i<n;i++)
	{
		if(Lr[i]==null)continue;
		if(Li[i]==0){LR[j++]=Lr[i];reellL=true;}
		else{ LI[kk++]=KStr(Lr[i],Li[i]);komplL=true;}
	}
	if(reellL)T+=(  ((LR.length>1)?"reelle Eigenwerte:":"reeller Eigenwert:")+"\n    {"+LR.join("; ")+"}").replace(/\./g,",").replace(/ ,/g," 0,").replace(/-,/g,"-0,").replace(/\{,/,"{0,")+"\n";
	if(komplL)T+=("komplexe Eigenwerte:\n    {"+LI.join("; ")+"}").replace(/\./g,",").replace(/ ,/g," 0,").replace(/-,/g,"-0,").replace(/\{,/,"{0,")+"\n";
	T+="\n";

	if(n>Lr.length)
	{
		T+=((n-Lr.length==1)?"eine Nullstelle":(n-Lr.length)+" Nullstellen")+" wurden nicht gefunden| \n\n";
		dirty=true;
	}
	var v=new Array();
	document.f.t.value=T.replace(/\|/g,".")+"\nBerechne Eigenvektoren...";
	var falsch_=(1==9);

	if(reellL)
	{
		status="bestimme reelle Eigenvektoren";
		var mm=new Array(nn);
		var kkk,i0=0,lss=1==0;
		for(j=0;j<n;j++)
		{
			status="bestimme reellen Eigenvektor zur "+(j+1)+". Nullstelle";
			if(Li[j]!=0)continue;
			for(i=0;i<nn;i++)mm[i]=(m[i]);
			for(i=0;i<nn;i+=n+1)mm[i]-=Lr[j];//alert(mm);



/*			glsl(mm,n);alert(mm);
			kk=leereReihe(mm,n,i0);
			if(j<n-1){if((Lr[j]==Lr[j+1])&&(kk>-1)&&(kk<n))i0=(kk+1)%n;}
			var ls=leereSpalte(mm,n);//alert(mm+"\n\nleere Zeile: "+kk+"\nleere Spalte: "+ls);
			if(kk==-1)
			{
				for(i=0;i<n;i++)v[i]=0;
			}
			else
			{
				for(kkk=0;kkk<n;kkk++)if(mm[kkk*n+kk]!=0)break;
				if(kkk==n)
				{
					for(i=0;i<n;i++){v[i]=1;for(kkk=0;kkk<n;kkk++)if(mm[i*n+kkk]!=0){v[i]=0;break;}}
				}
				else
				{
					//v[0]=1;
					v[kk]=-1/mm[kkk*n+kk];
					if(Math.abs(v[kk]-1)<1e-12)v[kk]=1;
					for(i=0;i<n;i++)if(i!=kk){v[i]=-v[kk]*mm[i*n+kk];}
				}
				if((ls>-1)&&((lss==true)||(ls!=kk)))
				{
					for(i=0;i<n;i++)v[i]=0;
				}
				if((ls>-1)&&(lss==false))
	//			if(ls>-1)
				{
					//alert(ls+"  "+kk);
					for(i=0;i<n;i++)v[i]=(i!=ls)?0:1;
					lss=true;
				}
				//for(i=0;i<n;i++)v[i]=Math.round(v[i]*10000000000)/10000000000;
				//status="normieren";
		 		if(normieren>=2)if(!normgz(v))if((normieren%2)==1)norm(v);
				if(normieren==1)norm(v);
			}
			if(n==1)v[0]="1";

*/

			for(i=0;i<n;i++)v[i]=0;

			var ss=glsl2(mm,n),ssi=0,toll=tol2;

			while((leereReihe(mm,n,n-1)!=n-1)&&(tol2<1e-4)){tol2*=10;ss=glsl2(mm,n);}

			tol2=toll;

			//alert(mm);

			var einfach=(j==n-1);if(!einfach)einfach=Math.abs(Lr[j]-Lr[j+1])>tol2;
			if(ss.length>1)while(Math.abs(Lr[j-ssi-1]-Lr[j])<tol2)ssi++;//alert(ssi);
			kk=leereSpalte(mm,n);
			{
				//if((kk>-1)&&(einfach))
				//{
				//	for(i=0;i<n;i++)v[i]=0;v[kk]=1;
				//}
				{
					var ii=0;
					for(i=0;i<n-1;i++)
					{
						if((i==ss)||(mm[i*n+ii]==0))ii++;
						if(ii==n)break;
						v[ii]=-mm[i*n+ss[ssi]]/mm[i*n+ii];
						ii++;
					}
					v[ss[ssi]]=1;
					if(ss.length>1)for(i=0;i<ss.length;i++){if(ss[i]!=ss[ssi])v[ss[i]]=0;}
				}
				//if((kk>-1)&&(!einfach))
				//{
				//	for(i=0;i<n;i++)v[i]=0;v[kk]=1;
				//}
			}
			//if(ss==-1)
			//{
			//	for(i=0;i<n;i++)v[i]=0;
			//}
	 		if(normieren>=2){if(!normgz(v))if((normieren%2)==1)norm(v);}
			if(normieren==1)norm(v);
			if(normieren==0){for(i=0;i<n;i++)if(v[i]!=0)break;if(i<n){kkk=v[i];for(ii=0;ii<n;ii++)v[ii]/=kkk;}}
			if(v.join("").indexOf("NaN")>-1)for(i=0;i<n;i++)v[i]=0;
			
			T+="Eigenvektor zu Eigenwert "+Lr[j]+": \n    ("+v.join("; ")+")\n";
			
			if(iterationsverfahren)
			{
				var viter=new Array(n),eiter;for(i=0;i<n;i++)viter[i]=v[i];
				eiter=iteration(m,n,viter);
				ITER+=((engl)?"Start with vector ":"Startvektor:  ")+"("+v.join("; ")+")\n zum Eigenwert  "+Lr[j]+"\n";
				/*if(eiter==null)
				{
					for(i=0;i<n;i++)viter[i]+=Math.random()/10-0.05;
					eiter=iteration(m,n,viter);
				}*/
				if(eiter==null)
				{
					ITER+=(engl)?"     The iteration doesn't converge\n\n":"    Iteration konvergiert nicht\n\n";
				}
				else
				{
					ITER+=" ——> Eigenwert: "+eiter;
					ITER+="\n     -vektor: ("+viter.join("; ")+")";
					if(normgz(viter))ITER+="\n    normiert: ("+viter.join("; ")+")";
					ITER+="\n\n";
				}
			}
			if(probemachen)
			{
				for(i=0;i<mm.length;i++)mm[i]=m[i];
				for(i=0;i<n;i++)mm[i*n+i]-=Lr[j];
				var p=new Array(n),falsch=(1==0),maxabw=0;
				for(i=0;i<n;i++)
				{
					p[i]=0;
					for(var ii=0;ii<n;ii++)p[i]+=mm[i*n+ii]*v[ii];
					if((maxabw=Math.max(maxabw,Math.abs(p[i])))>1e-10)falsch=true;
				}
				if(falsch)
				{
					falsch_=true;
					T+=(maxabw>0.1)?"\n    OFFENSICHTLICH FALSCH!":"\n    UNGENAUES ERGEBNIS!  Maximaler Fehler: "+String(maxabw).replace(/\./,",");
					T+="\n\n    Probe: (M - µE)v = ("+p.join("; ").replace(/\./,";")+")\n    (Müßte Nullvektor ergeben)\n\n\n";
					T=T.replace(/ ,/g," 0,");
				}
			}
		}
	}
	if(komplL)
	{
		var mr=new Array(),mi=new Array(),vr=new Array(),vi=new Array(),i0=0;
		for(j=0;j<n;j++)
		{
			status="bestimme Eigenvektor zur "+(j+1)+". Nullstelle";
			if(Li[j]==0)continue;
			if(Li[j]==null)break;
			for(i=0;i<nn;i++){mr[i]=m[i];mi[i]=0;}
			for(i=0;i<nn;i+=n+1){mr[i]-=Lr[j];mi[i]=-Li[j];}
			glslk(mr,mi,n);
			kk=leereReiheK(mr,mi,n,i0);//alert(kk);
			if(j<n-1){if((Lr[j]==Lr[j+1])&&(Li[j]==Li[j+1])&&(kk>-1)&&(kk<n))i0=kk+1;}
			//alert(kk+"\n\n"+n+"\n\n"+mr.join("   ")+"\n"+mi.join("   "));
			if(kk==-1)
			{
				for(i=0;i<n;i++){vr[i]=0;vi[i]=0;v[i]="0";}
			}
			else
			{
				for(kkk=0;kkk<n;kkk++)if((mr[kkk*n+kk]!=0)||(mi[kkk*n+kk]!=0))break;
				if(kkk==n)
				{
					for(i=0;i<n;i++)
					{
						vr[i]=1;vi[i]=0;
						for(kkk=0;kkk<n;kkk++)
						if((mr[i*n+kkk]!=0)&&(mi[i*n+kkk]!=0)){vr[i]=0;break;}
					}
				}
				else
				{
					var kh=new Array(0,0);
				//	v[kk]=-1/mm[kkk*n+kk];
				//	for(i=0;i<n;i++)if(i!=kk){v[i]=-v[kk]*mm[i*n+kk];}
					kdivv(-1,0,mr[kkk*n+kk],mi[kkk*n+kk],kh);//alert(kh);
					if(Math.abs(kh[0]-1)<1e-10)kh[0]=1;
					if(Math.abs(kh[1])<1e-10)kh[1]=0;
					vr[kk]=kh[0];vi[kk]=kh[1];
					for(i=0;i<n;i++)
					if(i!=kk)
					{
						kmultv(vr[kk],vi[kk],mr[i*n+kk],mi[i*n+kk],kh);//alert(kh);
						if(Math.abs(kh[0]-1)<1e-10){kh[0]=1;}
						if(Math.abs(kh[0]+1)<1e-10){kh[0]=-1;}
						if(Math.abs(kh[1])<1e-12)kh[1]=0;
						vr[i]=-kh[0];vi[i]=-kh[1];
					}
				}
				//status="normieren";
				if(normieren>=2)if(!normgzk(vr,vi))if((normieren%2)==1)normk(vr,vi);
				if(normieren==1)normk(vr,vi);
				
				for(i=0;i<n;i++)v[i]=KStr(vr[i],vi[i]);
			}
			T+="Eigenvektor zu Eigenwert "+KStr(Lr[j],Li[j])+": \n    ("+v.join("; ")+")\n";
			if(probemachen)
			{
				for(i=0;i<mi.length;i++){mr[i]=m[i];mi[i]=0;}
				for(i=0;i<n;i++){mr[i*n+i]-=Lr[j];mi[i*n+i]=-Li[j];}
				var pr=new Array(n),pi=new Array(n),falsch=(1==0),maxabw=0;
				for(i=0;i<n;i++)
				{
					pr[i]=0;pi[i]=0;
					for(var ii=0;ii<n;ii++){var iii=i*n+ii;pr[i]+=mr[iii]*vr[ii]-mi[iii]*vi[ii];pi[i]+=mr[iii]*vi[ii]+mi[iii]*vr[ii];}
					if((maxabw=Math.max(maxabw,Math.abs(pr[i])+Math.abs(pi[i])))>1e-9)falsch=true;
					v[i]=KStr(pr[i],pi[i]);
				}
				if(falsch)
				{
					falsch_=true;
					T+=(maxabw>.1)?"\n    OFFENSICHTLICH FALSCH!":"\n    UNGENAUES ERGEBNIS!  Maximaler Fehler: "+String(maxabw).replace(/\./,",");
					T+="\n\n    Probe: (M - µE)v = ("+v.join("; ")+")\n    (Müßte Nullvektor ergeben)\n\n\n";
					T=T.replace(/ ,/g," 0,");
				}
			}
		}
	}

	if((probemachen)&&(!falsch_)&&(reellL||komplL))T+=(engl)?"\nAll tests OK!":"\nAlle Proben OK!\n";

	if(iterationsverfahren)T+=((engl)?"\n\nTesting with iteration algorithm:\n\n":"\n\nTest der reellen Eigenvektoren als Startwert im Iterationsverfahren: \n\n")+ITER;

	
	if((quatsch>5)&&(!engl)){T+=" \n\nWarum klicken Sie eigentlich ständig auf diesen Button ohne Funktion?????\n\n";quatsch=3;}

	status="OK";

	T=T.replace(/\./g,",").replace(/ ,/g," 0,").replace(/-,/g,"-0,").replace(/\(,/g,"(0,")+"\n";
	T=T.replace(/\|/g,".");
}
function norm(v){var l=0,i;for(i=0;i<v.length;i++)l+=v[i]*v[i];l=Math.sqrt(l);if(l<1e-13)return;for(i=0;i<v.length;i++)v[i]/=l;}
function normk(vr,vi){var l=0,i;for(i=0;i<vr.length;i++)l+=vr[i]*vr[i]+vi[i]*vi[i];l=Math.sqrt(l);if(l<1e-13)return;for(i=0;i<vr.length;i++){vr[i]/=l;vi[i]/=l;}}
function normgz(v)
{
	var b,i,j,vmin=1e300,k,n,g;

	b=kettenbruchapprox(v[0],gzmax,1e-12);k=b[1];if((b[0]%1)!=0)return false;
	g=(v[0]%1)==0;
	for(i=1;i<v.length;i++)
	{
		b=kettenbruchapprox(v[i],gzmax,1e-12);if((b[0]%1)!=0)return false;
		k=k*b[1]/ggT(k,b[1]);
		g=g&&((v[i]%1)==0);
	}
	if(g)return true;
	if((k>0)&&(k<=gzmax)){for(i=0;i<v.length;i++)v[i]=Math.round(v[i]*k);return true;}
	return false;

/*	for(i=0;i<v.length;i++)if(v[i]!=0)vmin=Math.min(vmin,Math.abs(v[i]));
	for(i=1;i<101;i++)
	{
		for(j=0;j<v.length;j++){if(v[j]==0)continue;if(Math.abs(v[j]/vmin*i-Math.round(v[j]/vmin*i))>1e-8)break;}
		if(j==v.length)
		{
			for(j=0;j<v.length;j++)v[j]=Math.round(v[j]/vmin*i);alert(i/vmin); return true;
		}
	}
	return false;*/

}
function ggT(a,b)
{
	if(a==0)return b;if(b==0)return a; 
	a=Math.abs(a);b=Math.abs(b);
	var c=0; do{c=a%b;a=b;b=c;}while(c!=0); return a;
}
function normgzk(vr,vi)
{
	var i,j,k,g,b,o,kk;
	b=kettenbruchapprox(vr[0],gzmax);k=b[1];
	if((b[0]%1)!=0)return false;
	g=(vr[0]%1)==0;o=(1==0);
	for(i=1;i<vr.length;i++)
	{
		b=kettenbruchapprox(vr[i],gzmax);
		if((b[0]%1)!=0)return false;
		k=k*b[1]/ggT(k,b[1]);
		g=g&&((vr[i]%1)==0);
	}
	kk=k;
	for(i=0;i<vi.length;i++)
	{
		b=kettenbruchapprox(vi[i],gzmax);
		if((b[0]%1)!=0){k=1;break;}
		k=k*b[1]/ggT(k,b[1]);
		g=g&&((vi[i]%1)==0);
	}
	if(g)return true;//alert(k+"  "+kk);
	if((kk>0)&&(kk<=gzmax)){for(i=0;i<vr.length;i++){vr[i]=Math.round(vr[i]*kk);vi[i]*=kk;}return true;}
	if((k>0)&&(k<=gzmax)){for(i=0;i<vr.length;i++){vr[i]=Math.round(vr[i]*k);vi[i]=Math.round(vi[i]*k);}return true;}
	return false;

/*	for(i=1;i<gzmax;i++)
	{
		for(j=0;j<vr.length;j++)
		{
			if((vr[j]==0)&&(vi[j]==0))continue;
			if((Math.abs(vr[j]*i-Math.round(vr[j]*i))>1e-8)&&(Math.abs(vi[j]*i-Math.round(vi[j]*i))>1e-8))break;
		}
		if(j==vr.length)
		{
			for(j=0;j<vr.length;j++){vr[j]=Math.round(vr[j]*i);vi[j]=(vi[j]*i);}return true;
		}
	}
	return false;
*/
}

function solvePoly(k,Lr,Li)
{
	var g,G,gi,li=0,i,j=0,x,xx,kk=new Array(),kka=new Array(),KA=new Array();
	g=getGrad(k);
	G=g;
	Ableitung(k,KA,G);
	for(i=0;i<=g;i++)kk[i]=k[i];
	if(g>4)for(i=0;i<=g;i++)kk[i]/=10;
	if(g>6)for(i=0;i<=g;i++)kk[i]/=10;
	gi=g;
	newtonq=1;

	for(x=-100;(x<=100)&&(g>0);x++)
	{
		if(Math.abs(horner(kk,g,x))<tol1b)
		{
			polydivns(kk,g,x);
			Lr[li]=x;Li[li++]=0;
			g=getGrad(kk);
			x--;
		}
	}
	Ableitung(kk,kka,g);

	do
	{
		//alert(g);
		status="suche Lösungen - "+(j+1)+". Durchlauf - Restgrad: "+g+" - gefunden: "+li;
		if(g==1)
		{
			Li[li]=0;
			Lr[li]=-kk[0]/kk[1];//alert(Lr);
			Lr[li]=tryRound(Lr[li],kk);
			li++;
			//alert(l.join("\n"));
			return;
		}
		if(g==2)
		{
			//alert("hi\n"+kz+"\n"+kn);
			var p=kk[1]/kk[2],q=kk[0]/kk[2];//alert(kk);
			var r=p*p/4-q;
			if(r>=0)
			{
				x=-p/2-Math.sqrt(r);
				x=tryRound(x,kk);
				Li[li]=0;
				Lr[li++]=x;
				x=-p/2+Math.sqrt(r);
				x=tryRound(x,kk);
				Li[li]=0;
				Lr[li++]=x;
			}
			else
			{
				x=Math.sqrt(-r);
				var kh=new Array(-p/2,x);
				tryRoundk(kh,k);
				Lr[li]=kh[0];
				Li[li++]=-kh[1];
				Lr[li]=kh[0];
				Li[li++]=kh[1];
			}
			return;
		}
		var L=new Array(0,1),y,yy=999999999;
		xx=x=Math.random()*20-10;
		if(Math.random()>.9){xx*=10;x=xx;if(Math.random>.9){xx*=10;x=xx;if(Math.random>.9){xx*=10;x=xx;}}}
		if(reell)
		{
			yy=1e300;
			for(i=0;i<50;i++)
			{	
				x=newtonstep(kk,g,x,1);
				if(xx==x)break;xx=x;
				y=Math.abs(horner(k,g,x));
				if(y>yy)break;
				if(y<tol1)break;
				yy=y;
			}
			if(y<tol1)
			{
				
				for(i=0;i<20;i++){x=newtonstep(k,G,x,0.618);if(xx==x)break;xx=x;}
				if(horner(k,G,x)<=tol1b)
				{
					x=tryRound(x,kk);
					if(polydivns(kk,g,x))
					{
						Li[li]=0;
						Lr[li++]=x;
						//alert(li+". Lösung: "+x);
						//alert(PStr("x",kk,g));
						g=getGrad(kk);
						Ableitung(kk,kka,g);
						//alert("Restpolynom: "+PStr("x",kk,g));
					}//else alert("Polynomdivision bei x="+x+" ist fehlgeschlagen");
				}
			}
			j++;
		}
		if(komplex)
		{
			var XX;
			var Y=new Array(11110,1111110);
			i=0;
			//do{
				XX=new Array(Math.random()*20-10,Math.random()*20-10);
				if(Math.random()>.9){XX[0]/=10;if(Math.random()>.9)XX[0]/=10;}else
				if(Math.random()>.9){XX[0]*=10;if(Math.random()>.9)XX[0]*=10;}
				if(Math.random()>.9){XX[1]/=10;if(Math.random()>.9)XX[1]/=10;}else
				if(Math.random()>.9){XX[1]*=10;if(Math.random()>.9)XX[1]*=10;}
				hornerk(kk,g,XX,Y);
				i++;
			//}while((absq(Y)>1e8)&&(i<100));
			var X=new Array(XX[0],XX[1]);
			yy=1e300;
			for(i=0;i<50;i++)
			{	
				y=newtonstepk(kk,kka,g,X,1);
				if(Math.abs(X[1])<1e-16){X[1]=0;break;}
				if((XX[0]==X[0])&&(XX[1]==X[1]))break;XX[0]=X[0];XX[1]=X[1];
				//hornerk(k,g,X,Y);
				//y=absq(Y);//alert(y);
				if(y>yy+2)break;
				if(y<tol1)break;
				yy=y;
			}
			if((y<tol1)&&(X[1]!=0))
			{//alert(y);

				for(i=0;i<20;i++)
				{
					y=newtonstepk(kk,kka,g,X,0.618);
					if(Math.abs(X[1])<tol1b){X[1]=0;break;}
					if((XX[0]==X[0])&&(XX[1]==X[1]))break;XX[0]=X[0];XX[1]=X[1];
				}//alert(KStr(X[0],X[1]));
				for(i=0;i<10;i++)
				{
					y=newtonstepk(k,KA,G,X,0.618);
				}
				if(X[1]!=0)
				{
					hornerk(k,G,X,Y);
					y=absq(Y);//alert(KStr(X)+"\n"+y);
					if(y<=tol1b)
					{
						tryRoundk(X,kk);
						if(polydivnsk(kk,getGrad(kk),X[0],X[1]))
						{
							Lr[li]=X[0];Li[li++]=-Math.abs(X[1]);
							Lr[li]=X[0];Li[li++]=Math.abs(X[1]);
							//alert(li+". Lösung: "+l[li-1]);
							g=getGrad(kk);
							Ableitung(kk,kka,g);
							//alert("Restpolynom: "+PStr("x",kk,g));
						}
					}
					
				}//else{x=xx=X[0];alert(x);}
				else if(polydivns(kk,getGrad(kk),X[0]))
				{
					Lr[li]=X[0];Li[li++]=0;
					//alert(li+". Lösung: "+l[li-1]);
					g=getGrad(kk);
					Ableitung(kk,kka,g);
					//alert("Restpolynom: "+PStr("x",kk,g));
				}
			}
			j++;
		}
		
		if((j%200)==0){for(i=0;i<=g;i++)k[i]/=10;Ableitung(k,kk,g);}
		if((j%125)==0)newtonq*=0.8;
		if((j>600)&&((j%5)==0))newtonq=Math.random()+.001;

	}while((g>0)&&(j<jmax));
}

function absq(Y){return Y[0]*Y[0]+Y[1]*Y[1];}

function tryRound(x,k)
{
	if((x%1)==0)return x;
	var d=100000000000,xx,y,yy,g=getGrad(k);
	do{
		y=Math.abs(horner(k,g,x));
		xx=Math.round(x*d)/d;if(xx==0)return x;
		yy=Math.abs(horner(k,g,xx));
		d/=10;
		if(yy<=y)x=xx;else break;
	}while(true);
	return x;
}
function tryRoundk(x,k)
{
	if((x[0]%1)==0)return;
	var d=1000000000,xx,y,yy,g=getGrad(k),Y=new Array(0,0),X=new Array(x[0],x[1]);
	hornerk(k,g,X,Y);
	y=absq(Y);
	do{
		X[0]=Math.round(X[0]*d)/d;if(X[0]==0)return;
		horner(k,g,X,Y);
		yy=absq(Y)
		d/=10;
		if(yy<y)x[0]=X[0];else break;
		y=yy;
	}while(d>1);
}

function polydivns(k,g,x0)
{ 
	var q=new Array(g);
	var kk=new Array(g+1);
	var i,gg=g;
	for(i=0;i<kk.length;i++)kk[i]=k[i];
	for(i=0;i<kk.length-1;i++)q[i]=0;
	status="Polynomdivision";
	while(g>0)
	{
		kk[g-1]+=kk[g]*x0;
		q[g-1]=kk[g];
		kk[g]=0;
		while((kk[g]==0)&&(g>0))g--;
	}//alert(g+"\n"+kk);
	if(g>0)return false;
	if(Math.abs(kk[g])>1e-8){return false;}
	k[gg]=0;
	for(i=0;i<q.length;i++)k[i]=q[i];
	return true;
}
function polydivnsk(k,g,xr,xi)
{
	q=new Array(g);//alert(KStr(xr,xi));
	kk=new Array(g+1);
	var i,gg=g,a=-2*xr,b=xr*xr+xi*xi;
	for(i=0;i<kk.length;i++)kk[i]=k[i];
	for(i=0;i<kk.length-1;i++)q[i]=0;
	status="komplexe Polynomdivision";
	while(g>0)
	{
	 	//alert("Polynomdivision, g="+g+"  Rest: "+PStr("x",kk,gg));
		if(g>1)q[g-2]=kk[g];
		kk[g-1]-=kk[g]*a;
		if(g>1)kk[g-2]-=kk[g]*b;
		kk[g]=0;
		//alert("g: "+g+"\nq: "+q.join("  ")+"\nk: "+kk.join("  "));
		while((kk[g]==0)&&(g>0))g--;
	}
	//alert("fertig\ng="+g+"\nq: "+q.join("  ")+"\nk: "+kk.join("  "));
	if((Math.abs(kk[0])>1e-8)||(Math.abs(kk[1])>1e-8)||(g>0)){return false;}
	k[gg]=0;
	for(i=0;i<q.length;i++)k[i]=q[i];
	return true;
}

function horner(k,g,x)
{
	var y=k[g];
	for(var i=g-1;i>=0;i--)y=y*x+k[i];
	return y;
}
function hornerk(k,g,x,Y)
{
	var yr=k[g],yi=0;
	for(var i=g-1;i>=0;i--)
	{
		//xr·yr - yi·xi + kr + î·(yi·xr + xi·yr + ki)
		var yrr=yr*x[0]-yi*x[1]+k[i];
		yi=yi*x[0]+x[1]*yr;
		yr=yrr;
	}
	Y[0]=yr;Y[1]=yi;
}
function hornera(k,g,x)
{
	var y=k[g]*g;
	for(var i=g-1;i>=1;i--)y=y*x+i*k[i];
	return y;
}
function hornerka(k,g,x,Y)
{
	var yr=k[g]*g,yi=0;
	for(var i=g-1;i>=0;i--)
	{//i·k - x_i·yi + xr·yr + î·(x_i·yr + xr·yi)
		//xr·yr - yi·xi + kr + î·(yi·xr + xi·yr + ki)
		var yrr=yr*x[0]-yi*x[1]+k[i]*i;
		yi=yi*x[0]+x[1]*yr;
		yr=yrr;
	}
	Y[0]=yr;Y[1]=yi;
}

function newtonstep(k,g,x,q)
{
	if(q==null)q=1;
	var f=horner(k,g,x),ff=hornera(k,g,x);
	//alert(x+" - "+f+"/"+ff);
	return x-f*newtonq*q/ff;
}
function newtonstepk(k,kk,g,x,q)
{
//	xr - (ffi·fi + ffr·fr)/(ffi^2 + ffr^2) 
//    + î·((ffi·fr - ffr·fi)/(ffi^2 + ffr^2) + x_i)
	var f=new Array(0,0),ff=new Array(0,0),nenner;
	hornerk(k,g,x,f);hornerk(kk,g-1,x,ff);
	nenner=ff[1]*ff[1]+ff[0]*ff[0];
	x[0]-=(ff[1]*f[1]+ ff[0]*f[0])*q*newtonq/nenner;
	x[1]+=((ff[1]*f[0]-ff[0]*f[1])*q*newtonq/nenner);
	//alert(KStr(x[0],x[1])+"\n"+KStr(f[0],f[1])+"\n"+KStr(ff[0],ff[1]));
	return (absq(f));
}
function Ableitung(k,kk,g)
{
	for(var i=0;i<g;i++)kk[i]=k[i+1]*(i+1);
}


function Dreiecksform(Z,N,n)
{
	var j,i,k,qz,qn;
	for (j=n-1;j>=0;j--)
	{
        qz = Z[j*n+n-1-j];
        qn = N[j*n+n-1-j];
        if (isNullpoly(qz))
		{
            for (i=j-1;i>=0;i--)
		{
			if (!isNullpoly(Z[i*n+n-1-j]))
			{
				for (k=0;k<n;k++)
				{
					polyaddb(Z[j*n+k],N[j*n+k],Z[i*n+k],N[i*n+k],Z,N,j*n+k);
				}
				qz=Z[j*n+n-1-j];qn=N[j*n+n-1-j];
      	            break;
                  }
            }
        }
        if (!isNullpoly(qz))
		{
			for (i=j-1;i>=0;i--)
			{
				//if (i!=n-1-j)
				{//alert(Z+"\n"+N);
					qz=polymult(Z[i*n+n-1-j],N[j*n+n-1-j]);
					qn=polymult(N[i*n+n-1-j],Z[j*n+n-1-j]);//alert(qz+"   "+qn);return;
					//alert("multipliziere mit:\n"+PStr("x",qz)+"\n-------------------------\n"+PStr("x",qn));
					//q = a[i * n + j]/a[j*n+j];
					for(k=0;k<n;k++)
					{
						var fz=polymult(qz,Z[j*n+k]),fn=polymult(qn,N[j*n+k]);
						pkz(fz,fn);//alert("fz: "+fz+"\nfn: "+fn);
						polysubb(Z[i*n+k],N[i*n+k] , fz,fn , Z,N,i*n+k);
						pkz(Z[i*n+k],N[i*n+k]);
						//alert(Z[i*n+k]+"     "+N[i*n+k]);
						//a[i*n+k]-=q*a[j*n+k];
					}
				}
			}
		}
	else return;
	//alert(Z.join("\n")+"\n\n"+N.join("\n"));
    }
}

function pkz(z,n)
{
	gzkz(z,n);
	var i,q=0;
	for(i=0;i<z.length;i++)if(z[i]!=0)break;
	if(i==z.length){for(i==0;i<n.length;i++)n[i]=0;n[0]=1;return;}
	for(i=0;i<z.length;i++)
	{
		if((n[i]==0)&&(z[i]==0))continue;
		if((Math.abs(n[i]-z[i])<1e-10)&&(q==0))q=1;
		if((Math.abs(n[i]-z[i])<1e-10)&&(q!=1))return;
		if((Math.abs(n[i]+z[i])<1e-10)&&(q==0))q=-1;
		if((Math.abs(n[i]+z[i])<1e-10)&&(q!=-1))return;
		return;
	}
	for(i=0;i<z.length;i++){z[i]=0;n[i]=1;}z[0]=q;//alert("pkz");
}

function gzkz(z,n)
{
	var i,g=0;
	for(i=0;i<z.length;i++)
	{
		if(z[i]==0)continue;
		if(g==0)g=z[i];
		else g=ggT(g,z[i]);
		if(g==1)break;
	}
	for(i=0;i<n.length;i++)
	{
		if(n[i]==0)continue;
		if(g==0)g=n[i];
		else g=ggT(g,n[i]);
		if(g==1)return;
	}
	if(g==0)return;
	for(i=0;i<z.length;i++)z[i]/=g;
	for(i=0;i<n.length;i++)n[i]/=g;
}

function ggT(a,b)
{
	if((a==0)||(b==0))return 1;if((a%1)!=0)return 1;if((b%1)!=0)return 1;
	if(isNaN(a))return 1;if(isNaN(b))return 1;
	var c=1;while(c!=0){c=a%b;a=b;b=c;}	return a;
}

function isNullpoly(k)
{
	for(var i=0;i<k.length;i++)if((k[i]!=0)&&(k[i]!=null))return false;
	return true;
}

function polymult(a,b)
{	//alert("polymult\n"+a+"\n"+b);
	var c=new Array(0,0),i,j=getGrad(a),k=getGrad(b);
	for(i=0;i<j+k;i++)c[i]=0;
	for(i=0;i<a.length;i++)
	{
		if(a[i]==0)continue;
		if(a[i]==null)continue;
		for(j=0;j<b.length;j++)
		{
			if(b[j]==0)continue;	
			if(b[j]==null)continue;	
			if(c[i+j]==null)c[i+j]=0;
			c[i+j]+=a[i]*b[j];
		}
	}
	return c;
}
function polyadd(a,b)
{
	var c=new Array(Math.max(a.length,b.length)),i;
	for(i=0;i<c.length;i++)
	{
		c[i]=(a[i]!=null)?a[i]:0;
		c[i]+=(b[i]!=null)?b[i]:0;
	}
	return c;
}
function polyaddb(z1,n1,z2,n2,z,n,i)
{
	var zz=new Array();
	zz=polyadd(polymult(z1,n2),polymult(z2,n1));
	n[i]=polymult(n1,n2);
	z[i]=zz;
}
function polysub(a,b)
{
	var c=new Array(Math.max(a.length,b.length)),i;
	for(i=0;i<c.length;i++)
	{
		c[i]=(a[i]!=null)?a[i]:0;
		c[i]-=(b[i]!=null)?b[i]:0;
	}
	return c;
}
function polysubb(z1,n1,z2,n2,z,n,i)
{
	//var t=("polysubb:\n"+z1+"\n"+n1+"\n\n"+z2+"\n"+n2);
	var zz=new Array();
	zz=polysub(polymult(z1,n2),polymult(z2,n1));
	n[i]=polymult(n1,n2);
	z[i]=zz;
	//alert(t+"\n\n=\n"+z[i]+"\n"+n[i]);
}
function polymultb(z1,n1,z2,n2,z,n,i)
{
	var zz=new Array();
	zz=polymult(z1,z2);
	n[i]=polymult(n1,n2);
	z[i]=zz;
}

function polydiv(z,n,q,r)
{
	var gz=getGrad(z),gn=getGrad(n),m=n[gn],f,i,d,j=0;
	//r=new Array(gz+1);
	for(i=0;i<=gz;i++){r[i]=z[i];q[i]=0;}
	//if(gn==0){for(i=0;i<=gz;i++)q[i]=z[i]/n[0];return;}
	while((gz>=gn)&&(j<50))
	{
		d=gz-gn;
		f=r[gz]/m;
		for(i=0;i<=gn;i++)r[i+d]-=f*n[i];
		r[gz]=0;
		q[d]+=f;
	//	alert("Rest: "+PStr("x",r)+"\n\nDivisor: "+PStr("x",n)+"\n\nQuotient: "+PStr("x",q));
		j++;
		gz=getGrad(r);
	}
	for(i=0;i<q.length;i++)if(q[i]==null)q[i]=0;
	for(i=0;i<r.length;i++)if(r[i]==null)r[i]=0;
}

function getGrad(k)
{
	for(var i=k.length-1;i>=0;i--)
	{
		if(k[i]!=0)break;
	}
	return i;
}

function glsl2(m,n)
{
	var z=0,s=0,i,k=0,ss=new Array(1),ssi=0;
	ss[0]=-1;
	while((z<n)&&(s<n))
	{
		while((Math.abs(m[z*n+s])<tol2)&&(s<n))
		{
			m[z*n+s]=0;
			for(i=z+1;i<n;i++){if(Math.abs(m[i*n+s])>tol2)break;else m[i*n+s]=0;}
			if(i<n){tauscheZeilen(m,n,z,i);/*status="tausche Zeilen "+z+" und "+i;*/}
			else {ss[ssi]=s;ssi++;s++;}
		}
		for(j=s+1;j<n;j++){if(Math.abs(m[z*n+j])<tol2)m[z*n+j]=0;}
		for(i=0;i<n;i++)
		{
			if(i!=z)
			{
				q=m[i*n+s]/m[z*n+s];
				for(j=s;j<n;j++){m[i*n+j]-=q*m[z*n+j];if(Math.abs(m[z*n+j])<tol2)m[z*n+j]=0;}
			}
		}
		z++;s++;
	}
	return ss;
}
function tauscheZeilen(m,n,a,b)
{
	var i,x;
	for(i=0;i<n;i++){x=m[a*n+i];m[a*n+i]=m[b*n+i];m[b*n+i]=x;}
}


function glsl(m,n)
{
	var i, j, k, jj=0;
	var q;
	for (j=0;j<n;j++)
	{
		// Diagonalenfeld normalisieren
		q=m[j*n+jj];
		if(Math.abs(q)<tol2){q=0;m[j*n+jj]=0;}
		if(q==0)
		{
			//Gewährleisten, daß keine 0 in der Diagonale steht
			for (i=j+1;i<n;i++)
			{
				// Suche Reihe mit Feld <> 0 und addiere dazu
				if (m[i*n+jj] != 0)
				{
					for(k=0;k<n;k++)m[j*n+k]+=m[i*n+k];
					q = m[j*n+jj];
                    		break;
                		}
            	}
		}
//		while((Math.abs(m[j*n+jj])<tol2)&&(jj<n)){m[j*n+jj]=0;jj++;}
//		q=m[j*n+jj];
		if (q!=0)
		{
            	// Diagonalen auf 1 bringen
			for(k=0;k<n;k++)m[j*n+k]=m[j*n+k]/q;
		}
		// Spalten außerhalb der Diagonalen auf 0 bringen
		for (i=0;i<n;i++)
		{
			if (i!=j)
			{
				q = m[i*n+jj];
				for(k=0;k<n;k++){m[i*n+k]-=q*m[j*n+k];if(Math.abs(m[i*n+k])<tol2)m[i*n+k]=0;}
			}
		}
		jj++;
	}
}
function glslk(mr,mi,n)
{
	//alert(mr.join("   ")+"\n"+mi.join("   "));
	var i, j, k;
	var qi,qnull=(1==0);
	for (j=0;j<n;j++)
	{
		// Diagonalenfeld normalisieren
		qi=j*n+j;qnull=false;
		if(betr(mr[qi],mi[qi])<tol2){qnull=true;mr[qi]=0;mi[qi]=0;}
		if (qnull)
		{
			//Gewährleisten, daß keine 0 in der Diagonale steht
			for (i=j+1;i<n;i++)
			{
				// Suche Reihe mit Feld <> 0 und tausche
				if (betr(mr[i*n+j],mi[i*n+j])!=0)
				{
					for(k=0;k<n;k++)
					{var t=mr[j*n+k];mr[j*n+k]=mr[i*n+k];mr[i*n+k]=t;t=mi[j*n+k];mi[j*n+k]=mi[i*n+k];mi[i*n+k]=t;}
					qi=j*n+j;
                    		break;
                		}
            	}
		}
		if (betr(mr[qi],mi[qi])!=0)
		{
            	// Diagonalen auf 1 bringen
			for(k=0;k<n;k++)if(j*n+k!=qi)kdiv(mr,mi,j*n+k,qi,j*n+k);
			mr[qi]=1;mi[qi]=0;
		}
		// Spalten außerhalb der Diagonalen auf 0 bringen
		for (i = 0 ; i< n ; i++)
		{
			if (i != j )
			{
				qi=i*n+j;
				for(k=0;k<n;k++)
				{
					if(k==j)continue;
//						m[i*n+k]-=q*m[j*n+k];
					kmult(mr,mi,qi,j*n+k,n*n);
					ksub(mr,mi,i*n+k,n*n,i*n+k);
					if(betr(mr[i*n+k],mi[i*n+k])<tol2){mr[i*n+k]=0;mi[i*n+k]=0;}
				}
				kmult(mr,mi,qi,j*n+j,n*n);
				ksub(mr,mi,qi,n*n,qi);
			}
		}
		//alert(mr.join("   ")+"\n"+mi.join("   "));
	}
}

function kadd(r,i,s1,s2,e)
{
	r[e]=r[s1]+r[s2];
	i[e]=i[s1]+i[s2];
}
function ksub(r,i,s1,s2,e)
{
	r[e]=r[s1]-r[s2];
	i[e]=i[s1]-i[s2];
}
function kmult(r,i,f1,f2,e)
{
	var rr=r[f1]*r[f2]-i[f1]*i[f2];
	i[e]=r[f1]*i[f2]+r[f2]*i[f1];
	r[e]=rr;
}
function kdiv(r,i,d1,d2,e)
{
//	alert("teile "+KStr(r[d1],i[d1])+"\ndurch "+KStr(r[d2],i[d2]));
	var n=r[d2]*r[d2]+i[d2]*i[d2];
	var rr=(i[d1]*i[d2]+r[d1]*r[d2])/n; 
	i[e]=(i[d1]*r[d2]-i[d2]*r[d1])/n;
	r[e]=rr;
}
function kmultv(f1r,f1i,f2r,f2i,e)
{
	var rr=f1r*f2r-f1i*f2i;
	e[1]=f1r*f2i+f2r*f1i;
	e[0]=rr;
}
function kdivv(d1r,d1i,d2r,d2i,e)
{
//	alert("teile "+KStr(r[d1],i[d1])+"\ndurch "+KStr(r[d2],i[d2]));
	var n=d2r*d2r+d2i*d2i;
	var rr=(d1i*d2i+d1r*d2r)/n; 
	e[1]=(d1i*d2r-d2i*d1r)/n;
	e[0]=rr;
}

function betr(r,i){return Math.sqrt(r*r+i*i);}

function leereReihe(m,n,i0)
{
	var j,k;
	if(i0==null)i0=0;
	for(i=i0;i<n;i++)
	{
		for(j=0;j<n;j++)
		{
			if(m[i*n+j]!=0)break;
		}
		if(j==n)return i;
	}
	return -1;
}
function leereReiheK(mr,mi,n,i0)
{
	var i,j,k;
	if(i0==null)i0=0;
	for(i=i0;i<n;i++)
	{
		for(j=0;j<n;j++)
		{
			if(((mr[i*n+j]!=0))||(mi[i*n+j]!=0))break;
		}
		if(j==n)return i;
	}
	return -1;
}
function leereSpalte(m,n,i0)
{
	if(i0==null)i0=0;
	var i,j,k;
	for(i=i0;i<n;i++)
	{
		for(j=0;j<n;j++)
		{
			if(m[j*n+i]!=0)break;
		}
		if(j==n)return i;
	}
	return -1;
}
//1 -1 0 0 2 1 0 1 1
function iteration(m,n,v)
{
	var i,j,k,vv=new Array(n),d=0,q1,q2,qq,t="Iteration";
	for(i=0;i<n;i++)if(v[i]!=0)break;if(i==n)return null;
	status=t;
	for(i=0;i<200;i++)
	{
		for(j=0;j<n;j++)vv[j]=0;
		q1=null;q2=null;
		for(j=0;j<n;j++)
		{
			for(k=0;k<n;k++)vv[j]+=m[j*n+k]*v[k];
			if((q1==null)&&(v[j]!=0))q1=vv[j]/v[j];
			else{
			if((q2==null)&&(v[j]!=0))q2=vv[j]/v[j];}
//			{t+=".";status=t;}
		}
		d=0;
		for(j=0;j<n;j++){d+=vv[j]*vv[j];v[j]=vv[j];}
		d=Math.sqrt(d);if(d>1e15)break;
	}//alert(d+"   "+i+"    \n"+v+"\n"+q1+"\n"+q2);
	for(i=0;i<n;i++)v[i]/=d;
	if(normieren>1)normgz(v);
	if(Math.abs(q1-q2)<.000000001)return (q1+q2)/2;
	return null;
}

function hugo(i)
{
	var t;
	switch(i)
	{
	case 0:t="6 12 4\n-32 -50 -16\n88 132 42";break;
	case 1:t="3 -8 -4\n0 19 8\n0 -36 -15";break;
	case 2:t="-6 4 -2\n-8 6 -4\n-4 4 -4";break;
	case 3:t="-4 -1 0 -1\n-1 -7 -3 -1\n1 7 3 1\n3 6 3 0";break;
	case 4:t="1 -1 0 0 2 1 0 1 1";break;
	case 5:t="-2 2 0\n0 3 -2\n0 0 3";break;
	case 6:t="1 1 0\n0 1 1\n0 0 1";break;
	case 7:t="1 1 1 0\n0 1 1 1\n0 0 1 1\n0 0 0 1";break;
	case 8:t="1 0\n0 2";break;
	case 9:t="1 0 0\n0 1 0\n0 0 1";break;
	case 10:t="1 1 0\n0 1 0\n0 0 1";break;
/*	case 8:t="";break;
	case 8:t="";break;*/

	default:;
	}
	document.f.m.value=t;
}

function ganzzahligreell(L)
{
	var n=L.length,nn=n*n,m=new Array(nn),i,j=0,z=0,k;
	for(i=0;i<nn;i++){m[i]=((i%(n+1))==0)?L[j++]:((i>z*(n+1))?Math.round(Math.random()*4-2):0);if((i%n)==n-1)z++;}
	for(i=0;i<0;i++)
	{
		do{z=Math.floor(Math.random()*n);}while(z==(i%n));
		do{k=Math.round(Math.random()*2-1);}while(k==0);
		for(j=0;j<n;j++)m[(i%n)*n+j]+=k*m[z*n+j];alert(m);
	}
	document.f.m.value=m.join(" ");
//	run();
}