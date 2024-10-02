class Node {
    constructor(key) {
        this.key = key;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

class AVLTree {
    constructor() {
        this.root = null;
    }

    getHeight(node) {
        return node ? node.height : 0;
    }

    getBalance(node) {
        return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
    }

    rightRotate(y) {
        const x = y.left;
        const T2 = x.right;

        x.right = y;
        y.left = T2;

        y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));
        x.height = 1 + Math.max(this.getHeight(x.left), this.getHeight(x.right));

        return x;
    }

    leftRotate(x) {
        const y = x.right;
        const T2 = y.left;

        y.left = x;
        x.right = T2;

        x.height = 1 + Math.max(this.getHeight(x.left), this.getHeight(x.right));
        y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));

        return y;
    }

    insert(node, key) {
        if (!node) return new Node(key);
        if (key < node.key) {
            node.left = this.insert(node.left, key);
        } else {
            node.right = this.insert(node.right, key);
        }

        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));

        const balance = this.getBalance(node);

        if (balance > 1 && key < node.left.key) return this.rightRotate(node);
        if (balance < -1 && key > node.right.key) return this.leftRotate(node);
        if (balance > 1 && key > node.left.key) {
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }
        if (balance < -1 && key < node.right.key) {
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }
    delete(node, key) {
        if (!node) return node;

        if (key < node.key) {
            node.left = this.delete(node.left, key);
        } else if (key > node.key) {
            node.right = this.delete(node.right, key);
        } else {
            if (!node.left) return node.right;
            else if (!node.right) return node.left;

            const temp = this.getMinValueNode(node.right);
            node.key = temp.key;
            node.right = this.delete(node.right, temp.key);
        }

        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));

        const balance = this.getBalance(node);

        // Left Left Case
        if (balance > 1 && this.getBalance(node.left) >= 0) return this.rightRotate(node);
        // Left Right Case
        if (balance > 1 && this.getBalance(node.left) < 0) {
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }
        // Right Right Case
        if (balance < -1 && this.getBalance(node.right) <= 0) return this.leftRotate(node);
        // Right Left Case
        if (balance < -1 && this.getBalance(node.right) > 0) {
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    getMinValueNode(node) {
        let current = node;
        while (current.left) current = current.left;
        return current;
    }

    drawTree(node, x, y, ctx, offset) {
        if (!node) return;

        ctx.fillText(node.key, x, y);
        if (node.left) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - offset, y + 40);
            ctx.stroke();
            this.drawTree(node.left, x - offset, y + 40, ctx, offset / 2);
        }
        if (node.right) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + offset, y + 40);
            ctx.stroke();
            this.drawTree(node.right, x + offset, y + 40, ctx, offset / 2);
        }
    }
}

const avlTree = new AVLTree();

function insertValue() {
    const input = document.getElementById("valueInput").value;
    const value = parseInt(input);
    if (!isNaN(value)) {
        avlTree.root = avlTree.insert(avlTree.root, value);
        document.getElementById("valueInput").value = '';
        drawTree(); // Draw the tree after inserting a new value
    }
}

function traverseTree(type) {
    const arr = [];
    if (type === 'inorder') {
        inOrder(avlTree.root, arr);
    } else if (type === 'preorder') {
        preOrder(avlTree.root, arr);
    } else if (type === 'postorder') {
        postOrder(avlTree.root, arr);
    }
    document.getElementById("output").innerText = `${type.charAt(0).toUpperCase() + type.slice(1)} traversal: ` + arr.join(", ");
}
function deleteValue() {
    const input = document.getElementById("deleteInput").value;
    const value = parseInt(input);
    if (!isNaN(value)) {
        avlTree.root = avlTree.delete(avlTree.root, value);
        document.getElementById("deleteInput").value = '';
        drawTree(); // Draw the tree after deleting a value
    }
}

function inOrder(node, arr) {
    if (node) {
        inOrder(node.left, arr);
        arr.push(node.key);
        inOrder(node.right, arr);
    }
}

function preOrder(node, arr) {
    if (node) {
        arr.push(node.key);
        preOrder(node.left, arr);
        preOrder(node.right, arr);
    }
}

function postOrder(node, arr) {
    if (node) {
        postOrder(node.left, arr);
        postOrder(node.right, arr);
        arr.push(node.key);
    }
}

function drawTree() {
    const canvas = document.getElementById("treeCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "20px Arial";
    avlTree.drawTree(avlTree.root, canvas.width / 2, 30, ctx, 200);
}

// Handle popover functionality for video scenes
const popover = document.getElementById('popover');
const popoverContent = document.getElementById('popover-content');
const closeBtn = document.querySelector('.close-btn');

const scenes = {
    1: `
        <video width="790" height="790" controls>
            <source src="scene1_final.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    `,
    2: `
        <video width="790" height="790" controls>
            <source src="scene2_final.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    `,
    3: `
        <video width="790" height="790" controls>
            <source src="scene3_final.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    `,
    4: `
        <video width="790" height="790" controls>
            <source src="scene4_final.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    `,
    5: `
        <h3>AVL Tree Insertion</h3>
        <p>In this section, we will explore how to insert a new node into an AVL tree. The AVL tree maintains its balance by performing rotations after insertion.</p>
       
        <input type="text" id="valueInput" placeholder="Enter a value">
        <button onclick="insertValue()">Insert</button>
        <button onclick="traverseTree('inorder')">In-order Traversal</button>
        <button onclick="traverseTree('preorder')">Pre-order Traversal</button>
        <button onclick="traverseTree('postorder')">Post-order Traversal</button>
        <canvas id="treeCanvas" width="800" height="400" style="border:1px solid black;"></canvas>
        <div id="output"></div>
    `,
    6: `
        <video width="790" height="790" controls>
            <source src="scene5_final.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    `,
    7:  ` <h3>AVL Tree Deletion</h3>
    <p>In this section, we will explore how to delete a node from an AVL tree. The AVL tree maintains its balance by performing rotations after deletion.</p>
   
    <input type="text" id="deleteInput" placeholder="Enter a value to delete">
    <button onclick="deleteValue()">Delete</button>
    <canvas id="treeCanvas" width="800" height="400" style="border:1px solid black;"></canvas>
    <div id="output"></div>
     `,
    8: `
        <video width="790" height="790" controls>
            <source src="scene6_final.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    `,
};

document.querySelectorAll('.popover-button').forEach(button => {
    button.addEventListener('click', (event) => {
        const scene = event.target.getAttribute('data-scene');
        popoverContent.innerHTML = scenes[scene]; // Use innerHTML to allow HTML content
        popover.style.display = 'block';
        popover.style.left = event.pageX + 'px';
        popover.style.top = event.pageY + 'px';

        // Draw the AVL tree only when scene 5 is opened
        if (scene === '5' || scene === '7') {
            drawTree(); // Draw the AVL tree when scene 5 is opened
        }
    });
});

closeBtn.addEventListener('click', () => {
    popover.style.display = 'none';
});

