// GLOBALS
// AST types
const PROGRAM = 'PROGRAM';
const BLOCK = 'BLOCK';
const COMMAND = 'COMMAND';
const ASSIGNMENT = 'ASSIGNMENT';
// Command names
const LENGTH = 'LENGTH';
const SET = 'SET';
const MOVE = 'MOVE';
const LOOP = 'LOOP';


// Demos
const demos = [
`SET p1 @ 1
SET p2 @ 16

LOOP 3 {
	MOVE p1 1
	MOVE p2 -1
}`,

`SET p1 #ffae00 @ 1
SET p2 #f49820 @ 2
SET p3 #ea8340 @ 3
SET p4 #df6d60 @ 4
SET p5 #d55780 @ 5
SET p6 #ca419f @ 6
SET p7 #bf2cbf @ 7
SET p8 #b516df @ 8
SET p9 #aa00ff @ 9
SET p10 #b516df @ 10
SET p11 #bf2cbf @ 11
SET p12 #ca419f @ 12
SET p13 #d55780 @ 13
SET p14 #df6d60 @ 14
SET p15 #ea8340 @ 15
SET p16 #f49820 @ 16

LOOP 4 {
	MOVE p1 1
	MOVE p2 1
	MOVE p3 1
	MOVE p4 1
	MOVE p5 1
	MOVE p6 1
	MOVE p7 1
	MOVE p8 1
	MOVE p9 1
	MOVE p10 1
	MOVE p11 1
	MOVE p12 1
	MOVE p13 1
	MOVE p14 1
	MOVE p15 1
	MOVE p16 1
}`,

`LENGTH = 50

SET p1 #06A @ 1
SET p2 #0AC @ 2
SET p3 #0FF @ 3
SET p4 #06A @ 7
SET p5 #0AC @ 8
SET p6 #0FF @ 9
SET p7 #06A @ 13
SET p8 #0AC @ 14
SET p9 #0FF @ 15

LOOP 1 {
	MOVE p1 1
	MOVE p2 1
	MOVE p3 1
	MOVE p4 1
	MOVE p5 1
	MOVE p6 1
	MOVE p7 1
	MOVE p8 1
	MOVE p9 1
}`,

`LENGTH = 29

SET p1 @ 1
SET p2 @ 9
SET p3 @ 19
SET p4 @ 29

LOOP 3 {
	MOVE p1 1
	MOVE p2 -1
	MOVE p3 1
	MOVE p4 -1
}`];


const demoBtnsContainerNode = document.getElementById('demo-btns');
demos.forEach((src, i) => {
  const btn = document.createElement('span');
  btn.textContent = i + 1 + '';
  btn.classList.add('btn');
  demoBtnsContainerNode.appendChild(btn);
  btn.addEventListener('click', () => {
    let overwrite = true;
    if (srcChanged) {
      overwrite = confirm('This will overwrite your code. Continue?');
    }
    if (overwrite) {
      editorNode.value = src;
      handleSourceChange();
      handleSourceChange.flush();
      srcChanged = false;
    }
  });
});



// Initialize editor
const initialSrc = demos[0];

const appNode = document.getElementById('app');
const appPanelNode = document.getElementById('app-panel');
const editorNode = document.getElementById('editor');
const errorOutputNode = document.getElementById('error-output');
const astOutputNode = document.getElementById('ast-output');

editorNode.value = initialSrc;

let srcChanged = false;
const handleSourceChange = _.debounce(() => {
  const src = editorNode.value;
  const ast = parse(lex(src), PROGRAM);
  displayAST(ast);
  runProgram(ast);
  srcChanged = true;
}, 500);

const showAppErrors = errors => {
  const hasError = !!errors.length;
  appPanelNode.classList.toggle('error', hasError);
  errorOutputNode.innerHTML = '';
  if (hasError) {
    errors.forEach(error => {
      const errorNode = document.createElement('p');
      errorNode.textContent = error;
      errorOutputNode.appendChild(errorNode);
    });
  }
};

const displayAST = ast => {
  astOutputNode.textContent = JSON.stringify(ast, undefined, "\t");
};

// Process initial editor value
setTimeout(() => {
  handleSourceChange();
  handleSourceChange.flush();
  srcChanged = false;
}, 0);


editorNode.addEventListener('input', handleSourceChange);

// Allow tabs to be captured
editorNode.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 9) {// tab was pressed
    // get caret position/selection
    var start = this.selectionStart;
    var end = this.selectionEnd;

    var target = evt.target;
    var value = target.value;

    // set textarea value to: text before caret + tab + text after caret
    target.value = value.substring(0, start) +
    "\t" +
    value.substring(end);

    // put caret at right position again (add one for the tab)
    this.selectionStart = this.selectionEnd = start + 1;

    // prevent the focus loss
    evt.preventDefault();

    // Notify change handler
    handleSourceChange();
  }
}, false);


// Initialize app
const defaultLineLength = 16;
let lineLength = defaultLineLength;
let lineItems = [];

const initApp = () => {
  lineItems = [];
  appNode.innerHTML = '';
  for (let i = 0; i < lineLength; i++) {
    const item = document.createElement('div');
    item.classList.add('line-item');
    item.style.padding = `calc(${1 / lineLength * 50}% - 0.5px)`;
    lineItems.push(item);
    appNode.appendChild(item);
  }
};

const renderPoints = points => {
  lineItems.forEach(item => {
    item.style.backgroundColor = 'transparent';
  });

  Object.keys(points).forEach(pointName => {
    const pt = points[pointName];
    let index = (pt.x - 1) % lineLength;
    if (index < 0) index = lineLength + index;
    const item = lineItems[index];
    item.style.backgroundColor = pt.color || 'white';
  });
};

initApp();


// RAF loop runs outside of interpreter
let frameCount = 0;
let onEnterFrame;
const rafHandler = () => {
  onEnterFrame && onEnterFrame();
  frameCount++;
  requestAnimationFrame(rafHandler);
};
rafHandler();

// Interpreter
const runProgram = ast => {
  const program = ast.body;
  const errors = [
  ...ast.errors.map(error => 'ParseError: ' + error),
  ...checkASTErrors(ast)];

  showAppErrors(errors);

  if (!errors.length) {
    const points = {};

    const applyMovement = commands => commands.forEach(cmd => {
      if (cmd.type === COMMAND && cmd.command === MOVE) {
        points[cmd.pointName].x += cmd.pointDelta;
      }
    });

    let setLength = defaultLineLength;

    program.forEach(item => {
      // Define points
      if (item.type === COMMAND && item.command === SET) {
        points[item.pointName] = {
          x: item.pointPosition,
          color: item.pointColor };

      }
      // set length
      else if (item.type === ASSIGNMENT) {
          if (item.property === LENGTH) {
            setLength = item.value;
          }
        }
    });

    if (setLength !== lineLength) {
      lineLength = setLength;
      initApp();
    }

    // Apply immediate movement
    applyMovement(program);

    // Render initial points
    renderPoints(points);

    // hook into animation loop if needed
    const loops = program.filter(item => item.type === COMMAND && item.command === LOOP);
    if (loops.length) {
      // reset frame count first
      frameCount = 0;
      onEnterFrame = () => {
        let didChange = false;
        loops.forEach(loop => {
          if (frameCount % loop.delay === 0) {
            didChange = true;
            applyMovement(loop.block.body);
          }
        });

        didChange && renderPoints(points);
      };
    } else
    {
      onEnterFrame = null;
    }
  }
};


// Check a parsed AST for errors (what could become runtime errors)
const checkASTErrors = ast => {
  const program = ast.body;
  const errors = [];

  // Sort AST by types
  const definedPointNames = [];
  const usedPointNames = [];
  const loops = [];
  program.forEach(item => {
    if (item.type === COMMAND) {
      if (item.command === SET) {
        definedPointNames.push(item.pointName);
      } else
      if (item.command === MOVE) {
        usedPointNames.push(item.pointName);
      } else
      if (item.command === LOOP) {
        loops.push(item);

        // Track MOVE commands inside loops
        item.block.body.forEach(loopItem => {
          if (loopItem.command === MOVE) {
            usedPointNames.push(loopItem.pointName);
          }
        });
      }
    } else
    if (item.type === ASSIGNMENT) {
      if (item.property === LENGTH) {
        if (item.value < 1) {
          errors.push('LENGTH must be a positive integer.');
        }
      }
    }
  });

  // Check for duplicate point names
  _.forEach(_.countBy(definedPointNames), (value, key) => {
    if (value > 1) {
      errors.push(`A point named "${key}" already exists.`);
    }
  });

  // Check for undefined point names
  usedPointNames.forEach(name => {
    if (definedPointNames.indexOf(name) === -1) {
      errors.push(`Point "${name}" has not been set.`);
    }
  });

  // Only MOVE commands should be inside loops
  let loopCmdErrCount = 0;
  loops.forEach(loop => {
    if (loop.delay < 1) {
      errors.push('LOOP delay must be a positive integer.');
    }

    loop.block.body.forEach(item => {
      if (item.type !== COMMAND || item.command !== MOVE) {
        loopCmdErrCount++;
      }
    });
  });

  if (loopCmdErrCount) {
    errors.push(`Only MOVE commands can be used in LOOP blocks${loopCmdErrCount > 1 ? ` (${loopCmdErrCount} violations)` : ''}.`);
  }

  return errors;
};


// Given a source code string, return array of tokens
const lex = src => {
  return _.trim(src).split(/\s+/);
};

// Given array of tokens and a type, return AST
const parse = (tokens, type) => {
  const fullAST = { type, body: [], errors: [] };
  const body = fullAST.body;
  const errors = fullAST.errors;

  const commandParsers = {
    [LENGTH]: parseLENGTH,
    [SET]: parseSET,
    [MOVE]: parseMOVE,
    [LOOP]: parseLOOP };

  const commandList = Object.keys(commandParsers);

  const parseToken = (token, tokenIndex) => {
    for (let i = commandList.length - 1; i >= 0; i--) {
      const parser = commandParsers[commandList[i]];
      const result = parser(token, tokenIndex, tokens);
      if (result) return result;
    }
    return null;
  };

  const tokenCount = tokens.length;
  for (let i = 0; i < tokenCount; i++) {
    const thisToken = tokens[i];
    const result = parseToken(thisToken, i);
    if (!result) {
      errors.push(`Token was not a valid command ("${thisToken}").`);
      break;
    } else
    if (result.errors) {
      errors.push(...result.errors);
      break;
    } else
    {
      body.push(result.ast);
      i += result.movePointer;
    }
  }

  return fullAST;
};


// Parse a block
const parseBlock = (tokens, startIndex) => {
  const blockStartToken = tokens[startIndex];
  // Immediately return error if block isn't properly opened
  if (blockStartToken !== '{') return { errors: ['Block must start with open bracket "{".'] };

  // Find end of block - must consider nested and sibling blocks
  const realStartIndex = startIndex + 1; // skip over "{"
  const tokenCount = tokens.length;
  let depth = 0;
  let endIndex;
  for (let i = realStartIndex; i < tokenCount; i++) {
    const thisToken = tokens[i];
    if (thisToken === '{') {
      depth++;
    } else
    if (thisToken === '}') {
      if (depth === 0) {
        endIndex = i;
        break;
      } else
      {
        depth--;
      }
    }
  }

  if (!endIndex) return { errors: ['Block must end with closed bracket "}".'] };

  const blockTokens = tokens.slice(realStartIndex, endIndex);
  const blockAST = parse(blockTokens, BLOCK);

  // extract errors
  const errors = blockAST.errors;
  delete blockAST.errors;

  const block = {
    endIndex,
    ast: blockAST };


  if (errors.length) block.errors = errors;
  return block;
};

// Specific command parsers
const parseLENGTH = (token, i, tokens) => {
  if (token !== LENGTH) return null;

  const result = { movePointer: 0 };
  const errors = [];

  const assigner = tokens[i + 1];
  const value = +tokens[i + 2];

  if (assigner !== '=') {
    errors.push('LENGTH must be set with an "=" assignment (LENGTH = <value>).');
  } else
  if (isNaN(value)) {
    errors.push('LENGTH value must be a number (LENGTH = <value>).');
  } else
  {
    result.movePointer = 2;
    result.ast = {
      type: ASSIGNMENT,
      property: LENGTH,
      value: value | 0 };

  }

  if (errors.length) {
    result.errors = errors;
  }

  return result;
};


const parseSET = (token, i, tokens) => {
  if (token !== SET) return null;
  let argLen = 3;

  const result = { movePointer: 0 };
  const errors = [];

  const name = tokens[i + 1];
  let color = tokens[i + 2];
  if (color !== '@') {
    i++;
    argLen++;
  } else
  {
    color = null;
  }
  const positionDeclarator = tokens[i + 2];
  const position = +tokens[i + 3];

  if (positionDeclarator !== '@') {
    errors.push('"@" symbol must come after "SET <name>".');
  } else
  if (isNaN(position)) {
    errors.push('SET position must be a number (SET <name> @ <position>).');
  } else
  {
    result.movePointer = argLen;
    result.ast = {
      type: COMMAND,
      command: SET,
      pointName: name,
      pointColor: color,
      pointPosition: position | 0 };

  }

  if (errors.length) {
    result.errors = errors;
  }

  return result;
};


const parseMOVE = (token, i, tokens) => {
  if (token !== MOVE) return null;

  const result = { movePointer: 0 };
  const errors = [];

  const name = tokens[i + 1];
  const delta = +tokens[i + 2];

  if (isNaN(delta)) {
    errors.push('MOVE delta must be a number (MOVE <name> <delta>).');
  } else
  {
    result.movePointer = 2;
    result.ast = {
      type: COMMAND,
      command: MOVE,
      pointName: name,
      pointDelta: delta | 0 };

  }

  if (errors.length) {
    result.errors = errors;
  }

  return result;
};


const parseLOOP = (token, i, tokens) => {
  if (token !== LOOP) return null;

  const result = { movePointer: 0 };
  const errors = [];

  const delay = +tokens[i + 1];
  const openBlock = tokens[i + 2];

  if (isNaN(delay)) {
    errors.push('LOOP delay must be a number (LOOP <delay>).');
  } else
  if (openBlock !== '{') {
    errors.push('LOOP must define an execution block: { ... }');
  } else
  {
    const block = parseBlock(tokens, i + 2);

    if (block.errors) {
      errors.push(...block.errors);
    } else
    {
      result.movePointer = block.endIndex - i;
      result.ast = {
        type: COMMAND,
        command: LOOP,
        delay: delay | 0,
        block: block.ast };

    }
  }

  if (errors.length) {
    result.errors = errors;
  }

  return result;
};
