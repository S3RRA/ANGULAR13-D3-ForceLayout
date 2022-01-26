import { Component, OnInit } from '@angular/core';

import { forceSimulation, forceLink, forceManyBody, forceCenter, drag, zoom } from 'd3';
import * as d3 from 'd3-selection';
import { links, nodes, MANY_BODY_STRENGTH } from './data';

@Component({
  selector: 'app-network-graph',
  templateUrl: './network-graph.component.html',
  styles: []
})
export class NetworkGraphComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    const svg = d3.select('#container');

    const width = 1500;
    const height = 1000;
    const centerX = width/2;
    const centerY = height/2;

    let linkedByIndex: any = {};

    const simulation = forceSimulation(nodes)
      .force('charge', forceManyBody().strength(MANY_BODY_STRENGTH))
      .force('link', forceLink(links).distance(((link: any) => link.distance) as any))
      .force('center', forceCenter(centerX, centerY));
    
    const dragInteraction: any = drag().on('drag', (event: any, node: any) => {
      node.fx = event.x;
      node.fy = event.y;
      simulation.alpha(1);
      simulation.restart();
    });

    const lines = svg
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', ((link: any) => link.color || 'black') as any);

    for(let link of links){
      linkedByIndex[link.source.index + "," + link.target.index] = 1;
      linkedByIndex[link.target.index + "," + link.source.index] = 1;
    }

    const circles = svg
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('fill', ((node: any) => node.color || 'gray') as any)
      .attr('r', ((node: any) => node.size) as any)
      .call(dragInteraction)
      .on("mouseover", mouseover)
      .on("mouseout", (node:any) => mouseout(node))
      .on("contextmenu", (node:any) =>  alert(JSON.stringify(node.srcElement.__data__)));
    
    const text = svg
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('text-anchor', ('middle') as any)
      .attr('alignment-baseline', ('middle') as any)
      .style('pointer-events', ('none') as any)
      .text( (node: any) => node.id );
    
    //Legend
    let legendIconX = 10;
    let legendIconY = 10;
    let legendTextX = 20;
    let legentTextY = 20;
    for(let node of nodes){
      if(node.id){
        svg
          .append("circle")
          .attr("cx",legendIconX)
          .attr("cy",legendIconY)
          .attr("r", 6)
          .style("fill", node.color)
        svg
          .append("text")
          .attr("x", legendTextX)
          .attr("y", legentTextY)
          .attr("alignment-baseline","middle")
          .text(node.id)
          .style("font-size", "15px")
          .style('pointer-events', ('none') as any)
        legendIconY = legentTextY += 18;
      }
    } 
    
    simulation.on('tick', () => {
      let margin = 20;
        circles
          .attr('cx', ((node: any) => Math.max(margin, Math.min(width - margin, node.x))) as any)
          .attr('cy', ((node: any) => Math.max(margin, Math.min(height - margin, node.y))) as any);
        
        text
          .attr('x', ((node: any) => node.x) as any)
          .attr('y', ((node: any) => node.y) as any);
   
        lines
          .attr('x1', ((link: any) => link.source.x) as any)
          .attr('y1', ((link: any) => link.source.y) as any)
          .attr('x2', ((link: any) => link.target.x) as any)
          .attr('y2', ((link: any) => link.target.y) as any)
      });

    function neighboring(a: any, b: any) {
      return linkedByIndex[a.index + "," + b.index] || a.source.id === b.id;
    }

    function mouseover(d: any) {
        lines
          .attr("stroke","black")
          .attr("stroke-width",2);
        lines
          .transition()
          .duration(500)
          .style("opacity", function(o: any) {
              return o.source.id === d.srcElement.__data__.id || o.target.id === d.srcElement.__data__.id ? 1 : .1;
          });
        circles
          .transition()
          .duration(500)
          .style("opacity", function(o: any) {
            let relatedNodes = getLinks(d.srcElement.__data__);
            relatedNodes.push(d.srcElement.__data__.id);
            return relatedNodes.includes(o.id) ? 1 : .1;
        });
    }

    function mouseout(d: any) { 
      lines
        .attr('stroke', ((line: any) => line.color) as any );
      lines
        .transition()
        .duration(500)
        .style("opacity", 1);
      circles
        .attr('fill', ((node: any) => node.color || 'gray') as any)
        .attr('r', ((node: any) => node.size) as any)
      circles
        .transition()
        .duration(500)
        .style("opacity", 1);
     }

   /* function zoomed() {
      svg.attr("transform", "translate(" +  + ")scale(" + event.scale + ")");
     }
*/
    function getLinks(o: any){
      const result = [];
      for(let link of links){
        if(link.source.id === o.id){
          result.push(link.target.id);
        }
        if(link.target.id === o.id){
          result.push(link.source.id);
        }
      }
      return result;
    }

    
  }

  

}
