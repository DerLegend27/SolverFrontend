const printEquation = (equation) => {
  return `${equation.leftNode.toTex()} ${equation.comparator} ${equation.rightNode.toTex()}`;
  }
  
  const printOldNode = (step) => {
    return step.oldNode ? step.oldNode.toTex() : printEquation(step.oldEquation);
  }
  
  const printNewNode = (step) => {
    return step.newNode ? step.newNode.toTex() : printEquation(step.newEquation);
  }
  
  const printOrgNode = (orgstep) =>{
    return orgstep.substeps ? printNewNode(orgstep.substeps[orgstep.substeps.length-1]) : printNewNode(orgstep.step)
  }


  module.exports = {
    oldNode: printOldNode,
    newNode: printNewNode,
    orgNode: printOrgNode
  }