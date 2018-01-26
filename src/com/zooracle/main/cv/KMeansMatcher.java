package com.zooracle.main.cv;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfDMatch;
import org.opencv.core.MatOfKeyPoint;
import org.opencv.core.Size;
import org.opencv.core.TermCriteria;
import org.opencv.features2d.DMatch;
import org.opencv.features2d.DescriptorExtractor;
import org.opencv.features2d.DescriptorMatcher;
import org.opencv.features2d.FeatureDetector;
import org.opencv.highgui.Highgui;
import org.opencv.imgproc.Imgproc;

import com.zooracle.model.KMeansMatchingModel;
import com.zooracle.model.MetaData;
import com.zooracle.model.Range;

import tools.OpenCVUtils;

public class KMeansMatcher
{

	private String modelName;

	private int k;
	private int kMax;

	private FeatureDetector featureDetector;
	private DescriptorExtractor descriptorExtractor;
	private DescriptorMatcher matcher;

	private Mat queryImage = null;
	private Mat queryImageDescriptors;
	private MatOfKeyPoint queryImageKeypoints;
	private KMeansMatchingModel model;
	private int numPhotos;

	public KMeansMatcher()
	{
		model = null;
		featureDetector = FeatureDetector.create(FeatureDetector.PYRAMID_ORB);
		descriptorExtractor = DescriptorExtractor.create(DescriptorExtractor.BRIEF);
		matcher = DescriptorMatcher.create(DescriptorMatcher.BRUTEFORCE_SL2);
	}

	public void setModel(KMeansMatchingModel model)
	{
		this.model = model;
		this.numPhotos = model.getNumPhotos();
		this.k = model.getK();
		this.kMax = model.getMaxKn();
	}

	public void computeModel(ArrayList<MetaData> photos)
	{
		numPhotos = photos.size();
		model.setNumPhotos(numPhotos);

		MatOfKeyPoint[] keypoints = new MatOfKeyPoint[numPhotos];
		Mat[] descriptors = new Mat[numPhotos];
		Mat allDescriptors = new Mat();
		ArrayList<Integer> descriptorLabels = new ArrayList<Integer>();

		// compute keypoints and descriptors
		Mat currentImg = null;
		for (int a = 0; a < numPhotos; a++)
		{
			// System.out.println("now:" + animalFiles.get(a));
			currentImg = Highgui.imread(photos.get(a).getZooName().toString(), 0);
			Imgproc.resize(currentImg, currentImg, new Size(150, 250));
			Imgproc.equalizeHist(currentImg, currentImg);
			Imgproc.threshold(currentImg, currentImg, 127, 255, Imgproc.THRESH_BINARY);

			featureDetector.detect(currentImg, keypoints[a]);
			descriptorExtractor.compute(currentImg, keypoints[a], descriptors[a]);

			allDescriptors.push_back(descriptors[a]);

			for (int i = 0; i < descriptors[a].rows(); i++)
				descriptorLabels.add(a);
		}
		System.out.println("label size:" + descriptorLabels.size());

		Mat clusterLabels = new Mat();
		Mat centers = new Mat();

		// set up all desriptors, init criteria
		allDescriptors.convertTo(allDescriptors, CvType.CV_32F);
		TermCriteria criteria = new TermCriteria(TermCriteria.EPS + TermCriteria.MAX_ITER, 100, 0.1);
		long before = System.currentTimeMillis();
		
		// compute clusters
		System.out.print("creating kmeans clusters...");
		Core.kmeans(allDescriptors, k, clusterLabels, criteria, 10, Core.KMEANS_PP_CENTERS, centers);
		System.out.println("done.");

		// map k-means centroid labels to descriptors of all images
		ArrayList<ArrayList<Integer>> clusterImageMap = new ArrayList<ArrayList<Integer>>();
		for (int nk = 0; nk < k + 1; nk++)
			clusterImageMap.add(new ArrayList<Integer>());
		for (int r = 0; r < clusterLabels.rows(); r++)
			clusterImageMap.get((int) clusterLabels.get(r, 0)[0]).add(descriptorLabels.get(r));

		model.setCentroids(centers);
		model.setLabels(clusterLabels);
		model.setClusterImageMap(clusterImageMap);
		model.setKeypoints(keypoints);
		model.setDescriptors(descriptors);

	}

	public void setQueryImage(MetaData metaData)
	{
		this.queryImage = Highgui.imread(metaData.getZooName().toString(), 0);
	}

	public ArrayList<int[]> getBestMatches()
	{
		
		List<MatOfDMatch> matches = new ArrayList<MatOfDMatch>();
		int[] matchMatrix = new int[numPhotos];
	    ArrayList<ArrayList<Integer>> clusterImageMap = model.getClusterImageMap();
	    ArrayList<int[]> bestMatchArray = new ArrayList<int[]>();
	    
		//get current query image keypoints and descriptors, match with k-means centroid descriptors
		featureDetector.detect(queryImage, queryImageKeypoints);
		descriptorExtractor.compute(queryImage, queryImageKeypoints, queryImageDescriptors);
		matcher.knnMatch(queryImageDescriptors, model.getCentroids(), matches, (int) kMax);
		for (MatOfDMatch mdm : matches)
		{
			for (DMatch dm : mdm.toList())
			{
				int detectedKIndex = dm.trainIdx;
				for (int photoIndex : clusterImageMap.get(detectedKIndex))
					matchMatrix[photoIndex]++;
			}
		}

		//compute n best matches
		int currentBestMatchCount = -1;
		int currentBestMatchIndex = -1;
		for (int i = 0; i < numPhotos; i++)
		{
			currentBestMatchCount = (int) matchMatrix[i];
			currentBestMatchIndex = i;
			bestMatchArray.add(new int[] { currentBestMatchIndex, currentBestMatchCount });
		}
		Collections.sort(bestMatchArray, new Comparator<int[]>()
		{
			public int compare(int[] o1, int[] o2)
			{
				if (o1[1] < o2[1])
					return 1;
				else if (o1[1] > o2[1])
					return -1;
				return 0;
			}
		});
		
		return bestMatchArray;
	}

}
