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

  deleteNode(root, key) {
      if (!root) return root;

      if (key < root.key) {
          root.left = this.deleteNode(root.left, key);
      } else if (key > root.key) {
          root.right = this.deleteNode(root.right, key);
      } else {
          if (!root.left) return root.right;
          else if (!root.right) return root.left;

          const temp = this.getMinValueNode(root.right);
          root.key = temp.key;
          root.right = this.deleteNode(root.right, temp.key);
      }

      if (!root) return root;

      root.height = 1 + Math.max(this.getHeight(root.left), this.getHeight(root.right));

      const balance = this.getBalance(root);

      if (balance > 1 && this.getBalance(root.left) >= 0) return this.rightRotate(root);
      if (balance < -1 && this.getBalance(root.right) <= 0) return this.leftRotate(root);
      if (balance > 1 && this.getBalance(root.left) < 0) {
          root.left = this.leftRotate(root.left);
          return this.rightRotate(root);
      }
      if (balance < -1 && this.getBalance(root.right) > 0) {
          root.right = this.rightRotate(root.right);
          return this.leftRotate(root);
      }

      return root;
  }

  getMinValueNode(node) {
      if (node.left === null) return node;
      return this.getMinValueNode(node.left);
  }

  inOrder(node, arr) {
      if (node) {
          this.inOrder(node.left, arr);
          arr.push(node.key);
          this.inOrder(node.right, arr);
      }
  }

  preOrder(node, arr) {
      if (node) {
          arr.push(node.key);
          this.preOrder(node.left, arr);
          this.preOrder(node.right, arr);
      }
  }

  postOrder(node, arr) {
      if (node) {
          this.postOrder(node.left, arr);
          this.postOrder(node.right, arr);
          arr.push(node.key);
      }
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
      document.getElementById("errorMessage").innerText = '';
      drawTree();
  } else {
      document.getElementById("errorMessage").innerText = 'Please enter a valid number.';
  }
}

function deleteValue() {
  const input = document.getElementById("valueInput").value;
  const value = parseInt(input);
  if (!isNaN(value)) {
      avlTree.root = avlTree.deleteNode(avlTree.root, value);
      document.getElementById("valueInput").value = '';
      document.getElementById("errorMessage").innerText = '';
      drawTree();
  } else {
      document.getElementById("errorMessage").innerText = 'Please enter a valid number.';
  }
}

function traverseTree(type) {
  const arr = [];
  if (type === 'inorder') {
      avlTree.inOrder(avlTree.root, arr);
  } else if (type === 'preorder') {
      avlTree.preOrder(avlTree.root, arr);
  } else if (type === 'postorder') {
      avlTree.postOrder(avlTree.root, arr);
  }
  document.getElementById("output").innerText = `${type.charAt(0).toUpperCase() + type.slice(1)} traversal: ` + arr.join(", ");
}

function drawTree() {
  const canvas = document.getElementById("treeCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "20px Arial";
  avlTree.drawTree(avlTree.root, canvas.width / 2, 30, ctx, 200);
}
