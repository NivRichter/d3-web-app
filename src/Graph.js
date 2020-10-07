import React, { Component } from "react";
import * as d3 from 'd3'
import { Container,Card } from "react-bootstrap";
import { Row, Col, Navbar } from 'react-bootstrap';

class Graph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jsonData:{},
            diseaseName:''
        }
      }

      componentDidUpdate(){

        this.makeGraph(this.props.jsonData, this.props.diseaseName, this.props.proteins, this.props.drugs);

      }


    render() {
        d3.selectAll("svg > *").remove();

        //console.log(`data: ${this.props.proteins}`)

        return (
                <Row >
                    <Col >
                        <svg className = 'GraphSvg' 
                           style={{ backgroundColor: 'white',  height: '1080px', width: '100%', overflow: 'auto',
                           border: '3px solid green' }}
                            ref='canvas'>
                    

                        </svg>
                    </Col>
                </Row>
   
       
        );
    }


    makeGraph(data, diseaseName, prots,drugs) {
       // console.log('disease :' + diseaseName + ' prots: ' + prots)
                if(data.hasOwnProperty(diseaseName)) { 
                    console.log('starting to paint graph...')
                    let nodes = []
                    let links = []
                    let i = 1
                    nodes.push({id:diseaseName, name:diseaseName, type:"disease"})
                    
                 
                    for(var protein in prots) {
                        nodes.push({id:prots[protein],name:prots[protein], type:"protein"})
                        links.push({target:prots[protein], source:diseaseName})
                        //console.log('protein: ' + prots[protein] + ' drugs: ' + drugs[prots[protein]])
                        if(drugs[prots[protein]].length < 10)
                        { 
                           for(var drug in drugs[prots[protein]]){
                            let drugName = drugs[prots[protein]][drug]
                            nodes.push({id:`${drugName}${i}`, name:drugName, type:'drug'})
                            links.push({target: `${drugName}${i}`, source: prots[protein]})
                            i++}

                        }
                    }
                var width = window.innerWidth //window.innerWidth
                var height = window.innerHeight + 400 //window.innerHeight


                var svg = d3.select(this.refs.canvas).attr('viewbox',[0,0,width,height])
            
               /*
                svg.call(d3.zoom()
                    //.extent([[0, 0], [width, height]])
                    .scaleExtent([1, 8])
                    .on("zoom", zoomed));
                */
/*
                function zoomed({transform}) {
                    nodeElementsProteins.attr("transform", d => `translate(${transform.apply(d)})`);
                    nodeElementsDiseases.attr("transform", d => `translate(${transform.apply(d)})`);    
                    nodeElementsDrugs.attr("transform", d => `translate(${transform.apply(d)})`);
                }
                    
                */
                var linkForce = d3
                .forceLink()
                .id(function (link) { return link.id })

                // simulation setup with all forces
                var simulation = d3
                .forceSimulation()
                .force('charge', d3.forceManyBody().strength(-300))
                .force('center', d3.forceCenter(width / 2, height / 2))
                .force('link',linkForce)

                var linkElements = svg.append("g")
                    .attr("class", "links")
                    .selectAll("line")
                    .data(links)
                    .enter().append("line")
                    .attr("stroke-dasharray", 3)
                        .attr("stroke", "rgba(50, 50, 50, 0.4)")

                function getNodeColor(node) {
                return node.type === 'disease' ? 'red' :
                node.type === 'protein' ? 'blue' : 'green'
                }

                function getProteins(nodesList) {
                    return nodesList.filter((n) => n.type === 'protein');
                }
                function getDiseases(nodesList) {
                        return nodesList.filter((n) => n.type === 'disease');
                }
                function getDrugs(nodesList) {
                    return nodesList.filter((n) => n.type === 'drug');
                }
                var nodeElementsProteins = svg.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(getProteins(nodes))
                .enter().append("circle")
                    .attr("r", 8)
                    .attr("fill", getNodeColor)
                    .on("mouseover", function (d) {
                        d3.select(this).style("fill", "yellow")
                    }).on("mouseout", function (d) {
                        d3.select(this).style("fill", "blue")
                    })
                    

                var nodeElementsDiseases = svg.append("g")
                    .attr("class", "nodes")
                    .selectAll("rect")
                    .data(getDiseases(nodes))
                    .enter().append("rect")
                    .attr("width", 20)
                    .attr("height", 20)
                    .attr("fill", getNodeColor)
                    .on("mouseover", function (d) {
                        d3.select(this).style("fill", "yellow")
                    }).on("mouseout", function (d) {
                        d3.select(this).style("fill", "red")
                    })

                var nodeElementsDrugs = svg.append("g")
                    .attr("class", "nodes")
                    .selectAll("circle")
                    .data(getDrugs(nodes))
                    .enter().append("circle")
                        .attr("r", 6)
                        .attr("fill", getNodeColor)
                    .on("mouseover", function (d) {
                        d3.select(this).style("fill", "yellow")
                    }).on("mouseout", function (d) {
                        d3.select(this).style("fill", "#348017")
                    })
                    

                var textElements = svg.append("g")
                .attr("class", "texts")
                .selectAll("text")
                .data(nodes)
                .enter().append("text")
                    .text(function (node) { return  node.name })
                    .attr("font-size", 11)
                    .attr("dx", 15)
                    .attr("dy", 4)
                    .attr("fill", getNodeColor)
                    .attr("font-weight","bold")


                simulation.nodes(nodes).on('tick', () => {
                    nodeElementsProteins
                    .attr('cx', function (node) { return node.x })
                    .attr('cy', function (node) { return node.y })
                nodeElementsDiseases
                    .attr('x', function (node) { return node.x })
                    .attr('y', function (node) { return node.y })

                    nodeElementsDrugs
                    .attr('cx', function (node) { return node.x })
                    .attr('cy', function (node) { return node.y })

                    
                    textElements
                    .attr('x', function (node) { return node.x })
                    .attr('y', function (node) { return node.y })
                    linkElements
                        .attr('x1', function (link) { return link.source.x })
                        .attr('y1', function (link) { return link.source.y })
                        .attr('x2', function (link) { return link.target.x })
                        .attr('y2', function (link) { return link.target.y })
                })

                simulation.force('link').links(links);
                }
                else{
                    console.log(` disease ${diseaseName} not found` )
                }
            }
        }
    

export default Graph;
