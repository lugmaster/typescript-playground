let firstGenerationSize: number = 2;
let childrenPGen: number = 5;
let maxGenerations: number = 48;
let generationNumberToFind: number = 100;
let firstbornOfLastGenerationReached: boolean = false;
let sequence: number[] = generateIdSequence(1000);

run();

function run() {
    console.log('Start - initNodes');
    let nodes = initNodes();

    // console.log('Printing Nodes:');
    // //printNodes(nodes, 0);

    // console.log('Creating/Printing IdMap: ');
    let idMap = createIdMap(nodes, new Map<number, MyNode>());
    // printIdMap(idMap);

    console.log('Finding Node:');
    let flatNodes = createArrayFromMap(idMap);
    // console.log('flatNodes');
    // console.log(flatNodes);
    console.log(findeNode(flatNodes));

    // console.log('Creating Json: ');
    // console.log(createJSON(flatNodes));

    console.log('End');
}

function findeNode(nodes: Array<MyFlatNode>): MyFlatNode {
    let parentGeneration = new Map<number, Set<number>>();
    let childGeneration;
    let goalNode: MyFlatNode;

    //transform array into initialmap
    for (let i = 0; i < nodes.length; i++) {
        parentGeneration.set(nodes[i].id, new Set(nodes[i].children));
    }

    //clone map for to prevent confusing if/else on first iteration
    childGeneration = new Map(parentGeneration);
    //Add children´s childrenIds to parent ids
    console.log('childGeneration BF');
    console.log(childGeneration);

    let maxPopulationReached: boolean;
    let doWhileCounter: number = 0;
    do {
        maxPopulationReached = true;
        // console.log('doWhileCounter ' + doWhileCounter);
        for (let [id, children] of parentGeneration) {
            // console.log('Id ' + id);
            // console.log('childGeneration BF');
            // console.log(childGeneration);
            children.forEach(childId => {
                // console.log('childId ' + childId);
                parentGeneration.get(childId).forEach(childrensChildId => {
                    // console.log('childrensChildId ' + childrensChildId);
                    childGeneration.get(id).add(childrensChildId);
                })
            });
            // console.log('childGeneration AF');
            // console.log(childGeneration);
            // console.log('#######################');
            // console.log('#######################');
            // console.log('#######################');
        }
        let setsAreUnequal: boolean = false;
        for (let [id] of parentGeneration) {
            let setParent = parentGeneration.get(id);
            let setChild = childGeneration.get(id);

            setsAreUnequal = !(
                setParent.size === setChild.size &&
                [...setParent].every((value) => setChild.has(value))
            );
            // console.log('setsAreUnequal? ' + setsAreUnequal);
            if (setsAreUnequal) {
                maxPopulationReached = false;
                break;
            }
        }
        parentGeneration = new Map(childGeneration);
        doWhileCounter++;

    } while (!maxPopulationReached);


    //Search for node and log
    for (let [id, children] of parentGeneration) {
        // console.log('End of line reached!');
        // console.log('(' + id + ')(' + children + '), Size: ' + children.size);
        if (children.size === generationNumberToFind) {
            console.log('Element found!');
            goalNode = nodes.find((item) => item.id === id);
            console.log(goalNode);
        }
    }

    return goalNode;
}

function initNodes(): Array<MyNode> {
    let nodes = new Array<MyNode>();
    for (let i = 0; i < firstGenerationSize; i++) {
        nodes.push(generateNode(0));
    }
    return nodes;
}

interface MyNode {
    id: number;
    children: Array<MyNode>;
    generation: number;
}

interface MyFlatNode {
    id: number;
    children: number[];
    generation: number;
}

function generateIdSequence(size: number): Array<number> {
    let idSequence = new Array<number>();
    for (let i = 0; i < size; i++) {
        idSequence.push(i);
    }
    return idSequence;
}

function printNodes(nodes: Array<MyNode>, generation: number): void {
    console.log('Printing Generation ' + generation + ':');
    for (let i = 0; i < nodes.length; i++) {
        console.log(nodes[i]);
        if (nodes[i].children !== null) {
            for (let k = 0; k < nodes[i].children.length; k++) {
                printNodes(nodes[i].children, generation + 1);
            }
        }
    }
}

function getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
}

function generateNode(generation: number): MyNode {
    let node = {
        id: sequence.pop(),
        children: null,
        generation: generation,
    } as MyNode;

    if (generation === maxGenerations) {
        console.log(
            'Reached last Generation( ' +
            generation +
            ' / ' +
            maxGenerations +
            ' ) - Stopping'
        );
        firstbornOfLastGenerationReached = true;
    }

    if (generation !== maxGenerations && !firstbornOfLastGenerationReached) {
        if (generation < 3) {
            node.children = new Array<MyNode>(generation + 1);
        } else {
            node.children = new Array<MyNode>(getRandomInt(childrenPGen));
        }
        for (let i = 0; i < node.children.length; i++) {
            node.children[i] = generateNode(generation + 1);
        }
    }
    return node;
}

function createIdMap(nodes: Array<MyNode>, idMap: Map<number, MyNode>): Map<number, MyNode> {
    for (let i = 0; i < nodes.length; i++) {
        if (idMap.has(nodes[i].id)) {
            console.log('Duplicate found! -> ' + nodes[i]);
        } else {
            idMap.set(nodes[i].id, nodes[i]);
        }
        if (nodes[i].children != null) {
            idMap = createIdMap(nodes[i].children, idMap);
        }
    }
    return idMap;
}

function printIdMap(idMap: Map<number, MyNode>) {
    for (let [key, value] of idMap) {
        console.log(key, value);
    }
}

function createArrayFromMap(idMap: Map<number, MyNode>): Array<MyFlatNode> {
    let flatNodes = new Array<MyFlatNode>();
    for (let [key, value] of idMap) {
        let flatNode = {
            id: key,
            children: undefined,
            generation: value.generation,
        } as MyFlatNode;
        if (value.children !== null) {
            flatNode.children = value.children.map(function (child: { id: number }) {
                return child.id;
            });
        }
        flatNodes.push(flatNode);
    }
    return flatNodes;
}

function createJSON(obj: any) {
    return JSON.stringify(obj);
}
