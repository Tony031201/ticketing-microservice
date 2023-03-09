/* 
 * CSC 225 - Assignment 3
 * Name: 
 * Student number:
 */
 
/* 
Algorithm analysis goes here.
*/
 
 
import java.io.*;
import java.util.*;

public class ArrayMatch {
    static boolean match(int[] a, int[] b){
  
        
        /*
         Your recusive solution goes here.   
         */
		int n = a.length;
        if (n%2>0){
			return java.util.Arrays.equals(a, b);	
		}else{
			int N=n;
			n=n/2;
			int [] a1=new int[n];
			int [] a2=new int[n];
			int [] b1=new int[n];
			int [] b2=new int[n];

			for (int j=0;j<N;j++){
				if(j<n){
						a1[j]=a[j];
				}else if(j>=n){
					a2[j-n]=a[j];
				}
			}
	
			for (int k=0;k<N;k++){
				if(k<n){
					b1[k]=b[k];
				}else if(k>=n){
					b2[k-n]=b[k];
				}
			}

			return ((match(a1,b1) && match(a2,b2)) ||
					(match(a1,b1) && match(a1,b2)) || 
					(match(a2,b1) && match(a2,b2)));
		}
    }
    
    public static void main(String[] args) {
    /* Read input from STDIN. Print output to STDOUT. Your class should be named ArrayMatch. 

	You should be able to compile your program with the command:
   
		javac ArrayMatch.java
	
   	To conveniently test your algorithm, you can run your solution with any of the tester input files using:
   
		java ArrayMatch inputXX.txt
	
	where XX is 00, 01, ..., 13.
	*/

   	Scanner s;
	if (args.length > 0){
		try{
			s = new Scanner(new File(args[0]));
		} catch(java.io.FileNotFoundException e){
			System.out.printf("Unable to open %s\n",args[0]);
			return;
		}
		System.out.printf("Reading input values from %s.\n",args[0]);
	}else{
		s = new Scanner(System.in);
		System.out.printf("Reading input values from stdin.\n");
	}     
  
        int n = s.nextInt();
        int[] a = new int[n];
        int[] b = new int[n];
        
        for(int j = 0; j < n; j++){
            a[j] = s.nextInt();
        }
        
        for(int j = 0; j < n; j++){
            b[j] = s.nextInt();
        }
        
        System.out.println((match(a, b) ? "YES" : "NO"));
    }
}
