const { v4 } = require("uuid");
class TaskStore {
  constructor() {
    this.tasks = {};
    this.rootTasks = [];
  }

  addTask(task, parentId) {
    const id = v4();
    this.tasks[id] = {
      id,
      title: task.title,
      description: task.description,
      children: []
    };
    if (parentId) {
      this.tasks[parentId].children.push(id);
    } else {
      this.rootTasks.push(this.tasks[id]);
    }
    return id;
  }

  updateTask(task) {
    const id = task.id;
    this.tasks[id] = { ...task };
  }

  search(term) {
    return Object.values(this.rootTasks).map(task =>
      ({ task , searchResult: this.searchTask(task, term)})
    ).sort(({ searchResult: searchResultA }, { searchResult: searchResultB }) => {
      if (searchResultA.depth < searchResultB.depth) {
        return -1;
      } else if (searchResultA.depth > searchResultB.depth) {
        return 1;
      } else if (searchResultA.occurence > searchResultB.occurence) {
        return -1;
      } else if (searchResultA.occurence < searchResultB.occurence) {
        return 1;
      } else {
        return 0;
      }
    }).filter(({ searchResult: { occurence }}) => occurence);
  }

  searchTask(task, term) {
    const termFoundInNode = task.title.search(term) !== -1 || task.description.search(term) !== -1;
    const { minDepth, totalOccurence } = task.children.reduce(
      (accumulator, taskIdInList) => {
        const { depth, occurence } = this.searchTask(this.tasks[taskIdInList], term);
        const { minDepth, totalOccurence } = accumulator
        return {
          minDepth: minDepth < depth ? minDepth : depth,  
          totalOccurence: totalOccurence + occurence
        }
      },
      { minDepth: 999, totalOccurence: 0}
    );
    if (termFoundInNode) {
      return { depth: 0, occurence: totalOccurence + 1 };
    } else {
      return { depth: minDepth + 1, occurence: totalOccurence };
    }
  }

  getAll() {
    return Object.values(this.tasks);
  }
}
const taskstore = new TaskStore();
const taskId1 = taskstore.addTask({ title: "task 1", description: "task 1 is the first task" });
const taskId2 = taskstore.addTask({ title: "task 2", description: "task 2 is the term task" });
const taskId3 = taskstore.addTask({ title: "task 3", description: "task 3 is the third task" });
const taskId4 = taskstore.addTask({ title: "task 4", description: "task 4 is the third task" });
const taskId1Child = taskstore.addTask({ title: "task 1 child", description: "This is the child of task 1 term" }, taskId1);
const taskId2Child = taskstore.addTask({ title: "task 2 child", description: "This is the child of task 2" }, taskId2);
const taskId3Child1 = taskstore.addTask({ title: "task 3 child", description: "This is the child of task 3 term" }, taskId3);
const taskId3Child2 = taskstore.addTask({ title: "task 3 child", description: "This is the child of task 3 term" }, taskId3);
const taskId4Child1 = taskstore.addTask({ title: "task 4 child", description: "This is the child of task 4" }, taskId4);
const taskId4GrandChild1 = taskstore.addTask({ title: "task 4 grand child 1", description: "This is the child of task 4 term" }, taskId4Child1);
const taskId4GrandChild2 = taskstore.addTask({ title: "task 4 grand child 2", description: "This is the child of task 4 term" }, taskId4Child1);
const taskId4GrandChild3 = taskstore.addTask({ title: "task 4 grand child 3", description: "This is the child of task 4 term" }, taskId4Child1);


module.exports = taskstore;
