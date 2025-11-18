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
  const { id } = req.params
  try {
    const problem = await db.problem.findUnique({
      where:{
        id
      }
    });
    if(!problem){
      return res.status(404).json({message:"No problems found"})
    }
    return res.status(200).json({problem, message:"Problem fetched successfully"})

  } catch (error) {
     return res.status(500).json({message:"error in getting problems"})
  }
}

export const editProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      difficulty,
      tags,
      companyTags,
      constraints,
      examples,
      testCases,
      codeSnippets,
      referenceSolutions,
      editorial,
      hints,
    } = req.body;

    // Check if user is logged in and has admin rights
    if (!req.loggedInUser) {
      return res.status(401).json({ error: "Unauthorized - No user found" });
    }
    if (req.loggedInUser.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden - Admins only" });
    }

    // Check if problem exists
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // If reference solutions are being updated, validate them against test cases
    if (referenceSolutions) {
      for (const [language, solutionCode] of Object.entries(
        referenceSolutions
      )) {
        const languageId = getJudge0LanguageId(language);

        if (!languageId) {
          return res
            .status(400)
            .json({ error: `Language: ${language} is not supported.` });
        }

        // Use updated testcases if provided, otherwise use existing ones
        const testsToUse = testCases || problem.testCases;

        const submissions = testsToUse.map(({ input, output }) => ({
          source_code: solutionCode,
          language_id: languageId,
          stdin: input,
          expected_output: output,
        }));

        const submissionResults = await submitBatch(submissions);
        const tokens = submissionResults.map((res) => res.token);
        const results = await pollBatchResults(tokens);

        for (let i = 0; i < results.length; i++) {
          const result = results[i];

          if (result.status.id !== 3) {
            return res.status(400).json({
              error: `Test case ${i + 1} failed for language ${language}`,
              details: result,
            });
          }
        }
      }
    }

    // Prepare update data (only include fields that were provided)
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (constraints !== undefined) updateData.constraints = constraints;
    if (examples !== undefined) updateData.examples = examples;
    if (editorial !== undefined) updateData.editorial = editorial;
    if (hints !== undefined) updateData.hints = hints;
    if (tags !== undefined) updateData.tags = tags;
    if (companyTags !== undefined) updateData.companyTags = companyTags;
    if (testcases !== undefined) updateData.testCases = testCases;
    if (codeSnippets !== undefined) updateData.codeSnippets = codeSnippets;
    if (referenceSolutions !== undefined)
      updateData.referenceSolutions = referenceSolutions;

    // Update the problem
    const updatedProblem = await db.problem.update({
      where: {
        id,
      },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      problem: updatedProblem,
    });
  } catch (error) {
    console.error("Error updating problem:", error);
    return res.status(500).json({ error: "Error while updating problem" });
  }
};

export const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    await db.problem.delete({
      where: {
        id,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Problem deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting problem:", error);
    return res.status(500).json({ error: "Error While Deleting Problem" });
  }
};

export const getSolvedProblem = async (req, res) => {
  try {
    const problems = await db.problem.findMany({
      where: {
        solvedBy: {
          some: {
            userId: req.user.id,
          },
        },
      },
      include: {
        solvedBy: {
          where: {
            userId: req.user.id,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      data: problems.map((problem) => ({
        ...problem,
        solvedBy: problem.solvedBy[0],
      })),
    });
  } catch (error) {
    console.error("Error fetching problems solved by user:", error);
    res.status(500).json({ error: "Error while fetching problems" });
  }
};
