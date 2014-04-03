var m=new Array(  2 ,  2,   1,   2,   0,   2,  -1,   2,   0, 
 -1 , -2 ,  2 ,  1 ,  1 ,  0,  -2,   0,   0, 
  0 , -1 ,  2 , -1 ,  0 , -1,   1,   1,   1, 
  0 ,  1 , -1 ,  1 , -1 ,  1,  -2,   2,  -1, 
  0 , -1 , -1 , -1 ,  0 ,  2,  -1,   0,  -1, 
  0 ,  0 ,  1 ,  1 , -1 ,  0,   1,   0,  -1, 
  2 ,  0 ,  1 ,  1 , -1 ,  0,  -1,   0,  -1, 
  1 ,  1 ,  0 ,  0 ,  1 , -2,   1,  -2,  -1, 
  2 ,  1 ,  2 ,  0 ,  1 ,  0,  -2,   0,   0);
//krylov(m);


//liefert die Koeffizienten des charakteristischen Polynoms der Matrix m
function krylov(m,n)
{
	var n=Math.round(Math.sqrt(m.length));if(m.length!=n*n)return;
	var i,j,k,jj=1,nn=n;
	var z=new Array(n+1);
	z[0]=new Array(n);
	do
	{
		if(jj<3)
		{
			for(j=0;j<n;j++)z[0][j]=Math.round(Math.random()*10+1);
			for(i=1;i<=nn;i++)
			{
				z[i]=new Array(n);
				for(j=0;j<n;j++)
				{
					z[i][j]=0;
					for(k=0;k<n;k++)z[i][j]+=z[i-1][k]*m[j*n+k];
				}
			}
			//alert(z[i]);
		}
		var mm=new Array(n);
		for(i=0;i<n;i++)
		{
			mm[i]=new Array(nn+1);
			for(j=0;j<nn;j++)mm[i][j]=z[j][i];mm[i][nn]=-z[nn][i];
		}			
		alert("nn="+nn+"\n\n"+mm.join("\n"));
		for(i=0;i<nn;i++)
		{
			if(mm[i][i]==0)
			{
				for(j=i+1;j<n;j++)
				{
					if(mm[j][i]==0)continue;
					for(k=0;k<=nn;k++)mm[i][k]+=mm[j][k];
					break;
				}
				if(j==n)
				{
					jj++;
					break;
				}
			}
			var q=mm[i][i];
			for(k=i+1;k<=nn;k++)mm[i][k]/=mm[i][i];mm[i][i]=1;
			for(j=0;j<n;j++)
			{
				if(i==j)continue;
				var f=mm[j][i];
				for(k=Math.min(i,j);k<=nn;k++)
				//{mm[j][k]=subInt(multInt(q,mm[j][k]),multInt(f,mm[i][k]));}
				{mm[j][k]-=f*mm[i][k];if(Math.abs(mm[j][k])<1e-8)mm[j][k]=0;}
				//kuerzen(m[j]);
			}
			alert("nn="+nn+"\n\n"+mm.join("\n"));
		}
		if(i==nn)break;
		if((jj%1)==0)nn=i;
	}while((jj<12)&&(n>0));
	var a=new Array(nn+1),v=((nn%2)==1)?-1:1;
	for(i=0;i<nn;i++)
	{
		//alert(mm[i][i]+"\n\n"+mm[i][nn]);
		//var g=ggTInt(mm[i][nn],mm[i][i]);
		//alert(mm[i][i]+"\n\n"+mm[i][nn]+"\n\n"+g);
		//if(g!=1){mm[i][i]=divInt(mm[i][i],g);mm[i][nn]=divInt(mm[i][nn],g);}
		a[i]=v*mm[i][nn]/mm[i][i];
	}
	a[nn]=v;
	alert(a);	
}

function kuerzen(x)
{
	var i,g=ggTInt(x[0],x[1]);
	for(i=2;i<x.length;i++)g=ggTInt(g,x[i]);
	for(i=0;i<x.length;i++)x[0]=divInt(x[0],g);
}