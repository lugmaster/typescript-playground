let firstgenerationSize: number = 1;
let childrenPGen: number = 2;
let maxGenerations: number = 10;
let generationNumbertoFind: number = 10;

var firstbornOfLastGenerationReached: boolean = false;

let sequence: number[] = generateIdSequenz(1000);

run();

function run() {
    console.log('Start - initNodes');
    /*let nodes = initNodes();

    console.log('Printing Nodes:');
    //printNodes(nodes, 0);

    console.log('Creating/Printing IdMap: ');
    let idMap = createIdMap(nodes, new Map<number, MyNode>());
    printIdMap(idMap);

    console.log('Finding Node:');
    let flatNodes = createArrayFromMap(idMap);
    console.log(findeNode(flatNodes));

    console.log('Creating Json: ');
    console.log(createJSON(flatNodes));*/

    console.log('End');
}

//TODO wirte here
function findeNode(nodes: Array<MyFlatNode>): MyFlatNode {
    console.log('nodes');
    console.log(nodes);
    let parents = new Map<number, Set<number>>();
    let goalNode: MyFlatNode;

    //transform array into initialmap
    for (var i = 0; i < nodes.length; i++) {
        if (parents.has(nodes[i].id)) {
            nodes[i].children.forEach((item) => parents.get(nodes[i].id).add(item));
        } else {
            parents.set(nodes[i].id, new Set(nodes[i].children));
        }
    }
    console.log('parents');
    console.log(parents);

    //clone map for to prevent complicatet cloning in the first iteration
    let currentGeneration = new Map(
        JSON.parse(JSON.stringify(Array.from(parents)))
    ) as Map<number, Set<number>>;

    let setsAreUnequal: boolean = true;

    //Add children´s childrenIds to parent ids
    do {
        for (let [id, children] of parents) {
            for (var i = 0; i < children.size; i++) {
                console.log(parents.get(id));
                console.log(children != null);
                if (children != null) {
                    for (var k = 0; k < parents.get(children[i]).size; k++) {
                        currentGeneration.get(id).add(parents.get(children[i])[k]);
                    }
                }
            }
            /*children.forEach((childId) =>
              parents
                .get(childId)
                .forEach((childrensChild) =>
                  currentGeneration.get(id).add(childrensChild)
                )
            );*/
        }
        innerLoop: for (let [id, children] of parents) {
            let setParent = parents.get(id);
            let setChild = currentGeneration.get(id);
            setsAreUnequal = !(
                setParent.size === setChild.size &&
                [...setParent].every((value) => setChild.has(value))
            );
            if (setsAreUnequal) {
                break innerLoop;
            }
        }
        parents = new Map(
            JSON.parse(JSON.stringify(Array.from(currentGeneration)))
        ) as Map<number, Set<number>>;
    } while (setsAreUnequal);

    for (let [id, children] of parents) {
        console.log('End of line reached!');
        console.log('(' + id + ')(' + children + '), Size: ' + children.size);
        if (children.size === 48) {
            console.log('Element found!');
            goalNode = nodes.find((item) => item.id === id);
            console.log(goalNode);
        }
    }
    return goalNode;
}

function initNodes() {
    let nodes = new Array();
    for (var i = 0; i < firstgenerationSize; i++) {
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

function generateIdSequenz(size: number): Array<number> {
    let idSequence = new Array();
    for (var i = 0; i < size; i++) {
        idSequence.push(i);
    }
    return idSequence;
}

function printNodes(nodes: Array<MyNode>, generation: number): void {
    console.log('Printing Generation ' + generation + ':');
    for (var i = 0; i < nodes.length; i++) {
        console.log(nodes[i]);
        if (nodes[i].children !== null) {
            for (var k = 0; k < nodes[i].children.length; k++) {
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
            'Reached last Gneration( ' +
            generation +
            ' / ' +
            maxGenerations +
            ' ) - Stopping'
        );
        firstbornOfLastGenerationReached = true;
    }

    if (generation !== maxGenerations && !firstbornOfLastGenerationReached) {
        if (generation < 3) {
            //node.children = new Array<MyNode>(generation + 1);
            node.children = new Array<MyNode>(childrenPGen);
        } else {
            //node.children = new Array<MyNode>(getRandomInt(childrenPGen));
            node.children = new Array<MyNode>(childrenPGen);
        }
        for (var i = 0; i < node.children.length; i++) {
            node.children[i] = generateNode(generation + 1);
        }
    }
    return node;
}

function createIdMap(
    nodes: Array<MyNode>,
    idMap: Map<number, MyNode>
): Map<number, MyNode> {
    for (var i = 0; i < nodes.length; i++) {
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
