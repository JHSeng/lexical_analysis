/* eslint-disable */
//运算符优先级、操作数个数表
var OperatorInformationTable = [
  { operator: '(', priority: 0, numOfParams: 0 },
  { operator: '[', priority: 0, numOfParams: 0 },
  { operator: '|', priority: 1, numOfParams: 2 },
  { operator: '..', priority: 2, numOfParams: 2 },  // 链接运算符
  { operator: '*', priority: 3, numOfParams: 1 },
  { operator: '+', priority: 3, numOfParams: 1 },
  { operator: '{', priority: 3, numOfParams: 1 },
  { operator: '?', priority: 3, numOfParams: 1 },
  { operator: ')', priority: 4, numOfParams: 0 },
  { operator: ']', priority: 4, numOfParams: 0 },
  { operator: '}', priority: 4, numOfParams: 1 },
  { operator: '\\', priority: 0, numOfParams: 1 },
  { operator: '<', priority: 0, numOfParams: 0 },  //人工添加的左括号
  { operator: '>', priority: 4, numOFParams: 0 }  //人工添加的右括号
]
//常规字符表
var MiddlePackageAlphabet = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]

//栈对象
var Stack = function () {
  this.dataStore = [];
  this.pop = pop;
  this.top = top;
  this.push = push;
  this.nullOrNot = nullOrNot;
}
//出栈
function pop() {
  this.dataStore.length = this.dataStore.length - 1;
}
//查看栈顶元素
function top() {
  return this.dataStore[this.dataStore.length - 1];
}
//压栈
function push(el) {
  this.dataStore[this.dataStore.length] = el;
}
//判断栈是否为空
function nullOrNot() {
  if (this.dataStore.length == 0) {
    return true;
  }
  else {
    return false;
  }
}

//返回运算符操作数的个数
function NumOfParams(char) {
  var numOfParams = -1;//常规字符为-1
  for (var i = 0; i < OperatorInformationTable.length; i++) {
    if (char == OperatorInformationTable[i].operator) {
      numOfParams = OperatorInformationTable[i].numOfParams;
      break;
    }
  }
  return numOfParams;
}
//返回运算符优先级
function Priority(char) {
  var priority = -1;//常规字符优先级为-1
  for (var i = 0; i < OperatorInformationTable.length; i++) {
    if (char == OperatorInformationTable[i].operator) {
      priority = OperatorInformationTable[i].priority;
      break;
    }
  }
  return priority;
}
//向 string 字符串中添加字符，返回新的 string
// str 为原字符串， newChar 为要插入的单个字符，site 为要插入的位置
function insertChar(str, newChar, site) {
  var newStr = "";
  if (site === 0) {
    newStr = newChar + str;
    return newStr;
  }
  else if (site > 0 && site < str.length) {
    newStr = str.substring(0, site) + newChar + str.substring(site, str.length);
    return newStr;
  }
  else if (site == str.length) {
    newStr = str + newChar;
    return newStr;
  }
  else
    return -1;  //插入的位置有误
}
//括号匹配检测，传入字符串，字符串中某个左括号（左尖括号）的下标，返回该左括号（左尖括号）对应的右括号（右尖括号）的下标
function bracketDetection(leftBracketIndex, str) {
  var bracketStack = new Stack;
  bracketStack.push(str[leftBracketIndex]);
  if (str[leftBracketIndex] === '(') {
    for (let i = leftBracketIndex + 1; i < str.length;) {
      currentChar = str[i];
      switch (currentChar) {
        case '(':
          bracketStack.push(currentChar);
          i++;
          break;
        case ')':
          if (bracketStack.nullOrNot()) {
            return { state: 0, message: "Single \')\'" };
          }
          else {
            bracketStack.pop();
            if (bracketStack.nullOrNot()) {
              return i;
            }
            i++;
          }
          break;
        default:
          i++;
      }
    }
  }
  else if (str[leftBracketIndex] === '<') {
    for (let i = leftBracketIndex + 1; i < str.length;) {
      currentChar = str[i];
      switch (currentChar) {
        case '<':
          bracketStack.push(currentChar);
          i++;
          break;
        case '>':
          if (bracketStack.nullOrNot()) {
            return { state: 0, message: "Single \'>\'" };
          }
          else {
            bracketStack.pop();
            if (bracketStack.nullOrNot()) {
              return i;
            }
            i++;
          }
          break;
        default:
          i++;
      }
    }
  }
}

// //测试 brackerDetection()
// var testB="(ss)<a(a)a>";
// console.log(bracketDetection(4,testB));


//向一条正则表达式中添加语义的对象
var singleRegularStringAddSemantic = function (string) {
  //属性
  this.regularString = string;  //原始正则表达式

  //函数
  this.addConnector = addConnector;  //向正则表达式中添加连接符 '..'

  //向正则表达式中添加括号第一步，为属于集合 { a*,a+,a?,a{},\d,\m,[] } 中类型的字符串添加 '()'
  this.addBracketFirst = addBracketFirst;
  //向正则表达式中添加括号第二步，为属于集合 { ()*,()+,()?,(){} } 中类型的字符串添加 '()'
  this.addBracketSecond = addBracketSecond;
  //向正则表达式中添加括号第三步，将 X..Y 变为 (X..Y)，其中 X,Y 属于集合 { a,() }
  this.addBracketThird = addBracketThird;
  //向正则表达式中添加括号第四步，将 X|Y 变为 (X|Y)，其中 X,Y 属于集合 { a,() }
  this.addBracketFourth = addBracketFourth;
  //添加语义
  this.addSemantic = addSemantic;
  //去除连接运算符
  this.removeConnector = removeConnector;
}
//添加语义
function addSemantic() {
  var stateReturn = this.addConnector();
  if (stateReturn.state === 0) {
    return stateReturn;
  }
  else {
    stateReturn = this.addBracketFirst();
  }
  if (stateReturn.state === 0) {
    return stateReturn;
  }
  else {
    stateReturn = this.addBracketSecond();
  }
  if (stateReturn.state === 0) {
    return stateReturn;
  }
  else {
    stateReturn = this.addBracketThird();
  }
  if (stateReturn.state === 0) {
    return stateReturn;
  }
  else {
    stateReturn = this.addBracketFourth();
  }
  if (stateReturn.state === 0) {
    return stateReturn;
  }
  else {
    stateReturn = this.removeConnector();
  }
  return stateReturn;
}
//向正则表达式中添加连接符
function addConnector() {
  //用 str 储存原始正则表达式，str 在之后的运算中会改变
  var str = this.regularString;
  //从左向右遍历正则表达式
  for (let i = 0; i < str.length;) {
    if (i === str.length - 1) {
      break;
    }
    //当前读到的字符
    var currentChar = str[i];
    //通过当前字符操作数的个数，判断当前字符是什么
    switch (NumOfParams(currentChar)) {
      case -1:  //当前字符是常规字符
        // 向前看一个字符，如果下一个字符的优先级小于等于 0，则在运算符栈中压入一个连接运算符 '..'
        if (i + 1 < str.length && Priority(str[i + 1]) <= 0) {
          str = insertChar(str, '..', i + 1);
          i += 3;  //当前位置向右移三位
        }
        else {
          i++;
        }
        break;
      case 0:  //当前字符是零目运算符 '(' '[' ')' ']'
        switch (currentChar) {
          case '(':
            //如果下一个字符是')'
            if (i + 1 < str.length && str[i + 1] == ')') {
              i++;
              // 再看 ')' 的下一个字符 如果下一个字符的优先级小于等于 0,则向符号站中压入连接运算符 '..'
              if (i + 1 < str.length && Priority(str[i + 1]) <= 0) {
                str = insertChar(str, '..', i + 1);
                i += 3;  //当前位置向前移三位
              }
              else {
                i++;
              }
              break;
            }
            else {
              i++;
            }
            break;
          case ')':
            // 向前看一个字符，如果下一个字符的优先级小于等于 0，则在运算符栈中压入一个连接运算符 '..'
            if (i + 1 < str.length && Priority(str[i + 1]) <= 0) {
              str = insertChar(str, '..', i + 1);
              i += 3;  //当前位置向右移三位
            }
            else {
              i++;
            }
            break;
          case '[':
            i++;
            while (str[i] != ']') {
              i++;
            }
            //再看']'的下一个字符，如果下一个字符优先级小于等于零，则在符号站中压入连接运算符 '..'
            if (i + 1 < str.length && Priority(str[i + 1]) <= 0) {
              str = insertChar(str, '..', i + 1);
              i += 3;  //当前位置向右移三位
            }
            else {
              i++;
            }
            break;
          case ']':
            return { state: 0, message: "single \'\]\'." }
            break;
        }
        break;
      case 1:  //当前字符是单目运算符 '*' '+' '{' '?' '}' '\'
        switch (currentChar) {
          case '\\':
            //如果转义运算符后面跟的是运算符，这把运算符转义
            if (Priority(str[i + 1]) >= 0) {
              i++;
              //向前看一个字符，如果下一个字符的优先级小于等于零，则在符号栈中压入链接运算符'..'
              if (i + 1 < str.length && Priority(str[i + 1]) <= 0) {
                str = insertChar(str, '..', i + 1);
                i += 3;  //当前位置向右移三位
              }
              else {
                i++;
              }
              break;
            }
            //如果转义运算符后面跟的是 'd', 则表示 [0-9]
            else if (str[i + 1] == 'd') {
              i++;
              //向前看一个字符，如果下一个字符的优先级小于等于零，则在符号栈中压入链接运算符'..'
              if (i + 1 < str.length && Priority(str[i + 1]) <= 0) {
                str = insertChar(str, '..', i + 1);
                i += 3;  //当前位置向右移三位
              }
              else {
                i++;
              }
              break;
            }
            //如果转义运算符后面跟的不是运算符也不是字符 'd'，则报错
            else {
              return { state: 0, message: "invalid char after \'\\\'" }
            }
            break;
          case '*':
            // 向前看一个字符，如果下一个字符的优先级小于等于 0，则在运算符栈中压入一个连接运算符 '..'
            if (i + 1 < str.length && Priority(str[i + 1]) <= 0) {
              str = insertChar(str, '..', i + 1);
              i += 3;  //当前位置向右移三位
            }
            else {
              i++;
            }
            break;
          case '+':
            // 向前看一个字符，如果下一个字符的优先级小于等于 0，则在运算符栈中压入一个连接运算符 '..'
            if (i + 1 < str.length && Priority(str[i + 1]) <= 0) {
              str = insertChar(str, '..', i + 1);
              i += 3;  //当前位置向右移三位
            }
            else {
              i++;
            }
            break;
          case '?':
            // 向前看一个字符，如果下一个字符的优先级小于等于 0，则在运算符栈中压入一个连接运算符 '..'
            if (i + 1 < str.length && Priority(str[i + 1]) <= 0) {
              str = insertChar(str, '..', i + 1);
              i += 3;  //当前位置向右移三位
            }
            else {
              i++;
            }
            break;
          case '{':
            var next = i + 1;
            for (; next < str.length; next++) {
              if (str[next] === ',' || str[next] === '}') {
                break;
              }
            }
            if (str[next] === ',') {
              if (str[next + 1] === '}') {
              }
              else if (str[next + 2] === '}') {
              }
              else {
                return { state: 0, message: "single \'\{\'." };
              }
            }
            if (next == str.length && str[next] !== '}') {
              return { state: 0, message: "single \'\{\'." };
            }
            if (str[next] === '}') {
              var numStr = "";
              var num;
              if (next - i === 1) {
                num = 0;
              }
              else {
                for (var m = i + 1; m < tempCount; m++) {
                  if (str[m] != '0' && str[m] != '1' && str[m] != '2' && str[m] != '3' && str[m] != '4' &&
                    str[m] != '5' && str[m] != '6' && str[m] != '7' && str[m] != '8' && str[m] != '9') {
                    return { state: 0, message: "please enter integer in '{}'" };
                  }
                  numStr += str[m];
                }
                num = parseInt(numStr);
              }
              if (num < 0) {
                return { state: 0, message: "num<0 after \'\{\'" };
              }
              i = next;
            }
            else {
              var numOne;
              var numTwo;
              //检查第一个数字
              if (next - i === 1) {
                numOne = 0;
              }
              else {
                var numStr = ""
                for (var m = i + 1; m < next; m++) {
                  numStr += str[m]
                }
                // var numStr = numStrArray.join("")
                numOne = parseInt(numStr)
                if (numOne < 0) {
                  // console.log("numOne < 0 , invalid")
                  return { state: 0, message: "numOne<0 after \'\{\'." };
                  break;
                }
              }
              //检查第二个数字
              i = next;
              next = i + 1;
              for (let m = next; m < str.length; m++) {
                if (str[m] === '}') {
                  i = m;
                  break
                }
              }
              if (i === next) {
                numTwo = -1;
              }
              else {
                var numStr = ""//new Array()
                for (let m = next; m < i; m++) {
                  numStr += str[m]
                }
                // var numStr = numStrArray.join("")
                numTwo = parseInt(numStr)
                if (numTwo < numOne) {
                  return { state: 0, message: "numOne<numTwo after \'\{\'" }
                  break;
                }
              }
            }
            // 向前看一个字符，如果下一个字符的优先级小于等于 0，则在运算符栈中压入一个连接运算符 '..'
            if (i + 1 < str.length && Priority(str[i + 1]) <= 0) {
              str = insertChar(str, '..', i + 1);
              i += 3;  //当前位置向右移三位
            }
            else {
              i++;
            }
            break;
          case '}':
            return { state: 0, message: "single \'\}\'." };
            break;
        }
        break;
      case 2:  //当前字符是双目运算符 '|' '..'
        i++;
        break;
    }
  }
  this.regularString = str;
  return { state: 1, message: "" };
}
//向正则表达式中添加括号第一步，为属于集合 {a*,a+,a?,a{},\d,\m,[]} 中类型的字符串添加'<>'
function addBracketFirst() {
  var str = this.regularString;
  for (let i = 0; i < str.length;) {
    var currentChar = str[i];
    switch (NumOfParams(currentChar)) {
      case -1: //常规字符
        var next = i + 1;
        if (str[next] === '*') {
          str = insertChar(str, '<', i);
          str = insertChar(str, '>', next + 2);
          i = next + 3;
        }
        else if (str[next] === '+') {
          str = insertChar(str, '<', i);
          str = insertChar(str, '>', next + 2);
          i = next + 3;
        }
        else if (str[next] === '?') {
          str = insertChar(str, '<', i);
          str = insertChar(str, '>', next + 2);
          i = next + 3;
        }
        else if (str[next] === '{') {
          while (str[next] !== '}') {
            next++;
          }
          str = insertChar(str, '<', i);
          str = insertChar(str, '>', next + 2);
          i = next + 3;
        }
        else {
          i++;
        }
        break;
      case 0:
        switch (currentChar) {
          case '[':
            var next = i + 1;
            while (str[next] !== ']') {
              next++;
            }
            str = insertChar(str, '<', i);
            str = insertChar(str, '>', next + 2);
            i = next + 3;
            break;
          // case '(':
          //   i=bracketDetection(i,str);
          //   break;
          default:
            i++;
        }
        break;
      case 1:
        switch (currentChar) {
          case '\\':
            var next = i + 1;
            str = insertChar(str, '<', i);
            str = insertChar(str, '>', next + 2);
            i = next + 3; //写到这了
            break;
          default:
            i++;
        }
        break;
      default:
        i++;
    }
  }
  this.regularString = str;
  return { state: 1, message: "" };
}
//向正则表达式中添加括号第二步，为属于集合 { ()*,()+,()?,(){},<>*,<>+,<>?,<>{} } 中类型的字符串添加 '<>'
function addBracketSecond() {
  var str = this.regularString;
  for (let i = 0; i < str.length;) {
    var currentChar = str[i];
    if (currentChar === '(') {
      var next = bracketDetection(i, str) + 1;
      // var next=i+1;
      // var countLeftBracket=1;
      // var countRightBracket=0;
      // while(countLeftBracket!==countRightBracket){
      //   if(next<str.length && str[next]==='('){
      //     countLeftBracket++;
      //     next++;
      //   }
      //   else if(next<str.length && str[next]===')'){
      //     countRightBracket++;
      //     next++;
      //   }
      //   else{
      //     next++;
      //   }
      // }
      if (str[next] === '*') {
        str = insertChar(str, '<', i);
        str = insertChar(str, '>', next + 2);
        i = next + 3;
      }
      else if (str[next] === '+') {
        str = insertChar(str, '<', i);
        str = insertChar(str, '>', next + 2);
        i = next + 3;
      }
      else if (str[next] === '?') {
        str = insertChar(str, '<', i);
        str = insertChar(str, '>', next + 2);
        i = next + 3;
      }
      else if (str[next] === '{') {
        while (str[next] !== '}') {
          next++;
        }
        str = insertChar(str, '<', i);
        str = insertChar(str, '>', next + 2);
        i = next + 3;
      }
      else {
        i++;
      }
    }
    else if (currentChar === '<') {
      var next = i + 1;
      var countLeftBracket = 1;
      var countRightBracket = 0;
      while (countLeftBracket !== countRightBracket) {
        if (next < str.length && str[next] === '<') {
          countLeftBracket++;
          next++;
        }
        else if (next < str.length && str[next] === '>') {
          countRightBracket++;
          next++;
        }
        else {
          next++;
        }
      }
      if (str[next] === '*') {
        str = insertChar(str, '<', i);
        str = insertChar(str, '>', next + 2);
        i = next + 3;
      }
      else if (str[next] === '+') {
        str = insertChar(str, '<', i);
        str = insertChar(str, '>', next + 2);
        i = next + 3;
      }
      else if (str[next] === '?') {
        str = insertChar(str, '<', i);
        str = insertChar(str, '>', next + 2);
        i = next + 3;
      }
      else if (str[next] === '{') {
        while (str[next] !== '}') {
          next++;
        }
        str = insertChar(str, '<', i);
        str = insertChar(str, '>', next + 2);
        i = next + 3;
      }
      else {
        i++;
      }
    }
    else {
      i++;
    }
  }
  this.regularString = str;
  return { state: 1, message: "" };
}
//向正则表达式中添加括号第三步，将 X..Y 变为 <X..Y>，其中 X,Y 属于集合 { a,(),<> }
function addBracketThird(str = this.regularString) {
  var i = 0;
  for (; i < str.length;) {
    var currentChar = str[i];
    switch (NumOfParams(currentChar)) {
      case -1:  //常规字符
        var next = i + 1;  //看向常规字符的下一位
        if (next == str.length) {  //扫描到字符串末尾了
          i = next;
          break;  //算法结束
        }
        else {
          if (str[next] == '.') {  //如果下一位是一个连接符的开始 '.'，则表示应该加括号
            str = insertChar(str, '<', i);
            i += 4;  //将当前位置指向连接符 '..' 的下一位。因为添加了一个 '('，所以要加4。
            currentChar = str[i];
            if (NumOfParams(currentChar) === -1) {  //当前字符是常规字符
              str = insertChar(str, '>', i + 1);  // 在当前位置的下一个位置插入一个右尖括号 '>'
              i = 0; //重新开始扫描字符串
              break;
            }
            else if (currentChar == '(') {  //当前位置是一个左括号 '('
              i = bracketDetection(i, str);  //将当前位置更改为该左括号匹配的右括号的下标。
              str = insertChar(str, '>', i + 1); //在当前位置的下一个位置插入一个右尖括号 '>'
              i = 0;  //重新开始扫描字符串
              break;
            }
            else if (currentChar === '<') {
              i = bracketDetection(i, str);  //将当前位置更改为该左尖括号匹配的右尖括号的下标。
              str = insertChar(str, '>', i + 1); //在当前位置的下一个位置插入一个右尖括号 '>'
              i = 0;  //重新开始扫描字符串
              break;
            }
            else {
              return { state: 0, message: "Regular string error!" };
            }
          }
          else if (str[next] == '|') {  //如果下一位是一个或运算符 '|'
            i += 2;  //不做任何处理，当前位置指向或运算符后面的位置
          }
          else {  //如果下一位不是连接符的开始，也不是或运算符，说明正则表达式有问题，报错。
            return { state: 0, message: "Regular String Error!" };
          }
        }
        break;
      case 0:  //运算符 '(' 和 ')' 和 '<' 和 '>'
        if (currentChar == '(') {
          var leftIndex = i;  //记录左括号的下标
          var rightIndex = bracketDetection(i, str);  //将当前位置更改为与该左括号匹配的右括号的下标
          //取出括号内的字符串，递归调用 addBracketThird() 函数
          // str=str.substring(0,leftIndex+1)+(addBracketFirst(str.substring(leftIndex+1,rightIndex))).str+str.substring(rightIndex,str.length);
          i = bracketDetection(leftIndex, str);
          next = i + 1;
          if (next == str.length) {  //扫描到字符串末尾了
            i = next;
            break;  //算法终止
          }
          else {
            if (str[next] == '.') {  //如果下一位是连接符的开始 '.'
              str = insertChar(str, '<', leftIndex);  //在左括号前面加一个左尖括号
              i += 4;  //将当前位置指向连接符 '..' 的下一位。因为添加了一个 '('，所以要加4。
              currentChar = str[i];
              if (NumOfParams(currentChar) === -1) {  //当前字符是常规字符
                str = insertChar(str, '>', i + 1);  // 在当前位置的下一个位置插入一个右尖括号 '>'
                i = 0; //重新开始扫描字符串
                break;
              }
              else if (currentChar == '(') {  //当前位置是一个左括号 '('
                i = bracketDetection(i, str);  //将当前位置更改为该左括号匹配的右括号的下标。
                str = insertChar(str, '>', i + 1); //在当前位置的下一个位置插入一个右尖括号 '>'
                i = 0;  //重新开始扫描字符串
                break;
              }
              else if (currentChar === '<') {
                i = bracketDetection(i, str);  //将当前位置更改为该左尖括号匹配的右尖括号的下标。
                str = insertChar(str, '>', i + 1); //在当前位置的下一个位置插入一个右尖括号 '>'
                i = 0;  //重新开始扫描字符串
                break;
              }
              else {
                return { state: 0, message: "Regular string error!" };
              }
            }
            else if (str[next] == '|') {
              i += 2;  //将当前位置指向或运算符后面的位置
            }
            else {
              return { state: 0, message: "Regular String Error!" };
            }
          }
        }
        else if (currentChar == ')') {
          return { state: 0, message: "Single \')\'!" };
        }
        else if (currentChar === '<') {
          var leftIndex = i;  //记录左尖括号的下标
          i = bracketDetection(i, str);  //将当前位置更改为与该左尖括号匹配的右尖括号的下标
          next = i + 1;
          if (next == str.length) {  //扫描到字符串末尾了
            i = next;
            break;  //算法终止
          }
          else {
            if (str[next] == '.') {  //如果下一位是连接符的开始 '.'
              str = insertChar(str, '<', leftIndex);  //在左尖括号前面加一个左尖括号
              i += 4;  //将当前位置指向连接符 '..' 的下一位。因为添加了一个 '<'，所以要加4。
              currentChar = str[i];
              if (NumOfParams(currentChar) === -1) {  //当前字符是常规字符
                str = insertChar(str, '>', i + 1);  // 在当前位置的下一个位置插入一个右尖括号 '>'
                i = 0; //重新开始扫描字符串
                break;
              }
              else if (currentChar == '(') {  //当前位置是一个左括号 '('
                i = bracketDetection(i, str);  //将当前位置更改为该左括号匹配的右括号的下标。
                str = insertChar(str, '>', i + 1); //在当前位置的下一个位置插入一个右尖括号 '>'
                i = 0;  //重新开始扫描字符串
                break;
              }
              else if (currentChar === '<') {  //当前位置是一个左尖括号 '<'
                i = bracketDetection(i, str);  //将当前位置更改为该左尖括号匹配的右尖括号的下标。
                str = insertChar(str, '>', i + 1); //在当前位置的下一个位置插入一个右尖括号 '>'
                i = 0;  //重新开始扫描字符串
                break;
              }
              else {
                return { state: 0, message: "Regular string error!" };
              }
            }
            else if (str[next] == '|') {
              i += 2;  //将当前位置指向或运算符后面的位置
            }
            else {
              return { state: 0, message: "Regular String Error!" };
            }
          }
        }
        else if (currentChar === '>') {
          return { state: 0, message: "Single \'>\'!" };
        }
        else {
          return { state: 0, message: "Regular string Error!" };
        }
        break;
      default:
        return { state: 0, message: "Regular string Error!" };
    }
  }
  this.regularString = str;
  return { state: 1, message: "" };
}
//向正则表达式中添加括号第四步，将 X|Y 变为 <X|Y>，其中 X,Y 属于集合 { a,(),<> }
function addBracketFourth() {
  var str = this.regularString;
  var i = 0;
  for (; i < str.length;) {
    var currentChar = str[i];
    switch (NumOfParams(currentChar)) {
      case -1:  //常规字符
        var next = i + 1;  //看向常规字符的下一位
        if (next == str.length) {  //扫描到字符串末尾了
          i = next;
          break;  //算法结束
        }
        else {
          if (str[next] == '|') {  //如果下一位是一个或运算符 ‘|’
            str = insertChar(str, '<', i);
            i += 3;  //将当前位置指向或运算符 '|' 的下一位。因为添加了一个 '<'，所以要加3。
            currentChar = str[i];
            if (NumOfParams(currentChar) === -1) {  //当前字符是常规字符
              str = insertChar(str, '>', i + 1);  // 在当前位置的下一个位置插入一个右尖括号 '>'
              i = 0; //重新开始扫描字符串
              break;
            }
            else if (currentChar == '(') {  //当前位置是一个左括号 '('
              i = bracketDetection(i, str);  //将当前位置更改为该左括号匹配的右括号的下标。
              str = insertChar(str, '>', i + 1); //在当前位置的下一个位置插入一个右尖括号 '>'
              i = 0;  //重新开始扫描字符串
              break;
            }
            else if (currentChar == '<') {  //当前位置是一个左尖括号 '<'
              i = bracketDetection(i, str);  //将当前位置更改为该左括号匹配的右括号的下标。
              str = insertChar(str, '>', i + 1); //在当前位置的下一个位置插入一个右尖括号 '>'
              i = 0;  //重新开始扫描字符串
              break;
            }
            else {
              return { state: 0, message: "Regular string error!" };
            }
          }
          else {  //如果下一位不是或运算符，说明正则表达式有问题，报错。
            return { state: 0, message: "Regular String Error!" };
          }
        }
        break;
      case 0:  //运算符 '(' 和 ')' 和 '<' 和 '>'
        if (currentChar == '(') {
          var leftIndex = i;  //记录左括号的下标
          i = bracketDetection(i, str);  //将当前位置更改为与该左括号匹配的右括号的下标
          next = i + 1;
          if (next == str.length) {  //扫描到字符串末尾了
            i = next;
            break;  //算法终止
          }
          else {
            if (str[next] == '|') {  //如果下一位是或运算符 ‘|’
              str = insertChar(str, '<', leftIndex);  //在左括号前面加一个左尖括号
              i += 3;  //将当前位置指向或运算符 '|' 的下一位。因为添加了一个 '<'，所以要加3。
              currentChar = str[i];
              if (NumOfParams(currentChar) === -1) {  //当前字符是常规字符
                str = insertChar(str, '>', i + 1);  // 在当前位置的下一个位置插入一个右尖括号 '>'
                i = 0; //重新开始扫描字符串
                break;
              }
              else if (currentChar == '(') {  //当前位置是一个左括号 '('
                i = bracketDetection(i, str);  //将当前位置更改为该左括号匹配的右括号的下标。
                str = insertChar(str, '>', i + 1); //在当前位置的下一个位置插入一个右尖括号 '>'
                i = 0;  //重新开始扫描字符串
                break;
              }
              else if (currentChar == '<') {  //当前位置是一个左尖括号 '<'
                i = bracketDetection(i, str);  //将当前位置更改为该左括号匹配的右括号的下标。
                str = insertChar(str, '>', i + 1); //在当前位置的下一个位置插入一个右尖括号 '>'
                i = 0;  //重新开始扫描字符串
                break;
              }
              else {
                return { state: 0, message: "Regular string error!" };
              }
            }
            else {
              return { state: 0, message: "Regular String Error!" };
            }
          }
        }
        else if (currentChar == ')') {
          return { state: 0, message: "Single \')\'!" };
        }
        else if (currentChar === '<') {
          var leftIndex = i;  //记录左尖括号的下标
          i = bracketDetection(i, str);  //将当前位置更改为与该左尖括号匹配的右尖括号的下标
          next = i + 1;
          if (next == str.length) {  //扫描到字符串末尾了
            i = next;
            break;  //算法终止
          }
          else {
            if (str[next] == '|') {  //如果下一位是或运算符 ‘|’
              str = insertChar(str, '<', leftIndex);  //在左尖括号前面加一个左尖括号
              i += 3;  //将当前位置指向或运算符 '|' 的下一位。因为添加了一个 '<'，所以要加3。
              currentChar = str[i];
              if (NumOfParams(currentChar) === -1) {  //当前字符是常规字符
                str = insertChar(str, '>', i + 1);  // 在当前位置的下一个位置插入一个右尖括号 '>'
                i = 0; //重新开始扫描字符串
                break;
              }
              else if (currentChar == '(') {  //当前位置是一个左括号 '('
                i = bracketDetection(i, str);  //将当前位置更改为该左括号匹配的右括号的下标。
                str = insertChar(str, '>', i + 1); //在当前位置的下一个位置插入一个右尖括号 '>'
                i = 0;  //重新开始扫描字符串
                break;
              }
              else if (currentChar == '<') {  //当前位置是一个左尖括号 '<'
                i = bracketDetection(i, str);  //将当前位置更改为该左尖括号匹配的右尖括号的下标。
                str = insertChar(str, '>', i + 1); //在当前位置的下一个位置插入一个右尖括号 '>'
                i = 0;  //重新开始扫描字符串
                break;
              }
              else {
                return { state: 0, message: "Regular string error!" };
              }
            }
            else {
              return { state: 0, message: "Regular String Error!" };
            }
          }
        }
        else if (currentChar === '>') {
          return { state: 0, message: "Single \'>\'!" };
        }
        else {
          return { state: 0, message: "Regular string Error!" };
        }
        break;
      default:
        return { state: 0, message: "Regular string Error!" };
    }
  }
  this.regularString = str;
  return { state: 1, message: "" };
}
//去除连接运算符
function removeConnector() {
  var str = this.regularString;
  for (let i = 0; i < str.length;) {
    var currentChar = str[i];
    if (currentChar === '.') {
      str = str.substring(0, i) + str.substring(i + 2, str.length);
    }
    else {
      i++;
    }
  }
  this.regularString = str;
  return { state: 1, message: "" };
}

//给一组正则表达式组添加语义
var finalAddSemantic = function (strArray) {
  this.strArray = strArray;
  this.strArrayAddSemantic = strArrayAddSemantic;
  this.newStrArray = new Array();  //一个空数组，储存添加语义后的正则表达式
}
//给一组正则表达式增加语义信息
function strArrayAddSemantic() {
  for (let i = 0; i < this.strArray.length; ++i) {
    var temp = new singleRegularStringAddSemantic(this.strArray[i]);
    var tempState = temp.addSemantic();
    if (tempState.state === 0) {
      var num = i + 1;
      return { state: 0, message: "第" + num + "条正则表达式出错，" + tempState.message };
    }
    else {
      this.newStrArray.push(temp.regularString);
    }
  }
  return { state: 1, message: "" };
}


// // 测试
// // var temp="abcdefg"
// // var subTemp=temp.substring(2,3);
// // console.log(subTemp);
// // 测试向正则表达式中添加小括号
// console.log("start");
// var test=new singleRegularStringAddSemantic
// // ("(adf(ss)*)*dd");
// ("(a*a+a?a{1,2}|\\d\\+[as])");
// // ("asddfa*a+a?a{1,2}\\d\\+[as]|(as)*hjkl(as)+(a*a+a?a{1,2}|\\d\\+[as])?(as){1,2}");
// test.addConnector();
// console.log(test.regularString);
// test.addBracketFirst();
// console.log(test.regularString);
// test.addBracketSecond();
// console.log(test.regularString);
// test.addBracketThird();
// console.log(test.regularString);
// test.addBracketFourth();
// console.log(test.regularString);
// test.removeConnector();
// console.log(test.regularString);

module.exports = function (strArray) {
  var temp = new finalAddSemantic(strArray);
  var stateReturn = temp.strArrayAddSemantic();
  if (stateReturn.state === 0) {
    return stateReturn;
  }
  else {
    return { state: 1, message: stateReturn.message, result: temp.newStrArray };
  }
}
