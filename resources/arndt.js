//This code has been repurposed, by its original author, Arndt Brünner, from this website: http://www.arndt-bruenner.de/mathe/scripts/engl_eigenwert2.htm

// Returns the 4 eigenvalues -- output is Array((re1,im1),(re2,im2),...) -- of matrix m, 
// which must have the Array-structure
// (((a11re,a11im),(a12re,a12im),...,(a14re,a14im)),((a21re,a21im),...,(a24re,a24im)),... etc.

function eigenvalues4(m)
{
	return solve4(charpoly4(m));
}

function solve4(k_)
{
	var i,j,x=new Array(0,0),y=new Array(0,0),X=new Array(),nX=0,t,w=Math.pow(k_[0][0]*k_[0][0]+k_[0][1]*k_[0][1],0.125)*2,cp=false;
	var k=new Array(5);for(i=0;i<=4;i++){k[i]=new Array(k_[i][0],k_[i][1]);if(k[i][1]!=0)cp=true;}
	while((k[0][0]==0)&&(k[0][1]==0)){hkpd(k,x,y);X[nX++]=new Array(0,0);}
	for(i=0;(i<5000)&&(nX<4);i++)
	{
		x[0]=Math.random()*Math.random()*Math.random();x[0]*=x[0]*50*(i%50+10);if(Math.random()>0.5)x[0]=-x[0];x[1]=0;
		if((i%3)==1){x[1]=Math.random()*Math.random()*Math.random();x[1]*=x[1]*20*(i%50+10);if(Math.random()>0.5)x[1]=-x[1];}
		ntol=i*i*i*1e-18;
		if(t>1500){x[0]=w*1.5*Math.random()-0.75*w;x[1]=w*Math.random()-0.5*w;}
		if(newtonk(k,x))
		{
			hkpd(k,x,y);/*newtonk(k_,x);*/X[nX++]=new Array(x[0],x[1]);//alert(x+"\n\n"+k.join("\n"));
			if((Math.abs(x[1])>0.001)&&(!cp))
			{
				x[1]=-x[1];hk(k,x,y);
				if(y[0]*y[0]+y[1]*y[1]<1e-15){/*newtonk(k_,x);alert(x+"\n(konj)");*/hkpd(k,x,y);X[nX++]=new Array(x[0],x[1]);}
			}
		}
		if(nX==2)
		{
			var b=k[2][1]*k[2][1]+k[2][0]*k[2][0],r=(k[1][0]*k[2][0]+k[1][1]*k[2][1])/b;
			k[1][1]=(k[1][1]*k[2][0]-k[1][0]*k[2][1])/b;k[1][0]=r;
			r=(k[0][0]*k[2][0]+k[0][1]*k[2][1])/b;k[0][1]=(k[0][1]*k[2][0]-k[0][0]*k[2][1])/b;k[0][0]=r;
			var D=ksubtr(kmult(k[1],k[1]),kmult(new Array(4,0),k[0]));
			var W=new Array(Math.sqrt(Math.sqrt(D[0]*D[0]+D[1]*D[1])+D[0])/Math.sqrt(2),Math.sqrt(Math.sqrt(D[0]*D[0]+D[1]*D[1])-D[0])*sign(D[1])/Math.sqrt(2));
			X[2]=ksubtr(W,k[1]);W[0]=-W[0];W[1]=-W[1];X[3]=ksubtr(W,k[1]);
			X[2][0]=X[2][0]/2;X[2][1]=X[2][1]/2;X[3][0]=X[3][0]/2;X[3][1]=X[3][1]/2;
			nX=4;//newtonk(k_,X[2]);newtonk(k_,X[3]);
		}
	}
	//status=i;
	for(i=0;i<nX;i++){for(j=0;j<1;j++){if(Math.abs(X[i][j])<1e-14)X[i][j]=0;}}
	return X;
}
function hk(k,x,y) // Horner, complex
{
	var i,im,kk=new Array(4);y[0]=k[4][0];y[1]=k[4][1];
	for(i=3;i>=0;i--){im=y[0]*x[1]+y[1]*x[0]+k[i][1];y[0]=y[0]*x[0]-y[1]*x[1]+k[i][0];y[1]=im;}
}
function hkpd(k,x,y)  // Horner, complex, reduces polynomial
{
	var i,im,kk=new Array(new Array(0,0),new Array(0,0),new Array(0,0),new Array(0,0));y[0]=k[4][0];y[1]=k[4][1];
	if(x[0]*x[0]+x[1]*x[1]<1e-15){for(i=0;i<4;i++){k[i][0]=k[i+1][0];k[i][1]=k[i+1][1]};k[4][0]=k[4][1]=0;return;}
	for(i=3;i>=0;i--){im=(kk[i][1]=y[0]*x[1]+y[1]*x[0])+k[i][1];y[0]=(kk[i][0]=y[0]*x[0]-y[1]*x[1])+k[i][0];y[1]=im;}
	for(i=0;i<4;i++){k[i][0]=kk[i][0];k[i][1]=kk[i][1];}k[4][0]=k[4][1]=0;
	if(y[0]*y[0]+y[1]*y[1]>1e-15)alert("Error: |y|="+Math.sqrt(y[0]*y[0]+y[1]*y[1])+"!=0");
}
function hkd(k,x,y)  // Horner, complex, for 1. derivative
{
	var i;y[0]=4*k[4][0];y[1]=4*k[4][1];
	for(i=3;i>0;i--){im=(y[0]*x[1]+y[1]*x[0])+i*k[i][1];y[0]=(y[0]*x[0]-y[1]*x[1])+i*k[i][0];y[1]=im;}
}
function hkdd(k,x,y) // Horner, complex, for 2. derivative
{
	var i,c=new Array(0,0,2,6);y[0]=12*k[4][0];y[1]=4*k[4][1];
	for(i=3;i>1;i--){im=(y[0]*x[1]+y[1]*x[0])+c[i]*k[i][1];y[0]=(y[0]*x[0]-y[1]*x[1])+c[i]*k[i][0];y[1]=im;}
}
function hkddd(k,x,y) // Horner, complex, for 3. derivative
{
	y[0]=24*k[4][0]*x[0]-6*k[3][0];y[1]=24*k[4][1]*x[1]-6*k[3][1];
}
function newtonk(k,x)  // Newton-algorithm complex, to approximate roots
{
	var i,r,y=new Array(0,0),yy=new Array(0,0),by,bby=1e10,byy,xx=new Array(x[0],x[1]);
	for(i=0;i<40;i++)
	{
		hk(k,x,y);hkd(k,x,yy);by=(y[0]*y[0]+y[1]*y[1]);byy=(yy[0]*yy[0]+yy[1]*yy[1]);
		if(byy==0)return false;
		r=x[0]-(y[0]*yy[0]+y[1]*yy[1])/byy;x[1]-=(y[1]*yy[0]-y[0]*yy[1])/byy;x[0]=r;
		//alert(x+"\n"+byy);
		if(bby<by){x[0]=xx[0];x[1]=xx[1];by=bby;break;}
		if((Math.abs(x[0]-xx[0])<1e-20)&&(Math.abs(x[1]-xx[1])<1e-20))break;
		bby=by;xx[0]=x[0];xx[1]=x[1];
	}
	if(Math.abs(x[1])<ntol)x[1]=0;
	if(byy<1e-8){newtonek(k,x);newtonwk(k,x);}
	return(by<1e-15);
}
var ntol=1e-14;
function newtonek(k,xx)  // Newton-algorithm, complex, to approximate extremas (-> improving double root)
{
	var i,r,y=new Array(0,0),yy=new Array(0,0),by,bby=1e10,byy,x=new Array(xx[0],xx[1]),xxx=new Array(x[0],x[1]);
	for(i=0;i<40;i++)
	{
		hkd(k,x,y,false);hkdd(k,x,yy);by=(y[0]*y[0]+y[1]*y[1]);byy=(yy[0]*yy[0]+yy[1]*yy[1]);
		if((byy==0)||(bby<by)){by=bby;break;}
		r=x[0]-(y[0]*yy[0]+y[1]*yy[1])/byy;x[1]-=(y[1]*yy[0]-y[0]*yy[1])/byy;x[0]=r;
		//alert("extr\n"+x+"\n"+by);
		if((Math.abs(x[0]-xxx[0])<1e-20)&&(Math.abs(x[1]-xxx[1])<1e-20))break;
		bby=by;xxx[0]=x[0];xxx[1]=x[1];
	}
	if(Math.abs(x[1])<1e-14)x[1]=0;
	hk(k,x,y);if(y[0]*y[0]+y[1]*y[1]<1e-15){xx[0]=x[0];xx[1]=x[1];return true;}
	return false;
}
function newtonwk(k,xx) // Newton-algorithm, complex, to approximate inflection/saddle point (-> improving triple root)
{
	var i,r,y=new Array(0,0),yy=new Array(0,0),by,bby=1e10,byy,x=new Array(xx[0],xx[1]),xxx=new Array(x[0],x[1]);
	for(i=0;i<40;i++)
	{
		hkdd(k,x,y,false);hkddd(k,x,yy);by=(y[0]*y[0]+y[1]*y[1]);byy=(yy[0]*yy[0]+yy[1]*yy[1]);
		if((byy==0)||(bby<by)){by=bby;break;}
		r=x[0]-(y[0]*yy[0]+y[1]*yy[1])/byy;x[1]-=(y[1]*yy[0]-y[0]*yy[1])/byy;x[0]=r;
		//alert("wp\n"+x+"\n"+by);
		if((Math.abs(x[0]-xxx[0])<1e-20)&&(Math.abs(x[1]-xxx[1])<1e-20))break;
		bby=by;xxx[0]=x[0];xxx[1]=x[1];
	}
	if(Math.abs(x[1])<1e-14)x[1]=0;
	hk(k,x,y);if(y[0]*y[0]+y[1]*y[1]<1e-15){xx[0]=x[0];xx[1]=x[1];return true;}
	return false;
}

function sign(x){return(x<0)?-1:1;}
function kadd(a,b){return new Array(a[0]+b[0],a[1]+b[1]);}  // complex addition
function ksubtr(a,b){return new Array(a[0]-b[0],a[1]-b[1]);} // complex subtraction
function kmult(a,b){return new Array(a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]);}  // complex multiplication
function charpoly4(m){return fadlev(m);}
function fadlev(A)                         // Faddejew-Leverrier-algorithm (-> coefficients of char. pol.)
{
	var i,j,ii,k,B=new Array(),n=A.length,c=new Array(n+1),t=new Array(0,0);
	c[n]=new Array(1,0);
	for(ii=0;ii<6;ii++){B[ii]=new Array(n);for(i=0;i<n;i++){B[ii][i]=new Array(n);for(j=0;j<n;j++)B[ii][i][j]=new Array(0,0);}}
	for(k=1;k<=n+1;k++)
	{
		for(i=0;i<n;i++)for(j=0;j<n;j++)
		{
			B[k][i][j][0]=(i==j)?c[n-k+1][0]:0;B[k][i][j][1]=(i==j)?c[n-k+1][1]:0;
			for(ii=0;ii<n;ii++)B[k][i][j]=kadd(B[k][i][j],kmult(A[i][ii],B[k-1][ii][j]));
		}
		t[0]=t[1]=0;
		if(k==n+1)break;
		for(i=0;i<n;i++)for(ii=0;ii<n;ii++)t=kadd(t,kmult(A[i][ii],B[k][ii][i]));
		c[n-k]=new Array(-t[0]/k,-t[1]/k);
	}
	return c;
}

// (c) Arndt Brünner, 2014
