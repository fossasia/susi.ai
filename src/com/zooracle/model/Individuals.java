package com.zooracle.model;

import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
 
@XmlRootElement(name = "individuals") 
@XmlAccessorType (XmlAccessType.FIELD)
public class Individuals
{
    @XmlElement(name = "individual")
    private List<Individual> individuals = null;
 
    public void setIndividuals(List<Individual> individuals) {
        this.individuals = individuals;
    }

	public List<Individual> getIndividuals() {
		return individuals;
	}
    
    
}
