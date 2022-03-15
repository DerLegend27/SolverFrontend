export const organizeSteps = (steps) =>{
    var skip = 0
    var orgSteps = []

    steps.forEach(step => {
        if(skip > 0){
            skip = skip -1
            return
        }

        if (step.changeType=="SUBTRACT_FROM_BOTH_SIDES"){
            const orgStep = groupSideSwap(steps, steps.indexOf(step))
            skip = orgStep.substeps.length
            orgSteps.push(orgStep)
        }else{
            orgSteps.push(
                {step:step,
                }
            )

        }

        
    });

    return orgSteps
}

const groupSideSwap = (steps, index) => {
    var substeps = []
    var i
    for(i = 1; i<3; i++){
        substeps.push(steps[index+i])
    }

    const orgStep = {
        step: steps[index],
        substeps: substeps
    }
    

    return orgStep
}