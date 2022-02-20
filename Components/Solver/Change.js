import { ChangeTypes } from 'mathsteps';
import NodeType from './NodeType.js'

const Change = {
	changeFormatFunctionMap: {}
};

const OP_TO_STRING = {
  '+': 'Addiere',
  '-': 'Subtrahiere',
  '*': 'Multipliziere',
  '/': 'Dividiere'
};

const COMPARATOR_TO_STRING = {
  '=': 'gleich',
  '>': 'größer als',
  '>=': 'größergleich',
  '<': 'kleiner als',
  '<=': 'kleinergleich',
};

// Given a step, will return the change and explanation for the change
// from the oldNode, newNode, and changeType
Change.formatChange = function(step) {
  if (!(step.changeType in Change.changeFormatFunctionMap)) {
  	// TODO: add tests that will alert us when a new change type doesn't
  	// have a change function yet
  	console.error(step.changeType + ' does not have a change function!');
    return step.changeType;
  }

  const changeFormatFunctionMap = Change.changeFormatFunctionMap[step.changeType];
  let changeDescription = changeFormatFunctionMap(step);
  if (!changeDescription) {
    return `\\text{${Change.ChangeText[step.changeType]}}`;
  }

  return changeDescription;
};

function getChangeNodes(node) {
  return node.filter(node => node.changeGroup);
}

function getOldChangeNodes(step) {
  if (step.oldNode) {
    return getChangeNodes(step.oldNode);
  }
  else if (step.oldEquation) {
    const leftChangeNodeStrings = getChangeNodes(step.oldEquation.leftNode);
    const rightChangeNodeStrings = getChangeNodes(step.oldEquation.rightNode);
    return [...leftChangeNodeStrings, ...rightChangeNodeStrings];
  }
  return null;
}

function getNewChangeNodes(step) {
  if (step.newNode) {
    return getChangeNodes(step.newNode);
  }
  else if (step.newEquation) {
    const leftChangeNodeStrings = getChangeNodes(step.newEquation.leftNode);
    const rightChangeNodeStrings = getChangeNodes(step.newEquation.rightNode);
    return [...leftChangeNodeStrings, ...rightChangeNodeStrings];
  }
  return null;
}

function nodesToString(nodes, duplicates=false) {
  // get rid of changeGroup so we can find duplicates
  nodes.forEach(node => { node.changeGroup = undefined; });

  let strings = nodes.map(node => node.toTex());
  if (!duplicates) {
    strings = [...new Set(strings)];
  }

  if (strings.length === 0) {
    return '';
  }
  else if (strings.length === 1) {
    return strings[0];
  }
  else {
    return `${strings.slice(0, -1).join(', ')} \\text{ und } ${strings.slice(-1)}`;
  }
}

// e.g. |-3| -> 3
Change.changeFormatFunctionMap[ChangeTypes.ABSOLUTE_VALUE] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  if (oldNodes.length !== 1) {
    return null;
  }

  const absNode = oldNodes[0];
  if (!NodeType.isFunction(absNode, 'abs')) {
    return null;
  }

  const string = absNode.args[0].toTex();
  return `\\text{Nehme den Betrag von } ${string}`;
};

// e.g. 2x + x -> 2x + 1x
Change.changeFormatFunctionMap[ChangeTypes.ADD_COEFFICIENT_OF_ONE] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  const newNodes = getNewChangeNodes(step);
  if (oldNodes.length === 0 || newNodes.length !== oldNodes.length) {
    return null;
  }

  const before = nodesToString(oldNodes);
  const after = nodesToString(newNodes);
  return `\\text{Schreibe } ${before} \\text{ als } ${after}`;
};

// e.g. x^2 * x -> x^2 * x^1
Change.changeFormatFunctionMap[ChangeTypes.ADD_EXPONENT_OF_ONE] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  const newNodes = getNewChangeNodes(step);
  if (oldNodes.length === 0 || newNodes.length !== oldNodes.length) {
    return null;
  }

  const before = nodesToString(oldNodes);
  const after = nodesToString(newNodes);
  return `\\text{Schreibe } ${before} \\text{ als } ${after}`;
};

// e.g. 1/2 + 1/3 -> 5/6
Change.changeFormatFunctionMap[ChangeTypes.ADD_FRACTIONS] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  const newNodes = getNewChangeNodes(step);
  if (oldNodes.length !== 1 || newNodes.length !== 1) {
    return null;
  }

  const opNode = oldNodes[0];
  if (!NodeType.isOperator(opNode) || opNode.op !== '+' || opNode.args.length > 3) {
    return null;
  }

  const before = nodesToString(opNode.args, true);
  const after = newNodes[0].toTex();
  return `\\text{Addiere } ${before} \\text{ zu } ${after}`;
};

// e.g. (1 + 2)/3 -> 3/3
Change.changeFormatFunctionMap[ChangeTypes.ADD_NUMERATORS] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. x^2 + x^2 -> 2x^2
Change.changeFormatFunctionMap[ChangeTypes.ADD_POLYNOMIAL_TERMS] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  const newNodes = getNewChangeNodes(step);
  if (oldNodes.length !== 1 || newNodes.length !== 1) {
    return null;
  }

  const opNode = oldNodes[0];
  if (!NodeType.isOperator(opNode) || opNode.op !== '+') {
    return null;
  }

  const before = nodesToString(opNode.args, true);
  const after = newNodes[0].toTex();
  return `\\text{Addiere } ${before} \\text{ zu } ${after}`;
};

// e.g. x - 3 = 2 -> x - 3 + 3 = 2 + 3
Change.changeFormatFunctionMap[ChangeTypes.ADD_TO_BOTH_SIDES] = function(step) {
  // there is a term node on each side of the equation
  const termNodes = getNewChangeNodes(step);
  if (termNodes.length !== 2) {
    return null;
  }

  const term = termNodes[0].toTex();
  return `\\text{Addiere } ${term} \\text{ zu beiden Seiten}`;
};

// e.g. (x + 2)/2 -> x/2 + 2/2
Change.changeFormatFunctionMap[ChangeTypes.BREAK_UP_FRACTION] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  if (oldNodes.length !== 1) {
    return null;
  }

  const before = nodesToString(oldNodes);
  return `\\text{Vereinfache den Bruch } ${before}`;
};

// e.g. nthRoot(x ^ 2, 4) -> nthRoot(x, 2)
Change.changeFormatFunctionMap[ChangeTypes.CANCEL_EXPONENT] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. nthRoot(x ^ 2, 2) -> x
Change.changeFormatFunctionMap[ChangeTypes.CANCEL_EXPONENT_AND_ROOT] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. nthRoot(x ^ 2, 2) -> x
Change.changeFormatFunctionMap[ChangeTypes.CANCEL_MINUSES] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. nthRoot(x ^ 4, 2) -> x ^ 2
Change.changeFormatFunctionMap[ChangeTypes.CANCEL_ROOT] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. 2x/2 -> x
Change.changeFormatFunctionMap[ChangeTypes.CANCEL_TERMS] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  if (oldNodes.length !== 1) {
    return null;
  }

  const before = nodesToString(oldNodes);
  return `\\text{Kürze } ${before} \\text{ vom Zähler und Nenner}`;
};

// e.g. 2 + x + 3 + x -> 5 + 2x
Change.changeFormatFunctionMap[ChangeTypes.COLLECT_AND_COMBINE_LIKE_TERMS] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. x^2 * x^3 * x^1 -> x^(2 + 3 + 1)
Change.changeFormatFunctionMap[ChangeTypes.COLLECT_EXPONENTS] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. x + 2 + x^2 + x + 4 -> x^2 + (x + x) + (4 + 2)
Change.changeFormatFunctionMap[ChangeTypes.COLLECT_LIKE_TERMS] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. 2/5 + 1/5 -> (2+1)/5
Change.changeFormatFunctionMap[ChangeTypes.COMBINE_NUMERATORS] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. nthRoot(2, 2) * nthRoot(3, 2) -> nthRoot(2 * 3, 2)
Change.changeFormatFunctionMap[ChangeTypes.COMBINE_UNDER_ROOT] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. 2/6 + 1/4 -> (2*2)/(6*2) + (1*3)/(4*3)
Change.changeFormatFunctionMap[ChangeTypes.COMMON_DENOMINATOR] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. 3 + 1/2 -> 6/2 + 1/2
Change.changeFormatFunctionMap[ChangeTypes.CONVERT_INTEGER_TO_FRACTION] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  const newNodes = getNewChangeNodes(step);
  if (oldNodes.length !== 1 || newNodes.length !== 1) {
    return null;
  }

  const before = nodesToString(oldNodes);
  const after = nodesToString(newNodes);
  return `\\text{Erweitere } ${before} \\text{ zu } ${after} \\text{ um den gleichen Zähler zu haben`;
};

// e.g. 2 * 2 * 2 -> 2 ^ 3
Change.changeFormatFunctionMap[ChangeTypes.CONVERT_MULTIPLICATION_TO_EXPONENT] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  const newNodes = getNewChangeNodes(step);
  if (oldNodes.length !== 1 || newNodes.length !== 1) {
    return null;
  }

  const before = nodesToString(oldNodes);
  const after = nodesToString(newNodes);
  return `\\text{Schreibe } ${before} \\text{ als } ${after}`;
};

// e.g. 2(x + y) -> 2x + 2y
Change.changeFormatFunctionMap[ChangeTypes.DISTRIBUTE] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. -(2 + x) -> -2 - x
Change.changeFormatFunctionMap[ChangeTypes.DISTRIBUTE_NEGATIVE_ONE] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. nthRoot(2 * x) -> nthRoot(2) * nthRoot(x)
Change.changeFormatFunctionMap[ChangeTypes.DISTRIBUTE_NTH_ROOT] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// 1.2 + 1/2 -> 1.2 + 0.5
Change.changeFormatFunctionMap[ChangeTypes.DIVIDE_FRACTION_FOR_ADDITION] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  const newNodes = getNewChangeNodes(step);
  if (oldNodes.length !== 1 || newNodes.length !== 1) {
    return null;
  }

  const before = nodesToString(oldNodes);
  const after = nodesToString(newNodes);
  return `\\text{Dividiere } ${before} \\text{ in die Dezimalform } ${after}`;
};

// e.g. 2x = 1 -> (2x)/2 = 1/2
Change.changeFormatFunctionMap[ChangeTypes.DIVIDE_FROM_BOTH_SIDES] = function(step) {
  const termNodes = getNewChangeNodes(step);
  if (termNodes.length !== 2) {
    return null;
  }

  const term = termNodes[0].toTex();
  return `\\text{Dividiere beide Seiten durch } ${term}`;
};

// e.g. 2/-1 -> -2
Change.changeFormatFunctionMap[ChangeTypes.DIVISION_BY_NEGATIVE_ONE] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  const newNodes = getNewChangeNodes(step);
  if (oldNodes.length !== 1 || newNodes.length !== 1) {
    return null;
  }

  const before = nodesToString(oldNodes);
  const after = nodesToString(newNodes);
  return `${before} \\text{ dividiert durch -1 } ${after}`;
};

// e.g. 2/1 -> 2
Change.changeFormatFunctionMap[ChangeTypes.DIVISION_BY_ONE] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  const newNodes = getNewChangeNodes(step);
  if (oldNodes.length !== 1 || newNodes.length !== 1) {
    return null;
  }

  const before = nodesToString(oldNodes);
  const after = nodesToString(newNodes);
  return `${before} \\text{ dividiert durch 1 ist } ${after}`;
};

// e.g. nthRoot(4) * nthRoot(x^2) -> 2 * x
Change.changeFormatFunctionMap[ChangeTypes.EVALUATE_DISTRIBUTED_NTH_ROOT] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. 12 -> 2 * 2 * 3
Change.changeFormatFunctionMap[ChangeTypes.FACTOR_INTO_PRIMES] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  const newNodes = getNewChangeNodes(step);
  if (oldNodes.length !== 1 || newNodes.length < oldNodes.length || newNodes.length > 5) {
    return null;
  }

  const before = nodesToString(oldNodes);
  const after = nodesToString(newNodes);
  return `\\text{Faktorisiere } ${before} \\text{ zu } ${after}`;
};

// e.g. 2x^2 + 3x^2 + 5x^2 -> (2+3+5)x^2
Change.changeFormatFunctionMap[ChangeTypes.GROUP_COEFFICIENTS] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. nthRoot(2 * 2 * 2, 2) -> nthRoot((2 * 2) * 2)
Change.changeFormatFunctionMap[ChangeTypes.GROUP_TERMS_BY_ROOT] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. (2/3)x = 1 -> (2/3)x * (3/2) = 1 * (3/2)
Change.changeFormatFunctionMap[ChangeTypes.MULTIPLY_BOTH_SIDES_BY_INVERSE_FRACTION] = function(step) {
  const termNodes = getNewChangeNodes(step);
  if (termNodes.length !== 2) {
    return null;
  }

  const term = termNodes[0].toTex();
  return `\\text{Multipliziere beide Seiten mit dem Kehrbruch } ${term}`;
};

// e.g. -x = 2 -> -1 * -x = -1 * 2
Change.changeFormatFunctionMap[ChangeTypes.MULTIPLY_BOTH_SIDES_BY_NEGATIVE_ONE] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. x/(2/3) -> x * 3/2
Change.changeFormatFunctionMap[ChangeTypes.MULTIPLY_BY_INVERSE] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  const newNodes = getNewChangeNodes(step);
  if (oldNodes.length !== 1 || newNodes.length !== 1) {
    return null;
  }

  const before = nodesToString(oldNodes, true);
  const after = nodesToString(newNodes);
  return `\\text{Schreibe } ${before} \\text{ als } ${after}`;
};

// e.g. x * 0 -> 0
Change.changeFormatFunctionMap[ChangeTypes.MULTIPLY_BY_ZERO] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  const newNodes = getNewChangeNodes(step);
  if (oldNodes.length !== 1 || newNodes.length !== 1) {
    return null;
  }

  const before = nodesToString(oldNodes);
  const after = nodesToString(newNodes);
  return `\\text{Schreibe } ${before} \\text{ als } ${after}`;
};

// e.g. (2 * 3)(x * x) -> 6(x*x)
Change.changeFormatFunctionMap[ChangeTypes.MULTIPLY_COEFFICIENTS] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  const newNodes = getNewChangeNodes(step);
  if (oldNodes.length !== 1 || newNodes.length !== 1) {
    return null;
  }

  const opNode = oldNodes[0];
  if (!NodeType.isOperator(opNode) || opNode.op !== '*') {
    return null;
  }

  const before = nodesToString(oldNodes, true);
  const after = newNodes[0].toTex();
  return `\\text{Multipliziere die Koeffizienten } ${before} \\text{ zu } ${after}`;
};

// e.g. (2*2)/(6*2) + (1*3)/(4*3) -> (2*2)/12 + (1*3)/12
Change.changeFormatFunctionMap[ChangeTypes.MULTIPLY_DENOMINATORS] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. 1/2 * 2/3 -> 2/6
Change.changeFormatFunctionMap[ChangeTypes.MULTIPLY_FRACTIONS] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  const newNodes = getNewChangeNodes(step);
  if (oldNodes.length !== 1 || newNodes.length !== 1) {
    return null;
  }

  const opNode = oldNodes[0];
  if (!NodeType.isOperator(opNode) || opNode.op !== '*') {
    return null;
  }

  const before = nodesToString(opNode.args, true);
  const after = newNodes[0].toTex();
  return `\\text{Multipliziere } ${before} \\text{ zu } ${after}`;
};

// e.g. (2*2)/12 + (1*3)/12 -> 4/12 + 3/12
Change.changeFormatFunctionMap[ChangeTypes.MULTIPLY_NUMERATORS] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. 2x * x -> 2x ^ 2
Change.changeFormatFunctionMap[ChangeTypes.MULTIPLY_POLYNOMIAL_TERMS] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  const newNodes = getNewChangeNodes(step);
  if (oldNodes.length !== 1 || newNodes.length !== 1) {
    return null;
  }

  const opNode = oldNodes[0];
  if (!NodeType.isOperator(opNode) || opNode.op !== '*') {
    return null;
  }

  const before = nodesToString(opNode.args, true);
  const after = newNodes[0].toTex();
  return `\\text{Multipliziere } ${before} \\text{ zu } ${after}`;
};

// e.g. x/2 = 1 -> (x/2) * 2 = 1 * 2
Change.changeFormatFunctionMap[ChangeTypes.MULTIPLY_TO_BOTH_SIDES] = function(step) {
  const termNodes = getNewChangeNodes(step);
  if (termNodes.length !== 2) {
    return null;
  }

  const term = termNodes[0].toTex();
  return `\\text{Multipliziere beide Seiten mit } ${term}`;
};

// This should never happen
Change.changeFormatFunctionMap[ChangeTypes.NO_CHANGE] = function() {
  return null;
};

// e.g. nthRoot(4) -> 2
Change.changeFormatFunctionMap[ChangeTypes.NTH_ROOT_VALUE] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  if (oldNodes.length !== 1) {
    return null;
  }

  const before = nodesToString(oldNodes);
  return `\\text{Nehme die Wurzel von } ${before}`;
};

// e.g. x * 2 -> 2x
Change.changeFormatFunctionMap[ChangeTypes.REARRANGE_COEFF] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. x ^ 0 -> 1
Change.changeFormatFunctionMap[ChangeTypes.REDUCE_EXPONENT_BY_ZERO] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  const newNodes = getNewChangeNodes(step);
  if (oldNodes.length !== 1 || newNodes.length !== 1) {
    return null;
  }

  const before = nodesToString(oldNodes);
  const after = nodesToString(newNodes);
  return `\\text{Schreibe } ${before} \\text{ als } ${after}`;
};

// e.g. 0/1 -> 0
Change.changeFormatFunctionMap[ChangeTypes.REDUCE_ZERO_NUMERATOR] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  const newNodes = getNewChangeNodes(step);
  if (oldNodes.length !== 1 || newNodes.length !== 1) {
    return null;
  }

  const before = nodesToString(oldNodes);
  const after = nodesToString(newNodes);
  return `\\text{Schreibe } ${before} \\text{ als } ${after}`;
};

// e.g. 2 + 0 -> 2
Change.changeFormatFunctionMap[ChangeTypes.REMOVE_ADDING_ZERO] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. x ^ 1 -> x
Change.changeFormatFunctionMap[ChangeTypes.REMOVE_EXPONENT_BY_ONE] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  const newNodes = getNewChangeNodes(step);
  if (oldNodes.length !== 1 || newNodes.length !== 1) {
    return null;
  }

  const before = nodesToString(oldNodes);
  const after = nodesToString(newNodes);
  return `\\text{Schreibe } ${before} \\text{ als } ${after}`;
};

// e.g. x * -1 -> -x
Change.changeFormatFunctionMap[ChangeTypes.REMOVE_MULTIPLYING_BY_NEGATIVE_ONE] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  const newNodes = getNewChangeNodes(step);
  if (oldNodes.length !== 1 || newNodes.length !== 1) {
    return null;
  }

  const before = nodesToString(oldNodes);
  const after = nodesToString(newNodes);
  return `\\text{Schreibe } ${before} \\text{ als } ${after}`;
};

// e.g. x * 1 -> x
Change.changeFormatFunctionMap[ChangeTypes.REMOVE_MULTIPLYING_BY_ONE] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  const newNodes = getNewChangeNodes(step);
  if (oldNodes.length !== 1 || newNodes.length !== 1) {
    return null;
  }

  const before = nodesToString(oldNodes);
  const after = nodesToString(newNodes);
  return `\\text{Schreibe } ${before} \\text{ als } ${after}`;
};

// e.g. 2 - - 3 -> 2 + 3
Change.changeFormatFunctionMap[ChangeTypes.RESOLVE_DOUBLE_MINUS] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. 2 + 2 -> 4 or 2 * 2 -> 4
Change.changeFormatFunctionMap[ChangeTypes.SIMPLIFY_ARITHMETIC] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  const newNodes = getNewChangeNodes(step);
  if (oldNodes.length !== 1 || newNodes.length !== 1) {
    return null;
  }

  const opNode = oldNodes[0];
  if (!NodeType.isOperator(opNode) || '+-*/^'.indexOf(opNode.op) === -1) {
    return null;
  }

  const before = nodesToString(opNode.args, true);
  const after = newNodes[0].toTex();
  return `\\text{${OP_TO_STRING[opNode.op]} } ${before} \\text{ zu } ${after}`;
};

// e.g. 2/3/4 -> 2/(3*4)
Change.changeFormatFunctionMap[ChangeTypes.SIMPLIFY_DIVISION] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  const newNodes = getNewChangeNodes(step);
  if (oldNodes.length !== 1 || newNodes.length !== 1) {
    return null;
  }

  const before = nodesToString(oldNodes);
  const after = nodesToString(newNodes);
  return `\\text{Schreibe } ${before} \\text{ als } ${after}`;
};

// e.g. 2/6 -> 1/3
Change.changeFormatFunctionMap[ChangeTypes.SIMPLIFY_FRACTION] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  const newNodes = getNewChangeNodes(step);
  if (oldNodes.length !== 1 || newNodes.length !== 1) {
    return null;
  }

  const before = nodesToString(oldNodes);
  const after = nodesToString(newNodes);
  return `\\text{Vereinfache } ${before} \\text{ zu } ${after}`;
};

// e.g. x + 2 - 1 = 3 -> x + 1 = 3
Change.changeFormatFunctionMap[ChangeTypes.SIMPLIFY_LEFT_SIDE] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. x = 3 - 1 -> x = 2
Change.changeFormatFunctionMap[ChangeTypes.SIMPLIFY_RIGHT_SIDE] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. 2/-3 -> -2/3
Change.changeFormatFunctionMap[ChangeTypes.SIMPLIFY_SIGNS] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. 2 * 4x + 2*5 --> 8x + 10
Change.changeFormatFunctionMap[ChangeTypes.SIMPLIFY_TERMS] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. 2 = 3
Change.changeFormatFunctionMap[ChangeTypes.STATEMENT_IS_FALSE] = function(step) {
  const comparator = step.newEquation.comparator;
  return `\\text{Die linke Seite ist nicht ${COMPARATOR_TO_STRING[comparator]} der rechten Seite}`;
};

// e.g. 2 = 2
Change.changeFormatFunctionMap[ChangeTypes.STATEMENT_IS_TRUE] = function(step) {
  const comparator = step.newEquation.comparator;
  return `\\text{Die linke Seite ist ${COMPARATOR_TO_STRING[comparator]} der rechten Seite}`;
};

// e.g. x + 3 = 2 -> x + 3 - 3 = 2 - 3
Change.changeFormatFunctionMap[ChangeTypes.SUBTRACT_FROM_BOTH_SIDES] = function(step) {
  const termNodes = getNewChangeNodes(step);
  if (termNodes.length !== 2) {
    return null;
  }

  const term = termNodes[0].toTex();
  return `\\text{Subtrahiere } ${term} \\text{ von beiden Seiten}`;
};

// e.g. 2 = x -> x = 2
Change.changeFormatFunctionMap[ChangeTypes.SWAP_SIDES] = function(step) {
  return `\\text{${Change.ChangeText[step.changeType]}}`;
};

// e.g. 2x - x -> 2x - 1x
Change.changeFormatFunctionMap[ChangeTypes.UNARY_MINUS_TO_NEGATIVE_ONE] = function(step) {
  const oldNodes = getOldChangeNodes(step);
  const newNodes = getNewChangeNodes(step);
  if (oldNodes.length === 0 || newNodes.length !== oldNodes.length) {
    return null;
  }

  const before = nodesToString(oldNodes);
  const after = nodesToString(newNodes);
  return `\\text{Schreibe } ${before} \\text{ als } ${after}`;
};

Change.ChangeText = {
  ABSOLUTE_VALUE: 'Nehme den Betrag',
  ADD_COEFFICIENT_OF_ONE: 'Schreibe den Term mit einem Koeffizienten von 1',
  ADD_EXPONENT_OF_ONE: 'Schreibe den Term mit dem Exponenten 1',
  ADD_FRACTIONS: 'Addiere die Brüche',
  ADD_NUMERATORS: 'Addiere die Terme im Zähler',
  ADD_POLYNOMIAL_TERMS: 'Addiere die polynomen Terme',
  ADD_TO_BOTH_SIDES: 'Addiere den Term zu beiden Seiten',
  BREAK_UP_FRACTION: 'Vereinfache den Bruch',
  CANCEL_EXPONENT: 'Streiche den Exponent',
  CANCEL_EXPONENT_AND_ROOT: 'Streiche den Exponent und die Wurzel',
  CANCEL_MINUSES: 'Streiche die Minuszeichen im Zähler und Nenner',
  CANCEL_ROOT: 'Streiche die Wurzel',
  CANCEL_TERMS: 'Streiche gleiche Terme in Zähler und Nenner',
  COLLECT_AND_COMBINE_LIKE_TERMS: 'Fasse zusammen',
  COLLECT_EXPONENTS: 'Addiere die Exponenten',
  COLLECT_LIKE_TERMS: 'Finde die gleichen Terme und gruppiere sie',
  COMBINE_NUMERATORS: 'Addiere die Zähler mit den gleichen Nennern',
  COMMON_DENOMINATOR: 'Multipliziere die Terme, um einen gleichen Nenner zu erhalten',
  COMBINE_UNDER_ROOT: 'Addiere Terme mit der gleichen Wurzel',
  CONVERT_INTEGER_TO_FRACTION: 'Erweitere zu einem Bruch mit dem gelichen Nenner',
  CONVERT_MULTIPLICATION_TO_EXPONENT: 'Fasse zusammen als Exponent',
  DISTRIBUTE: 'Multipliziere aus',
  DISTRIBUTE_NEGATIVE_ONE: 'Multipliziere die Klammer mit -1',
  DISTRIBUTE_NTH_ROOT: 'Multiplizere die Wurzel aus',
  DIVIDE_FRACTION_FOR_ADDITION: 'Wandle Brüche in Dezimalzahlen um',
  DIVIDE_FROM_BOTH_SIDES: 'Dividiere beide Seiten durch den Term',
  DIVISION_BY_NEGATIVE_ONE: 'Schreibe alle Terme dividiert durch -1 als negativ',
  DIVISION_BY_ONE: 'Schreibe alle Terme durch 1 als einfach nur den Term',
  EVALUATE_DISTRIBUTED_NTH_ROOT: 'Nimm die Wurzel aller Terme',
  FACTOR_INTO_PRIMES: 'Faktorisiere die Nummer',
  GROUP_COEFFICIENTS: 'Gruppiere die Koeffiziente',
  GROUP_TERMS_BY_ROOT: 'Gruppiere wiederholende Faktoren',
  MULTIPLY_BOTH_SIDES_BY_INVERSE_FRACTION: 'Multipliziere beide Seiten mit dem Kehrbruch',
  MULTIPLY_BOTH_SIDES_BY_NEGATIVE_ONE: 'Multipliziere beide Seiten mit -1',
  MULTIPLY_BY_INVERSE: 'Schreibe Division als Multiplikation mit dem Kehrbruch',
  MULTIPLY_BY_ZERO: 'Schreibe alle Terme multipliziert mit 0 als 0',
  MULTIPLY_COEFFICIENTS: 'Multipliziere die Koeffizienten miteinander',
  MULTIPLY_DENOMINATORS: 'Multipliziere die Terme im Nenner',
  MULTIPLY_FRACTIONS: 'Multipliziere die Brüche',
  MULTIPLY_NUMERATORS: 'Multipliziere die Terme im Zähler',
  MULTIPLY_POLYNOMIAL_TERMS: 'Multipliziere die Polynomterme',
  MULTIPLY_TO_BOTH_SIDES: 'Multipliziere beide Seiten mit dem Term',
  NTH_ROOT_VALUE: 'Nimm die Wurzel der Zahl',
  NO_CHANGE: 'Keine Veränderung',
  REARRANGE_COEFF: 'Bewege die Koeffizienten zum Anfang des Terms',
  REDUCE_ZERO_NUMERATOR: 'Schreibe 0 dividiert durch 0 als 0',
  REMOVE_EXPONENT_BY_ONE: 'Schreibe jeden Term mit dem Exponenten 1 ohne Exponent',
  REDUCE_EXPONENT_BY_ZERO: 'Schreibe jeden Term mit dem Exponenten 0 als 1',
  REMOVE_ADDING_ZERO: 'Eliminiere 0 beim Addieren',
  REMOVE_MULTIPLYING_BY_NEGATIVE_ONE: 'Schreibe jeglichen Term multipliziert mit -1 als negativ',
  REMOVE_MULTIPLYING_BY_ONE: 'Schreibe jeglichen Term multipliziert mit 1 als einfach nur den Term',
  RESOLVE_DOUBLE_MINUS: 'Schreibe negative Subtraktion als Addition',
  SIMPLIFY_ARITHMETIC: 'Evaluiere die Rechnung',
  SIMPLIFY_DIVISION: 'Vereinfache die Division',
  SIMPLIFY_FRACTION: 'Vereinface durch Dividieren des Oberen und Unteren durch den größten gemeinsamen Nenner',
  SIMPLIFY_LEFT_SIDE: 'Vereinfache die linke Seite',
  SIMPLIFY_RIGHT_SIDE: 'Vereinfache die rechte Seite',
  SIMPLIFY_SIGNS: 'Bewege das Minuszeichen in den Zähler',
  SIMPLIFY_TERMS: 'Vereinfache nach dem Ausmultiplizieren',
  STATEMENT_IS_FALSE: 'Die Aussage ist falsch',
  STATEMENT_IS_TRUE: 'Die Aussage ist wahr',
  SUBTRACT_FROM_BOTH_SIDES: 'Subtrahiere den Term von beiden Seiten',
  SWAP_SIDES: 'Tausche beide Seiten',
  UNARY_MINUS_TO_NEGATIVE_ONE: 'Schreibe - als den Koeffzienten -1',
};

export default Change;