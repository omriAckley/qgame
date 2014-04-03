var alg,alg_alt,kbapr,ewdz100,javaq=navigator.javaEnabled(),komma=",";
var tdirty=1==1,t_alt="",n_alt,betrageins;
var CP,EW,EV,M;
var CPstr,EWstr;
var engl=1==0;

function berechnen()
{
	var t=document.f.m.value.replace(/,/g,".");
	var kmplx,exakt,flkmz,ganzzahlig=(t.indexOf(".")==-1)&&(t.indexOf(",")==-1)&&(t.indexOf("/")==-1);
	alg=document.f.cpmodus.selectedIndex;
	kbapr=document.f.kbapprox.checked;
	ewdz100=document.f.ewdz100.checked;
	komma=(document.f.komma.selectedIndex==0)?",":".";
	betrageins=document.f.evmodus.selectedIndex==1;
	javaq=navigator.javaEnabled();
	exakt=(document.f.cpmodusauto.checked)?document.f.cpmodusexakt.checked:(alg>1)&&(alg<7);
	flkmz=(document.f.cpmodusauto.checked)?document.f.cpmodusfloat.checked&&(t.indexOf(".")>-1):(alg<2)||(alg==7);
	ausgabe1(" ");
	if(tdirty)
	{
		if(javaq)
		{
			try{document.cpa.zadd=1;}
			catch(err)
			{
				javaq=false;
				if(alg>3)
				{
					alert("Fehler: "+err+"\n\nDas Java-Applet steht nicht zur Verfügung.\nWählen Sie bitte einen anderen Algorithmus.");
					document.f.cpmodus.focus();
					return;
				}
			}
		}
		if((alg>3)&&(!document.f.cpmodusauto.checked)&&(!javaq))
		{
			ausgabe1(" \n\n     Java ist momentan nicht verfügbar.\n\n     Aktivieren Sie Java oder wählen Sie \n     einen Javascriptmodus.");
			alert("Sie haben einen Java-Berechnungsmodus gewählt. In Ihrem Browser steht Java aber nicht zur Verfügung. \nAktivieren Sie Java oder wählen Sie einen Javascript-Modus.");
			document.f.cpmodus.blur();
			document.f.cpmodus.focus();
			return;
		}
		status="lese Eingabe";
		var pt=parseT(t,0);
		if(pt==null)return;
		var m=pt[0],t_=t_alt=pt[1],n=n_alt=Math.round(Math.sqrt(m.length));
		if(n*n!=m.length){alert("Matrix nicht quadratisch");return;}
		if(n>16){alert("Die eingegebene "+n+"×"+n+"-Matrix kann leider nicht verarbeitet werden, da die Matrixgröße hier auf 16×16 beschränkt ist.");
			return;}
		pt=null;
		darstellung=-1;
		if(document.f.eingabeformatieren.checked)document.f.m.value=matrStr(t_.split(" "),n).replace(/\./g,komma);
		M=new Array(m.length);
		for(i=0;i<m.length;i++)M[i]=m[i];


	}
	else
	{
		t_=t_alt;n=n_alt;
		if(document.f.eingabeformatieren.checked)document.f.m.value=matrStr(t_.split(" "),n).replace(/\./g,komma);
		m=new Array(M.length);
		for(i=0;i<m.length;i++)m[i]=M[i];
	}
	kmplx=false;for(i=0;i<m.length;i++){if(m[i][1]!=0){kmplx=true;break;}}
	
	var mmm=new Array(m.length);
	for(i=0;i<m.length;i++)mmm[i]=new Array(m[i][0]/m[i][2],m[i][1]/m[i][2]);

	if((alg!=alg_alt)||(tdirty))   // Neuberechnen des charakteristischen Polynoms
	{                              // nur bei Änderung der Matrix oder Wahl eines anderen Algorithmus'

		var p=new Array(n+1),ew=new Array(n),ev=new Array(n);
		CP=new Array(n);EW=new Array(n);EV=new Array();

		if(kmplx){if(alg==0)alg=1;}
		if(document.f.cpmodusauto.checked)
		{
			if(javaq)
			{
				alg=6;
				if(n>5)alg=5;
				if(n>7)alg=4;
				if(n>9)alg=8;
				if(n>11)alg=7;
				if((n>11)&&(ganzzahlig))alg=8;
				if(flkmz)alg=7;
			}
			else
			{
				alg=2;
				if(n>3)alg=3;
				if((n>6)||flkmz)alg=(kmplx)?1:0;
			}
		}
		var jt=m.join(",").replace(/,/g," ");
		if((alg<4)||(alg==7))ewdz100=document.f.ewdz100.checked=false;
	
		document.f.cpmodus.selectedIndex=alg_alt=alg;
		ausgabe1("Berechne das charakteristische Polynom");
		var t0=(new Date).getTime(),cpstr="";
		switch(alg)
		{
		case 0: //  Javascript, Fließkomma, reell (--> altes Script auf eigenwert.js)
			status="berechne Dreiecksmatrix";
			document.f.ttt.value="Erstelle Matrix und wandle sie in eine untere Dreiecksmatrix um.\n\n";

			var Z=new Array(m.length),N=new Array(m.length);
			for(i=0;i<m.length;i++)
			{
				Z[i]=new Array(((i%(n+1))==0)?1:2);Z[i][0]=m[i][0];N[i]=new Array(1);N[i][0]=m[i][2];
				if((i%(n+1))==0)Z[i][1]=-m[i][2];
			}
			//alert(Z.join("\n")+"\n\n"+N.join("\n"));

			Dreiecksform(Z,N,n);
			//alert(Z.join("   ")+"\n\n"+N.join("   "));//return;
			var dz=new Array(1,0),dn=new Array(1,0);
			status="multipliziere Diagonalelemente";
			document.f.ttt.value+="Multipliziere Diagonalelemente\n\n";
			for(i=(n-1)*n;i>0;i-=n-1)
			{
				dz=polymult(dz,Z[i]),dn=polymult(dn,N[i]);
			}
			//alert(dz.join("  ")+"\n\n"+dn.join("  "));
			status="Polynomdivision";
			document.f.ttt.value+="Polynomdivision mit Produktterm. \n";
			var r=new Array(),q=new Array();
			polydiv(dz,dn,q,r);		
			//alert(q.join("  ")+"\n\n"+r.join("  "));
			var vz=q[n]*(((((n%4)==1)||(n%4)==2))?1:-1);
			if(ganzzahlig)for(i=0;i<=n;i++)p[i]=Math.round(q[i]/vz);
			else for(i=0;i<=n;i++)p[i]=q[i]/vz;
			if(kbapr)for(i=0;i<=n;i++){p[i]=kettenbruchapprox(p[i]);}
			else for(i=0;i<=n;i++){p[i]=new Array(p[i],1);}

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
			//if(g[getGrad(g)]<0){for(i=0;i<k.length;i++)k[i]*=-1;}
			cpstr=pStrr(p).replace(/\./g,komma);
			break;
	
		case 1: //  Javascript, Fließkomma, komplex, algebraisch
			status="Javascript, Fließkomma";
			kmplx=true;
			var mm=new Array(n*n);
			for(i=0;i<mm.length;i++)mm[i]=new Array(m[i][0]/m[i][2],m[i][1]/m[i][2])
			for(i=0;i<=n;i++){ausgabe1("\nBerechne den Koeffizienten "+i,true);p[i]=charpolykoeff(mm,n,i);}
			if(ganzzahlig){for(i=0;i<=n;i++){p[i][0]=Math.round(p[i][0]);p[i][1]=Math.round(p[i][1]);}}
			cpstr=pStrkxf(p);
			break;

		case 2: //  Javascript, genau, komplex, algebraisch
			status="Javascript, algebraisch";
			ausgabe1("\nAlgorithmus: Javascript, algebraisch ... (langsam)",true);
			var pp=charpolykx(m,n);
			for(i=0;i<=n;i++){p[i]=new Array(pp[0][i][0],pp[0][i][1],pp[1][0][0]);}
			//if(pp[1][0][1]!=0)alert("geteilt durch "+pp[1][0][1]+"i");
			cpstr=pStrkx(p);
			kmplx=true;
			break;
		case 3: //  Javascript, genau, komplex, numerisch
			status="Javascript, genau";
			kmplx=true;
			for(i=0;i<=n;i++){ausgabe1("\nBerechne den Koeffizienten "+i,true);p[i]=charpolykoeff(m,n,i);}
			cpstr=pStrkx(p);
			break;

		case 4: //  Java, genau, algebraisch 1
		case 5: //  Java, genau, algebraisch 2
			status="Java, genau, Algorithmus "+(alg-3);
			kmplx=true;
			document.cpa.reducendum=alg-4;
			p=String(document.cpa.charpoly(jt,n)).split(",");
			for(i=0;i<p.length;i++)p[i]=p[i].split(" ");
			cpstr=pStrkx(p);
			break;

		case 6: //  Java, genau, numerisch
			status="Applet, genau, Alg 1";t0=new Date().getTime();
			for(i=0;i<=n;i++)
			{ausgabe1("\nBerechne den Koeffizienten "+i,true);p[i]=String(document.cpa.charpolykoeff(jt,n,i)).split(",");}
			cpstr=pStrkx(p);
			kmplx=true;
			break;

		case 7: //  Java, Fließkomma, komplex
			status="Java, Fließkomma, komplex";
			kmplx=true;
			var mm=new Array(n*n);
			for(i=0;i<mm.length;i++)mm[i]=new Array(m[i][0]/m[i][2],m[i][1]/m[i][2]);
			jt=mm.join(",").replace(/,/g," ");
//			for(i=0;i<=n;i++)
//			{
//				ausgabe1("\nBerechne den Koeffizienten "+i,true);
//				p[i]=document.cpa.charpolykoefff(jt,n,i).split(",");
//			}
			p=String(document.cpa.charpolyf(mm.join(",").replace(/,/g," "),n)).split(",");
			for(i=0;i<p.length;i++)p[i]=p[i].split(" ");
			if(ganzzahlig){for(i=0;i<=n;i++){p[i][0]=Math.round(p[i][0]);p[i][1]=Math.round(p[i][1]);}}
			kmplx=true;
			cpstr=pStrkxf(p);
			break;
		case 8:  //  Java, Krylov
			status="Java, Krylov, "+(kmplx?"komplex":"reell");
			kmplx=true;
			p=String(document.cpa.charpolykrylov(jt,n)).split(",");//alert(p.join("\n"));
			for(i=0;i<p.length;i++)p[i]=p[i].split(" ");
			cpstr=pStrkx(p);
			break;
		}
	}
	var t1=(new Date).getTime()-t0;
	var defizit=0;
	ausgabe1(t=("charakteristisches Polynom:\n  "+cpstr));
	if(p.length<n+1)
	{
		ausgabe1("\n  offensichtlich "+(defizit=n+1-p.length)+" mehrfache Eigenwerte!",true);
		t+="\n\n    Hinweis: Das Polynom ist wegen mehrfacher Eigenwerte,\n    die der Krylov-Algorithmus nicht erfaßt, unvollständig.\n    (Es wird weiter unten ergänzt.)";
	}

	if((alg!=alg_alt)||(tdirty))  // Neuberechnung der Eigenwerte
	{
		for(i=0;i<p.length;i++){if(Math.abs(p[i][0])<1e-10)p[i][0]=0;else p[i][0]=Number(p[i][0]);
						if(Math.abs(p[i][1])<1e-10)p[i][1]=0;else p[i][1]=Number(p[i][1]);}
		var pp=new Array(n+1-defizit),x_;
		if((kmplx)&&(p[0].length==3)){for(i=0;i<pp.length;i++)pp[i]=new Array(p[i][0]/p[i][2],p[i][1]/p[i][2]);}
		else if((kmplx)&&(p[0].length==2)){for(i=0;i<p.length;i++)pp[i]=new Array(Number(p[i][0]),Number(p[i][1]));}
		else for(i=0;i<p.length;i++)pp[i]=new Array(p[i][0]/p[i][1],0);
		for(i=0;i<p.length;i++)for(j=0;j<2;j++){if(String(pp[i][j]).indexOf(".")==-1)pp[i][j]+=".0";}
		var ppp=String(pp.join(",")).replace(/,/g," ");
		ppp.replace(/ \./g," 0."); if(ppp.charAt(0)==".")ppp="0"+ppp;
		for(i=0;i<p.length;i++)for(j=0;j<2;j++){pp[i][j]=Number(pp[i][j]);}
		status="berechne Eigenwerte";
		ausgabe1(t+"\n\nberechne Eigenwerte");
		ew=solvepkx(pp);defizit-=p.length-1-ew.length;
		var vielfachheit=sortiere(ew);
		if((defizit>0)&&(alg!=8))
		{
			t+="\n\n  Es wurde"+((ew.length>1)?"n":"")+" nur "+ew.length+" von "+(p.length-1)+" Nullstellen gefunden.";
			t+="\n  Das Restpolynom ist: "+pStrkxf(p,false).replace(/\./g,komma);
		}
		for(i=0;i<ew.length;i++){if(Math.abs(ew[i][0])<1e-14)ew[i][0]=0;if(Math.abs(ew[i][1])<1e-14)ew[i][1]=0;}
		EWstr=new Array(n);EW=new Array(n);
		for(i=0;i<n-defizit;i++)EWstr[i]=new Array(String(ew[i][0]),String(ew[i][1]));
		for(i=0;i<n-defizit;i++)EW[i]=new Array(ew[i][0],ew[i][1]);

			status="verbessere Werte";
			ausgabe1(t+"\n\nverbessere berechnete Eigenwerte");
			for(i=0;i<n-defizit;i++)
			{
				if((ew[i][0]==Math.round(ew[i][0]))||(ew[i][1]==Math.round(ew[i][1])))continue;
				EW[i]=new Array(ew[i][0],ew[i][1]);
				try{
				x_=document.cpa.newton(String(ew[i][0]),String(ew[i][1]),n,30,ppp).split(",");
				}catch(err){continue;}
				if(x_=="")continue;
				for(k=0;k<2;k++)
				{
					j=x_[k].indexOf(".");
					x_[k]=x_[k].substring(0,j+21);
					EW[i][k]=ew[i][k]=Number(x_[k].substring(0,j+21));
					EWstr[i][k]=String(ew[i][k]);
				}
			}

		if(ewdz100)
		{
			status="approximiere auf 100 Dezimalstellen";
			ausgabe1(t+"\n\napproximiere Eigenwerte auf 100 Dezimalstellen");
			for(i=0;i<n-defizit;i++)
			{
				EWstr[i][k]=new Array(EW[i][0],EW[i][1]);
				x_=document.cpa.newton(String(ew[i][0]),String(ew[i][1]),n,100,"").split(",");
				if(x_==""){ausgabe1("\nApproximation gescheitert",true);continue;}
				for(k=0;k<2;k++)
				{
					j=x_[k].indexOf(".");
					x_[k]=x_[k].substring(0,j+101);
					EWstr[i][k]=x_[k];
					EW[i][k]=Number(x_[k].substring(0,j+21));
					ausgabe1("\nre["+(i+1)+"] = "+x_[0]+"\nim["+(i+1)+"] = "+x_[1]+"\n",true);
				}
			}
			//alert(EWstr.join("\n"));
		}
		var rew=new Array(),kew=new Array();

		for(i=0;i<n-defizit;i++)
		{
			if(Math.abs(EW[i][1])<1e-10)rew[rew.length]=kxStrf(EW[i]);
			else kew[kew.length]=kxStrf(EW[i]);
		}
		if(rew.length>0)t+="\n\nreelle Eigenwerte:   { "+rew.join(" ;  ")+" }";
		if(kew.length>0)t+="\n\nkomplexe Eigenwerte: { "+kew.join(" ;  ")+" }";
		ausgabe1(t);
	}
	var nev=0;
	if(true)  //Neuberechnung der Eigenvektoren
	{
		status="berechne Eigenvektoren";
		ausgabe1(t+"\n\nberechne Eigenvektoren");
		// d=1: m[i] reelle Fließkommazahl, d=2: m[i]=Array(re,im), d=3: m[i]=Array(re,im,n) (ganzzahlig)
		//n: Dimension, e: Eigenwert
		//alert(mmm.join("\n"));
		t+="\n\nEigenvektoren:";
		var nstr=new Array("","","doppelten ","dreifachen ","vierfachen ","fünffachen ","6fachen ","7fachen ","8fachen ","9fachen ","","","","","","","","","","");
		for(i=0;i<n-defizit;i++)
		{
			status="berechne Eigenvektor "+(i+1);
			for(k=0;k<i;k++)if(Math.abs(EW[k][0]-EW[i][0])+Math.abs(EW[k][1]-EW[i][1])<1e-10)break;
			if(k<i)continue;
			var dm=diagonalisieren(mmm,n,EW[i],2);
			ev[i]=eigenvektoren(dm,n);
			t+="\n\n zum "+nstr[vielfachheit[i]]+"Eigenwert "+kxStrf(EW[i])+":";
			for(j=0;j<ev[i].length;j++)
			{
				if(betrageins)
				{
					var vb=vbetrkx(ev[i][j]);
					for(k=0;k<ev[i][j].length;k++){ev[i][j][k][0]/=vb;ev[i][j][k][1]/=vb;}
				}
				t+="\n   [ "+vStrkxf(ev[i][j])+" ]";
				EV[EV.length]=ev[i][j];nev++;
			}
			if(ev[i].length==0)t+="\n   Der Eigenvektor konnte leider nicht bestimmt werden."+((flkmz)?"\n   Abhilfe: Berechnen Sie neu in einem exakten Modus.":"");
			for(j=ev[i].length;j<vielfachheit[i];j++)EV[EV.length]=null;
		}
		ausgabe1(t);
	}

	if((defizit>0)&&(alg==8))
	{
		var chp=new Array(n+1),chr;
		for(i=0;i<n+1-defizit;i++){chp[i]=new Array(p[i][0],p[i][1]);}
		for(i=n+1-defizit;i<=n;i++)chp[i]=new Array(0,0);
		for(i=0;i<ew.length;i++)
		{
			for(j=1;j<ev[i].length;j++)
			{
				for(k=n-1;k>=0;k--)
				{
					if((chp[k][0]!=0)||(chp[k][1]!=0))
					{
						chp[k+1][0]-=chp[k][0];chp[k+1][1]-=chp[k][1];
						chr=EW[i][0]*chp[k][0]-EW[i][1]*chp[k][1];
						chp[k][1]=EW[i][1]*chp[k][0]+EW[i][0]*chp[k][1];
						chp[k][0]=chr;
					}
				}
			}
		}
		cpstr=pStrkxf(chp);
		ausgabe1("\n\ncharakteristisches Polynom (ergänzt):\n  "+cpstr,true);
		t+="\n\ncharakteristisches Polynom (ergänzt):\n  "+cpstr;
	}

	if(ewdz100)
	{
		t+="\n\nGenau approximierte Eigenwerte:\n"
		for(i=0;i<EWstr.length;i++)
		{
			var ewkx=(Number(EW[i][1])!=0);
			t+="\n"+(i+1)+". Eigenwert:\n"+(ewkx?"re: ":"")+(EWstr[i][0]+(ewkx?"\nim: "+EWstr[i][1]:"")).replace(/\./g,komma)+"\n";
		}
		ausgabe1(t);		
	}
	if((document.f.proben.checked)&&(nev>0))
	{
		t+="\n\n\n"+probe(m,n,EV,EW,false,true);
		if(nev!=n)t=t.replace(/Proben/,"Proben mit den gefundenen Eigenvektoren");
		ausgabe1(t);
	}
	status="fertig";
	document.f.cpmodus.selectedIndex=alg_alt=alg;
}
function ausgabe1(t,append)
{
	if(t==null)
	{
		t="";
	}
	else
	{

	}
	if(!append)document.f.ttt.value=t;else document.f.ttt.value+=t;
}

function derivestr(m,n)
{
	var t="expand(charpoly([",z,s;
	for(z=0;z<n;z++)for(s=0;s<n;s++)t+="("+m[s+n*z][0]+((m[s+n*z][1]>=0)?"+":"")+m[s+n*z][1]+"î)/"+m[s+n*z][2]+((s==n-1)?" ; ":" , ");
	t=t.substr(0,t.length-2)+"],x),x)";
	return t;
}

function pStrr(p,html)
{
	var i,g=p.length-1,t=(p[g][0]>0)?"":"-",pp;
	if(istNullp(p))return "0";
	for(i=g;i>=0;i--)
	{
		pp=String(p[i][0]).replace(/-/,"");
		if(pp=="0")continue;
		if(p[i][1]!=1)
		{
			pp+="/"+p[i][1];
		}
		if((t!="")&&(i<g))t+=(p[i][0]>0)?" + ":" - ";
		if((pp!="1")||(i==0))t+=pp;
		if(i>0)t+="x";
		if(i>1)t+="^"+i;
	}
	return t;
}
function pStrkx(p,html)
{
	var pr=new Array(p.length),i,pi=new Array(p.length),t="";
	for(i=0;i<p.length;i++)
	{
		pr[i]=new Array(p[i][0],p[i][2]);pi[i]=new Array(p[i][1],p[i][2]);
		kzkx(pr[i]);kzkx(pi[i]);
	}
	reducep_(pr);reducep_(pi);//alert("pr: "+pr+"\npi: "+pi)
	t+=pStrr(pr);
	if(!istNullp(pi)){if(t!="")t+=" + ";t+="("+pStrr(pi)+")·î";}
	t=t.replace(/\(1\)·/,"");
	return t;
}
function pStrkxf(p,html)
{
	var pr=new Array(p.length),i,pi=new Array(p.length),t="";
	for(i=0;i<p.length;i++)
	{
		if(kbapr==false){pr[i]=new Array(Number(p[i][0]),1);pi[i]=new Array(Number(p[i][1]),1);}
		else
		{pr[i]=kettenbruchapprox(Number(p[i][0]),1000000,1e-12);pi[i]=kettenbruchapprox(Number(p[i][1]),1000000,1e-12);}
	}
	reducep_(pr);reducep_(pi);//alert("pr: "+pr+"\npi: "+pi)
	t+=pStrr(pr);
	if(!istNullp(pi)){if(t!="")t+=" + ";t+="("+pStrr(pi)+")·î";}
	t=t.replace(/\(1\)·/,"");
	return t.replace(/\./g,komma);
}

function istNullp(p){var i,j;for(i=0;i<p.length;i++){if(p[i][0]!=0)return false;}return true;}
function reducep_(p){while((Number(p[p.length-1][0])==0)&&(p.length>1))p.pop();}
function sortiere(x)
{
	var i,mr,mi,j,k,y,g=new Array(x.length);g[g.length-1]=1;
	for(i=0;i<x.length-1;i++)
	{
		mr=x[i][0];mi=x[i][1];k=i;g[i]=0;
		for(j=i+1;j<x.length;j++)
		{if((x[j][0]<mr)||((x[j][0]==mr)&&(x[j][1]<mi))){mr=x[j][0];mi=x[j][1];k=j;}}
		for(j=0;j<2;j++){y=x[k][j];x[k][j]=x[i][j];x[i][j]=y;}
	}
	for(i=0;i<x.length-1;i+=k)
	{
		k=1;
		while((x[i][0]==x[i+k][0])&&(x[i][1]==x[i+k][1])){k++;if(k+i>=x.length-1)break;}
		g[i]=k;
	}
	return g;
}
function Zufallsmatrix()
{
	var n=document.f.zmn.selectedIndex+1;
	var o=document.f.zmo.selectedIndex;
	if(n==1)n=rnd(3,9);
	if(o==6)Startbeispiel((document.f.zmn.selectedIndex=Math.min(n,4)-1)+1);
	else
	{
		var kx=o>2,u=o%3,i,j,m=new Array(n*n),r,im;
		for(i=0;i<n*n;i++)
		{
			m[i]=rnd(-5*(5-n/2),5*(5-n/2));
			if((u==1)&&(rnd(0,5)>2)&&(m[i]!=0)){while(ggT_(r=rnd(2,20),m[i])!=1);m[i]+="/"+r;}
			if((u==2)&&(rnd(0,5)>3)){r=rnd(0,8);m[i]+=komma;for(j=0;j<r;j++)m[i]+=rnd(0,9);m[i]+=rnd(1,9);}
			if((!kx)||(rnd(0,15)>10-n))continue;
			im=rnd(-5*(4-n/2),5*(4-n/2));
			if(im==0)continue;
			if((u==1)&&(rnd(0,5)>2)){while(ggT_(r=rnd(2,20),im)!=1);im+="/"+r;}
			if((u==2)&&(rnd(0,5)>3)){r=rnd(0,8);im+=komma;for(j=0;j<r;j++)im+=rnd(0,9);im+=rnd(1,9);}
			if(m[i]==0)m[i]="";
			if(im==1)im="";if(im==-1)im="-";
			if((String(im).indexOf("-")==-1)&&(m[i]!=""))im="+"+im;im+="î";
			if(rnd(0,5)<3)m[i]=im;else m[i]+=im;
			if(m[i].charAt(0)=="+")m[i]=m[i].substring(1,m[i].length);
		}
		darstellung=-1;
		document.f.m.value=matrStr(m,n);
	}
	ausgabe1("");
	document.f.berli.focus();
}
 
function berechneMatrix()
{
	status="lese Eingabe";
	var t=document.f2.t.value,t_="";
	document.f2.tt.value="";
	var i,j,k,n,e,v;
	v=parseT(t,1);e=v[0];t_=v[2];v=v[1];
	n=e.length;
	var ee=new Array(n);
	for(i=0;i<n;i++)ee[i]=new Array(e[i][0],e[i][1],e[i][2]);
	darstellung=0;document.f2.t.value=matrStr(t_.replace(/\./g,",").split(" "),n+1);darstellung=1;
	if(!document.f2.exakt.checked){for(i=0;i<n;i++){e[i][0]/=e[i][2];e[i][1]/=e[i][2];e[i].pop();}}
	//alert(e+"\n\n"+v);return;
	status="Berechne Inverse im "+((document.f2.exakt.checked)?"exakten ":"Fließkomma-")+"Modus";
	var m=eigenmatrix(e,v);
	if(m==null){document.f2.tt.value="Die Vektoren sind nicht linear unabhängig";status="";return;}
	if(!document.f2.exakt.checked)
	{
		for(i=0;i<m.length;i++){m[i][2]=1;}
		if(document.f2.kbr.checked)
		{
			status="Rekonstruiere Brüche (Kettenbruchalgorithmus)";
			for(i=0;i<m.length;i++)
			{
				var a1=kettenbruchapprox(m[i][0],10000000,1e-13),a2=kettenbruchapprox(m[i][1],10000000,1e-13);
				if(((a1[1]!=1)||(a1[0]==Math.floor(a1[0])))&&((a2[1]!=1)||(a2[0]==Math.floor(a2[0]))))
				{
					m[i][2]=a1[1]*a2[1];m[i][0]=a1[0]*a2[1];m[i][1]=a2[0]*a1[1];
					kzkx(m[i]);
				}
			}
		}
	}
	status="Bereite Ausgabe vor";var td;
	document.f2.tt.value=genM=(td=matrStr(m,n)).replace(/\./g,komma);
	//var mm=new Array((n+1)*n);
	//for(i=0;i<n;i++){mm[i*(n+1)]=e[i];for(j=0;j<n;j++)mm[i*(n+1)+j+1]=v[i][j];}
	//document.f2.t.value=matrStr(mm,n+1);
	td="charpoly(["+td+"],x)";
	td=td.replace(/\[ +/,"[").replace(/ +\]/,"]").replace(/\n/g,";").replace(/ +/g,",").replace(/,;/g,";").replace(/;,/g,";").replace(/;\]/g,"]");
	document.f2.td.value=td;
	if(document.f2.probe.checked)document.f2.tt.value+="\n"+probe(m,n,v,ee,(document.f2.exakt.checked)&&(document.f2.probeexakt.checked));
	status="Fertig";
}
var genM="";
//modus=0: Matrix
//modus=1: Eigenwerte,-vektoren
function parseT(t,modus)
{
	if(modus==null)modus=0;
	t=t.replace(/\r/g,"\n").replace(/\n+/g,"\n").replace(/î/g,"i").replace(/[·*]/g,"").replace(/ +/g," ").replace(/,/g,".");
	t=t.replace(/pi/g,"3.141592653589793238");
	t=t.replace(/\+ +/g,"+").replace(/- +/g,"-").replace(/ \//g,"/").replace(/\/ /g,"/").replace(/\n +/g,"\n").replace(/ +\n/g,"\n");
	while((t.charAt(0)=="\n")&&(t.length>0))t=t.substring(1,t.length);
	while((t.charAt(t.length-1)=="\n")&&(t.length>0))t=t.substr(0,t.length-1);
	if(modus==1)t=t.split("\n");
	if(modus==0)
	{
		t=t.replace(/\n/g," ");
		while((t.charAt(0)==" ")&&(t.length>0))t=t.substring(1,t.length);
		while((t.charAt(t.length-1)==" ")&&(t.length>0))t=t.substr(0,t.length-1);
		t=t.split(" ");
	}
	if(t.length==0)return;
	var i,j,k=0,n=t.length,e=new Array(n),ee=new Array(n),v=new Array(n),t_="";
	var ungenau=(document.f.cpmodusauto.checked==false&&document.f.cpmodus[document.f.cpmodus.selectedIndex].text.indexOf("genau")==-1);
	for(i=0;i<n;i++)
	{
		var genau=false;
		var ttt=t[i].replace(/[\/iî\-\+]/g," ").split(" "),mL=0,genau=1==0;
		if(!ungenau){for(j=0;j<ttt.length;j++){mL=Math.max(mL,ttt[j].length);if(mL>14){genau=true;break;}}}
		while((t[i].charAt(0)==" ")&&(t[i].length>1))t[i]=t[i].substring(1,t[i].length);
		while((t[i].charAt(t[i].length-1)==" ")&&(t[i].length>1)){t[i]=t[i].substr(0,t[i].length-1);}
		t_+=t[i]+((i<n+1)?" ":"");
		if(modus==1)
		{
			t[i]=t[i].split(" ");if(t[i].length!=n+1){status="fehlerhafte Eingabe";alert("Zeile "+(i+1)+" hat nicht die richtige Anzahl von Komponenten.");return;}
			e[i]=genau?parsekx(t[i][0]):parsekx_(t[i][0]);if(e[i]==null){status="fehlerhafte Eingabe";alert("Eingabe "+t[i][0]+" nicht erkannt.");return;}
			v[i]=new Array(n);
			for(j=0;j<n;j++){v[i][j]=genau?parsekx(t[i][j+modus]):parsekx_(t[i][j+modus]);if(v[i][j]==null){status="fehlerhafte Eingabe";alert("Eingabe "+t[i][j+modus]+" nicht erkannt.");return;}}
		}
		else
		{
			v[i]=genau?parsekx(t[i]):parsekx_(t[i]);
			if(v[i]==null){status="fehlerhafte Eingabe";alert("Eingabe "+t[i]+" nicht erkannt.");return;}
		}
	}
	return(modus==1)?new Array(e,v,t_):new Array(v,t_);
}
function probe(mm,n,v,e,exakt,nurFehler)
{
	var m=new Array(mm.length),i,j,k,t="",rv,s,vv=new Array(n),e3=e[0].length==3;
	for(i=0;i<n;i++)
	{
		if(v[i]==null)continue;
		status="Probe "+(i+1)+" von "+n;
		if(exakt)
		{
			for(j=0;j<m.length;j++)
			{
				m[j]=new Array(mm[j][0],mm[j][1],mm[j][2]);
				if((j%(n+1))==0){m[j]=addkx(m[j],multkx(e[i],new Array(-1,0,1)));}
			}
			rv=matrixmalvektor2(m,v[i],n);//alert(m+"\n"+v+"\n"+e+"\n\n"+rv);
			s=0;
			for(k=0;k<n;k++)s+=rv[k][0]*rv[k][0]/(rv[k][2]*rv[k][2])+rv[k][1]*rv[k][1]/(rv[k][2]*rv[k][2]);
		}
		else
		{
			vv[i]=new Array(n);
			for(j=0;j<n;j++)vv[i][j]=(v[i][j].length==3)?new Array(v[i][j][0]/v[i][j][2],v[i][j][1]/v[i][j][2]):new Array(v[i][j][0],v[i][j][1]);
			for(j=0;j<m.length;j++)
			{
				m[j]=new Array(mm[j][0]/mm[j][2],mm[j][1]/mm[j][2],1);
				if((j%(n+1))==0){m[j][0]-=e[i][0]/(e3?e[i][2]:1);m[j][1]-=e[i][1]/(e3?e[i][2]:1);}
			}
			rv=matrixmalvektor(m,vv[i],n);//alert(m+"\n"+v+"\n"+e+"\n\n"+rv);
			s=0;
			for(k=0;k<n;k++)s+=rv[k][0]*rv[k][0]+rv[k][1]*rv[k][1];
		}
		if((!nurFehler)||(s>=1e-8))
		{
			t+=(i+1)+". Eigenvektor/-wert: |(M-eE)v| = ";
			t+=String(Math.sqrt(s)).replace(/\./,",")+((s<1e-8)?"     (OK)":"    <--- (?)")+"\n";
			if(!exakt)t+="   EW: "+kxStrf(e[i])+"\n   EV: [ "+vStrkxf(vv[i])+" ]\n\n";
		}
	}
	status="";
	if(t=="")return "Alle Proben OK";
	return "Proben:\n"+t;
}
var darstellung=1;
function matrStr(m,n)
{
	var i,j,g,n,re,im,nr,ni,t="",b=new Array(n),bm=0,a=new Array(n*n),r,rl,rr,nsp=1,sp="                                               ";sp+=sp;
	for(i=0;i<m.length;i++)
	{
		if(i<n)b[i]=3;
		if(darstellung==1)
		{
		re=m[i][0];nr=ni=m[i][2];im=m[i][1];
		g=ggTInt(re,nr);if(g!=1){re=divInt(re,g);nr=divInt(nr,g);}
		g=ggTInt(im,ni);if(g!=1){im=divInt(im,g);ni=divInt(ni,g);}
		a[i]=(re!=0)?re+((nr!=1)?"/"+nr:""):"";
		if(Number(im)!=0){if(Number(im)>0)a[i]+="+";a[i]+=im+((ni!=1)?"/"+ni:"")+"i";}
		a[i]=a[i].replace(/\+1i/,"+i").replace(/-1i/,"-i");
		if(a[i].charAt(0)=="+")a[i]=a[i].substring(1,a[i].length);
		if(a[i]=="")a[i]="0";
		}
		else a[i]=m[i];
 		b[i%n]=Math.max(b[i%n],String(a[i]).length);bm=Math.max(bm,b[i%n]);
	}
	nsp+=Math.floor(bm/10);
	for(i=0;i<m.length;i++)
	{
		r=b[i%n]-String(a[i]).length+nsp;rr=Math.floor(r/2);rl=r-rr;
		t+=sp.substr(0,rl)+a[i]+sp.substr(0,rr);
		if((darstellung==0)&&((i%n)==0))t+="     ";
		if((i%n)==n-1)t+="\n";
	}
	return t.replace(/i/g,"î");
}

function parsekx(t)
{
	var i,j,re=new Array(0,1),im=new Array(0,1),n=1,vr=1,vi=1,x,v,c0;
	if(t.replace(/[\/i\d\.\+\- ]/g,"")!="")return null;
	t=t.replace(/\+i/g,"+1i").replace(/-i/g,"-1i");
	if(t.charAt(0)=="i")t="1"+t;
	c0=t.charAt(0);
	t=t.substr(1,t.length-1);
	t=t.replace(/-/,"+-");
	x=t.split("+");
	x[0]=c0+x[0];
	for(i=0;i<x.length;i++)
	{
		if(x[i].indexOf("i")>-1)parseadd(x[i].replace(/i/,""),im);else parseadd(x[i],re);
	}
	re[0]=multInt(re[0],im[1]);im[0]=multInt(im[0],re[1]);n=multInt(re[1],im[1]);
	x=new Array(re[0],im[0],n);kzkx(x);
	return x;
}
function parseadd(x,y)
{
	var z=0,n="1",xx,g,kz,kn,k,s0="000000000000000000000000000000000000000000000000000000000000000000";s0+=s0;
	if(x.indexOf("/")>-1){xx=x.split("/");z=xx[0];n=xx[1];}
	else z=x;
	//alert(x);
	kz=(z+".").indexOf(".");kn=(n+".").indexOf(".");k=Math.max(z.length-kz,n.length-kn);
	z=z.replace(/\./,"");n=n.replace(/\./,"");
	z+=s0.substr(0,k-(z.length-kz+1));n+=s0.substr(0,k-(n.length-kn+1));
	//alert(z+"/"+n+"\n\n"+kz+"   "+kn);
	g=ggTInt(z,n);
	if(g!=1){z=divInt(z,g);n=divInt(n,g);}
	y[0]=addInt(multInt(y[0],n),multInt(z,y[1]));
	y[1]=multInt(y[1],n);
	kzkx(y);
}

function parsekx_(t)
{
	var i,j,re=new Array(0,1),im=new Array(0,1),n=1,vr=1,vi=1,x,v,c0;
	if(t.replace(/[\/i\d\.\+\- ]/g,"")!="")return null;
	t=t.replace(/\+i/g,"+1i").replace(/-i/g,"-1i");
	if(t.charAt(0)=="i")t="1"+t;
	c0=t.charAt(0);
	t=t.substr(1,t.length-1);
	t=t.replace(/-/,"+-");
	x=t.split("+");
	x[0]=c0+x[0];
	for(i=0;i<x.length;i++)
	{
		if(x[i].indexOf("i")>-1)parseadd_(x[i].replace(/i/,""),im);else parseadd_(x[i],re);
	}
	re[0]*=im[1];im[0]*=re[1];n=re[1]*im[1];
	x=new Array(re[0],im[0],n);
	kzkx_(x);
	return x;
}
function parseadd_(x,y)
{
	var z=0,n="1",xx,g,kz,kn,k,s0="000000000000000000000000000000000000000000000000000000000000000000";s0+=s0;
	if(x.indexOf("/")>-1){xx=x.split("/");z=xx[0];n=xx[1];}
	else z=x;
	//alert(x);
	kz=(z+".").indexOf(".");kn=(n+".").indexOf(".");k=Math.max(z.length-kz,n.length-kn);
	z=z.replace(/\./,"");n=n.replace(/\./,"");
	z+=s0.substr(0,k-(z.length-kz+1));n+=s0.substr(0,k-(n.length-kn+1));
	//alert(z+"/"+n+"\n\n"+kz+"   "+kn);
	g=ggT_(z,n);if(g!=1){z/=g;n/=g;}
	y[0]=y[0]*n+z*y[1];
	y[1]*=n;
	kzkx_(y);
}
function kzkx_(x)
{
	var g=ggT_(x[0],x[1]),i;
	for(i=2;i<x.length;i++){g=ggT_(x[i],g);if(g==1)return;}
	for(i=0;i<x.length;i++)x[i]/=g;
}

function test(n)
{
	var i,z,a=new Array(n*n),p,q;
	for(i=0;i<n*(n+1);i++)
	{
		z=rnd(0,20);
		if(z<17)a[i]=rnd(-5,5);
		else if(z<19){do{a[i]=p=rnd(-10,10);}while(a[i]==0);do{q=rnd(2,20)}while(ggTInt(p,q)!=1);a[i]+="/"+q;}
		else a[i]=String(rnd(-5,5)/100).replace(/\./,",");
		if(rnd(0,n)<8)a[0]=0;
		a[i]=String(a[i]);
		if(rnd(1,10)==10)
		{
			if(rnd(1,4)<3)a[i]="";
			z=rnd(0,15);
			if(z<5)a[i]+="+"+rnd(2,5)+"i";
			if(z>10)a[i]+="-"+rnd(2,5)+"i";
			if((z<7)&&(a>=5))a[i]="i";
			if(z==10)a[i]="-i";
			if((z>5)&&(z<8)){p=a[i]=rnd(1,10);do{q=rnd(2,20);}while(ggTInt(p,q)!=1);a[i]+=((rnd(0,1)==0)?"+":"-")+p+"/"+q+"i";}
			if((z>7)&&(z<10))a[i]+=rnd(-50,50)/100+"i";
		}
		if(rnd(0,10)>8)a[i]="0";
		a[i]=String(a[i]).replace(/\./,",");
		if(a[i].charAt(0)=="+")a[i]="1"+a[i];
		if(a[i]=="")a[i]=rnd(-2,2);
	}
	darstellung=0;
	document.f2.t.value=matrStr(a,n+1);
	darstellung=1;
}
function rnd(a,b)
{
	return Math.floor(Math.random()*(b-a+1)+a);
}
//k: Kürzen 
function vektorprodukt(v1,v2,k)
{
	var v3= new Array(new Array(v1[1][0]*v2[2][0]-v1[1][1]*v2[2][1]-v1[2][0]*v2[1][0]+v1[2][1]*v2[1][1],v1[1][0]*v2[2][1]+v1[1][1]*v2[2][0]-v1[2][0]*v2[1][1]-v1[2][1]*v2[1][0]),
	                  new Array(v1[2][0]*v2[0][0]-v1[2][1]*v2[0][1]-v1[0][0]*v2[2][0]+v1[0][1]*v2[2][1],v1[2][0]*v2[0][1]+v1[2][1]*v2[0][0]-v1[0][0]*v2[2][1]-v1[0][1]*v2[2][0]),
	                  new Array(v1[0][0]*v2[1][0]-v1[0][1]*v2[1][1]-v1[1][0]*v2[0][0]+v1[1][1]*v2[0][1],v1[0][0]*v2[1][1]+v1[0][1]*v2[1][0]-v1[1][0]*v2[0][1]-v1[1][1]*v2[0][0]));
	if(!k)return v3;
	var i,g=ggT_(v3[0][0],v3[0][1]);g=ggT_(g,ggT_(v3[1][0],v3[1][1]));g=ggT_(g,ggT_(v3[2][0],v3[2][1]));
	for(i=0;i<3;i++){v3[i][0]/=g;v3[i][1]/=g;}
	return v3
}
//liefert zu zwei vierdimensionalen Vektoren v1 und v2 einen dritten v3 mit v1*v3=v2*v3=0 und v3[i]=0;
function ortho4(v1,v2,i)
{
	var vv1=new Array(3),vv2=new Array(3),j,k,kk=0,v3=new Array(4);
	for(k=0;k<3;k++)
	{
		vv1[k]=new Array(2);vv2[k]=new Array(2);
		if(k==i)kk++;
		vv1[k][0]=v1[k+kk][0];vv1[k][1]=v1[k+kk][1];vv2[k][0]=v2[k+kk][0];vv2[k][1]=v2[k+kk][1];
	}
	var vv3=vektorprodukt(vv1,vv2,true);kk=0;
	
	for(k=0;k<3;k++)
	{
		if(k==i)kk++;
		v3[k+kk]=new Array(2);
		v3[k+kk][0]=vv3[k][0];v3[k+kk][1]=vv3[k][1];v3[k+kk][0]=vv3[k][0];v3[k+kk][1]=vv3[k][1];
	}
	v3[i]=new Array(0,0);
	return v3;
}
// i als String aller Indizes, die im Ergebnisvektor 0 sind
function ortho(v1,v2,i)
{
	i=String(i);
	var n=3+i.length,vv1=new Array(3),vv2=new Array(3),j,k,kk=0,v3=new Array(4);
	for(k=0;k<3;k++)
	{
		vv1[k]=new Array(2);vv2[k]=new Array(2);
		if(i.indexOf(k)>-1)kk++;
		vv1[k][0]=v1[k+kk][0];vv1[k][1]=v1[k+kk][1];vv2[k][0]=v2[k+kk][0];vv2[k][1]=v2[k+kk][1];
	}
	var vv3=vektorprodukt(vv1,vv2,true);kk=0;
	
	for(k=0;k<3;k++)
	{
		if(i.indexOf(i)>-1)kk++;
		v3[k+kk]=new Array(2);
		v3[k+kk][0]=vv3[k][0];v3[k+kk][1]=vv3[k][1];v3[k+kk][0]=vv3[k][0];v3[k+kk][1]=vv3[k][1];
	}
	v3[i]=new Array(0,0);
	return v3;
}

//macht v[] zueinander paarweise orthogonal. v[0] bleibt erhalten.
function orthogonalisiere(v)
{
	
}
function Startbeispiel(n)
{
	status="erstelle Beispielmatrix mit \"schönen\" Eigenwerten und -vektoren";
	var ber=1==0;
	if(n==null){n=3;ber=true;}
	var e=new Array(n),v=new Array(n),i,j,k,ii=0;
	if(ber)with(document.f){cpmodus.selectedIndex=0;cpmodusauto.checked=false;kbapprox.checked=true;}
	do{ii++;
		for(i=0;i<n;i++)
		{
			e[i]=new Array(rnd(-5,5),((rnd(0,15)==1)?rnd(-3,3):0));
			v[i]=new Array(n);
			for(j=0;j<n;j++)v[i][j]=new Array(rnd(-5,5),((rnd(0,15)==1)?rnd(-2,2):0),1);
		}
		if(n==3)
		{
			//e00·(e11·e22 - e12·e21) + e01·(e12·e20 - e10·e22) + e02·(e10·e21 - e11·e20)=1
                  
			var r1=v[1][1][0]*v[2][2][0]-v[1][1][1]*v[2][2][1]-(v[1][2][0]*v[2][1][0]-v[1][2][1]*v[2][1][1]);
			var i1=v[1][1][1]*v[2][2][0]+v[1][1][0]*v[2][2][1]-(v[1][2][1]*v[2][1][0]+v[1][2][0]*v[2][1][1]);
			var r2=v[1][2][0]*v[2][0][0]-v[1][2][1]*v[2][0][1]-(v[1][0][0]*v[2][2][0]-v[1][0][1]*v[2][2][1]);
			var i2=v[1][2][1]*v[2][0][0]+v[1][2][0]*v[2][0][1]-(v[1][0][1]*v[2][2][0]+v[1][0][0]*v[2][2][1]);
			var r3=v[1][0][0]*v[2][1][0]-v[1][0][1]*v[2][1][1]-(v[1][1][0]*v[2][0][0]-v[1][1][1]*v[2][0][1]);
			var i3=v[1][0][1]*v[2][1][0]+v[1][0][0]*v[2][1][1]-(v[1][1][1]*v[2][0][0]+v[1][1][0]*v[2][0][1]);
			var sr=v[0][1][0]*r2-v[0][1][1]*i2+v[0][2][0]*r3-v[0][2][1]*i3;
			var si=v[0][1][1]*r2+v[0][1][0]*i2+v[0][2][1]*r3+v[0][2][0]*i3;
			if(r1*r1+i1*i1==0)continue;

			//v[0][0][0]=(v[0][1][0]*(v[1][0][0]*v[2][2][0]-v[1][2][0]*v[2][0][0])+v[0][2][0]*(v[1][1][0]*v[2][0][0]-v[1][0][0]*v[2][1][0])+1)/(v[1][1][0]*v[2][2][0]-v[1][2][0]*v[2][1][0]);
			//alert(v[0][0][0]);
			kx_div(new Array(1-sr,-si),new Array(r1,i1),v[0][0]);
			var br=kettenbruchapprox(v[0][0][0]),bi=kettenbruchapprox(v[0][0][1]);
			if((Math.abs(br[0])>5)||(Math.abs(br[1])>5)||(Math.abs(bi[0])>5)||(Math.abs(bi[1])>5))continue;
			break;
		}
		else if(n==2)
		{
			//v00=(1+v01*v10)/v11;
			if(v[1][1][0]*v[1][1][0]+v[1][1][1]*v[1][1][1]==0)continue;
			kx_div(new Array(1+v[0][1][0]*v[1][0][0]-v[0][1][1]*v[1][0][1],v[0][1][1]*v[1][0][0]+v[0][1][0]*v[1][0][1]),new Array(v[1][1][0],v[1][1][1]),v[0][0]);
			var br=kettenbruchapprox(v[0][0][0]),bi=kettenbruchapprox(v[0][0][1]);
			if((Math.abs(br[0])>5)||(Math.abs(br[1])>5)||(Math.abs(bi[0])>5)||(Math.abs(bi[1])>5))continue;
			break;
		}
		else break;
	}while(ii<42);
	//alert(ii+"\n\n"+v.join("\n"));
	var m=eigenmatrix(e,v);
	//if((m[0].length<3)&&(n<5))
	{
		for(i=0;i<m.length;i++){m[i][2]=1;}
			//status="Rekonstruiere Brüche (Kettenbruchalgorithmus)";
			for(i=0;i<m.length;i++)
			{
				var a1=kettenbruchapprox(m[i][0],100000,1e-10),a2=kettenbruchapprox(m[i][1],100000,1e-10);
				if((a1[0]!=Math.round(a1[0]))||(a2[0]!=Math.round(a2[0])))return Startbeispiel(n);
				if(((a1[1]!=1)||(a1[0]==Math.floor(a1[0])))&&((a2[1]!=1)||(a2[0]==Math.floor(a2[0]))))
				{
					m[i][2]=a1[1]*a2[1];m[i][0]=a1[0]*a2[1];m[i][1]=a2[0]*a1[1];
					kzkx(m[i]);
				}
			}
	}
	darstellung=1;
	document.f.m.value=(td=matrStr(m,n)).replace(/\./g,",");
	if(ber)
	{
		berechnen();
		with(document.f){cpmodus.selectedIndex=0;cpmodusauto.checked=true;kbapprox.checked=false;}
	}
	status="Beispielmatrix mit \"schönen\" Eigenwerten und -vektoren erstellt";
}

function kopieren()
{
	document.f.m.value=genM;ausgabe1("");
	document.f.m.select();document.f.m.focus();
}
