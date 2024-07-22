const Sigil = {
        LINE: 0,
        T: 1,
        Z: 2,
        S: 3,
        L: 4,
        J: 5,
        SQUARE: 6
    };
const sigils = [Sigil.LINE,Sigil.T,Sigil.Z,Sigil.S,Sigil.L,Sigil.J,Sigil.SQUARE];
const possibleRotations = [2,3,2,2,4,4,1];
const SigilDefine = [
    [
        [
            [0,0,1,1,1,1],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0]
        ],
        [
            [0,0,1,0,0,0],
            [0,0,1,0,0,0],
            [0,0,1,0,0,0],
            [0,0,1,0,0,0]
        ]
    ],
    [
        [[0,0,1,1,1,0],
         [0,0,0,1,0,0],
         [0,0,0,0,0,0],
         [0,0,0,0,0,0]],
        [[0,0,1,0,0,0],
         [0,1,1,0,0,0],
         [0,0,1,0,0,0],
         [0,0,0,0,0,0]],
        [[0,0,1,0,0,0],
         [0,0,1,1,0,0],
         [0,0,1,0,0,0],
         [0,0,0,0,0,0]]
    ],
    [
        [[0,0,1,1,0,0],
         [0,0,0,1,1,0],
         [0,0,0,0,0,0],
         [0,0,0,0,0,0]],
        [[0,0,1,0,0,0],
         [0,1,1,0,0,0],
         [0,1,0,0,0,0],
         [0,0,0,0,0,0]]
    ],
    [
        [[0,0,1,0,0,0],
         [0,0,1,1,0,0],
         [0,0,0,1,0,0],
         [0,0,0,0,0,0]],
        [[0,0,1,1,0,0],
         [0,1,1,0,0,0],
         [0,0,0,0,0,0],
         [0,0,0,0,0,0]]
    ],
    [
        [[0,0,1,0,0,0],
         [0,0,1,0,0,0],
         [0,0,1,1,0,0],
         [0,0,0,0,0,0]],
        [[0,0,1,1,1,0],
         [0,0,1,0,0,0],
         [0,0,0,0,0,0],
         [0,0,0,0,0,0]],
        [[0,0,1,1,0,0],
         [0,0,0,1,0,0],
         [0,0,0,1,0,0],
         [0,0,0,0,0,0]],
        [[0,0,1,0,0,0],
         [1,1,1,0,0,0],
         [0,0,0,0,0,0],
         [0,0,0,0,0,0]]
    ],
    [
        [[0,0,1,0,0,0],
         [0,0,1,0,0,0],
         [0,1,1,0,0,0],
         [0,0,0,0,0,0]],
        [[0,0,1,0,0,0],
         [0,0,1,1,1,0],
         [0,0,0,0,0,0],
         [0,0,0,0,0,0]],
        [[0,0,1,1,0,0],
         [0,0,1,0,0,0],
         [0,0,1,0,0,0],
         [0,0,0,0,0,0]],
        [[0,0,1,1,1,0],
         [0,0,0,0,1,0],
         [0,0,0,0,0,0],
         [0,0,0,0,0,0]]
    ],
    [
        [[0,0,1,1,0,0],
         [0,0,1,1,0,0],
         [0,0,0,0,0,0],
         [0,0,0,0,0,0]] 
    ]
]
const MARKS = "#$%^&*.~?/;<>qwertyuiopasdfghjklzxcvbnm";
const maxMarkIndex = MARKS.length; // 注意：JS中获取长度是.length而不是.length()
let markIndex = 0;
let sigilCount = [0,0,0,0,0,0,0];
let line = 0;let column = 0;
let board = [];
function defineboard(){
    board = new Array(line); // 创建line行
    for (let i = 0; i < line; i++) {
        board[i] = new Array(column).fill(0); // 创建column列，并填充0
    }
}

// 使用createSigilPatternGridIterator来生成迭代器
const SIGIL_PATTERN_LINE = 4;
const SIGIL_PATTERN_COLUMN = 6;
const SIGIL_PATTERN_ANCHOR_LINE = 0;
const SIGIL_PATTERN_ANCHOR_COLUMN = 2;
function createSigilPatternGridIterator() {
    let iterator = [];
    for (let i = 0; i < 4; i++) {
        for (let j = -2; j < 4; j++) {
            iterator.push([i, j]);
        }
    }
    return iterator;
}
const sigilPatternGridIterator = createSigilPatternGridIterator();
function GridIterateHelper(l,c){
    let iterator = [];
    for(let i=0;i < l;i++){
        for(let j=0;j < c;j++){
            iterator.push([i,j]);
        }
    }
    return iterator;
}
function issigilplaceable(sigilToBePlaced, x, y, rotation) {
    const isSingleCoordinateFailed = (i, j) => {
        // 如果这个位置的符文不在符文形状里面，那就没必要判断了。
        const sigil = SigilDefine[sigilToBePlaced][rotation];
        if (!sigil[i][j + SIGIL_PATTERN_ANCHOR_COLUMN]) return 0;
        let targetX = x + i, targetY = y + j;
        if (targetX >= line || targetX < 0 || targetY < 0 || targetY >= column) return 1;
        if (board[targetX][targetY]) return 1;
        return 0;
    };

    for (let [i, j] of sigilPatternGridIterator) {
        if (isSingleCoordinateFailed(i, j)) return 0;
    }
    return 1;
}
function placesigil(sigilToBePlaced,x,y,rotation){
    const sigil = SigilDefine[sigilToBePlaced][rotation];
    for (let [i, j] of sigilPatternGridIterator) {
        if(!sigil[i][j + SIGIL_PATTERN_ANCHOR_COLUMN])continue;
        let targetx = x + i, targety = y + j;
        if (targetx < 0 || targetx >= line || targety < 0 || targety >= column) {
            // 输出错误消息到控制台
            console.error(`越界错误：尝试将符文放置到(${targetx}, ${targety})，超出了板的范围。`);
            continue; // 继续执行循环，而不是退出函数
        }
        board[targetx][targety] = MARKS[markIndex % maxMarkIndex];
    }
    return 0;
}
function unplacesigil(sigilToBePlaced,x,y,rotation){
    const sigil = SigilDefine[sigilToBePlaced][rotation];
    for (let [i, j] of sigilPatternGridIterator){
        if(!sigil[i][j + SIGIL_PATTERN_ANCHOR_COLUMN])continue;
        let targetx = x + i, targety = y + j;
        if (targetx < 0 || targetx >= line || targety < 0 || targety >= column) {
            // 输出错误消息到控制台
            console.error(`越界错误：尝试撤回(${targetx}, ${targety})的符文，超出了板的范围。`);
            continue; // 继续执行循环，而不是退出函数
        }
        board[targetx][targety] = 0;
    }

}
let dfsstep = 0;
function dfs() {
    dfsstep++;
    let emptySpotX = 0, emptySpotY = 0;
    let hasEmptySpot = false;

    for (let [i, j] of GridIterateHelper(line, column)) {
        if (board[i][j]) continue;
        hasEmptySpot = true;
        emptySpotX = i;
        emptySpotY = j;
        break;
    }

    if (!hasEmptySpot) {
        // 成功！
        return 1;
    }

    for (let sigil of sigils) {
        if (!sigilCount[sigil]) continue;
        for (let rotation = 0; rotation < possibleRotations[sigil]; rotation++) {
            // console.log(sigil, rotation);
            if (issigilplaceable(sigil, emptySpotX, emptySpotY, rotation)) {
                placesigil(sigil, emptySpotX, emptySpotY, rotation);
                sigilCount[sigil] -= 1;
                markIndex += 1;
                if (dfs()) return 1;
                unplacesigil(sigil, emptySpotX, emptySpotY, rotation);
                sigilCount[sigil] += 1;
                markIndex -= 1;
            }
        }
    }

    return 0;
}
function testcase(){
    //case 1
    line = 6;
    column = 8;
    sigilCount[Sigil.LINE] = 1;
    sigilCount[Sigil.T] = 2;
    sigilCount[Sigil.SQUARE] = 2;
    sigilCount[Sigil.S] = 1;
    sigilCount[Sigil.Z] = 3;
    sigilCount[Sigil.J] = 3;
    sigilCount[Sigil.L] = 0;
}
function reset(){
    markIndex = 0;
    dfsstep = 0;
    sigilCount = [0,0,0,0,0,0,0];
}
function getinput(){
    line = parseInt(document.getElementById("lineInput").value);
    column = parseInt(document.getElementById("columnInput").value);
    sigilCount[Sigil.LINE] = parseInt(document.getElementById("lineSigilCount").value);
    sigilCount[Sigil.T] = parseInt(document.getElementById("tSigilCount").value);
    sigilCount[Sigil.SQUARE] = parseInt(document.getElementById("squareSigilCount").value);
    sigilCount[Sigil.S] = parseInt(document.getElementById("sSigilCount").value);
    sigilCount[Sigil.Z] = parseInt(document.getElementById("zSigilCount").value);
    sigilCount[Sigil.J] = parseInt(document.getElementById("jSigilCount").value);
    sigilCount[Sigil.L] = parseInt(document.getElementById("lSigilCount").value);

}
function calleverything(){
    reset();
    // testcase();
    getinput();
    defineboard();
    let res = dfs();
    console.log(res);
    let displayText = ""
    if(res){
        displayText += "success in " + dfsstep + " steps<br>";
    }
    else{
        displayText += "failed after " + dfsstep + " steps<br>";
    }
    for (let i = 0; i < line; i++) {
        for (var j = 0; j < column; j++) {
            displayText += board[i][j];
            if(j!=column-1)displayText+=' ';
        }
        displayText += "<br>";
    }
    document.getElementById("displayArray").innerHTML = displayText;
}
