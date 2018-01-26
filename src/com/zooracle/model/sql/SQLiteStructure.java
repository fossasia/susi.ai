package com.zooracle.model.sql;

import java.io.File;
import java.util.ArrayList;

import com.zooracle.model.ColorRange;

public class SQLiteStructure
{
//	public static SQLColumn columnTitle = new SQLColumn("title", String.class, "");

	public static String tableAgeClass = "ageclass";
	public static String tableColorSelection = "colorselection";
	public static String tableDbInformation = "dbinformation";
	public static String tableImageSettings = "imagesettings";
	public static String tableIndividual = "individual";
	public static String tableMatchingModel = "matchingmodel";
	public static String tableMetaData = "metadata";
	public static String tableModel = "model";
	public static String tablePopulation = "population";
	public static String tableRelationVer = "relationver";
	public static String tableRelKMeta = "relkmeta";
	public static String tableRelMetaInd = "relmetaind";
	public static String tableToadData = "toaddata";
	
	public static String columnTitle = "title";
	public static String columnType = "type";
	public static String columnComment = "comment";
	public static String columnValidFrom = "validFrom";
	public static String columnValidUntil = "validUntil";
	public static String columnImagePath = "imagePath";
	public static String columnFileName = "fileName";
	public static String columnZooName = "zooName";
	public static String columnAltName = "altName";
	public static String columnView = "view";
	public static String columnGpsLat = "gpsLat";
	public static String columnGpsLon = "gpsLon";
	public static String columnMetadataId = "metadataId";
	public static String columnId = "id";
	public static String columnIndividualId = "individualId"; 
	public static String columnImagesettingsId = "imagesettingsId";
	public static String columnName = "name";
	public static String columnGender = "gender";
	public static String columnSize1 = "size1";
	public static String columnSize2 = "size2";
	public static String columnWeight = "weight";
	public static String columnAgeClass = "ageClass";
	public static String columnZoom = "zoom";
	public static String columnAngle= "angle";
	public static String columnPosX= "posX";
	public static String columnPosY= "posY";
	public static String columnImgOffsetX= "imgOffsetX";
	public static String columnImgOffsetY= "imgOffsetY";
	public static String columnContrast= "contrast";
	public static String columnBrightness= "brightness";
	public static String columnCustomParam1= "customParam1";
	public static String columnCustomParam2= "customParam2";
	public static String columnCustomParam3= "customParam3";
	public static String columnBlur = "blur";
	public static String columnBlurSize = "blurSize";
	public static String columnMode = "mode";
	public static String columnHueLow = "hueLow";
	public static String columnSatLow = "satLow";
	public static String columnValLow = "valLow";
	public static String columnHueHigh = "hueHigh";
	public static String columnSatHigh = "satHigh";
	public static String columnValHigh = "valHigh";
	public static String columnFeather = "feather";
	public static String columnThumbnail = "thumbnail";
	public static String columnPopulationId = "populationId";
	
	public static String[] metaDataColumns = {columnId,columnValidFrom,columnValidUntil,columnZooName,columnAltName,columnView,columnIndividualId,columnComment,columnGpsLat,columnGpsLon,columnFileName,columnThumbnail};
	public static String[] toadDataColumns = {columnId,columnMetadataId,columnPopulationId,columnSize1,columnSize2,columnWeight,columnAgeClass};
	public static String[] imageSettingsColumns = {columnId,"imgOffsetX","imgOffsetY","posX","posY","zoom","angle","blurSize","contrast","brightness","customParam1","customParam2","customParam3","metadataId","validUntil"};
	public static String[] colorSelectionColumns = {columnId,"imagesettingsId","hueLow","hueHigh","satLow","satHigh","valLow","valHigh","mode","validUntil","feather"};
	public static String[] individualColumns = {"id","name","gender","validFrom","validUntil","comment"};
	
	
	
	//table matchingmodel
	public static String columnK = "k";
	public static String columnKMax = "kmax";
	public static String columnNumPhotos = "numphotos"; 
	public static String columnCentroids = "centroids";
	public static String columnLabels = "labels"; 
	
	//table relkmeta
	public static String columnModelId = "modelId";
	
	//table relmetaind
	public static String columnVersionId = 	"versionId";
	
	//table  ageclass
	public static String columnDescription = "description";

	 

}
