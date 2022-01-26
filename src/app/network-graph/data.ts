import { colors } from './colors';

export const nodes: any[] = [];
export const links: any[]  = [];

const MAIN_NODE_SIZE = 40;
const CHILD_NODE_SIZE = 15;
const LEAF_NODE_SIZE = 5;

const MAIN_NODE_DISTANCE = 30;
const DEFAULT_DISTANCE = 50;
const LEAF_NODE_DISTANCE = 30;

export const MANY_BODY_STRENGTH = -20;

let i = 0;
const addMainNode = (node: any) => {
    node.size = MAIN_NODE_SIZE;
    node.color = colors[i++][1];
    node.collapsing = 0;
    node.collapsed = false;
    node.type = 'Main'
    nodes.push(node);
};

const addChildNode = (parentNode: any, childNode: any, size: any = CHILD_NODE_SIZE, distance: any = DEFAULT_DISTANCE, node_type: any = '2nd') => {
    childNode.size = size;
    childNode.collapsing = 0;
    childNode.collapsed = false;
    childNode.color = parentNode.color;
    childNode.type = node_type
    nodes.push(childNode);
    links.push({source: parentNode, target: childNode, distance, color: parentNode.color });
};

const assembleChildNode = (parentNode: any, id: any, numLeafs: number = 20) => {
    let childNode = { id };
    addChildNode(parentNode, childNode);
    
    for(let i=0; i<numLeafs; i++){
        addChildNode(childNode, { id:'' }, LEAF_NODE_SIZE, LEAF_NODE_DISTANCE, '3rd');
    }
};

const connectMainNodes = (source: any, target: any) => {
    links.push({
        source,
        target,
        distance: MAIN_NODE_DISTANCE,
        color: source.color
    });
}

//------------------------------------------------------------------------------------

const artsWeb = {id: "Arts Web"};
addMainNode(artsWeb);
assembleChildNode(artsWeb, 'Community Vision');
assembleChildNode(artsWeb, 'Sillicon Valley Creates');

const socialImpactCommons = {id: "Social Impact Commons"};
addMainNode(socialImpactCommons);
assembleChildNode(socialImpactCommons, 'Theatre Bay Area');
assembleChildNode(socialImpactCommons, 'EastSide Arts Alliance');
assembleChildNode(socialImpactCommons, 'Local color');

const communityArts = {id: "Community Arts Stabilization Trust"};
addMainNode(communityArts);
assembleChildNode(communityArts, 'CounterPulse');
assembleChildNode(communityArts, 'Luggage Store Gallery');
assembleChildNode(communityArts, 'Performing Arts Workshop');
assembleChildNode(communityArts, '447 Minna St.', 5);
assembleChildNode(communityArts, 'Keeping Space Oakland');

const ambitioUS = {id:'AmbitioUS'};
addMainNode(ambitioUS);
assembleChildNode(ambitioUS, 'EBPREC', 0);
assembleChildNode(ambitioUS, 'SELC', 0);
assembleChildNode(ambitioUS, 'The Runway Project', 0);
assembleChildNode(ambitioUS, 'Common Future', 0);
assembleChildNode(ambitioUS, 'FreeLancers Union', 0);
assembleChildNode(ambitioUS, 'US Federation of Worker Cooperatives', 0);

for(let i=0; i<nodes.length; i++) {
    nodes[i].collapsing = 0;
    nodes[i].collapsed = false;
  }

connectMainNodes(artsWeb, socialImpactCommons);
connectMainNodes(communityArts, artsWeb);
connectMainNodes(communityArts, socialImpactCommons);
connectMainNodes(ambitioUS, socialImpactCommons);
connectMainNodes(ambitioUS, communityArts);
connectMainNodes(ambitioUS, artsWeb);









