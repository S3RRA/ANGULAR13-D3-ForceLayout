import { Component, OnInit } from '@angular/core';

import { forceSimulation, forceLink, forceManyBody, forceCenter, drag } from 'd3';
import * as d3 from 'd3-selection';
import { links, nodes, MANY_BODY_STRENGTH } from './data';

@Component({
  selector: 'app-network-graph',
  templateUrl: './network-graph.component.html',
  styles: [
  ]
})
export class NetworkGraphComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    const svg = d3.select('#container');

    const centerX = 950/2;
    const centerY = 500/2;

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

    const circles = svg
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('fill', ((node: any) => node.color || 'gray') as any)
      .attr('r', ((node: any) => node.size) as any)
      .call(dragInteraction);

    
    const text = svg
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('text-anchor', ('middle') as any)
      .attr('alignment-baseline', ('middle') as any)
      .style('pointer-events', ('none') as any)
      .text( (node: any) => node.id );

    simulation.on('tick', () => {
      circles
        .attr('cx', ((node: any) => node.x) as any)
        .attr('cy', ((node: any) => node.y) as any);
      
      text
        .attr('x', ((node: any) => node.x) as any)
        .attr('y', ((node: any) => node.y) as any);
 
      lines
        .attr('x1', ((link: any) => link.source.x) as any)
        .attr('y1', ((link: any) => link.source.y) as any)
        .attr('x2', ((link: any) => link.target.x) as any)
        .attr('y2', ((link: any) => link.target.y) as any)
    });
  }

}
