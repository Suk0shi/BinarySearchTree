function node(data, left = null, right = null) {
    return {
        data: data, 
        leftChild: left, 
        rightChild: right, 
    };
}

function buildTree(array) {
    let filterdArray = [...new Set(array)];
    let orderedArray = mergeSort(filterdArray);

    return recursiveTree(orderedArray, 0, orderedArray.length - 1);
}

function recursiveTree(array, start, end) {
    if (start > end) return null;
    
    
    const mid = Math.floor((start + end) / 2);
    const root = node(array[mid]);

    root.leftChild = recursiveTree(array, start, mid - 1);
    root.rightChild = recursiveTree(array, mid + 1, end);
    
    return root;
}

function mergeSort(array) {
    if (array.length === 1) return array;
    if (array.length > 1) {
        //start merging process
        const mid = Math.floor(array.length / 2);
        //make new array betweeen array[1], array[mid] called firstHalf
        const firstHalf = array.slice(0, mid);
        //make new array betweeen array[mid+1], array[array.length] called secondHalf
        const secondHalf = array.slice(mid, array.length);
        
        //reorder the two halves
        return merge(mergeSort(firstHalf), mergeSort(secondHalf))
    }
    //do splitting process
}

function merge(firstHalf, secondHalf) {
    const result = [];
    let i = 0;
    let j = 0;
    while(i < firstHalf.length && j < secondHalf.length) {
        if(firstHalf[i] < secondHalf[j]) {
            result.push(firstHalf[i]);
            i++;
        }
        else {
            result.push(secondHalf[j]);
            j++;
        }
    }
    while (i < firstHalf.length) {
        result.push(firstHalf[i])
        i++;
    }
    while (j < secondHalf.length) {
        result.push(secondHalf[j])
        j++;
    }
    return result;
}

function tree(array) { 

    return {
        root: buildTree(array),
        
        insert(value, root = this.root) {
            if (root === null) {
                root = node(value);
                return root;
            }

            if (value < root.data) {
                root.leftChild = this.insert(value, root.leftChild);
            } else if (value > root.data) {
                root.rightChild = this.insert(value, root.rightChild)
            }

            return root;
        },

        delete(value, root = this.root) {
            if (root === null) {
                return root;
            }
            if (value === root.data) {
                // has both children
                if (root.leftChild !== null && root.rightChild !== null) {
                    //find next biggest root (right child then all left child)
                    const minData = function findNextSmallest(root) {
                        let min = root.data;
                        let newRoot = root;

                        while (root.leftChild !== null) {
                            min = root.leftChild.data;
                            newRoot = root.leftChild;
                        } 
                        return min;
                    }

                    root.data = minData(root.rightChild);
                    root.rightChild = this.delete(root.data, root.rightChild)
                    
                    //remove next biggest 
                    //insert it as value of root
                }
                // has one child
                else if (root.leftChild !== null) {
                    //delete root (point its parent to its child)
                    delete root.data;
                    return root.leftChild;
                }
                else if (root.rightChild !== null) {
                    //delete root (point its parent to its child)
                    delete root.data;
                    return root.rightChild;
                }
                // has no children
                else if (root.leftChild === null && root.rightChild === null) {
                    //delete root (delete pointer)
                    delete root.data;
                    return null;
                }
                // do one of three operations to delete
            }
            if (value < root.data) {
                root.leftChild = this.delete(value, root.leftChild);
            } else if (value > root.data) {
                root.rightChild = this.delete(value, root.rightChild)
            }

            return root;
        },

        find(value, root = this.root) {
            if (value === root.data) {
                return root;
            }
            if (value < root.data) {
                return this.find(value, root.leftChild);
            } else if (value > root.data) {
                return this.find(value, root.rightChild)
            }
        },

        levelOrder(arr = [], queue = [], root = this.root) {
            if (root === null) {
                return;
            }
            
            //visit root
            arr.push(root.data);

            //que both children 
            queue.push(root.leftChild);
            queue.push(root.rightChild);

            //move down level
            while (queue.length) {
                const level = queue[0];
                queue.shift();
                this.levelOrder(arr, queue, level);
            }
            return arr;
        },

        inOrder(arr = [], root = this.root) {
            if (root === null) return;

            if (root.leftChild) this.inOrder(arr, root.leftChild);
            arr.push(root.data);
            if (root.rightChild) this.inOrder(arr, root.rightChild);

            return arr;
        },

        preOrder(arr = [], root = this.root) {
            if (root === null) return;
            
            arr.push(root.data);
            if (root.leftChild) this.inOrder(arr, root.leftChild);
            if (root.rightChild) this.inOrder(arr, root.rightChild);

            return arr;
        },

        postOrder(arr = [], root = this.root) {
            if (root === null) return;
            
            if (root.leftChild) this.inOrder(arr, root.leftChild);
            if (root.rightChild) this.inOrder(arr, root.rightChild);
            arr.push(root.data);

            return arr;
        },

        height(root = this.root) {
            //how far is it till leaf node longest path 
            if (root === null) return 0;
            
            let lHeight = this.height(root.leftChild);
            let rHeight = this.height(root.rightChild);

            if (lHeight > rHeight) {
                return lHeight + 1;
            } else {
                return rHeight + 1;
            }
            
        },

        depth(node, root = this.root, depth = 0) {
            //how far is it from root to node
            if (root === node) return depth;

            if (node.data < root.data) {
                return this.depth(node, root.leftChild, depth + 1);
            } else if (node.data > root.data) {
                return this.depth(node, root.rightChild, depth + 1)
            }
        
            return depth;
        },

        isBalanced(root = this.root) {
            if (root === null) return;
            //find difference between height of left and right
            const difference = Math.abs(this.height(root.leftChild) -
            this.height(root.rightChild));

            //is difference 1 or lower (balanced)
            return difference < 2 ? 'true' : 'false'; 
        },

        rebalance(root = this.root) {
            const rebalanceArr = this.inOrder();
            return this.root = buildTree(rebalanceArr);
        }
    };
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.rightChild !== null) {
      prettyPrint(node.rightChild, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.leftChild !== null) {
      prettyPrint(node.leftChild, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
};


function randomNumberArray(num) {
    const randomArray = Array.from({ length: num }, () => Math.floor(Math.random() * 100));
    return randomArray;
}

console.log('--- Create random tree of length 10 ---')
const newTree = tree(randomNumberArray(10));
console.log(newTree)
prettyPrint(newTree.root)
console.log('Balanced: ' + newTree.isBalanced())
console.log('Level Order: ' + newTree.levelOrder())
console.log('Pre Order: ' + newTree.preOrder())
console.log('Post Order: ' + newTree.postOrder())
console.log('In Order: ' + newTree.inOrder())

console.log('--- Insert Numbers to unbalance tree ---')
newTree.insert(101)
newTree.insert(102)
newTree.insert(103)
newTree.insert(104)
prettyPrint(newTree.root)
console.log('Balanced: ' + newTree.isBalanced())

console.log('--- Rebalance tree ---')
newTree.rebalance()
prettyPrint(newTree.root)
console.log('Balanced: ' + newTree.isBalanced())
console.log('Level Order: ' + newTree.levelOrder())
console.log('Pre Order: ' + newTree.preOrder())
console.log('Post Order: ' + newTree.postOrder())
console.log('In Order: ' + newTree.inOrder())