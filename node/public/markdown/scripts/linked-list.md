# Linked List (Deprecated)

## Linked List Sorting 问题解决记录

有一个 `Node` linked list, 对应的 pointer 是 `*node` , 怎么修改它?

如果直接用 `*node` 对自身进行 iterate, head pointer 就乱了.
所以应该创建一个新 pointer `*current` , 让 `current = node` .
那如何操作 `*current` 才能带动 `*node` 一起变化呢?

如果对 `*current` 本身进行操作, 比如让 `current = pt` , 那么仅仅是把 `*current` 所指向的地址改了.
因此必须对 `*current` 所指向的地址的内容进行操作, 让

```c
current->next = newnode;
```

那么问题又来了, `current->next` 就已经是第二个 node 了, 怎么才能在第一个 node 上操作呢?

于是我们引入 `*dummyhead` , 先给 `*dummyhead` 分配空间

```c
dummyhead = (struct Node*)malloc(sizeof(struct Node));
```

再让

```c
dummyhead->next = node;
```

这时, `*current` 指针就可以从虚拟头节点逐个移到最后一个节点了.

应该这样才能带动 node 变化

```c
dummyhead->next = node;
current = dummyhead;
current->next = newnode;
node = dummyhead->next;
```

完整代码如下:

```c
struct Node {
    ...
    struct Node* next;
}*node, *dummyhead;

void InsertNode(struct Node* newnode) {

    dummyhead = (struct Node*)malloc(sizeof(struct Node));
    dummyhead->next = node;

    current = dummyhead;

    if (node != NULL) {
        while (current->next) {
            if ([Statement]) {
                current->next = newnode;
            }
        }
    }

    node = dummyhead->next;

}
```

插入问题解决了, 排序问题也类似.

使用简单的 bubble sort, 则有2层循环. 内循环使用 `*current` 指针遍历, 并判断是否要 swap; 在外循环中, 为了避免计算 linked list 的长度, 直接引入 `isComplete` 变量, 每次进入内循环前, 重置使其为1, 如果内层循环中发生 swap, 则让它等于0, 如果内循环结束后, 它的值还是为1, 那么说明排序结束.

内循环中, 创建 `*left` , `*right` 两个指针, 此处的字面意思指的是 swap 后的值, 于是让 `left` 指向右边,  `right` 指向左边. 然后在给 `*left` , `*right` , `*current` 三个指针的 `next` 赋值时, 重新安排位置.

完整代码如下:

```c
struct Node {
    ...
    int value;
    struct Node* next;
}* node, * dummyhead;

void SortByValue() {

    struct Node* current, * left, * right;
    int isComplete = 0;

    dummyhead = (struct Node*)malloc(sizeof(struct Node));
    dummyhead->next = node;

    if (node != NULL)
    {
        while (isComplete == 0)
        {
            current = dummyhead;
            isComplete = 1;
            while (current->next->next != NULL) {
                
                if (current->next->next->value > current->next->value) {

                    // Create: current->right->left->...
                    left = current->next->next;
                    right = current->next;

                    // Rearrange: current->left->right->...
                    right->next = current->next->next->next;
                    left->next = right;
                    current->next = left;

                    isComplete = 0;

                }
                current = current->next;
            }
        }
    }

    pcb = dummyhead->next;

}
```