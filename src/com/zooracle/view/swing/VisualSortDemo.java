package com.zooracle.view.swing;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;

import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JFrame;

import org.apache.log4j.Logger;
import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfDMatch;
import org.opencv.core.MatOfKeyPoint;
import org.opencv.core.Point;
import org.opencv.core.Scalar;
import org.opencv.core.Size;
import org.opencv.core.TermCriteria;
import org.opencv.features2d.DMatch;
import org.opencv.features2d.DescriptorExtractor;
import org.opencv.features2d.DescriptorMatcher;
import org.opencv.features2d.FeatureDetector;
import org.opencv.highgui.Highgui;
import org.opencv.imgproc.Imgproc;

import com.zooracle.main.Settings;
import com.zooracle.model.Range;

import tools.FileUtils;
import tools.OpenCVUtils;

public class VisualSortDemo
{
	final static Logger logger = Logger.getLogger(VisualSortDemo.class);
	
	public static String osBaseDir = Settings.basePath;
	public static ArrayList<Integer> individuals = new ArrayList<Integer>();
	private static String method = "rg_bf2";
	
	public static File fout = null;
	public static FileOutputStream fos = null;
	public static BufferedWriter bw = null;
	
	public static int distLimit = 82500;
	public static int k = 4750; 
	public static double maxKn = 2;
	public static int maxKn2 = 2;
	public static boolean createCodebook = true;
    
	public static enum ParseType {
		OFFSET, POS, HUE, SATURATION, VALUE
	}

	protected static String dir;

	public static void main(String[] args)
	{
//		System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
//		logger.info(Core.VERSION);
		final ArrayList<File> animalFiles = new ArrayList<File>();
		final JFrame frame = new JFrame();
		frame.setSize(200, 100);
		
		
		frame.setLayout(new BoxLayout(frame.getContentPane(), BoxLayout.Y_AXIS));
		
		final JButton createModelButton = new JButton("create model");
		JButton compareButton = new JButton("compare");
		
		createModelButton.addActionListener(new ActionListener() {
			

			public void actionPerformed(ActionEvent e) {
				dir = FileUtils.selectDirectory(frame, "select folder with (old) .zoo-files to create model");
				ArrayList<File> animalFile = new ArrayList<File>();
				FileUtils.getImages(dir, animalFile, true);
				createModelButton.setText("CREATING!");
				try {
					generateCodeBook(animalFile, new File(osBaseDir + "_.json"));
				} catch (IOException e1) {
					e1.printStackTrace();
				}
				createModelButton.setText("DONE!");
				createModelButton.setEnabled(false);
			}
		});
		
		frame.add(createModelButton);
//		frame.add(compareButton);
		
		frame.setLocationRelativeTo(null);
		frame.setVisible(true);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
			
	}
	    
	
	public static double[][] generateCodeBook(ArrayList<File> animalFiles, File codeBookFile) throws IOException
	{
		
		try
		{
			fout = new File(dir + "best_Matches_Report.txt");
			fos = new FileOutputStream(fout);
			bw = new BufferedWriter(new OutputStreamWriter(fos));
		}
		catch (FileNotFoundException e)
		{
			e.printStackTrace();
		}
		
//		System.loadLibrary(Core.NATIVE_LIBRARY_NAME);

		List<MatOfKeyPoint> keypoints = new ArrayList<MatOfKeyPoint>();
		long timebefore = System.nanoTime();

		//init detector, extractor and matcher
		FeatureDetector surfFeatureDetector = FeatureDetector.create(FeatureDetector.PYRAMID_ORB);
		DescriptorExtractor descriptorExtractor = DescriptorExtractor.create(DescriptorExtractor.BRIEF);
		DescriptorMatcher matcher = DescriptorMatcher.create(DescriptorMatcher.BRUTEFORCE_SL2);
		
		//init arrays for all animals
		int numAnimals = animalFiles.size();
		MatOfKeyPoint[] aKeypoints = new MatOfKeyPoint[numAnimals];
		Mat[] aImg = new Mat[numAnimals];
		Mat[] aDescriptors = new Mat[numAnimals];
		int[][] numMatches = new int[numAnimals][numAnimals];
		int[][] numGoodMatches = new int[numAnimals][numAnimals];
		double[] numGoodMatches1D = new double[numAnimals*numAnimals];
		
		Mat allDescriptors = new Mat();
		
		HashMap<Integer,Range> descImg = new HashMap<Integer, Range>();
		ArrayList<Integer> labels = new ArrayList<Integer>();
//		HashMap<Integer,Integer> descImg = new HashMap<Integer, Range>();
		
		int currentNumRows = 0;

		// read images
		for (int a = 0; a < numAnimals; a++)
		{
//			logger.info("now:" + animalFiles.get(a));
			aImg[a] = Highgui.imread(animalFiles.get(a).toString(), 0); 
			Imgproc.resize(aImg[a], aImg[a], new Size(150, 250));
			Imgproc.equalizeHist(aImg[a], aImg[a]);
			Imgproc.threshold(aImg[a], aImg[a], 127, 255, Imgproc.THRESH_BINARY);
			
			MatOfKeyPoint tempKeypoints = new MatOfKeyPoint();
			Mat tempDescriptor = new Mat();

			surfFeatureDetector.detect(aImg[a], tempKeypoints); aKeypoints[a] = tempKeypoints;
			descriptorExtractor.compute(aImg[a], aKeypoints[a], tempDescriptor); aDescriptors[a] = tempDescriptor;
			
			allDescriptors.push_back(aDescriptors[a]);
			
			for (int i = 0; i < aDescriptors[a].rows(); i++)
				labels.add(a);
			
			//remember which desc belongs to which image
			descImg.put(a, new Range(currentNumRows, aDescriptors[a].rows()-1));
			
			//remember last desc index
			currentNumRows+=aDescriptors[a].rows();
		}
		logger.info("label size:" + labels.size());
		
		Mat clusterLabels = new Mat();
		Mat centers = new Mat();
		
		allDescriptors.convertTo(allDescriptors, CvType.CV_32F);
	    TermCriteria criteria = new TermCriteria(TermCriteria.EPS + TermCriteria.MAX_ITER,100,0.1);
	    long before= System.currentTimeMillis();
	    
//	    if ((createCodebook) && (!vocabularyFile.exists()))
	    {
		    System.out.print("creating kmeans cluster...");
		    Core.kmeans(allDescriptors, k, clusterLabels, criteria, 10, Core.KMEANS_PP_CENTERS, centers);
		    logger.info("done.");
	    }
//	    else
//	    	centers = OpenCVUtils.loadMatFromFile(vocabularyFile);
	    
	    long after = System.currentTimeMillis() - before;
	    logger.info("done in " + (after) + " ms");
	    logger.info("clusters size:" + clusterLabels.size());
	    logger.info("centers size:" + centers.size());		
	    
	    double[] clusterLabelArray = new double[clusterLabels.rows()];
	    ArrayList<ArrayList<Integer>> clusterImageMap = new ArrayList<ArrayList<Integer>>();
	    for (int nk = 0; nk < k+1; nk++)
	    	clusterImageMap.add(new ArrayList<Integer>());
	    
	    for (int r = 0; r < clusterLabels.rows(); r++)
	    {
	    	clusterLabelArray[r] = clusterLabels.get(r, 0)[0];
	    	clusterImageMap.get((int)clusterLabels.get(r, 0)[0]).add(labels.get(r));
	    }
	    
	    int no = 0;
	    
	    centers.convertTo(centers, CvType.CV_8U);
	    List<MatOfDMatch> matches = new ArrayList<MatOfDMatch>();
	    
	    int nBestMatches = 10;
	    
	    double codebook[][] = new double[numAnimals][k];
	    double codebook1D[] = new double[numAnimals*k];
	    double matchMatrix[][] = new double[numAnimals][numAnimals];
	    double matchMatrix1D[] = new double[numAnimals*numAnimals];
	    int bestMatches[][] = new int[numAnimals][nBestMatches];
	    
	    double maxValMM = Double.MIN_VALUE;
	    double minValMM = Double.MAX_VALUE;
	    for (int a = 0; a < numAnimals; a++)
		{
	    	double maxVal = Double.MIN_VALUE;
	    	double minVal = Double.MAX_VALUE;
	    	
	    	
	    	matcher.knnMatch(aDescriptors[a], centers, matches, (int)maxKn);
//	    	logger.info("matches size: " + matches.size());
	    	
	    	
	    	
	    	for (MatOfDMatch mdm : matches)
	    	{
	    		double kn = 1;
	    		for (DMatch dm : mdm.toList())
	    		{
//	    			codebook[k*a + dm.trainIdx] += (maxKn-kn+1d)/maxKn;
	    			codebook[a][dm.trainIdx] += ((maxKn-kn+1d)/maxKn)*((maxKn-kn+1d)/maxKn);
	    			
	    			int detectedKIndex = dm.trainIdx;
//	    			dm.
	    			for (int photoIndex : clusterImageMap.get(detectedKIndex))
	    			{
//	    				if (a==photoIndex)
//	    					continue;
	    				matchMatrix[a][photoIndex]++;
	    			}
	    			
//	    			codebook[a][dm.trainIdx] += ((maxKn-kn+1d)/maxKn)*((maxKn-kn+1d)/maxKn);
//	    			codebook[a][dm.trainIdx] += ((maxKn-kn+1d)/maxKn)*((maxKn-kn+1d)/maxKn);
					kn++;
	    		}
//	    		logger.info("kn:" + kn);
	    	}
	    	
	    	int currentBestMatchCount = -1;
	    	int currentBestMatchIndex = -1;
	    	
	    	ArrayList<int[]> bestMatchArray = new ArrayList<int[]>();
	    	
	    	for (int i = 0; i < numAnimals; i++)
	    	{
//	    		if (matchMatrix[a][i] > currentBestMatchCount)
//	    		{
	    			currentBestMatchCount = (int)matchMatrix[a][i];
	    			currentBestMatchIndex = i;
	    			bestMatchArray.add(new int[]{currentBestMatchIndex,currentBestMatchCount});
//	    		}
	    	}
	    	Collections.sort(bestMatchArray, new Comparator<int[]>()
			{

				public int compare(int[] o1, int[] o2)
				{
					if (o1[1]<o2[1])
						return 1;
					else if (o1[1]>o2[1])
						return -1;
					return 0;
				}

			});
	    	
	    	
	    	logger.info("animal files size:" + animalFiles.size());
	    	logger.info("");
	    	
	    	
	    	
			bw.write("Checking " + animalFiles.get(a).getName() + ":");
			bw.newLine();

	    	
	    	Mat cdMat = new Mat(aImg[a].height()+30, aImg[a].width()*6 + 40, CvType.CV_8U);
	    	aImg[a].copyTo(cdMat.rowRange(0, aImg[a].rows()).colRange(0, aImg[a].cols()));
			Core.putText(cdMat, animalFiles.get(a).getName(), new Point(0d, (double)(aImg[a].rows())+12d), Core.FONT_HERSHEY_SIMPLEX, .3, new Scalar(255, 255, 255));
	    	for (int n = 0; n < nBestMatches; n++)
	    	{
	    		int cbm = bestMatchArray.get(n)[0];
	    		bestMatches[a][n] = cbm;
	    		logger.info(animalFiles.get(a).getName() + "=" + animalFiles.get(cbm).getName() + " ( " + bestMatchArray.get(n)[1] + " matches )");
	    		
	    		if (!animalFiles.get(a).getName().equals(animalFiles.get(cbm).getName()))
	    		{
		    		bw.write(animalFiles.get(a).getName() + "=" + animalFiles.get(cbm).getName() + " ( " + bestMatchArray.get(n)[1] + " matches )");
		    		bw.newLine();
	    		}
	    		
	    		if ((n>0) && (n<6))
	    		{
	    			aImg[cbm].copyTo(cdMat.rowRange(0, aImg[a].rows()).colRange((n)*(aImg[a].cols()), (n+1)*(aImg[a].cols()) ));
	    			Core.putText(cdMat, animalFiles.get(cbm).getName(), new Point((double)((n)*(aImg[a].cols())), (double)(aImg[a].rows())+12d), Core.FONT_HERSHEY_SIMPLEX, .3, new Scalar(255, 255, 255));
	    		}
	    	}
	    	Highgui.imwrite(animalFiles.get(a).toString() + ".compare.png" , cdMat);
	    	logger.info(" ");
	    	bw.newLine();
	    	
	    	for (int i = 0; i < k; i++)
	    	{
	    		maxVal = Math.max(maxVal,codebook[a][i]);
	    		minVal = Math.min(minVal,codebook[a][i]);
	    	}
	    	for (int i = 0; i < k; i++)
	    		codebook[a][i] = (codebook[a][i] - minVal) / (maxVal-minVal);
		}
	    
	    //close file again
	    try
		{
			bw.close();
		} catch (IOException e)
		{
			e.printStackTrace();
		}
	    
	    
	    for (int i = 0; i < numAnimals; i++)
	    {	 
	    	for (int j = 0; j < numAnimals; j++)
	    	{
	    		maxValMM = Math.max(maxValMM,matchMatrix[i][j]);
	    		minValMM = Math.min(minValMM,matchMatrix[i][j]);
//	    		matchMatrix1D[i*numAnimals + j] = distances2D[a][a2] * 40d;
	    	}
	    }
//	    logger.info("min: " + minValMM + "\t max: " + maxValMM);
	    for (int i = 0; i < numAnimals; i++)
	    {	 
	    	for (int j = 0; j < numAnimals; j++)
	    	{
	    		matchMatrix1D[i*numAnimals + j] = (matchMatrix[i][j]-minValMM) / (maxValMM-minValMM) * 255d;
	    		
	    	}
	    }
	    
	    Mat cdMat = new Mat(numAnimals, numAnimals, CvType.CV_8U);
		cdMat.put(0, 0, matchMatrix1D);
		Imgproc.resize(cdMat, cdMat, new Size(numAnimals * 15, numAnimals * 15), 2d, 2d, Imgproc.INTER_NEAREST);
		OpenCVUtils.imshow("response kmeans", cdMat);
		
		Highgui.imwrite(osBaseDir+method+"_kmeans_" + k + "n_" + maxKn + ".png", cdMat);
		
		int maxGM = Integer.MIN_VALUE;
		int minGM = Integer.MAX_VALUE;
		for (int m = 0; m < numAnimals; m++)
		{
			for (int n = 0; n < m; n++)
			{
				matches = new ArrayList<MatOfDMatch>();
//				List<MatOfDMatch> matches = new ArrayList<MatOfDMatch>();
				matcher.knnMatch(aDescriptors[m], aDescriptors[n], matches, maxKn2);
				
				numMatches[m][n] = matches.size();
//				logger.info("matches: " + matches.size());
				
				Mat outImg = new Mat();
				// logger.info(matchesList.toString());
				double min_dist = Double.MAX_VALUE;
				double max_dist = Double.MIN_VALUE;
				
				
				List<MatOfDMatch> newMatchesList = new ArrayList<MatOfDMatch>();
				int c = 0;
				List<DMatch> newDMatchList = new LinkedList<DMatch>();
				
				

				for (MatOfDMatch match : matches)
				{
					
					DMatch[] mar = match.toArray();
					
					MatOfDMatch newMODM = new MatOfDMatch();
					for (int i = 0; i < mar.length; i++)
					{
						if (mar[i].distance<distLimit)
						{
							newDMatchList.add(mar[i]);
							numGoodMatches[m][n]++;
							maxGM = Math.max(maxGM,numGoodMatches[m][n]);
							minGM = Math.min(minGM,numGoodMatches[m][n]);
						}
						if (mar[i].distance < min_dist)
							min_dist = mar[i].distance;
						if (mar[i].distance > max_dist)
							max_dist = mar[i].distance;
					}
					if (newDMatchList.size()>0)
					{
						newMODM.fromList(newDMatchList);
						newMatchesList.add(newMODM);
					}
				}
				
			}
		}
		for (int m = 0; m < numAnimals; m++)
			for (int n = 0; n < numAnimals; n++)
			{
				numGoodMatches1D[m*numAnimals + n] = (double)(numGoodMatches[m][n]-minGM)/(double)(maxGM-minGM)*255d;
			}
		
		long timeTook = System.nanoTime() - timebefore;
		logger.info("time took: " +timeTook/1000000 + "ms");
	    Mat cdMat2 = new Mat(numAnimals, numAnimals, CvType.CV_8U);
		cdMat2.put(0, 0, numGoodMatches1D);
		Imgproc.resize(cdMat2, cdMat2, new Size(numAnimals * 15, numAnimals * 15), 2d, 2d, Imgproc.INTER_NEAREST);
//		OpenCVUtils.imshow("response direct comparison", cdMat2);
		Highgui.imwrite(osBaseDir+method+"_directcmp_"+distLimit+"_km_" + maxKn2 + ".png", cdMat2);

		
	    if (!codeBookFile.exists())	    
	    	OpenCVUtils.saveMatToFile(codeBookFile, centers);
		
		return codebook;
	
	}

	public static HashMap<String, Integer> readCSV(String csvFile,String cvsSplitBy)
	{
		HashMap<String, Integer> idMap = new HashMap<String, Integer>();
		BufferedReader br = null;
		String line = "";

		int currentLine = -1;
		try
		{
			br = new BufferedReader(new FileReader(csvFile));
			while ((line = br.readLine()) != null)
			{
				currentLine++;
				if (currentLine==0)
					continue;
				
				logger.info(currentLine + ": " + line);
				// use comma as separator
				String[] splittedLine = line.split(cvsSplitBy);
				int id = Integer.valueOf(splittedLine[1].split("\\.")[0].substring(2));
				idMap.put(splittedLine[0], id);
				if (!individuals.contains(id))
					individuals.add(id);
			}

		} catch (FileNotFoundException e)
		{
			e.printStackTrace();
		} catch (IOException e)
		{
			e.printStackTrace();
		} finally
		{
			if (br != null)
			{
				try
				{
					br.close();
				} catch (IOException e)
				{
					e.printStackTrace();
				}
			}
		}
		return idMap;


	}

}
