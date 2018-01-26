package com.zooracle.model;

import java.util.ArrayList;
import java.util.List;

import org.opencv.core.Mat;
import org.opencv.core.MatOfDMatch;
import org.opencv.core.MatOfKeyPoint;
import org.opencv.core.TermCriteria;
import org.opencv.features2d.DescriptorExtractor;
import org.opencv.features2d.DescriptorMatcher;
import org.opencv.features2d.FeatureDetector;

public class KMeansMatchingModel implements MatchingModel
{
	private int id;
	private int k;
	private int maxKn;
	private int numPhotos;
	
	private Mat centroids;
	private Mat labels;
	private ArrayList<Integer> descriptorLabels;
	private ArrayList<ArrayList<Integer>> clusterImageMap;
	private MatOfKeyPoint[] keypoints;
	private Mat[] descriptors;
	private TermCriteria criteria;
	private int nBestMatches = 10;

	private double matchMatrix[][];
	
	private String modelName;

	/**
	 * 
	 * centroid -> k -> labels -> metadata ids
	 */
	public KMeansMatchingModel(String name, int k, int kMax)
	{
		this.modelName = name;
		this.k = k;
		this.maxKn = kMax;
		clusterImageMap = new ArrayList<ArrayList<Integer>>();

	}

	public int getK()
	{
		return k;
	}

	public void setK(int k)
	{
		this.k = k;
	}

	public int getMaxKn()
	{
		return maxKn;
	}

	public void setMaxKn(int maxKn)
	{
		this.maxKn = maxKn;
	}

	public int getNumPhotos()
	{
		return numPhotos;
	}

	public void setNumPhotos(int numPhotos)
	{
		this.numPhotos = numPhotos;
	}

	public Mat getCentroids()
	{
		return centroids;
	}

	public void setCentroids(Mat centroids)
	{
		this.centroids = centroids;
	}

	public Mat getLabels()
	{
		return labels;
	}

	public void setLabels(Mat labels)
	{
		this.labels = labels;
	}

	public ArrayList<Integer> getDescriptorLabels()
	{
		return descriptorLabels;
	}

	public void setDescriptorLabels(ArrayList<Integer> descriptorLabels)
	{
		this.descriptorLabels = descriptorLabels;
	}

	public ArrayList<ArrayList<Integer>> getClusterImageMap()
	{
		return clusterImageMap;
	}

	public void setClusterImageMap(ArrayList<ArrayList<Integer>> clusterImageMap)
	{
		this.clusterImageMap = clusterImageMap;
	}

	public TermCriteria getCriteria()
	{
		return criteria;
	}

	public void setCriteria(TermCriteria criteria)
	{
		this.criteria = criteria;
	}

	public double[][] getMatchMatrix()
	{
		return matchMatrix;
	}

	public void setMatchMatrix(double[][] matchMatrix)
	{
		this.matchMatrix = matchMatrix;
	}

	public MatOfKeyPoint[] getKeypoints()
	{
		return keypoints;
	}

	public void setKeypoints(MatOfKeyPoint[] keypoints)
	{
		this.keypoints = keypoints;
	}

	public Mat[] getDescriptors()
	{
		return descriptors;
	}

	public void setDescriptors(Mat[] descriptors)
	{
		this.descriptors = descriptors;
	}
	
	public int getnBestMatches()
	{
		return nBestMatches;
	}
	
	public void setnBestMatches(int nBestMatches)
	{
		this.nBestMatches = nBestMatches;
	}

	

}
