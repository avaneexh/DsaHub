import { db } from "../../libs/db.js";
import { getJudge0LanguageId, poolBatchResults, submitBatch } from "../../libs/judge0.lib.js";

export const createProblem = async(req, res) => {
  const {title, description, difficulty, tags, examples, constraints, testCases, codeSnippets, referenceSolutions, editorial, hints} = req.body;
  try {
    if(req.user.role !== "ADMIN"){
      return res.status(403).json({
        message: "You are not allowed to create a problem"
      })
    }

    for(const [language, solutionCode] of Object.entries(referenceSolutions)){
      const languageId = getJudge0LanguageId(language);

      if(!languageId){
        return res.status(400).json({
          message: `Language ${language} is not supported`
        })
      }
        
      const submissions = testCases.map(({input, output})=>({
        source_code:solutionCode,
        language_id:languageId,
        stdin:input,
        expected_output:output,
      }))

      const submissionResult = await submitBatch(submissions);

      const tokens = submissionResult.map((res) => res.token);

      const results = await poolBatchResults(tokens);

      for(let i = 0; i < results.length; i++){
        const result = results[i];
        console.log("Result-----", result);
        if(result.status.id !==3){
          return res.status(400).json({message:`testcase ${i+1} failed for language ${language}`})
        }
      }
    }
    const newProblem = await db.problem.create({
      data:{
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testCases,
        codeSnippets,
        referenceSolutions,
        userId:req.user.id,
      }
    })
      
    return res.status(201).json({newProblem, message:"Problem created successfully"})
   

  } catch (error) {
      console.error("Error creating Problem:", error)
      res.status(500).json({
        error:"Error Creating Problem"
      })
  }    
}

export const getProblem = async(req, res) => {
  try {
    const problems = await db.problem.findMany();
    if(!problems){
      return res.status(404).json({message:"No problems found"})
    }
    return res.status(200).json({problems, message:"Problem fetched successfully"})

  } catch (error) {
     return res.status(500).json({message:"error in getting problems"})
  }
}

export const getProblemById = async(req, res) => {
  const { id } = req.query.id
}
export const editProblem = async(req, res) => {

}
export const deleteProblem = async(req, res) => {

}
export const getSolvedProblem = async(req, res) => {

}